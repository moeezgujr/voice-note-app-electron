import { useState, useEffect } from "react"

const NotesGallery = () => {
  const [selectedTab, setSelectedTab] = useState("snapshots")
  const [playingId, setPlayingId] = useState(null)
  const [audioElement, setAudioElement] = useState(null)
  const [snapshots, setSnapshots] = useState([])
  const [recordings, setRecordings] = useState([])
  const [loading, setLoading] = useState({ snapshots: false, recordings: false })
  const [error, setError] = useState(null)

  // Load both snapshots and recordings from storage
  useEffect(() => {
    const loadMedia = async () => {
      if (!window.ipcRenderer) return // Skip in non-Electron environment
      
      try {
        setLoading(prev => ({ ...prev, snapshots: true, recordings: true }))
        setError(null)
        
        const [savedSnapshots, savedRecordings] = await Promise.all([
          window.ipcRenderer.getSavedSnapshots(),
          window.ipcRenderer.getSavedRecordings()
        ])
        
        setSnapshots(savedSnapshots)
        setRecordings(savedRecordings)
      } catch (err) {
        console.error("Failed to load media:", err)
        setError("Failed to load media from storage")
      } finally {
        setLoading(prev => ({ ...prev, snapshots: false, recordings: false }))
      }
    }

    loadMedia()
  }, [])

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  // Format duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Play audio from base64 string
  const playAudio = (recording) => {
    if (audioElement) {
      audioElement.pause()
    }

    const audio = new Audio(recording.base64Audio)
    audio.onended = () => setPlayingId(null)
    audio.play()

    setAudioElement(audio)
    setPlayingId(recording.id)
  }

  // Pause audio
  const pauseAudio = () => {
    if (audioElement) {
      audioElement.pause()
      setPlayingId(null)
      setAudioElement(null)
    }
  }

  // Delete snapshot
  const deleteSnapshot = async (id) => {
    if (!window.ipcRenderer) return
    
    try {
      await window.ipcRenderer.deleteSnapshot(id)
      setSnapshots(prev => prev.filter(s => s.id !== id))
    } catch (err) {
      console.error("Failed to delete snapshot:", err)
      setError("Failed to delete snapshot")
    }
  }

  // Delete recording
  const deleteRecording = async (id) => {
    if (!window.ipcRenderer) return
    
    try {
      await window.ipcRenderer.deleteRecording(id)
      setRecordings(prev => prev.filter(r => r.id !== id))
    } catch (err) {
      console.error("Failed to delete recording:", err)
      setError("Failed to delete recording")
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Notes Gallery</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 ${
            selectedTab === "snapshots"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-600 dark:text-gray-400"
          }`}
          onClick={() => setSelectedTab("snapshots")}
        >
          Snapshots ({loading.snapshots ? "..." : snapshots.length})
        </button>

        <button
          className={`px-4 py-2 ${
            selectedTab === "recordings"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-600 dark:text-gray-400"
          }`}
          onClick={() => setSelectedTab("recordings")}
        >
          Recordings ({loading.recordings ? "..." : recordings.length})
        </button>
      </div>

      {selectedTab === "snapshots" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading.snapshots ? (
            <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
              Loading snapshots...
            </div>
          ) : snapshots.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
              No snapshots yet. Take some photos in the Record tab.
            </div>
          ) : (
            snapshots.map((snapshot) => (
              <div key={snapshot.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden relative">
                <div className="aspect-w-16 aspect-h-9 bg-black">
                  <img
                    src={snapshot.dataUrl}
                    alt={`Snapshot ${snapshot.id}`}
                    className="object-contain w-full h-full"
                  />
                </div>
                <div className="p-2">
                  <div className="text-sm text-gray-600 dark:text-gray-300">{formatDate(snapshot.timestamp)}</div>
                </div>
                <button
                  onClick={() => deleteSnapshot(snapshot.id)}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                  title="Delete snapshot"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {selectedTab === "recordings" && (
        <div className="space-y-2">
          {loading.recordings ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Loading recordings...
            </div>
          ) : recordings.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No recordings yet. Record some audio in the Record tab.
            </div>
          ) : (
            recordings.map((recording) => (
              <div key={recording.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <div className="mr-3">
                    {playingId === recording.id ? (
                      <button onClick={pauseAudio} className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
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
                        onClick={() => playAudio(recording)}
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
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
                  </div>

                  <div className="flex-1">
                    <div className="font-medium text-gray-800 dark:text-white">{recording.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                      <span>{formatDate(recording.timestamp)}</span>
                      <span className="mx-2">•</span>
                      <span>{formatDuration(recording.duration)}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => deleteRecording(recording.id)}
                  className="ml-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                  title="Delete recording"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default NotesGallery
