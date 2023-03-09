// This should be in an environment variable that is injected at buildtime
// but since this only needs to run locally I'm going to just put it here.
const BASE_URL = "http://localhost:3001";

export type Player = "red" | "blue";

export interface Move {
  player: Player;
  cell: string;
}

type Moves = Move[];

export interface Game {
  id: string;
  board: Moves;
  playersTurn: Player;
}

// Normally would create a session with whatever http client I'm using to set a base url
const url = (path: string) => `${BASE_URL}/${path}`;
const GET = async (path: string) => await fetch(url(path));
const POST = async (path: string, options: RequestInit = {}) =>
  await fetch(url(path), { ...options, method: "POST" });
const PUT = async (path: string) => await fetch(url(path), { method: "PUT" });

// On larger project I would prefer some sort of end to end typesafety
// Whether it is with GraphQL or TRPC
export const useApi = () => {
  const getGame = async (id: string) => {
    const res = await GET(`game/${id}`);
    const game = await res.json();
    // The debate between defining return types and casting your returns
    // and letting TS infer return types is not one I want to get in to right now
    return game as Game;
  };

  const createGame = async () => {
    const res = await POST("new-game");
    const game = await res.json();
    return game as Game;
  };

  const createMove = async (id: string, move: Move) => {
    const res = await POST(`game/${id}/move`, {
      body: JSON.stringify(move),
      headers: { "content-type": "application/json" },
    });

    const game = await res.json();
    return game as Game;
  };

  const resetGame = async (id: string) => {
    const res = await PUT(`game/${id}/reset`);
    const game = await res.json();
    return game as Game;
  };

  return {
    getGame,
    createGame,
    createMove,
    resetGame,
  };
};
