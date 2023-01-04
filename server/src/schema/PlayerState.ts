import { Schema, type, ArraySchema } from "@colyseus/schema";
import { KeyInputState } from "./KeyInputState";
import { PositionState } from "./PositionState";

export class PlayerState extends Schema {

  @type("string") label: string;

  @type(PositionState) position: PositionState;

  @type("number") rotation: number;

  @type(KeyInputState) keyInput: KeyInputState;

  @type(["string"]) callablePeers: ArraySchema<string>;

  constructor(
    _label: string,
    _position: PositionState,
    _rotation: number,
    _callablePeers: ArraySchema<string>
  ) {
    super();
    this.label = _label;
    this.position = _position;
    this.rotation = _rotation;
    this.keyInput = new KeyInputState();
    this.callablePeers = _callablePeers;
  }

}
