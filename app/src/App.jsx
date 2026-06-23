import AiStage from "./AI Reply/Stage";
import { scenes as aiScenes } from "./AI Reply/scenes";
import Stage from "./components/Stage";
import { scenes } from "./scenes";

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, "");
  const isAi =
    path.endsWith("/ai") ||
    new URLSearchParams(window.location.search).has("ai");
  if (isAi) return <AiStage scenes={aiScenes} />;
  return <Stage scenes={scenes} />;
}
