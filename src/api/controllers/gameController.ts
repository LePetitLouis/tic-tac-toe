import {
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Server, Socket } from "socket.io";

@SocketController()
export class GameController {
  private getSocketGameRoom(socket: Socket): string {
    const socketRooms = Array.from(socket.rooms.values()).filter(
      (r) => r !== socket.id
    );
    const gameRoom = socketRooms && socketRooms[0];

    return gameRoom;
  }

  @OnMessage("update_game")
  public async updateGame(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: string
  ) {
    const gameRoom = this.getSocketGameRoom(socket);
    socket.to(gameRoom).emit("on_game_update", message);
  }

  @OnMessage("game_win")
  public async gameWin(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: string
  ) {
    const gameRoom = this.getSocketGameRoom(socket);
    socket.to(gameRoom).emit("on_game_win", message);
  }

  @OnMessage("play_again")
  public async playAgain(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: string[]
  ) {
    const gameRoom = this.getSocketGameRoom(socket);
    if (message.length === 2) {
      io.to(gameRoom).emit("on_play_again", { again: true, players: message });
      socket.emit("start_game", { start: true, symbol: "x" });
      socket.to(gameRoom).emit('start_game', { start: false, symbol: "o" });
    } else {
      io.to(gameRoom).emit("on_play_again", { again: false, players: message });
    }
  }
}
