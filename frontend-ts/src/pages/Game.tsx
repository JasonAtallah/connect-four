import { Game, Move, Player } from "../hooks/api";

interface Props {
  curGame: Game;
  player: Player;
  newMove: (move: Move) => Promise<void>;
  reset: () => Promise<void>;
}

const BOARD_CONFIG = {
  x: ["A", "B", "C", "D", "E", "F", "G"],
  y: [1, 2, 3, 4, 5, 6],
};

export default function GameComponent({
  newMove,
  curGame: { playersTurn, id, board },
  player,
  reset,
}: Props) {
  return (
    <div>
      <div style={{ margin: "1rem 0" }}>
        <h1 id="message">It is currently {playersTurn}'s turn.</h1>
        <div>
          <span>
            <b>Game ID: </b>
            {id}
          </span>
        </div>
        <div>
          <span>You are the {player} player</span>
        </div>
      </div>

      <main>
        <div id="style1">
          {BOARD_CONFIG.x.map((xKey) => {
            return (
              <div key={xKey} className="style2">
                {BOARD_CONFIG.y.map((yKey) => {
                  const key = `${xKey}${yKey}`;
                  const boardObj = board.reduce((acc, move) => {
                    acc[move.cell] = move.player;
                    return acc;
                  }, {} as { [key: string]: "red" | "blue" });
                  return (
                    <div
                      key={key}
                      onClick={() => newMove({ player, cell: key })}
                      className={`style3 ${
                        playersTurn !== player
                          ? "disabled-cursor"
                          : "pointer-cursor"
                      }`}
                    >
                      {boardObj[key] && (
                        <div className={`style4 ${boardObj[key]}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div id="buttonContainer">
          <button
            onClick={(e) => {
              e.preventDefault();
              reset();
            }}
          >
            Reset Game
          </button>
        </div>
      </main>
    </div>
  );
}
