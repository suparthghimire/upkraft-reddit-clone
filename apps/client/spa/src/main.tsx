import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
// import RockPaperScissor from "./pages/rock-paper-scissor.tsx";
// import TicTacToe from "./pages/tic-tac-toe.tsx";
import MainLayout from "./components/layout/main-layout/index.tsx";
// import HooksInReact from "./pages/hooks.tsx";
// import APICall from "./pages/api-call.tsx";
// import AutomaticCounter from "./pages/auto-counter.tsx";
// import Mutations from "./pages/mutations.tsx";
// import Refs from "./pages/ref.tsx";
import DialogPage from "./pages/dialog-page.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MainLayout>
      <DialogPage />
    </MainLayout>
  </StrictMode>,
);
