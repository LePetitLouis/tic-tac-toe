import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import gameContext from "../../gameContext";
import gameService from "../../services/gameService";
import socketService from "../../services/socketService";


const ModalContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
`;

const ModalMask = styled.div`
  width: 100%;
  height: 100%;
  background-color: #131616;
  opacity: 40%;
  position: absolute;
  top: 0;
  right: 0;
  transition: opacity 0.3s ease;
`;

const ModalWrapper = styled.div`
  background-color: white;
  width: 40%;
  border-radius: 12px;
  padding: 28px 32px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  margin: auto;
  z-index: 999;
  text-align: center;
`;

const ButtonReplay = styled.button`
  outline: none;
  background-color: #8dc3f2;
  color: #fff;
  font-size: 17px;
  border: 2px solid transparent;
  border-radius: 5px;
  padding: 8px 18px;
  margin-top: 1em;
  cursor: pointer;

  :disabled {
    background-color: #D9D9D9;
  }
`;

export interface propsModal {
  text: String,
  playAgain: () => void,
  closeModal: () => void
}

export function ResultModal(props: propsModal) {
  const [opponentWantPlayAgain, setOpponentWantPlayAgain] = useState<boolean>(false);
  const [isPlayAgain, setIsPlayAgain] = useState<boolean>(false);
  const { playerName, playerNameOpponent } = useContext(gameContext);

  const replay = () => {
    const players = opponentWantPlayAgain ? [playerName, playerNameOpponent] : [playerName];
    if (socketService.socket) gameService.playAgain(socketService.socket, players);
  }

  const handlePlayAgain = () => {
    if (socketService.socket) gameService.onPlayAgain(socketService.socket, (options) => {
      if (options.players[0] === playerName) setIsPlayAgain(true);
      else setOpponentWantPlayAgain(true);
      if (options.again) {
        props.playAgain();
        props.closeModal();
      }
    })
  }

  useEffect(() => {
    handlePlayAgain()
  }, [])

  return (
    <ModalContainer>
      <ModalMask onClick={props.closeModal} />
      <ModalWrapper>
        <h1>{ props.text }</h1>
        { opponentWantPlayAgain && (<p>{playerNameOpponent} veut rejouer avec vous</p>) }
        <ButtonReplay onClick={replay} disabled={isPlayAgain}>{ isPlayAgain ? 'En attente de votre adversaire...' : 'Rejouer' }</ButtonReplay>
      </ModalWrapper>
    </ModalContainer>

  )
}