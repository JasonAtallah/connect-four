import { useApi } from "./api";
import Game from "./Game";
import Home from "./Home";

export default function App() {
  const { curGame, joinGame, newGame } = useApi();

  return (
    <div className="container">
      {curGame ? <Game /> : <Home joinGame={joinGame} newGame={newGame} />}
    </div>
  );
}
