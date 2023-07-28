import expres from  "express"
import { getGames,postGames,getCustomers,postCustomers } from "../controllers/games.controller.js"
import { validateSchema } from "../middleweres/validateSchema.js"
import { gameSchema,customersSchema } from "../schemas/schemas.js"

const app = expres()

app.get("/games", getGames)
app.post("/games",validateSchema(gameSchema), postGames)
app.get("/customers", getCustomers)
app.get("/customers/:id", getCustomers)
app.post("/customers",validateSchema(customersSchema), postCustomers)

export const  router = app