import { Schema, type } from "@colyseus/schema";

export class ChatState extends Schema {

  @type("string") id: string;

  @type("string") message: string;

  @type("number") timestamp: number;

  constructor(_id: string, _message: string, _timestamp: number) {
    super();
    this.id = _id;
    this.message = _message;
    this.timestamp = _timestamp;
  }

}
