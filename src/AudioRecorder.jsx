"use client"

import { useState, useRef, useEffect } from "react"

const AudioRecorder = ({ addRecording, updateTranscription }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState(null)
  const [recognizing, setRecognizing] = useState(false)

  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const timerRef = useRef(null)
  const audioRef = useRef(null)
  const recognitionRef = useRef(null)

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = ""
        let finalTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        // Update transcription in parent component
        updateTranscription(finalTranscript || interimTranscript)
      }

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error)
        setError(`Speech recognition error: ${event.error}`)
      }
    } else {
      setError("Speech recognition is not supported in this browser.")
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [updateTranscription])

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        setAudioBlob(audioBlob)

        // Create URL for the audio blob
        const audioUrl = URL.createObjectURL(audioBlob)
        // audioRef.current.src = audioUrl
      }

      // Start media recorder
      mediaRecorderRef.current.start()
      setIsRecording(true)
      setError(null)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1)
      }, 1000)

      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start()
        setRecognizing(true)
      }
    } catch (err) {
      console.error("Error starting recording:", err)
      setError("Could not access microphone. Please check permissions.")
    }
  }

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()

      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())

      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      setIsRecording(false)

      // Stop speech recognition
      if (recognitionRef.current && recognizing) {
        recognitionRef.current.stop()
        setRecognizing(false)
      }
    }
  }

  // Toggle play/pause audio
  const togglePlayback = () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      if (!audioRef.current) {
        audioRef.current = new window.Audio(URL.createObjectURL(audioBlob))
        audioRef.current.onended = () => setIsPlaying(false)
      }
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  // Clean up audio element when component unmounts or when audio blob changes
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [audioBlob])

  // Save recording
  const saveRecording = () => {
    if (!audioBlob) return

    // In a real app, you would save this to disk using Electron's API
    // For this example, we'll just add it to our state
    const timestamp = new Date().toISOString()
    const newRecording = {
      id: Date.now().toString(),
      blob: audioBlob,
      url: URL.createObjectURL(audioBlob),
      timestamp,
      duration: recordingTime,
      name: `Recording ${timestamp}`,
    }

    addRecording(newRecording)
    setRecordingTime(0)
  }

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Voice Recorder</h2>

      <div className="flex-1 flex flex-col items-center justify-center min-h-[240px]">
        <div className="text-4xl font-mono mb-6 text-gray-800 dark:text-white">{formatTime(recordingTime)}</div>

        <div className="flex space-x-4">
          {isRecording ? (
            <button onClick={stopRecording} className="bg-red-500 hover:bg-red-600 text-white rounded-full p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <rect x="9" y="9" width="6" height="6"></rect>
              </svg>
            </button>
          ) : (
            <button onClick={startRecording} className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            </button>
          )}

          {audioBlob && !isRecording && (
            <button
              onClick={togglePlayback}
              className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4"
              disabled={isRecording}
            >
              {isPlaying ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
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
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              )}
            </button>
          )}
        </div>

        {recognizing && <div className="mt-4 text-blue-500 dark:text-blue-400 animate-pulse">Listening...</div>}

        {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}
      </div>

      {audioBlob && !isRecording && (
        <button
          onClick={saveRecording}
          className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
        >
          Save Recording
        </button>
      )}
    </div>
  )
}

export default AudioRecorder
