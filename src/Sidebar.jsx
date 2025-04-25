import { useTheme } from './ThemeContext';  // Import the hook

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { darkMode, toggleDarkMode } = useTheme();  // Access theme state

  return (
    <div className={`flex flex-row md:flex-col w-full md:w-64 h-16 md:h-full ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md transition-all duration-200 overflow-y-auto`}>
      {/* Logo or App Name */}
      <div className="hidden md:flex items-center justify-center py-4">
        <h1 className="text-lg font-bold text-gray-800 dark:text-white hidden lg:block">
          Voice Notes
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-row md:flex-col w-full items-center justify-around md:justify-start md:space-y-1 px-1 py-2 md:py-0" style={{ width: '95%' }}>
        {/* Record Button */}
        <button
          onClick={() => setActiveTab("record")}
          className={`flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 w-full px-3 py-3 rounded-lg transition ${activeTab === "record" ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
        >
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
          <span className="text-xs md:text-sm lg:text-base hidden md:inline">Record</span>
        </button>

        {/* Gallery Button */}
        <button
          onClick={() => setActiveTab("gallery")}
          className={`flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 w-full px-3 py-3 rounded-lg transition ${activeTab === "gallery" ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
        >
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          <span className="text-xs md:text-sm lg:text-base hidden md:inline">Gallery</span>
        </button>
      </nav>

      {/* Dark Mode Toggle */}
      <div className="hidden md:flex items-center justify-center mb-4">
        <button
          onClick={toggleDarkMode}  // Toggle theme
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <svg
              className="h-5 w-5 text-yellow-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg
              className="h-5 w-5 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}

export default Sidebar
