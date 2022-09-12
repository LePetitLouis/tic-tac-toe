import { useContext } from "react";
import styled from "styled-components";
import gameContext from "../../gameContext";

const WaitingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const Loader = styled.div`
  border: 8px solid #f3f3f3;
  border-radius: 50%;
  border-top: 8px solid #3498db;
  width: 60px;
  height: 60px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;

  @-webkit-keyframes spin {
    0% { -webkit-transform: rotate(0deg); }
    100% { -webkit-transform: rotate(360deg); }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Link = styled.button`
  border: none;
  background: #fff;
  cursor: pointer;
`;

export function WaitingPlayer() {
  const { roomId } = useContext(gameContext);

  const clipboard = () => {
    const link = `https://projet-tic-tac-toe.herokuapp.com/${roomId}`;
    navigator.clipboard.writeText(link).then(() => {
      console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
      console.error('Async: Could not copy text: ', err);
    });
  }

  return (
    <WaitingContainer>
      <Loader />
      <h2>En attente d'un autre joueur</h2>
      <Link onClick={clipboard}>Copier le lien</Link>
    </WaitingContainer>
  )
}