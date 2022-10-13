import { Schema, type, MapSchema } from "@colyseus/schema";
import { LabelState } from "./LabelState";
import { PlayerState } from "./PlayerState";
import { CameraState } from "./CameraState";

export class MainSpaceState extends Schema {

  @type(LabelState) labels = new LabelState();

  @type({ map: PlayerState }) players = new MapSchema<PlayerState>();

  @type({ map: CameraState }) cameras = new MapSchema<CameraState>;

}
