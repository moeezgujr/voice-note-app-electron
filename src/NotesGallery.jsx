import { useState } from "react"

const NotesGallery = ({ snapshots, recordings }) => {
  const [selectedTab, setSelectedTab] = useState("snapshots")
  const [playingId, setPlayingId] = useState(null)
  const [audioElement, setAudioElement] = useState(null)

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  // Format duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }
  // Play audio
  const playAudio = (recording) => {
    if (audioElement) {
      audioElement.pause()
    }

    const audio = new Audio(recording.url)
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Notes Gallery</h2>

      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 ${
            selectedTab === "snapshots"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-600 dark:text-gray-400"
          }`}
          onClick={() => setSelectedTab("snapshots")}
        >
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            Snapshots ({snapshots.length})
          </div>
        </button>

        <button
          className={`px-4 py-2 ${
            selectedTab === "recordings"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-600 dark:text-gray-400"
          }`}
          onClick={() => setSelectedTab("recordings")}
        >
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
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
            Recordings ({recordings.length})
          </div>
        </button>
      </div>

      {selectedTab === "snapshots" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {snapshots.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
              No snapshots yet. Take some photos in the Record tab.
            </div>
          ) : (
            snapshots.map((snapshot) => (
              <div key={snapshot.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 bg-black">
                  <img
                    src={snapshot.dataUrl || "/placeholder.svg"}
                    alt={`Snapshot ${snapshot.id}`}
                    className="object-contain w-full h-full"
                  />
                </div>
                <div className="p-2">
                  <div className="text-sm text-gray-600 dark:text-gray-300">{formatDate(snapshot.timestamp)}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selectedTab === "recordings" && (
        <div className="space-y-2">
          {recordings.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No recordings yet. Record some audio in the Record tab.
            </div>
          ) : (
            recordings.map((recording) => (
              <div key={recording.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 flex items-center">
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
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default NotesGallery
