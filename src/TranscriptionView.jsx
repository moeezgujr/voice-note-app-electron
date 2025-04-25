const TranscriptionView = ({ transcription, sendToApi, isLoading }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Transcription</h2>

        <button
          onClick={sendToApi}
          disabled={!transcription || isLoading}
          className={`flex items-center px-3 py-1 rounded-md ${
            !transcription || isLoading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              Sending...
            </>
          ) : (
            <>
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
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              Send to API
            </>
          )}
        </button>
      </div>

      <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-md p-3 min-h-[120px] max-h-[200px] overflow-y-auto">
        {transcription ? (
          <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{transcription}</p>
        ) : (
          <p className="text-gray-400 dark:text-gray-500 italic">Your transcription will appear here...</p>
        )}
      </div>
    </div>
  )
}

export default TranscriptionView
