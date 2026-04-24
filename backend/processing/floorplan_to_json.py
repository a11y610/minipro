import cv2
import numpy as np
import sys
import json

image_path = sys.argv[1]

img = cv2.imread(image_path)
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# 🔥 Step 1: Strong threshold (walls become white)
_, thresh = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY_INV)

# 🔥 Step 2: Remove small noise
kernel = np.ones((7,7), np.uint8)
clean = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

# 🔥 Step 3: Dilate to make walls thick & continuous
clean = cv2.dilate(clean, kernel, iterations=2)

# 🔥 Step 4: Find contours (BIG SHAPES)
contours, _ = cv2.findContours(clean, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

walls = []

for cnt in contours:
    area = cv2.contourArea(cnt)

    # 🔥 Ignore small objects
    if area > 5000:
        x, y, w, h = cv2.boundingRect(cnt)

        # Convert rectangle into walls
        walls.append({"x1": x, "y1": y, "x2": x+w, "y2": y})
        walls.append({"x1": x, "y1": y, "x2": x, "y2": y+h})
        walls.append({"x1": x+w, "y1": y, "x2": x+w, "y2": y+h})
        walls.append({"x1": x, "y1": y+h, "x2": x+w, "y2": y+h})

print(json.dumps(walls))