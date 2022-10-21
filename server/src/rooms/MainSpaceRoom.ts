import { Room, Client } from "colyseus";
import { Dispatcher } from "@colyseus/command";
import { MainSpaceState } from "../schema/MainSpaceState";
import { 
  CheckPlayerCountCommand, 
  OnJoinCommand, 
  OnKeyInputCommand, 
  OnLeaveCommand 
} from "../commands/MainSpaceCommand";

export class MainSpaceRoom extends Room<MainSpaceState> {

  dispatcher = new Dispatcher(this);

  onCreate (options: any) {
    this.setState(new MainSpaceState());

    this.onMessage("key_input", (client, msg) => {
      this.dispatcher.dispatch(new OnKeyInputCommand(), {
        sessionId: client.sessionId,
        data: msg
      })
    });
  }

  onJoin (client: Client, options: any) {
    this.dispatcher.dispatch(new CheckPlayerCountCommand());
    
    this.dispatcher.dispatch(new OnJoinCommand(), {
      sessionId: client.sessionId,
    });
    console.log(client.sessionId, "joined!");
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");

    this.dispatcher.dispatch(new OnLeaveCommand(), {
      sessionId: client.sessionId
    });
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
