FROM python:3.10-slim

WORKDIR /app

# Install system dependencies for OpenCV
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements-server.txt .

# Install Python dependencies
# We use the CPU version of Torch to save slug size, but you can remove the extra-index-url for GPU if you have a GPU instance
RUN pip install --no-cache-dir -r requirements-server.txt --extra-index-url https://download.pytorch.org/whl/cpu

# Copy the rest of the application
COPY . .

# Pre-download the YOLO model to speed up boot time
RUN python -c "from ultralytics import YOLO; YOLO('yolov8n.pt')"

EXPOSE 8000

# Start the server (server.py contains the 'app' object)
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
