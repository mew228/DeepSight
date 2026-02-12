from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image
import io
import numpy as np
import base64

app = FastAPI()

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load YOLOv8 Model (Nano)
# It will download automatically on first run
model = YOLO('yolov8n.pt') 

@app.get("/")
@app.get("/api")
def status():
    return {"status": "Online", "model": "DeepSight YOLOv8n", "version": "2.0.0"}

@app.post("/detect")
@app.post("/api/detect")
async def detect_objects(file: UploadFile = File(...)):
    # Read image
    image_data = await file.read()
    image = Image.open(io.BytesIO(image_data))
    
    # Run YOLO inference
    results = model(image)
    
    # Process detections
    detections = []
    
    # Generate processed image with bounding boxes
    res_plotted = results[0].plot()
    res_image = Image.fromarray(res_plotted[..., ::-1])
    
    # Convert to base64
    buffered = io.BytesIO()
    res_image.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    
    # Extract bounding box info
    for result in results:
        boxes = result.boxes
        for box in boxes:
            detections.append({
                "class": model.names[int(box.cls)],
                "confidence": float(box.conf),
                "bbox": box.xyxy.tolist()[0]
            })

    return {
        "detections": detections,
        "image_processed": f"data:image/jpeg;base64,{img_str}"
    }

if __name__ == "__main__":
    import uvicorn
    # Local run on port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)
