import { useState } from "react";
import Button from "../components/core/button";

type Move = "rock" | "paper" | "scissor";

// Manage States in our component

// ON MOUNT -> WHEN COMPONENT IS MOUNTED IN VDOM TREE
// ON UPDATE  -> WHEN A COMPONENT THAT IS IN VDOM TREE IS UPDATED
// ON UNMOUNT -> WHEN A COMPONENT IS REMOVED FROM VDOM TREE

const moves: Move[] = ["rock", "paper", "scissor"];

function RockPaperScissor() {
  const [humanMove, setHumanMove] = useState<Move | undefined>(undefined);

  const [aiMove, setAiMove] = useState<Move | undefined>(undefined);

  const [winner, setWinner] = useState<"human" | "ai" | "draw" | undefined>(
    undefined,
  );

  function determineWinner(humanMove: Move, aiMove: Move) {
    if (humanMove === aiMove) return "draw";
    else {
      if (humanMove === "rock") {
        if (aiMove === "paper") return "ai";
        else return "human";
      } else if (humanMove === "paper") {
        if (aiMove === "scissor") return "ai";
        else return "human";
      } else if (humanMove === "scissor") {
        if (aiMove === "rock") return "ai";
        else return "human";
      }
    }
  }

  const handleClick = (move: Move) => {
    setHumanMove(move);

    // Choose a move for AI randomly
    const randomMoveIndex = Math.floor(Math.random() * moves.length);
    const moveByAI = moves[randomMoveIndex];

    console.log("AI Move: ", moveByAI);

    setAiMove(moveByAI);

    const winner = determineWinner(move, moveByAI);

    setWinner(winner);
  };

  return (
    <div>
      {/* Rock paper scissor */}
      <p>Your Move:</p>
      <Choices handleClick={handleClick} />

      <div>Your Move: {humanMove ?? "You need to click a button"}</div>
      <div>AI Move: {aiMove ?? "AI Will Play after you play"}</div>
      <GameStateText winner={winner} />
    </div>
  );
}

function Choices(props: { handleClick: (move: Move) => void }) {
  const { handleClick } = props;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "10px",
      }}
    >
      <Button
        onClick={() => {
          handleClick("rock");
        }}
      >
        Rock
      </Button>
      <Button
        onClick={() => {
          handleClick("paper");
        }}
      >
        Paper
      </Button>
      <Button
        onClick={() => {
          handleClick("scissor");
        }}
      >
        Scissor
      </Button>
    </div>
  );
}

function GameStateText(props: { winner: "human" | "ai" | "draw" | undefined }) {
  if (props.winner === "draw") return <div>It's a draw</div>;
  else if (props.winner === "human") return <div>Human Wins</div>;
  else if (props.winner === "ai") return <div>AI Wins</div>;
  else return <div>No Winner Yet</div>;
}
export default RockPaperScissor;
