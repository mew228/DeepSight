import { useState, useRef } from 'react';
import { Upload, X, Check, Loader2, Play, Image as ImageIcon, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.PROD ? "/api" : "http://localhost:8000";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/detect`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Analysis failed");

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to analyze image. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white selection:bg-blue-500 selection:text-white">
      {/* Navbar */}
      <nav className="border-b border-gray-800 backdrop-blur-md sticky top-0 z-50 bg-gray-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
                <Box className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Deep<span className="text-blue-500">Sight</span>
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
              <button onClick={() => setActiveModal('docs')} className="hover:text-white transition-colors">Documentation</button>
              <button onClick={() => setActiveModal('models')} className="hover:text-white transition-colors">Models</button>
              <a
                href="https://github.com/mew228/DeepSight"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors"
              >
                View GitHub
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero / Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <AnimatePresence>
          {activeModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setActiveModal(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative"
              >
                <button
                  onClick={() => setActiveModal(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

                {activeModal === 'docs' && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white mb-2">Documentation</h2>
                    <p className="text-gray-300 leading-relaxed">
                      <strong className="text-blue-400">DeepSight</strong> is a research-grade object detection platform designed for rapid inference and high accuracy.
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                      <li><strong>Input Support:</strong> Processes high-resolution images via drag-and-drop.</li>
                      <li><strong>Privacy:</strong> Client-server architecture ensures data isolation.</li>
                      <li><strong>Performance:</strong> Optimized for sub-100ms inference on standard CPUs.</li>
                    </ul>
                    <div className="p-3 bg-gray-800 rounded-lg border border-gray-700 mt-4">
                      <code className="text-sm text-cyan-300">v2.0.0-release</code>
                    </div>
                  </div>
                )}

                {activeModal === 'models' && (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white mb-2">Model Architecture</h2>
                    <p className="text-gray-300">
                      We utilize the <strong className="text-blue-400">YOLOv8</strong> (You Only Look Once) architecture, a state-of-the-art single-stage detector.
                    </p>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                        <h3 className="font-semibold text-white">Backbone: CSPDarknet</h3>
                        <p className="text-sm text-gray-400">Extracts rich feature maps using potential-preserving computational blocks.</p>
                      </div>
                      <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                        <h3 className="font-semibold text-white">Neck: PANet</h3>
                        <p className="text-sm text-gray-400">Path Aggregation Network ensuring multi-scale feature fusion for detecting small objects.</p>
                      </div>
                      <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                        <h3 className="font-semibold text-white">Head: Anchor-Free</h3>
                        <p className="text-sm text-gray-400">Decoupled task alignment for simultaneous classification and localization.</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            Real-Time Object <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Detection System</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto"
          >
            Powered by YOLOv8. Upload an image to detect objects with state-of-the-art accuracy and speed. Perfect for research and production workflows.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Upload */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Upload className="w-5 h-5 text-blue-400" />
                  Upload Image
                </h2>
                {file && (
                  <button
                    onClick={handleReset}
                    className="text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 px-3 py-1 rounded-full transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div
                className={`
                  relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ease-in-out text-center cursor-pointer
                  ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/30'}
                  ${preview ? 'h-64' : 'h-64 flex flex-col items-center justify-center'}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => !file && fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <AnimatePresence mode="wait">
                  {preview ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="w-full h-full relative group"
                    >
                      <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                        <p className="text-white font-medium">Click to change image</p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="space-y-4"
                    >
                      <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-white">Click or drag image here</p>
                        <p className="text-sm text-gray-400 mt-1">Supports JPG, PNG, WEBP</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!file || loading}
                className={`
                  w-full mt-6 py-4 rounded-xl font-semibold text-lg shadow-lg flex items-center justify-center gap-2 transition-all
                  ${!file || loading
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white hover:shadow-blue-500/25 trnasform hover:-translate-y-0.5'}
                `}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    Run Detection
                  </>
                )}
              </button>
            </div>

            {/* Features Mini Section */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                <div className="text-2xl font-bold text-white mb-1">~20ms</div>
                <div className="text-sm text-gray-400">Inference Speed</div>
              </div>
              <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                <div className="text-2xl font-bold text-white mb-1">80+</div>
                <div className="text-sm text-gray-400">Classes Supported</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-xl min-h-[500px] flex flex-col"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              Detection Results
            </h2>

            <div className="flex-1 rounded-xl bg-gray-900/50 border border-gray-700/50 overflow-hidden relative flex items-center justify-center">
              {result ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full h-full flex flex-col"
                >
                  <div className="flex-1 relative overflow-auto p-4 flex items-center justify-center bg-black/20">
                    <img src={result.image_processed} alt="Processed" className="max-w-full max-h-[400px] shadow-lg rounded-lg" />
                  </div>

                  <div className="bg-gray-800/80 p-4 border-t border-gray-700 max-h-60 overflow-y-auto">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Detected Objects ({result.detections.length})</h3>
                    <div className="space-y-2">
                      {result.detections.map((det, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm p-3 bg-gray-700/50 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            <span className="font-medium text-white capitalize">{det.class}</span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="font-mono text-cyan-400">{(det.confidence * 100).toFixed(1)}%</span>
                            <span className="text-xs text-gray-500">Confidence</span>
                          </div>
                        </div>
                      ))}
                      {result.detections.length === 0 && (
                        <p className="text-gray-400 text-center py-4">No objects detected.</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center text-gray-500 p-8">
                  <div className="w-20 h-20 border-2 border-dashed border-gray-700 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <Box className="w-8 h-8 opacity-20" />
                  </div>
                  <p>Results will appear here afer analysis</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default App;
