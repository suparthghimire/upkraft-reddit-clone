import { useState } from "react";
import Button from "../components/core/button";
import "../styles/tic-tac-toe.css";

type BoardCell = "X" | "O" | null;
type GameOverState = {
  isGameOver: boolean;
  winner?: BoardCell;
  isDraw: boolean;
};
function generateEmptyBoard(): BoardCell[][] {
  return [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
}

const winningCombinations = [
  // Rows
  [
    [0, 0],
    [0, 1],
    [0, 2],
  ],
  [
    [1, 0],
    [1, 1],
    [1, 2],
  ],
  [
    [2, 0],
    [2, 1],
    [2, 2],
  ],

  // Columns
  [
    [0, 0],
    [1, 0],
    [2, 0],
  ],
  [
    [0, 1],
    [1, 1],
    [2, 1],
  ],
  [
    [0, 2],
    [1, 2],
    [2, 2],
  ],

  // Dialognals
  [
    [0, 0],
    [1, 1],
    [2, 2],
  ],
  [
    [0, 2],
    [1, 1],
    [2, 0],
  ],
];

function TicTacToe() {
  const [board, setBoard] = useState(generateEmptyBoard());
  const [turn, setTurn] = useState<Required<BoardCell>>("X");
  const [gameOverState, setGameOverState] = useState<GameOverState>({
    isGameOver: false,
    winner: null,
    isDraw: true,
  });

  function swapTurn() {
    setTurn(turn === "X" ? "O" : "X");
  }

  function determineGameOver(board: BoardCell[][]) {
    // Check if anyone won
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;

      const cellA = board[a[0]][a[1]];
      const cellB = board[b[0]][b[1]];
      const cellC = board[c[0]][c[1]];

      // If all these are same and not null, then we have a winner
      if (cellA && cellB && cellC && cellA === cellB && cellB === cellC) {
        setGameOverState({
          isGameOver: true,
          winner: cellA,
          isDraw: false,
        });
        return;
      }
    }

    let isDraw = true;
    // Check if any cell of board is null
    for (const row of board) {
      for (const cell of row) {
        if (cell === null) {
          isDraw = false;
          break;
        }
      }
    }

    if (isDraw) {
      setGameOverState({
        isGameOver: true,
        winner: null,
        isDraw: true,
      });
    } else {
      setGameOverState({
        isGameOver: false,
        winner: null,
        isDraw: false,
      });
    }
  }

  function handleCellClick(args: { rowIndex: number; cellIndex: number }) {
    const newBoard = [...board.map((row) => [...row])]; // Create a new array to trigger re-render

    // We need to flip the current state of the board based on the ell that was clicked
    const cell = newBoard[args.rowIndex][args.cellIndex];

    if (cell !== null) {
      alert(
        `Cell is already filled with ${cell}. Please select an empty cell.`,
      );
      return;
    }

    // If cell is empty, set the value to current player's turn
    if (cell === null) {
      newBoard[args.rowIndex][args.cellIndex] = turn;
      setBoard(newBoard); // Create a new array to trigger re-render
    }

    determineGameOver(newBoard);
    swapTurn();
  }

  function resetGame() {
    setBoard(generateEmptyBoard());
    setTurn("X");
    setGameOverState({
      isGameOver: false,
      winner: null,
      isDraw: true,
    });
  }

  return (
    <div>
      {!gameOverState.isGameOver ? (
        <div className="tic-tac-toe-board">
          {board.map((row, rowIndex) => {
            return row.map((cell, cellIndex) => {
              return (
                <Cell
                  type={cell}
                  key={`${rowIndex}-${cellIndex}-${cell?.toString()}`}
                  onClick={() => handleCellClick({ rowIndex, cellIndex })}
                />
              );
            });
          })}
        </div>
      ) : (
        <div>
          <GameOver
            isDraw={gameOverState.isDraw}
            winner={gameOverState.winner}
            isGameOver={gameOverState.isGameOver}
          />
          <Button onClick={resetGame}>Reset Game</Button>
        </div>
      )}
    </div>
  );
}

type CellProps = {
  onClick: () => void;
  type: BoardCell;
};

function Cell(props: CellProps) {
  return (
    <Button className="tic-tac-toe-cell" onClick={props.onClick}>
      {props.type}
    </Button>
  );
}

function GameOver(props: GameOverState) {
  if (props.isDraw) {
    return <div>Game Over! It's a draw!</div>;
  } else if (props.winner) {
    return <div>Game Over! {props.winner} wins!</div>;
  }
  return <div>Game Over!</div>;
}

export default TicTacToe;
