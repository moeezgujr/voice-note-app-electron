const ApiResponse = ({ apiResponse }) => {
  if (!apiResponse) return null

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col">
      <div className="flex items-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-green-500 mr-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">API Response</h2>
      </div>

      <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-md p-3 min-h-[120px] max-h-[200px] overflow-y-auto">
        <pre className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
          {JSON.stringify(apiResponse, null, 2)}
        </pre>
      </div>
    </div>
  )
}

export default ApiResponse
