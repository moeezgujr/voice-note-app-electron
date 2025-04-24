
import { useState } from "react"
import Sidebar from "./Sidebar"
import CameraView from "./CameraView"
import AudioRecorder from "./AudioRecorder"
import TranscriptionView from "./TranscriptionView"
import ApiResponse from "./ApiResponse"
import TextToSpeech from "./TextToSpeech"
import { ThemeProvider } from "./ThemeContext"
import NotesGallery from "./NotesGallery"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const App = () => {
  const [activeTab, setActiveTab] = useState("record")
  const [snapshots, setSnapshots] = useState([])
  const [recordings, setRecordings] = useState([])
  const [transcription, setTranscription] = useState("")
  const [apiResponse, setApiResponse] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Add a new snapshot to the collection
  const addSnapshot = (snapshot) => {
    setSnapshots((prev) => [...prev, snapshot])
    toast.success("Snapshot saved successfully!")
  }

  // Add a new recording to the collection
  const addRecording = (recording) => {
    setRecordings((prev) => [...prev, recording])
    toast.success("Recording saved successfully!")
  }

  // Update the transcription
  const updateTranscription = (text) => {
    setTranscription(text)
  }

  // Send transcription to API
  const sendToApi = async () => {
    if (!transcription.trim()) {
      toast.error("No transcription to send!")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        body: JSON.stringify({
          title: "Voice Note Transcription",
          body: transcription,
          userId: 1,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })

      const data = await response.json()
      setApiResponse(data)
      toast.success("API request successful!")
    } catch (error) {
      console.error("API Error:", error)
      toast.error("Failed to send to API: " + error.message)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <ThemeProvider>
      <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-gray-800">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4">
          {activeTab === "record" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CameraView addSnapshot={addSnapshot} />
              <AudioRecorder addRecording={addRecording} updateTranscription={updateTranscription} />
              <TranscriptionView transcription={transcription} sendToApi={sendToApi} isLoading={isLoading} />
              <ApiResponse apiResponse={apiResponse} />
              <TextToSpeech text={apiResponse ? apiResponse.body : transcription} />
            </div>
          )}

          {activeTab === "gallery" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <NotesGallery snapshots={snapshots} recordings={recordings} />
            </div>
          )}
        </main>

        <ToastContainer position="bottom-right" />
      </div>
    </ThemeProvider>
  )
}

export default App
