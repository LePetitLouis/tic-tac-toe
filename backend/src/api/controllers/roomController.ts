import {
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Server, Socket } from "socket.io";

interface joinGameBody {
  roomId?: string,
  playerName: string
}

interface Room {
  id: string;
  playerName: string,
  playerNameOpponent?: string
}

let rooms: Room[] = []

@SocketController()
export class RoomController {
  @OnMessage("join_game")
  public async joinGame(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: joinGameBody
  ) {

    let room: Room = null;

    console.log(message)

    if (!message.roomId) {
      room = createRoom(message);
      console.log(`[create room ] - ${room.id} - ${message.playerName}`);
    } else {
      room = rooms.find(r => r.id === message.roomId);

      if (room === undefined) {
        socket.emit("room_join_error", {
          error: "Room is full please choose another room to play!",
        });
      }

      message.roomId = room.id;
      room.playerNameOpponent = message.playerName;
    }

    await socket.join(room.id);
    socket.emit("room_joined", { roomId: room.id });

    if (room.playerName && room.playerNameOpponent) {
      socket.emit("start_game", { start: true, symbol: "x", playerNameOpponent: room.playerName });
      socket.to(room.id).emit('start_game', { start: false, symbol: "o", playerNameOpponent: room.playerNameOpponent });
    }
  }
}

const createRoom = (player: joinGameBody) => {
  const room = { id: roomId(), playerName: player.playerName };
  rooms.push(room);

  return room;
}

const roomId = () => {
  return Math.random().toString(16).slice(2);
}
