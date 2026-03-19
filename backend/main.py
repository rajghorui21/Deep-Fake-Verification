import os
import tempfile
import cv2
import base64
import numpy as np
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from detection import verify_frame

app = FastAPI(title="Deep-Fake Verification API")

# Add CORS middleware to allow Frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust as needed for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok", "message": "API is running"}

@app.post("/verify")
async def verify_video(file: UploadFile = File(...)):
    """
    Endpoint that processes a Video/Image.
    - Extracts the center frame (for speed).
    - Runs Grad-CAM evaluation.
    - Returns trust score and base64 heatmap view.
    """
    try:
        # Save uploaded file to temp path to support VideoCapture
        suffix = os.path.splitext(file.filename)[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
             temp_file.write(await file.read())
             temp_path = temp_file.name

        # Initialize video capture
        cap = cv2.VideoCapture(temp_path)
        if not cap.isOpened():
             os.remove(temp_path)
             return JSONResponse(content={"error": "Could not open video file"}, status_code=400)

        # Get total frames
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        if total_frames <= 0:
             os.remove(temp_path)
             return JSONResponse(content={"error": "Empty or corrupt video"}, status_code=400)

        # Seek to middle frame to avoid start/end black frames
        target_index = total_frames // 2
        cap.set(cv2.CAP_PROP_POS_FRAMES, target_index)
        
        ret, frame = cap.read()
        cap.release()
        os.remove(temp_path)

        if not ret:
             return JSONResponse(content={"error": "Failed to read video frame"}, status_code=500)

        # Run verification logic
        trust_score, overlay = verify_frame(frame)

        # Encode overlay to base64
        _, buffer = cv2.imencode('.jpg', overlay)
        img_str = base64.b64encode(buffer).decode('utf-8')

        is_fake = trust_score < 50

        return {
            "trust_score": trust_score,
            "is_fake": is_fake,
            "status_message": "Fake announcement detected!" if is_fake else "Trusted announcement",
            "heatmap": f"data:image/jpeg;base64,{img_str}"
        }

    except Exception as e:
         return JSONResponse(content={"error": str(e)}, status_code=500)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
