import { Schema, type } from "@colyseus/schema";

export class KeyInputState extends Schema {

  @type("boolean") w: boolean;

  @type("boolean") s: boolean;

  @type("boolean") a: boolean;

  @type("boolean") d: boolean;

  constructor() {
    super();
    this.w = false;
    this.s = false;
    this.a = false;
    this.d = false;
  }

}
