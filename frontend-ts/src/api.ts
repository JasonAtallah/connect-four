import { useState } from "react";

// This should be in an environment variable that is injected at buildtime
// but since this only needs to run locally I'm going to just put it here.
const BASE_URL = "http://localhost:3001";
// Normally would create a session with whatever http client I'm using to set a base url
const url = (path: string) => `${BASE_URL}/${path}`;

interface Game {
  id: string;
  board: {
    player: "red" | "blue";
    cell: string;
  }[];
}

// In a larger application I would prefer to use a more robust state mgmt tool like Zustand
// And adding end to end typesafety GraphQL or TRPC
export const useApi = () => {
  const [curGame, setCurGame] = useState<Game | undefined>();
  const [playerColor, setPlayerColor] = useState<"red" | "blue" | undefined>();

  const clear = () => {
    setCurGame(undefined);
    setPlayerColor(undefined);
  };

  const joinGame = async (id: string) => {
    clear();
    const res = await fetch(url(`game/${id}`));
    const game = await res.json();
    setPlayerColor("blue");
    setCurGame(game);
  };

  const newGame = async () => {
    clear();
    const res = await fetch(url("new-game"), { method: "POST" });
    const game = await res.json();
    console.log("game", game);
    setPlayerColor("red");
    setCurGame(game);
  };

  return {
    curGame,
    playerColor,
    joinGame,
    newGame,
  };
};
