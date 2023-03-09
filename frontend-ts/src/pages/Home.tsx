import { useState } from "react";

interface Props {
  joinGame: (id: string) => Promise<void>;
  newGame: () => Promise<void>;
}

export default function Home({ joinGame, newGame }: Props) {
  const [id, setId] = useState("");

  return (
    <div>
      <h1>Connect Four</h1>

      <button onClick={newGame}>Start a new game</button>

      <h4>---Or---</h4>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          joinGame(id);
        }}
      >
        <h2>Join a game</h2>
        <label>
          Game Id:
          <input type="text" onChange={(e) => setId(e.target.value)} />
        </label>
        <input disabled={!id.trim()} type="submit" value="Submit" />
      </form>
    </div>
  );
}
