import expres from "express"
import {
    getGames, postGames,
    getCustomers,
    postCustomers, putCustomers,
    getRents,
    postRentals,
    deleteRental,
    putRentals
}
    from "../controllers/games.controller.js"
import { validateSchema } from "../middleweres/validateSchema.js"
import { gameSchema, customersSchema,rentalsSchema} from "../schemas/schemas.js"

const app = expres()

app.get("/games", getGames)
app.post("/games", validateSchema(gameSchema), postGames)
app.get("/customers", getCustomers)
app.get("/customers/:id", getCustomers)
app.post("/customers", validateSchema(customersSchema), postCustomers)
app.put("/customers/:id", validateSchema(customersSchema), putCustomers)
app.get("/rentals", getRents)
app.post("/rentals", validateSchema(rentalsSchema),postRentals)
app.delete("/rentals/:id",deleteRental)
app.post("/rentals/:id/return",putRentals)
export const router = app