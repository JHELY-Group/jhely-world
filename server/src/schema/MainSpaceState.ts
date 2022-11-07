import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";
import { LabelState } from "./LabelState";
import { PlayerState } from "./PlayerState";
import { CameraState } from "./CameraState";
import { ChatState } from "./ChatState";

export class MainSpaceState extends Schema {

  @type(LabelState) labels = new LabelState();

  @type({ array: ChatState }) chats = new ArraySchema<ChatState>();

  @type({ map: PlayerState }) players = new MapSchema<PlayerState>();

  @type({ map: CameraState }) cameras = new MapSchema<CameraState>;

}
