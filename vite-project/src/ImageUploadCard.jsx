import React, { useRef, useState } from 'react';
import { Upload, Camera, X, AlertCircle } from 'lucide-react';
import Webcam from 'react-webcam';
import { analyzeImageWithGemini, isGeminiConfigured } from './ai';

export default function ImageUploadCard({ 
  t, 
  language,
  uploadedImage, 
  setUploadedImage, 
  handleImageUpload, 
  onGeminiResult, 
  setAnalyzing 
}) {
  const [showGemini, setShowGemini] = useState(false);
  const [loading, setLoading] = useState(false);
  const [geminiResult, setGeminiResult] = useState(null);
  const [geminiError, setGeminiError] = useState(null);
  const [showCameraChoice, setShowCameraChoice] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState('user');
  const [area, setArea] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState('');
  const webcamRef = useRef(null);

  const handleTakePhotoClick = (e) => {
    e.preventDefault();
    setShowCameraChoice(true);
  };

  const handleCameraSelect = (which) => {
    setShowCameraChoice(false);
    setCameraFacingMode(which === 'front' ? 'user' : 'environment');
    setShowWebcam(true);
  };

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      alert('Failed to capture image. Please try again.');
      return;
    }
    
    setUploadedImage(imageSrc);
    
    // Convert base64 to Blob for Gemini API
    fetch(imageSrc)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'captured.jpg', { type: 'image/jpeg' });
        setImageFile(file);
      })
      .catch(err => {
        console.error('Error converting captured image:', err);
        alert('Error processing captured image');
      });
    
    setShowWebcam(false);
  };

  const handleCloseWebcam = () => {
    setShowWebcam(false);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image file is too large. Please select an image smaller than 10MB.');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
      };
      reader.onerror = () => {
        alert('Failed to read image file.');
      };
      reader.readAsDataURL(file);
    }
    if (handleImageUpload) handleImageUpload(e);
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setImageFile(null);
    setShowGemini(false);
    setGeminiResult(null);
    setGeminiError(null);
    setAnalysisProgress('');
  };

  const handleAnalyze = async () => {
    // Check API configuration
    if (!isGeminiConfigured()) {
      setGeminiError('Gemini API is not configured. Please add your API key in secret.js');
      return;
    }

    if (!imageFile) {
      setGeminiError('No image file available for analysis');
      return;
    }

    setShowGemini(true);
    setLoading(true);
    if (setAnalyzing) setAnalyzing(true);
    setGeminiResult(null);
    setGeminiError(null);
    
    // Show progress messages
    setAnalysisProgress('Uploading image...');
    setTimeout(() => setAnalysisProgress('Analyzing crop details...'), 1000);
    setTimeout(() => setAnalysisProgress('Calculating estimates...'), 2000);

    try {
      const { result, error } = await analyzeImageWithGemini(imageFile, area, language, 60);
      
      if (error) {
        setGeminiError(error);
      } else if (result) {
        setGeminiResult(result);
        
        // Pass result to parent component
        if (onGeminiResult) {
          onGeminiResult(result);
        }
      } else {
        setGeminiError('No result returned from analysis');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setGeminiError('Unexpected error during analysis. Please try again.');
    } finally {
      setLoading(false);
      if (setAnalyzing) setAnalyzing(false);
      setAnalysisProgress('');
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-green-100">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{t.uploadImage}</h2>
      
      {/* Area input */}
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">
          Land Area (optional):
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            step="0.1"
            value={area}
            onChange={e => setArea(e.target.value)}
            className="rounded-lg border-2 border-green-200 px-4 py-2 w-32 focus:outline-none focus:border-green-400"
            placeholder="e.g. 2.5"
            disabled={loading}
          />
          <span className="text-gray-600 font-medium">acres</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Optional: Enter your land area for more accurate analysis
        </p>
      </div>

      {uploadedImage ? (
        <div className="relative">
          <div className="relative">
            <img 
              src={uploadedImage} 
              alt="Uploaded" 
              className="w-full h-64 object-cover rounded-2xl mb-4 border-2 border-green-200" 
            />
            <button
              onClick={handleRemoveImage}
              disabled={loading}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full font-semibold hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              title="Remove image"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Analyze button */}
          {!showGemini && !loading && (
            <button
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full px-6 py-3 font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg"
              onClick={handleAnalyze}
            >
              🔍 Analyze Crop Image
            </button>
          )}

          {/* Loading indicator */}
          {loading && (
            <div className="mt-4 bg-green-50 rounded-xl p-6 border-2 border-green-200">
              <div className="flex flex-col items-center">
                <div className="relative w-16 h-16 mb-4">
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-green-200 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-green-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-lg font-semibold text-green-700 mb-1">
                  {analysisProgress || 'Analyzing...'}
                </p>
                <p className="text-sm text-gray-600">
                  This may take up to 60 seconds
                </p>
              </div>
            </div>
          )}

          {/* Error display */}
          {geminiError && !loading && (
            <div className="mt-4 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-red-800 mb-1">Analysis Failed</p>
                <p className="text-red-700 text-sm">{geminiError}</p>
                <button
                  onClick={handleAnalyze}
                  className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-all"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      ) : showWebcam ? (
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-full max-w-md">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ 
                facingMode: cameraFacingMode,
                width: { ideal: 1280 },
                height: { ideal: 720 }
              }}
              className="rounded-2xl border-4 border-green-200 w-full h-64 object-cover"
            />
          </div>
          <div className="flex gap-4">
            <button
              className="bg-green-600 text-white rounded-full px-8 py-3 font-semibold hover:bg-green-700 transition-all shadow-lg flex items-center gap-2"
              onClick={handleCapture}
            >
              <Camera className="w-5 h-5" />
              Capture Photo
            </button>
            <button
              className="bg-gray-400 text-white rounded-full px-8 py-3 font-semibold hover:bg-gray-500 transition-all shadow-lg"
              onClick={handleCloseWebcam}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="cursor-pointer group">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInput}
            />
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8 text-center hover:shadow-xl transition-all border-2 border-dashed border-blue-400 group-hover:border-blue-600 h-full flex flex-col items-center justify-center">
              <Upload className="w-12 h-12 mx-auto mb-3 text-blue-600 group-hover:scale-110 transition-transform" />
              <p className="font-semibold text-blue-800 mb-1">{t.chooseGallery || 'Choose from Gallery'}</p>
              <p className="text-xs text-blue-600">JPG, PNG (max 10MB)</p>
            </div>
          </label>
          
          <button 
            className="cursor-pointer w-full group" 
            onClick={handleTakePhotoClick}
          >
            <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-8 text-center hover:shadow-xl transition-all border-2 border-dashed border-green-400 group-hover:border-green-600 h-full flex flex-col items-center justify-center">
              <Camera className="w-12 h-12 mx-auto mb-3 text-green-600 group-hover:scale-110 transition-transform" />
              <p className="font-semibold text-green-800 mb-1">{t.takePhoto || 'Take Photo'}</p>
              <p className="text-xs text-green-600">Use camera</p>
            </div>
          </button>

          {/* Camera choice modal */}
          {showCameraChoice && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
              <div className="bg-white rounded-2xl p-6 shadow-2xl flex flex-col gap-4 min-w-[280px] max-w-md w-full">
                <h3 className="text-xl font-bold mb-2 text-gray-800">Choose Camera</h3>
                <button
                  className="bg-blue-600 text-white rounded-xl px-6 py-3 font-semibold hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2"
                  onClick={() => handleCameraSelect('front')}
                >
                  <Camera className="w-5 h-5" />
                  Front Camera
                </button>
                <button
                  className="bg-green-600 text-white rounded-xl px-6 py-3 font-semibold hover:bg-green-700 transition-all shadow-lg flex items-center justify-center gap-2"
                  onClick={() => handleCameraSelect('back')}
                >
                  <Camera className="w-5 h-5" />
                  Back Camera
                </button>
                <button
                  className="mt-2 text-gray-500 hover:text-gray-700 font-medium"
                  onClick={() => setShowCameraChoice(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}