import type * as Party from "partykit/server";

export default class Server {
  constructor(readonly party: Party.Party) {}

  static onFetch(req: Party.Request, lobby: Party.FetchLobby) {
    // demo: call /login/:userId to set a cookie
    if (req.url.includes("/login/")) {
      const userId = req.url.split("/login/")[1];
      return setUserCookie(userId);
    }

    if (req.url.includes("/user")) {
      // otherwise, we route any request to /user to the "user" party,
      // and get room id from "user" cookie
      const userId = getCookie(req.headers.get("Cookie"), "user");
      console.log(req.url, req.headers.get("Cookie"));
      if (userId) {
        return lobby.parties.user
          .get(userId)
          .fetch(req as unknown as RequestInit);
      }

      return new Response("Unauthorized", { status: 401 });
    }

    return new Response("Not Found", { status: 404 });
  }
}

function setUserCookie(userId: string) {
  // set "user" cookie for all requests to /user
  // todo: subdomain for non-localhost requests
  const newCookie = `user=${userId}; Path=/user; Secure; HttpOnly; SameSite=Strict`;
  return new Response(JSON.stringify({ userId }), {
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": newCookie,
    },
  });
}

function getCookie(cookieString: string | null, key: string) {
  if (cookieString) {
    const allCookies = cookieString.split("; ");
    const targetCookie = allCookies.find((cookie) => cookie.includes(key));
    if (targetCookie) {
      const [_, value] = targetCookie.split("=");
      return value;
    }
  }

  return null;
}

Server satisfies Party.Worker;
