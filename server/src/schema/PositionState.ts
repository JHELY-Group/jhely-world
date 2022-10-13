import { Schema, type } from "@colyseus/schema";

export class PositionState extends Schema {

  @type("number") x: number;

  @type("number") y: number;

  @type("number") z: number;

  constructor(_x: number, _y: number, _z: number) {
    super();
    this.x = _x;
    this.y = _y;
    this.z = _z;
  }

}
