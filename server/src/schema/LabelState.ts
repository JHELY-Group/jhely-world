import { Schema, type } from "@colyseus/schema";

export class LabelState extends Schema {

  @type("string") A: string;

  @type("string") B: string;

  @type("string") C: string;

  constructor() {
    super();
    this.A = "";
    this.B = "";
    this.C = "";
  }

}
