import { Schema, type } from "@colyseus/schema";
import { PositionState } from "./PositionState";

export class CameraState extends Schema {

  @type("number") alpha: number;

  @type("number") beta: number;

  @type("number") radius: number;

  @type(PositionState) position: PositionState;

  constructor(_alpha: number, _position: PositionState) {
    super();
    this.alpha = _alpha;
    this.beta = Math.PI * 0.4;
    this.radius = 20;
    this.position = _position;
  }

}
