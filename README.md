![image](https://github.com/user-attachments/assets/f21e30a1-66b9-40d8-ae32-fbf34e36a335)
![image](https://github.com/user-attachments/assets/5ee32fe3-7242-4c14-96ce-4918f9308748)
![image](https://github.com/user-attachments/assets/5160ba2c-5c37-4c58-b966-13cbb84cfabd)


Electron Voice App README
Features
 - Voice Recording: Record audio with the built-in voice recorder.
 - Speech-to-Text: Convert recorded audio to text using the Google Cloud Speech API.
 - Text-to-Speech: Play back the transcribed text using text-to-speech technology.
 - Camera Snapshot: Capture snapshots of the user’s environment with an integrated camera feature.
 - Gallery: View and manage snapshots and recordings.
Technologies Used
 - Electron: For building cross-platform desktop applications.
 - Vite: Fast frontend build tool for fast development and bundling.
 - React: User interface library.
 - Tailwind CSS: Utility-first CSS framework for styling.
 - Google Cloud Speech API: Cloud-based speech-to-text transcription service.
 - React Toastify: For toast notifications.
 - Electron Builder: For packaging and building the application.
Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/electron-voice-app.git
   cd electron-voice-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. To build and package the application:
   ```bash
   npm run build
   ```
Available Scripts
 - `dev`: Starts the development server using Vite.
 - `build`: Builds the app and packages it using Electron Builder.
 - `preview`: Previews the app after building.
 - `test`: Runs tests using Vitest.
 - `postinstall`: Rebuilds native modules required by Electron.
Dependencies
 - @google-cloud/speech: Google Cloud Speech API client for speech-to-text.
 - @speechly/speech-recognition-polyfill: Polyfill for speech recognition.
 - electron-updater: For auto-updating the Electron app.
 - react-toastify: Toast notifications for feedback to the user.
 - vosk: Offline speech-to-text library.
Development Dependencies
 - electron: Core Electron framework.
 - electron-builder: For packaging and building the Electron app.
 - vite: Frontend development and build tool.
 - tailwindcss: For styling the app’s UI.
 - typescript: Static typing for JavaScript.
 - vite-plugin-electron: Vite plugin for integrating Electron with Vite.
 - postcss and autoprefixer: For styling and CSS post-processing.
