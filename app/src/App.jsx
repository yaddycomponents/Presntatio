import { scenes as aiScenes } from "./AI Reply/scenes";
import AiStage from "./AI Reply/Stage";
import Stage from "./components/Stage";
import { scenes as debtScenes } from "./debt/scenes";
import DebtStage from "./debt/Stage";
import { scenes } from "./scenes";

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, "");
  const params = new URLSearchParams(window.location.search);
  if (path.endsWith("/debt") || params.has("debt"))
    return <DebtStage scenes={debtScenes} />;
  if (path.endsWith("/ai") || params.has("ai"))
    return <AiStage scenes={aiScenes} />;
  return <Stage scenes={scenes} />;
}
