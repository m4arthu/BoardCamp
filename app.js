import express, { json } from  "express"
import dotenv from "dotenv"
import cors from "cors"
import { router } from "./routes/router.js"
import { db } from "./database_connection/database.js"

const port = process.env.PORT | 5000
const app  = express()
app.use(cors())
app.use(json())
dotenv.config()


app.use(router)

app.listen(port,()=>{
    console.log(`servidor rodando na porta: ${port} `)
})