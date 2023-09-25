import type * as Party from "partykit/server";

export default class User implements Party.Server {
  constructor(readonly party: Party.Party) {}

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    conn.send("User connected to party " + this.party.id);
  }

  onMessage(message: string) {
    if (message === "ping") {
      this.party.broadcast(`User room ${this.party.id} says pong`);
    }
  }

  onRequest(request: Party.Request) {
    return new Response("User made a request to party " + this.party.id);
  }
}
