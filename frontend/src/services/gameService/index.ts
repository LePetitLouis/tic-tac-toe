import { Socket } from "socket.io-client";
import { IPlayMatrix, IStartGame } from "../../components/game";

class GameService {
  public async joinGameRoom(socket: Socket, playerName: string, roomId?: string): Promise<boolean> {
    return new Promise((rs, rj) => {
      socket.emit("join_game", { playerName, roomId });
      socket.on("room_join_error", ({ error }) => rj(error));
      rs(true);
    });
  }

  public async roomJoined(socket: Socket, listiner: (roomId: string) => void) {
    socket.on("room_joined", ({ roomId }) => listiner(roomId));
  }

  public async updateGame(socket: Socket, gameMatrix: IPlayMatrix) {
    socket.emit("update_game", { matrix: gameMatrix });
  }

  public async onGameUpdate(
    socket: Socket,
    listiner: (matrix: IPlayMatrix) => void
  ) {
    socket.on("on_game_update", ({ matrix }) => listiner(matrix));
  }

  public async onStartGame(
    socket: Socket,
    listiner: (options: IStartGame) => void
  ) {
    socket.on("start_game", listiner);
  }

  public async gameWin(socket: Socket, message: string) {
    socket.emit("game_win", { message });
  }

  public async onGameWin(socket: Socket, listiner: (message: string) => void) {
    socket.on("on_game_win", ({ message }) => listiner(message));
  }

  public async playAgain(socket: Socket, players: string[]) {
    socket.emit("play_again", players);
  }

  public async onPlayAgain(socket: Socket, listiner: (options: { again: boolean, players: string[] }) => void) {
    socket.on("on_play_again", listiner);
  }
}

export default new GameService();
