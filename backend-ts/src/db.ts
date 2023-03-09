import { z } from "zod";

const playerSchema = z.enum(["red", "blue"]);

export const moveSchema = z.object({
  player: playerSchema,
  cell: z.string(),
});

type Move = z.TypeOf<typeof moveSchema>;

export const gameSchema = z.object({
  id: z.string(),
  board: moveSchema.array(),
});

type Game = z.TypeOf<typeof gameSchema>;

const games: Game[] = [];

export default {
  createGame() {
    const id = (Math.random() + 1).toString(36).substring(4);
    const newGame = { id, board: [] };
    games.push(newGame);
    return newGame;
  },

  getGame(id: string) {
    const game = games.find((game) => game.id === id);
    if (!game) throw new Error("Game does not exist");
    return game;
  },

  getAllGames() {
    return games;
  },

  newMove(id: string, move: Move) {
    const curGame = this.getGame(id);
    const { board } = curGame;

    const numRedMoves = board.filter((i) => i.player === "red").length;
    const numBlueMoves = board.filter((i) => i.player === "blue").length;
    // This assumes Red always goes first
    const playersTurn = numRedMoves === numBlueMoves ? "red" : "blue";
    if (move.player !== playersTurn) throw new Error("It is not your turn");

    if (board.find((i) => i.cell === move.cell))
      throw new Error("Cell is already occupied");

    curGame.board.push(move);
  },

  resetGame(id: string) {
    const game = this.getGame(id);
    game.board = [];
  },
};
