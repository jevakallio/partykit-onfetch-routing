import "./styles.css";

import { WebSocket } from "partysocket";

declare const PARTYKIT_HOST: string;

let pingInterval: ReturnType<typeof setInterval>;

// Let's append all the messages we get into this DOM element
const output = document.getElementById("app") as HTMLDivElement;

// Helper function to add a new line to the DOM
function add(text: string) {
  output.appendChild(document.createTextNode(text));
  output.appendChild(document.createElement("br"));
}

const host = document.location.host;
const protocol =
  host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "ws" : "wss";

// Use the raw websocket connectior
const conn = new WebSocket(`${protocol}://${host}/user`, undefined, {
  startClosed: true,
});

document.getElementById("login")?.addEventListener("click", (e) => {
  e.preventDefault();
  const userId = (document.getElementById("username") as HTMLInputElement)
    ?.value;
  if (!userId) {
    return add("Please set a username first");
  }

  add(`Setting a cookie by calling /login/${userId}`);
  fetch(`/login/${userId}`, { credentials: "include" })
    .then((res) => res.text())
    .then((text) => {
      add(`Cookie should now be set, server responded with ${text}}`);

      add("Opening a WebSocket connection to /user");
      conn.reconnect();

      add("Making a HTTP request to /user");
      fetch("/user", { method: "POST", credentials: "include" })
        .then((res) => res.text())
        .then((text) => {
          add("Received HTTP response: " + text);
        });
    });
});

// You can even start sending messages before the connection is open!
conn.addEventListener("message", (event) => {
  add(`Received WebSocket Message: ${event.data}`);
});

// Let's listen for when the connection opens
// And send a ping every 2 seconds right after
conn.addEventListener("open", () => {
  add("Connected!");
  add("Sending a ping every 2 seconds...");
  // TODO: make this more interesting / nice
  clearInterval(pingInterval);
  pingInterval = setInterval(() => {
    conn.send("ping");
  }, 1000);
});
