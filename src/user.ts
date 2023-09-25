import type * as Party from "partykit/server";

export default class User implements Party.Server {
  constructor(readonly party: Party.Party) {}

  // Prevent public access to party
  // (only internal .fetch calls from main party are allowed)
  static onBeforeRequest() {
    return new Response("Unauthorized", { status: 401 });
  }
  static onBeforeConnect() {
    return new Response("Unauthorized", { status: 401 });
  }

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
