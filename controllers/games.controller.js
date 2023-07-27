import { db } from "../database_connection/database.js";

export async function getGames(req,res){
     try {
        const games   = await db.query("SELECT * FROM games")
        res.send(games.rows)
     } catch(e){
         console.log(e)
        res.status(500).send("deu pau  no  servidor")
     }
}


export async function postGames(req,res){
   const {} = req.body
   try {
      await db.query(``,[])
      res.sendStatus(201)
   } catch(e){
       console.log(e)
      res.status(500).send("deu pau  no  servidor")
   }
}
