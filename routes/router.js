import expres from  "express"
import { getGames,postGames } from "../controllers/games.controller.js"
import { validateSchema } from "../middleweres/validateSchema.js"
import { gameSchema } from "../schemas/schemas.js"

const app = expres()

app.get("/games", getGames)
app.post("/games",validateSchema(gameSchema), postGames)

export const  router = app