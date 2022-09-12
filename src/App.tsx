import React, { useState } from "react";
import styled from "styled-components";
import "./App.css";
import { JoinRoom } from "./components/joinRoom";
import GameContext, { IGameContextProps } from "./gameContext";
import { Game } from "./components/game";

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em;
`;

const WelcomeText = styled.h1`
  margin: 0;
  color: #26150F;
`;

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function App() {
  const [isInRoom, setInRoom] = useState<boolean>(false);
  const [roomId, setRoomId] = useState<string>("");
  const [playerSymbol, setPlayerSymbol] = useState<"x" | "o">("x");
  const [playerName, setPlayerName] = useState<string>("")
  const [playerNameOpponent, setPlayerNameOpponent] = useState<string>("")
  const [isPlayerTurn, setPlayerTurn] = useState<boolean>(false);
  const [isGameStarted, setGameStarted] = useState<boolean>(false);

  const gameContextValue: IGameContextProps = {
    isInRoom,
    setInRoom,
    roomId,
    setRoomId,
    playerSymbol,
    setPlayerSymbol,
    playerName,
    setPlayerName,
    playerNameOpponent,
    setPlayerNameOpponent,
    isPlayerTurn,
    setPlayerTurn,
    isGameStarted,
    setGameStarted,
  };

  return (
    <GameContext.Provider value={gameContextValue}>
      <AppContainer>
        <WelcomeText>Bienvenue sur Tic-Tac-Toe</WelcomeText>
        <MainContainer>
          {!isInRoom && <JoinRoom />}
          {isInRoom && <Game />}
        </MainContainer>
      </AppContainer>
    </GameContext.Provider>
  );
}

export default App;
