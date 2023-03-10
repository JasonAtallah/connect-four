import { Player, useApi } from "./hooks/api";
import type { Game, Move } from "./hooks/api";
import GameComponent from "./pages/Game";
import Home from "./pages/Home";
import { useState } from "react";
import { useInterval } from "./hooks/interval";

export default function App() {
  // In a larger application I would use a more robust state mgmt tool instead of managing state at the root
  const [curGame, setCurGame] = useState<Game | undefined>();
  const [player, setPlayer] = useState<Player | undefined>();
  const { getGame, createGame, createMove, resetGame } = useApi();

  // A websocket or GQL subscription would handle this much better
  useInterval(async () => {
    if (curGame) {
      const game = await getGame(curGame.id);
      setCurGame(game);
    }
  }, 500);

  const clear = () => {
    setCurGame(undefined);
    setPlayer(undefined);
  };

  const joinGame = async (id: string) => {
    clear();
    const game = await getGame(id);
    setPlayer("blue");
    setCurGame(game);
  };

  const newGame = async () => {
    clear();
    const game = await createGame();
    setPlayer("red");
    setCurGame(game);
  };

  const newMove = async (move: Move) => {
    if (!curGame) return;
    await createMove(curGame.id, move);
  };

  const reset = async () => {
    clear();
    if (!curGame) return;
    const game = await resetGame(curGame.id);
    setPlayer("red");
    setCurGame(game);
  };

  return (
    <div className="container">
      {/* Should use a router and that way the game can be set thru the url and a link could be shared */}
      {curGame && player ? (
        <GameComponent
          curGame={curGame}
          player={player}
          newMove={newMove}
          reset={reset}
        />
      ) : (
        <Home joinGame={joinGame} newGame={newGame} />
      )}
    </div>
  );
}
