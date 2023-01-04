import { Command } from "@colyseus/command";
import { MainSpaceRoom } from "../rooms/MainSpaceRoom";
import { CameraState } from "../schema/CameraState";
import { PlayerState } from "../schema/PlayerState";
import { PositionState } from "../schema/PositionState";
import { ChatState } from "../schema/ChatState";
import { ArraySchema } from "@colyseus/schema";
import { ServerError } from "colyseus";

export class OnKeyInputCommand extends Command<MainSpaceRoom, {
  sessionId: string,
  data: {
    w: boolean,
    a: boolean,
    s: boolean,
    d: boolean,
  }
}> {
  execute({ sessionId, data } = this.payload) {
    const { keyInput } = this.state.players.get(sessionId);
    keyInput.w = data.w;
    keyInput.s = data.s;
    keyInput.a = data.a;
    keyInput.d = data.d;
  }
}

export class OnPositionCommand extends Command<MainSpaceRoom, {
  sessionId: string,
  data: {
    _x: number,
    _y: number,
    _z: number,
  }
}> {
  execute({ sessionId, data } = this.payload) {
    const { position, callablePeers } = this.state.players.get(sessionId);
    position.x = data._x;
    position.y = data._y;
    position.z = data._z;

    this.state.players.forEach((otherPlayer: PlayerState, id: string) => {
      if (sessionId === id) return;

      let isCaller: boolean;
      // two players should not call each other, only one player should
      for (let i = 0; i < sessionId.length; i++) {
        if (sessionId.charCodeAt(i) > id.charCodeAt(i)) {
          isCaller = false;
          break;
        }
        if (sessionId.charCodeAt(i) < id.charCodeAt(i)) {
          isCaller = true;
          break;
        }
      }

      const trigger = 30;
      const deltaX = Math.abs(position.x - otherPlayer.position.x);
      const deltaZ = Math.abs(position.z - otherPlayer.position.z);

      const peers = isCaller ? callablePeers : otherPlayer.callablePeers;
      const seshId = isCaller ? id : sessionId;

      if (
        deltaX + deltaZ <= trigger &&
        peers.indexOf(seshId) < 0
      ) {
        peers.push(seshId);
      } else if (
        deltaX + deltaZ > trigger &&
        peers.indexOf(seshId) >= 0
      ) {
        peers.deleteAt(peers.indexOf(seshId));
      }
    });
  }
}

export class OnRotationCommand extends Command<MainSpaceRoom, {
  sessionId: string,
  data: number
}> {
  execute({ sessionId, data } = this.payload) {
    const player = this.state.players.get(sessionId);
    player.rotation += data;
  }
}

export class OnSendMsgCommand extends Command<MainSpaceRoom, {
  sessionId: string,
  message: string,
  timestamp: number
}> {
  execute({ sessionId, message, timestamp } = this.payload) {
    const chat = new ChatState(sessionId, message, timestamp);
    this.state.chats.push(chat);
  }
}

export class OnJoinCommand extends Command<MainSpaceRoom, {
  sessionId: string,
}> {
  execute({ sessionId } = this.payload) {
    const { A, B, C } = this.state.labels;
    let label: string;
    let position: PositionState;
    let rotation: number;
    let alpha: number;

    // assigns the first empty position
    switch ("") {
      case A:
        this.state.labels.A = sessionId;
        label = "A";
        position = new PositionState(0, -5, 10);
        rotation = 0;
        alpha = Math.PI / 2;
        break;
      case B:
        this.state.labels.B = sessionId;
        label = "B";
        position = new PositionState(10, -5, 0);
        rotation = 90;
        alpha = Math.PI * 2;
        break;
      case C:
        this.state.labels.C = sessionId;
        label = "C";
        position = new PositionState(-10, -5, 0);
        rotation = -90;
        alpha = Math.PI;
        break;
    }

    const callablePeers = new ArraySchema<string>();

    this.state.players.forEach((otherPlayer: PlayerState, id: string) => {
      if (sessionId === id) return;

      let isCaller: boolean;
      // two players should not call each other, only one player should
      for (let i = 0; i < sessionId.length; i++) {
        if (sessionId.charCodeAt(i) > id.charCodeAt(i)) {
          isCaller = false;
          break;
        }
        if (sessionId.charCodeAt(i) < id.charCodeAt(i)) {
          isCaller = true;
          break;
        }
      }

      const trigger = 30;
      const deltaX = Math.abs(position.x - otherPlayer.position.x);
      const deltaZ = Math.abs(position.z - otherPlayer.position.z);

      const peers = isCaller ? callablePeers : otherPlayer.callablePeers;
      const seshId = isCaller ? id : sessionId;

      if (deltaX + deltaZ <= trigger) {
        console.log('isCaller:', isCaller);
        peers.push(seshId);
      }
    });

    this.state.players.set(sessionId, new PlayerState(label, position, rotation, callablePeers));
    this.state.cameras.set(sessionId, new CameraState(alpha, position));
  }
}

export class OnLeaveCommand extends Command<MainSpaceRoom, {
  sessionId: string,
}> {
  execute({ sessionId } = this.payload) {
    const { A, B, C } = this.state.labels;

    switch (sessionId) {
      case A:
        this.state.labels.A = "";
        break;
      case B:
        this.state.labels.B = "";
        break;
      case C:
        this.state.labels.C = "";
        break;
    }
    this.state.players.delete(sessionId);
    this.state.cameras.delete(sessionId);
    if (!this.state.players.size) this.state.chats.clear();

    this.state.players.forEach((player: PlayerState, id: string) => {
      if (sessionId === id) return;

      const peerIndex = player.callablePeers.indexOf(sessionId);
      if (peerIndex >= 0) {
        player.callablePeers.deleteAt(peerIndex);
      }
    });
  }
}

export class CheckPlayerCountCommand extends Command<MainSpaceRoom> {
  validate(): boolean {
    const playerCount = this.state.players.size;
    return playerCount === 3;
  }

  execute() {
    throw new ServerError(403, "Game room is full!");
  }
}
