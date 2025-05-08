# 4TH-KIT Locker Room

An immersive, web-based 3D locker room experience built with React and React Three Fiber.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Add your lockerRoom.glb model and splash.png image to the `public` directory.
3. Start the development server:
   ```bash
   npm start
   ```

## Features
- Full-screen welcome/start screen
- Loading fallback with splash image
- 3D locker room scene (GLB)
- Ready for first-person controls and navigation

## Project Structure
```
/public
  ├── index.html
  ├── splash.png
  └── lockerRoom.glb
/src
  ├── App.jsx
  ├── index.jsx
  ├── index.css
  ├── StartScreen.jsx
  ├── LoaderFallback.jsx
  └── LockerRoomScene.jsx
```
