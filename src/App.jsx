import React, { useState } from "react";
import StartScreen from "./components/StartScreen";
import LoadingScreen from "./components/LoadingScreen";
import LockerRoomScene from "./LockerRoomScene";

export default function App() {
  const [stage, setStage] = useState("start"); // "start", "loading", "scene"

  return (
    <>
      {stage === "start" && (
        <StartScreen onStart={() => setStage("loading")} />
      )}
      {stage === "loading" && (
        <LoadingScreen onComplete={() => setStage("scene")} />
      )}
      {stage === "scene" && <LockerRoomScene />}
    </>
  );
}
