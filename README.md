# DeepSight - Object Detection Platform

**DeepSight** is a research-grade object detection platform designed for rapid inference and high accuracy. Powered by **YOLOv8** and a sleek **React + Tailwind** frontend.

## 🚀 Live Demo
Access the live application here: [https://DeepSight228.vercel.app](https://DeepSight228.vercel.app)

## ✨ Features
*   **Real-Time Inference**: Powered by Ultralytics YOLOv8 models.
*   **Drag & Drop Upload**: Seamless image analysis experience.
*   **Instant Visual Feedback**: Bounding boxes are rendered directly on your images.
*   **Detailed Metrics**: View confidence scores and object classes for every detection.
*   **Glassmorphic UI**: A premium, dark-mode aesthetic built with Tailwind CSS.

## 🛠️ Technology Stack
*   **Frontend**: React (Vite), Tailwind CSS, Framer Motion
*   **Backend**: FastAPI, Python, PyTorch, Ultralytics YOLO
*   **Deployment**: Vercel (All-in-one Monorepo)

## 📁 Project Structure (Merged)
*   `src/`: React frontend source code.
*   `public/`: Static assets for the frontend.
*   `api/`: Vercel serverless functions (Python).
*   `server.py`: Local backend server and Docker entry point.
*   `requirements-server.txt`: Local Python dependencies.
*   `run_project.bat`: One-click launcher for Windows.

## 📦 Local Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/mew228/DeepSight.git
    cd DeepSight
    ```

2.  **Run the automated script**
    Double-click `run_project.bat` to install dependencies and start the app.

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License
MIT License.
