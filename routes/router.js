import expres from  "express"
import { getGames } from "../controllers/games.controller.js"

const app = expres()

app.get("/games",getGames)

export const  router = app