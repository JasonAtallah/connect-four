// As files grow I'd typically split things out into various files such as utils, types, etc.
import { z } from "zod";

// Zod schemas
const playerSchema = z.enum(["red", "blue"]);

export const moveSchema = z.object({
  player: playerSchema,
  cell: z.string(),
});

export const gameSchema = z.object({
  id: z.string(),
  board: moveSchema.array(),
});

const metadataSchema = z.object({
  playersTurn: playerSchema,
});

// Type defs
type Move = z.TypeOf<typeof moveSchema>;
type Game = z.TypeOf<typeof gameSchema>;
type Metadata = z.TypeOf<typeof metadataSchema>;
type FullGame = Game & Metadata;

// Utils
const getPlayersTurn = (board: Game["board"]) => {
  const numRedMoves = board.filter((i) => i.player === "red").length;
  const numBlueMoves = board.filter((i) => i.player === "blue").length;
  // This assumes Red always goes first
  const playersTurn = numRedMoves === numBlueMoves ? "red" : "blue";
  return playersTurn;
};

const addMetadataToGame = (game: Game) => {
  const metadata = {
    playersTurn: getPlayersTurn(game.board),
  };

  return { ...game, ...metadata } as FullGame;
};

// "DB"
let games: Game[] = [];

// Fake DB methods
export default {
  createGame() {
    const id = (Math.random() + 1).toString(36).substring(4);
    const newGame = { id, board: [] };
    games.push(newGame);
    return addMetadataToGame(newGame);
  },

  getGame(id: string) {
    const game = games.find((game) => game.id === id);
    if (!game) throw new Error("Game does not exist");
    return addMetadataToGame(game);
  },

  getAllGames() {
    return games.map((game) => addMetadataToGame(game));
  },

  newMove(id: string, move: Move) {
    const curGame = this.getGame(id);
    const { board } = curGame;

    // I know security and edge cases can be ignored but someone double clicking a square
    // or clicking when it's not their turn can easily and accidently ruin the board
    // so this is some basic checks
    const playersTurn = getPlayersTurn(board);
    if (move.player !== playersTurn) throw new Error("It is not your turn");

    if (board.find((i) => i.cell === move.cell))
      throw new Error("Cell is already occupied");

    curGame.board.push(move);
    return addMetadataToGame(curGame);
  },

  resetGame(id: string) {
    const game = this.getGame(id);
    game.board = [];
    games = games.map((g) => (g.id === game.id ? game : g));
    return addMetadataToGame(game);
  },
};
