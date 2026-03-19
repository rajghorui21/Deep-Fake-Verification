import requests
import json
import cv2
import numpy as np

# 1. Create a dummy image representing a video frame
img = np.zeros((480, 640, 3), dtype=np.uint8)
# Add some shapes to mimic a face-like region
cv2.circle(img, (320, 240), 100, (120, 180, 120), -1)  # Face
cv2.circle(img, (280, 200), 15, (0, 0, 0), -1)      # Left Eye
cv2.circle(img, (360, 200), 15, (0, 0, 0), -1)      # Right Eye
cv2.ellipse(img, (320, 280), (40, 10), 0, 0, 180, (0, 0, 200), -1) # Mouth

# Save to temp
cv2.imwrite('test_frame.jpg', img)

# 2. Call local FastAPI /verify endpoint
url = 'http://127.0.0.1:8000/verify'
files = {'file': ('test_frame.jpg', open('test_frame.jpg', 'rb'), 'image/jpeg')}

try:
    response = requests.post(url, files=files)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
         data = response.json()
         print("Verification Successful!")
         print(f"Trust Score: {data.get('trust_score')}%")
         print(f"Is Fake: {data.get('is_fake')}")
         print(f"Status: {data.get('status_message')}")
         print(f"Heatmap Length: {len(data.get('heatmap'))} chars")
    else:
         print(f"Failed: {response.text}")

except Exception as e:
    print(f"Error: {e}")
