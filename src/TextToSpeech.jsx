import { useState, useRef, useEffect } from "react";

const TextToSpeech = () => {
  const [text, setText] = useState("");  // State for text input
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState(null);
  const [volume, setVolume] = useState(1);

  const utteranceRef = useRef(null);

  // Initialize speech synthesis
  useEffect(() => {
    if (!window.speechSynthesis) {
      setError("Speech synthesis is not supported in this browser.");
      return;
    }

    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Update utterance when text changes
  useEffect(() => {
    if (window.speechSynthesis && text) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  }, [text]);

  // Play text
  const playText = () => {
    if (!window.speechSynthesis || !text) return;

    if (isPaused) {
      // Resume paused speech
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Create new utterance
    utteranceRef.current = new SpeechSynthesisUtterance(text);
    utteranceRef.current.volume = volume;

    // Set event handlers
    utteranceRef.current.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setError("Error during speech synthesis.");
      setIsPlaying(false);
      setIsPaused(false);
    };

    // Start speaking
    window.speechSynthesis.speak(utteranceRef.current);
    setIsPlaying(true);
  };

  // Pause speech
  const pauseSpeech = () => {
    if (window.speechSynthesis && isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  // Stop speech
  const stopSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = Number.parseFloat(e.target.value);
    setVolume(newVolume);

    if (utteranceRef.current) {
      utteranceRef.current.volume = newVolume;
    }
  };

  // Handle text input change
  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Text to Speech</h2>

      <div className="flex-1 flex flex-col justify-center items-center min-h-[120px]">
        {error ? (
          <div className="text-red-500 text-sm">{error}</div>
        ) : (
          <div className="w-full">
            <div className="mb-4">
              {/* Text input field to allow user to type text */}
              <textarea
                value={text}
                onChange={handleTextChange}
                placeholder="Type text here..."
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            <div className="flex justify-center space-x-4 mb-6">
              {isPlaying ? (
                <button onClick={pauseSpeech} className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                </button>
              ) : (
                <button
                  onClick={playText}
                  className="bg-green-500 hover:bg-green-600 text-white rounded-full p-3"
                  disabled={!text}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </button>
              )}

              <button
                onClick={stopSpeech}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full p-3"
                disabled={!isPlaying && !isPaused}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                </svg>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600 dark:text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextToSpeech;
