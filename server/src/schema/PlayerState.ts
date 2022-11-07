import { Schema, type } from "@colyseus/schema";
import { KeyInputState } from "./KeyInputState";
import { PositionState } from "./PositionState";

export class PlayerState extends Schema {

  @type("string") label: string;

  @type(PositionState) position: PositionState;

  @type("number") rotation: number;

  @type(KeyInputState) keyInput: KeyInputState;

  constructor(
    _label: string,
    _position: PositionState,
    _rotation: number
  ) {
    super();
    this.label = _label;
    this.position = _position;
    this.rotation = _rotation;
    this.keyInput = new KeyInputState();
  }

}
