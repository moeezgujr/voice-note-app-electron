// "use client"

// import { useState, useRef, useEffect } from "react"

// const CameraView = ({ addSnapshot }) => {
//   const videoRef = useRef(null)
//   const canvasRef = useRef(null)
//   const [stream, setStream] = useState(null)
//   const [cameraActive, setCameraActive] = useState(false)
//   const [error, setError] = useState(null)
//   const [previewImage, setPreviewImage] = useState(null)
//   const [selectedDevice, setSelectedDevice] = useState('');
//   const [devices, setDevices] = useState([]);

//   useEffect(() => {
//     const getCameras = async () => {
//       try {
//         const devices = await navigator.mediaDevices.enumerateDevices();
//         const videoDevices = devices.filter(device => device.kind === 'videoinput');
//         setDevices(videoDevices);
//         if (videoDevices.length > 0) {
//           setSelectedDevice(videoDevices[0].deviceId);
//         }
//       } catch (err) {
//         console.error('Error enumerating devices:', err);
//         setError('Could not access camera devices');
//       }
//     };

//     getCameras();
//   }, []);

//   // Initialize camera
//   const startCamera = async () => {
//     try {
//       const constraints = {
//         video: {
//           deviceId: selectedDevice ? { exact: selectedDevice } : undefined,
//           width: { ideal: 1280 },
//           height: { ideal: 720 }
//         }
//       };

//       const stream = await navigator.mediaDevices.getUserMedia(constraints);
//       setStream(stream);
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//       }
//       setError(null);
//     } catch (err) {
//       console.error('Error accessing camera:', err);
//       setError('Could not access the camera. Please check permissions.');
//     }
//   }

//   const stopCamera = () => {
//     if (stream) {
//       stream.getTracks().forEach(track => track.stop());
//       setStream(null);
//       if (videoRef.current) {
//         videoRef.current.srcObject = null;
//       }
//     }
//   };
//   // Toggle camera
//   const toggleCamera = () => {
//     if (cameraActive) {
//       stopCamera()
//     } else {
//       startCamera()
//     }
//   }

//   // Take snapshot
//   const takeSnapshot = () => {
//     if (!cameraActive || !videoRef.current || !canvasRef.current) return

//     const video = videoRef.current
//     const canvas = canvasRef.current

//     // Set canvas dimensions to match video
//     canvas.width = video.videoWidth
//     canvas.height = video.videoHeight

//     // Draw video frame to canvas
//     const ctx = canvas.getContext("2d")
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

//     // Get image data as base64
//     const imageData = canvas.toDataURL("image/png")
//     setPreviewImage(imageData)

//     // Save the snapshot
//     saveSnapshot(imageData)
//   }

//   // Save snapshot
//   const saveSnapshot = async (imageData) => {
//     try {
//       // In a real app, you would save this to disk using Electron's API
//       // For this example, we'll just add it to our state
//       const timestamp = new Date().toISOString()
//       const newSnapshot = {
//         id: Date.now().toString(),
//         data: imageData,
//         timestamp,
//         name: `Snapshot ${timestamp}`,
//       }

//       addSnapshot(newSnapshot)
//     } catch (err) {
//       console.error("Error saving snapshot:", err)
//       setError("Failed to save snapshot.")
//     }
//   }

//   // Clean up on unmount
//   useEffect(() => {
//     return () => {
//       if (stream) {
//         stream.getTracks().forEach(track => track.stop());
//       }
//     };
//   }, [stream]);
//   return (
//     <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col">
//       <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Camera Preview</h2>

//       <div className="relative bg-black rounded-lg overflow-hidden flex-1 min-h-[240px] flex items-center justify-center">
//         {cameraActive ? (
//           <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
//         ) : previewImage ? (
//           <img
//             src={previewImage || "/placeholder.svg"}
//             alt="Snapshot preview"
//             className="w-full h-full object-contain"
//           />
//         ) : (
//           <div className="text-gray-400 dark:text-gray-500 flex flex-col items-center">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-12 w-12 mb-2"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
//               <circle cx="12" cy="13" r="4"></circle>
//             </svg>
//             <p>Camera is off</p>
//           </div>
//         )}

//         {error && <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white p-2 text-sm">{error}</div>}
//       </div>

//       <div className="flex justify-between mt-4">
//         <button
//           onClick={toggleCamera}
//           className={`px-4 py-2 rounded-md ${
//             cameraActive ? "bg-red-500 hover:bg-red-600 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
//           }`}
//         >
//           {cameraActive ? "Turn Off Camera" : "Turn On Camera"}
//         </button>

//         <button
//           onClick={takeSnapshot}
//           disabled={!cameraActive}
//           className={`px-4 py-2 rounded-md ${
//             cameraActive ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
//           }`}
//         >
//           Take Snapshot
//         </button>
//       </div>

//       {/* Hidden canvas for capturing snapshots */}
//       <canvas ref={canvasRef} className="hidden" />
//     </div>
//   )
// }

// export default CameraView
import React, { useState, useRef, useEffect } from 'react';

const CameraComponent = ({addSnapshot}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');

  // Get available cameras
  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedDevice(videoDevices[0].deviceId);
        }
      } catch (err) {
        console.error('Error enumerating devices:', err);
        setError('Could not access camera devices');
      }
    };

    getCameras();
  }, []);

  // Start camera with selected device
  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          deviceId: selectedDevice ? { exact: selectedDevice } : undefined,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setError(null);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access the camera. Please check permissions.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  // Capture photo
  const capturePhoto = async ({}) => {
    if (!stream || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get image data
    const imageData = canvas.toDataURL('image/png');
    
    // Add to photos array
    const newPhoto = {
      id: Date.now(),
      dataUrl: imageData,
      timestamp: new Date().toLocaleString()
    };
    
    addSnapshot(newPhoto)

    // Save to file system
    // try {
    //   const buffer = Buffer.from(imageData.split(',')[1], 'base64');
    //   const result = await window.electronAPI.saveImage(buffer);
    //   if (!result.success) {
    //     console.error('Failed to save image:', result.error);
    //   }
    // } catch (err) {
    //   console.error('Error saving image:', err);
    // }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
<div className="p-6 w-full max-w-xs bg-gray-900 rounded-xl shadow-lg">
  <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
    <span role="img" aria-label="camera">📸</span> Camera Snapshot
  </h2>

  <div className="w-full aspect-video bg-black rounded-lg overflow-hidden border border-gray-700 mb-4">
    <video
      ref={videoRef}
      autoPlay
      playsInline
      className="w-full h-full object-contain"
    />
  </div>

  <div className="flex flex-col space-y-3">
    <button
      onClick={startCamera}
      disabled={!!stream}
      className={`w-full py-2 rounded-lg font-semibold transition focus:outline-none ${
        stream
          ? 'bg-gray-500 text-white cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700 text-white'
      }`}
    >
      Start Camera
    </button>

    <button
      onClick={capturePhoto}
      disabled={!stream}
      className={`w-full py-2 rounded-lg font-semibold transition focus:outline-none ${
        !stream
          ? 'bg-gray-500 text-white cursor-not-allowed'
          : 'bg-green-600 hover:bg-green-700 text-white'
      }`}
    >
      Capture Photo
    </button>
  </div>

  {/* Optional Camera Selector */}
  {devices.length > 1 && (
    <div className="mt-4">
      <label className="block text-sm text-white mb-1">Select Camera:</label>
      <select
        value={selectedDevice}
        onChange={(e) => setSelectedDevice(e.target.value)}
        className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none"
      >
        {devices.map((device, i) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Camera ${i + 1}`}
          </option>
        ))}
      </select>
    </div>
  )}

  {/* Hidden canvas for image capture */}
  <canvas ref={canvasRef} className="hidden" />
</div>
  );
  
};

export default CameraComponent;