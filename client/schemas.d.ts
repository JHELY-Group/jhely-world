import { Schema, type, MapSchema } from '@colyseus/schema';

export class MainSpaceState extends Schema {

  @type(LabelState) labels = new LabelState();

  @type({ map: PlayerState }) players: MapSchema<PlayerState>;

  @type({ map: CameraState }) cameras: MapSchema<CameraState>;

}

export class LabelState extends Schema {

  @type("string") A: string;

  @type("string") B: string;

  @type("string") C: string;

}

export class ChatState extends Schema {

  @type("string") id: string;

  @type("string") message: string;

  @type("number") timestamp: number;

  constructor(_id: string, _message: string, _timestamp: number);

}

export class PlayerState extends Schema {

  @type("string") label: string;

  @type(PositionState) position: PositionState;

  @type("number") rotation: number;

  @type(KeyInputState) keyInput: KeyInputState;

  constructor(
    _label: string,
    _position: PositionState,
    _rotation: number
  );

}

export class PositionState extends Schema {

  @type("number") x: number;

  @type("number") y: number;

  @type("number") z: number;

  constructor(_x: number, _y: number, _z: number);

}

export class KeyInputState extends Schema {

  @type("boolean") w: boolean;

  @type("boolean") s: boolean;

  @type("boolean") a: boolean;

  @type("boolean") d: boolean;

}

export class CameraState extends Schema {

  @type("number") alpha: number;

  @type("number") beta: number;

  @type("number") radius: number;

  @type(PositionState) position: PositionState;

  constructor(_alpha: number, _position: PositionState);

}

