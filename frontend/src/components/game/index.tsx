import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import gameContext from "../../gameContext";
import gameService from "../../services/gameService";
import socketService from "../../services/socketService";

import { WaitingPlayer } from "./WaitingPlayer";
import { ResultModal } from "../modals/ResultModal";

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const RowContainer = styled.div`
  width: 100%;
  display: flex;
`;

interface ICellProps {
  borderTop?: boolean;
  borderRight?: boolean;
  borderLeft?: boolean;
  borderBottom?: boolean;
}

const Cell = styled.div<ICellProps>`
  width: 13em;
  height: 9em;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-top: ${({ borderTop }) => borderTop && "3px solid #737372"};
  border-left: ${({ borderLeft }) => borderLeft && "3px solid #737372"};
  border-bottom: ${({ borderBottom }) => borderBottom && "3px solid #737372"};
  border-right: ${({ borderRight }) => borderRight && "3px solid #737372"};
  transition: all 270ms ease-in-out;

  &:hover {
    background-color: #8d44ad28;
  }
`;

const PlayStopper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 99;
  cursor: default;
`;

const X = styled.span`
  font-size: 100px;
  color: #8C1127;
  &::after {
    content: "X";
  }
`;

const O = styled.span`
  font-size: 100px;
  color: #D9B7B0;
  &::after {
    content: "O";
  }
`;

export type IPlayMatrix = Array<Array<string | null>>;
export interface IStartGame {
  start: boolean;
  symbol: "x" | "o";
  playerNameOpponent: string
}

export function Game() {
  const [matrix, setMatrix] = useState<IPlayMatrix>([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [textModal, setTextModal] = useState<string>("");

  const {
    playerSymbol,
    setPlayerSymbol,
    setPlayerTurn,
    isPlayerTurn,
    setGameStarted,
    isGameStarted,
    playerNameOpponent,
    setPlayerNameOpponent
  } = useContext(gameContext);

  const checkGameState = (matrix: IPlayMatrix) => {
    for (let i = 0; i < matrix.length; i++) {
      let row = [];
      for (let j = 0; j < matrix[i].length; j++) {
        row.push(matrix[i][j]);
      }

      if (row.every((value) => value && value === playerSymbol)) {
        return [true, false];
      } else if (row.every((value) => value && value !== playerSymbol)) {
        return [false, true];
      }
    }

    for (let i = 0; i < matrix.length; i++) {
      let column = [];
      for (let j = 0; j < matrix[i].length; j++) {
        column.push(matrix[j][i]);
      }

      if (column.every((value) => value && value === playerSymbol)) {
        return [true, false];
      } else if (column.every((value) => value && value !== playerSymbol)) {
        return [false, true];
      }
    }

    if (matrix[1][1]) {
      if (matrix[0][0] === matrix[1][1] && matrix[2][2] === matrix[1][1]) {
        if (matrix[1][1] === playerSymbol) return [true, false];
        else return [false, true];
      }

      if (matrix[2][0] === matrix[1][1] && matrix[0][2] === matrix[1][1]) {
        if (matrix[1][1] === playerSymbol) return [true, false];
        else return [false, true];
      }
    }

    //Check for a tie
    if (matrix.every((m) => m.every((v) => v !== null))) {
      return [true, true];
    }

    return [false, false];
  };

  const updateGameMatrix = (column: number, row: number, symbol: "x" | "o") => {
    const newMatrix = [...matrix];

    if (newMatrix[row][column] === null || newMatrix[row][column] === "null") {
      newMatrix[row][column] = symbol;
      setMatrix(newMatrix);
    }

    if (socketService.socket) {
      gameService.updateGame(socketService.socket, newMatrix);
      const [currentPlayerWon, otherPlayerWon] = checkGameState(newMatrix);
      if (currentPlayerWon && otherPlayerWon) {
        gameService.gameWin(socketService.socket, "Egalité!");
        setTextModal("Egalité!");
        setOpenModal(true);
      } else if (currentPlayerWon && !otherPlayerWon) {
        gameService.gameWin(socketService.socket, "Tu as perdu!");
        setTextModal("Tu as gagné!");
        setOpenModal(true);
      }

      setPlayerTurn(false);
    }
  };

  const handleGameUpdate = () => {
    if (socketService.socket)
      gameService.onGameUpdate(socketService.socket, (newMatrix) => {
        console.log('ON GAME UPDATE')
        setMatrix(newMatrix);
        checkGameState(newMatrix);
        setPlayerTurn(true);
      });
  };

  const handleGameStart = () => {
    if (socketService.socket)
      gameService.onStartGame(socketService.socket, (options) => {
        setGameStarted(true);
        setPlayerSymbol(options.symbol);
        if (options.playerNameOpponent) setPlayerNameOpponent(options.playerNameOpponent)
        if (options.start) setPlayerTurn(true);
        else setPlayerTurn(false);
      });
  };

  const handleGameWin = () => {
    if (socketService.socket)
      gameService.onGameWin(socketService.socket, (message) => {
        setPlayerTurn(false);
        setTextModal(message);
        setOpenModal(true);
      });
  };

  const playAgain = async() => {
    // Reset matrix
    const newMatrix = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
    setMatrix(newMatrix);
    setOpenModal(false);
  }

  useEffect(() => {
    handleGameUpdate();
    handleGameStart();
    handleGameWin();
  }, []);

  return (
    <GameContainer>
      { openModal && (<ResultModal text={textModal} closeModal={() => setOpenModal(false)} playAgain={playAgain} />) }
      {!isGameStarted && (<WaitingPlayer />)}
      {(!isGameStarted || !isPlayerTurn) && <PlayStopper />}
      { isGameStarted && (
        <div>
          { isPlayerTurn ? <h2 style={{textAlign: 'center', marginBottom: '50px'}}>C'est à votre tour</h2> : <h2 style={{textAlign: 'center', marginBottom: '50px'}}>C'est au tour de {playerNameOpponent}</h2> }
          { matrix.map((row, rowIdx) => {
            return (
              <RowContainer>
                {row.map((column, columnIdx) => (
                  <Cell
                    borderRight={columnIdx < 2}
                    borderLeft={columnIdx > 0}
                    borderBottom={rowIdx < 2}
                    borderTop={rowIdx > 0}
                    onClick={() =>
                      updateGameMatrix(columnIdx, rowIdx, playerSymbol)
                    }
                  >
                    {column && column !== "null" ? (
                      column === "x" ? (
                        <X />
                      ) : (
                        <O />
                      )
                    ) : null}
                  </Cell>
                ))}
              </RowContainer>
            );
          })}
        </div>
      )}
    </GameContainer>
  );
}
