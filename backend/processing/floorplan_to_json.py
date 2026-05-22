import cv2
import numpy as np
import sys
import json
import os

image_path = sys.argv[1]
base_name = sys.argv[2] if len(sys.argv) > 2 else os.path.splitext(os.path.basename(image_path))[0]

uploads_dir = os.path.join(os.path.dirname(__file__), "..", "uploads")
os.makedirs(uploads_dir, exist_ok=True)

# ── Load image ────────────────────────────────────────────────────────────────
img = cv2.imread(image_path)
if img is None:
    print(json.dumps({"walls": [], "maskFile": ""}))
    sys.exit(0)

orig_h, orig_w = img.shape[:2]

# Downscale large images so Hough runs fast (cap at 1200px on long side)
MAX_DIM = 1200
scale = 1.0
if max(orig_w, orig_h) > MAX_DIM:
    scale = MAX_DIM / max(orig_w, orig_h)
    img = cv2.resize(img, (int(orig_w * scale), int(orig_h * scale)), interpolation=cv2.INTER_AREA)

h, w = img.shape[:2]

# ── Convert to grayscale ──────────────────────────────────────────────────────
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# ── Smooth then threshold: dark lines → white ─────────────────────────────────
blur = cv2.GaussianBlur(gray, (3, 3), 0)
_, thresh = cv2.threshold(blur, 180, 255, cv2.THRESH_BINARY_INV)

# ── Morphological cleanup ─────────────────────────────────────────────────────
# Remove small noise
open_k = np.ones((2, 2), np.uint8)
thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN,  open_k, iterations=1)
# Close small breaks in wall lines
close_k = np.ones((4, 4), np.uint8)
thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, close_k, iterations=2)

# ── Edge detection for cleaner line features ──────────────────────────────────
edges = cv2.Canny(thresh, 50, 150, apertureSize=3)
# Dilate edges a bit so Hough has enough pixels to vote on
edges = cv2.dilate(edges, np.ones((2, 2), np.uint8), iterations=1)

# ── Save mask image ───────────────────────────────────────────────────────────
mask_filename = base_name + "_mask.png"
mask_path = os.path.join(uploads_dir, mask_filename)

# Save a colour debug image: thresh in blue channel, edges in red
debug = cv2.cvtColor(thresh, cv2.COLOR_GRAY2BGR)
debug[:, :, 2] = np.maximum(debug[:, :, 2], edges)   # red overlay for edges
cv2.imwrite(mask_path, debug)

# ── Probabilistic Hough Line Transform ───────────────────────────────────────
# Adaptive parameters based on image size
min_line_length = int(min(w, h) * 0.03)   # 3 % of shorter side
max_line_gap    = int(min(w, h) * 0.025)  # 2.5 % gap allowed

lines_raw = cv2.HoughLinesP(
    edges,
    rho=1,
    theta=np.pi / 180,
    threshold=30,
    minLineLength=min_line_length,
    maxLineGap=max_line_gap
)

# ── Collect & normalise wall segments ─────────────────────────────────────────
walls = []

if lines_raw is not None:
    for line in lines_raw:
        x1, y1, x2, y2 = line[0].tolist()

        seg_len = np.hypot(x2 - x1, y2 - y1)
        if seg_len < min_line_length * 0.8:
            continue

        # Normalise to 0..1 using the working image dimensions
        walls.append({
            "x1": round(x1 / w, 5),
            "y1": round(y1 / h, 5),
            "x2": round(x2 / w, 5),
            "y2": round(y2 / h, 5),
        })

# ── Fallback: contour-based bounding rect edges ───────────────────────────────
if len(walls) == 0:
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area < (w * h * 0.001):
            continue
        rx, ry, rw, rh = cv2.boundingRect(cnt)
        for seg in [
            (rx,      ry,      rx + rw, ry),
            (rx,      ry + rh, rx + rw, ry + rh),
            (rx,      ry,      rx,      ry + rh),
            (rx + rw, ry,      rx + rw, ry + rh),
        ]:
            walls.append({
                "x1": round(seg[0] / w, 5),
                "y1": round(seg[1] / h, 5),
                "x2": round(seg[2] / w, 5),
                "y2": round(seg[3] / h, 5),
            })

print(json.dumps({"walls": walls, "maskFile": mask_filename}))