import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import gameContext from "../../gameContext";
import gameService from "../../services/gameService";
import socketService from "../../services/socketService";

interface IJoinRoomProps {}

const JoinRoomContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 2em;
`;

const RoomIdInput = styled.input`
  height: 30px;
  width: 20em;
  font-size: 17px;
  outline: none;
  border: 1px solid #26150f;
  border-radius: 10px;
  padding: 18px 10px;
`;

const JoinButton = styled.button`
  outline: none;
  background-color: #8dc3f2;
  color: #fff;
  font-size: 17px;
  border: 2px solid transparent;
  border-radius: 5px;
  padding: 8px 18px;
  transition: all 230ms ease-in-out;
  margin-top: 1em;
  cursor: pointer;

  &:hover {
    background-color: transparent;
    border: 2px solid #8dc3f2;
    color: #8dc3f2;
  }
`;

export function JoinRoom(props: IJoinRoomProps) {
  const [playerName, setPlayerName] = useState<string>("");
  const [isJoining, setJoining] = useState<boolean>(false);

  const { id } = useParams();
  const { setInRoom, setRoomId } = useContext(gameContext);

  const connectSocket = async () => {
    await socketService.connect("http://localhost:9000").catch((err) => {
      console.log("Error: ", err);
    });
  };

  const handlePlayerNameChange = (e: React.ChangeEvent<any>) => {
    const value = e.target.value;
    setPlayerName(value);
  };

  const joinRoom = async (e: React.FormEvent) => {
    e.preventDefault();

    // connect to socket
    connectSocket();

    setPlayerName(playerName);

    const socket = socketService.socket;
    if (!playerName || playerName.trim() === "" || !socket) return;

    setJoining(true);

    if (id) {
      // join room already created
      const joined = await gameService
        .joinGameRoom(socket, playerName, id)
        .catch((err) => {
          alert(err);
        });

      if (joined) setInRoom(true);
    } else {
      // create room
      const joined = await gameService
        .joinGameRoom(socket, playerName)
        .catch((err) => {
          alert(err);
        });

      // set roomId
      await gameService.roomJoined(socket, (options) => {
        setRoomId(options)
      })

      if (joined) setInRoom(true);
    }

    setJoining(false);
  };

  return (
    <form onSubmit={joinRoom}>
      <JoinRoomContainer>
        <h4>Entrez votre pseudo</h4>
        <RoomIdInput
          placeholder="Pseudo"
          value={playerName}
          onChange={handlePlayerNameChange}
        />
        <JoinButton type="submit" disabled={isJoining}>
          {isJoining ? "Chargement..." : "C'est parti !"}
        </JoinButton>
      </JoinRoomContainer>
    </form>
  );
}
