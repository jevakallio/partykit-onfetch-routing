## 🎈 party-onfetch-example

Welcome to the party, pal!

This is a [Partykit](https://partykit.io) demo, showing how to:
- Reroute requests/connections to a different party by using an `onFetch` handler
- Create secure per-user stores by implementing cookie/session authentication

## Live site

https://onfetch.jevakallio.partykit.dev

## Server implementation

This project contains two parties:

### `main.ts`

Exposes two API endpoints:
- `/login/:userId` — a fake login endpoint to set a cookie for given userId
- `/user/*` — a router that forwards all requests to the `user.ts` party, using the `user` cookie value as the room id, i.e. every user will be routed to their separate room.

### `user.ts`

Simple PartyKit room that responds to HTTP request and WebSocket ping messages to demonstrate routing.

This room prevents direct access to the party's public URL, so the only access is via the `onFetch` router via the main party.

### How it works

The simplified version of the implementation is:
```ts
const userId = getCookie(req.headers.get("Cookie"), "user");
if (userId) {
  return lobby.parties.user
    .get(userId)
    .fetch(req as unknown as RequestInit);
}
```

This gets the user cookie value, and then makes a fetch request to the user party with that akey as the id.

## Client implementation

The client in `client.ts` does the following:
1. Calls the `/login/userId` endpoint to set the "user" cookie
2. Makes a HTTP POST request to `/user` with the cookie to demonstrate that request is routed to the user room (equivalent to `/parties/user/:userId`).
3. Opens a WebSocket connection to `/user` with cookie to demonstrate that the websocket is routed to the user room (equivalent to `/parties/user/:userId`).

### How it works

Instead of the usual `import PartySocket from "partysocket"` constructor, we use the raw reconnecting `WebSocket` constructor, which takes a URL string as a parameter.

Note that for the cookie to be passed to the WebSocket, the WebSocket origin needs to be the same as the website host.  

At the moment, until PartyKit gets custom domain support, this approach won't work for cross-origin requests unless you proxy the request via your own domain.

```ts
import { WebSocket } from "partysocket";
const host = document.location.host;
const protocol =
  host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "ws" : "wss";
const conn = new WebSocket(`${protocol}://${host}/user`, undefined, {
  startClosed: true,
});
```







