import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { validateReqVar } from "./middleware";
import { z } from "zod";
import db, { moveSchema } from "./db";

const idParamSchema = z.object({ id: z.string() });

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.get(
  "/game/:id",
  validateReqVar(idParamSchema, "params"),
  (req: Request, res: Response) => {
    const { id } = req.params;
    const game = db.getGame(id);
    return res.json(game);
  }
);

app.get("/games", (_req: Request, res: Response) => {
  const games = db.getAllGames();
  return res.json(games);
});

app.post("/new-game", (_: Request, res: Response) => {
  const game = db.createGame();
  return res.json(game);
});

app.put(
  "/reset-game/:id",
  validateReqVar(idParamSchema, "params"),
  (req: Request, res: Response) => {
    const { id } = req.params;
    db.resetGame(id);
    const game = db.getGame(id);
    res.json(game);
  }
);

app.post(
  "/game/:id/move",
  validateReqVar(idParamSchema, "params"),
  validateReqVar(moveSchema),
  (req: Request, res: Response) => {
    const { id } = req.params;
    db.newMove(id, req.body);
    const game = db.getGame(id);
    res.json(game);
  }
);

app.listen(3001, function () {
  console.log("Example app listening on port 3001!");
});
