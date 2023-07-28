import { db } from "../database_connection/database.js";

export async function getGames(req, res) {
   try {
      const games = await db.query("SELECT * FROM games")
      res.send(games.rows)
   } catch (e) {
      console.log(e)
      res.status(500).send("deu pau  no  servidor")
   }
}


export async function postGames(req, res) {
   const { name, image, stockTotal, pricePerDay } = req.body
   try {
      const existName = await db.query("SELECT name FROM games WHERE name = $1", [name])
      if (existName.rows.length !== 0) {
         res.sendStatus(409)
         return
      }
      await db.query(`INSERT INTO games(name,image,"stockTotal","pricePerDay") 
       SELECT $1,$2,$3,$4
       WHERE NOT EXISTS (
       SELECT 1 FROM games WHERE name = $1
       );`, [name, image, stockTotal, pricePerDay])
      res.sendStatus(201)
   } catch (e) {
      console.log(e)
      res.status(500).send("deu pau  no  servidor")
   }
}

export async function getCustomers(req, res) {
   try {
      let  customers
      if (req.params.id) {
         customers =  await db.query(`SELECT * FROM customers WHERE id= $1`,[req.params.id])
      } else {
         customers = await db.query("SELECT * FROM customers")
      }
      res.send(customers.rows)
   } catch (e) {
      console.log(e)
      res.status(500).send("deu pau  no  servidor")
   }
}

export async function postCustomers(req, res) {
   const { name, phone, cpf, birthday } = req.body
   try {
      const existName = await db.query("SELECT cpf FROM customers WHERE cpf = $1", [cpf])
      console.log(existName.rows)
      if (existName.rows.length !== 0) {
         res.sendStatus(409)
         return
      }
      await db.query(`INSERT INTO customers(name, phone, cpf, birthday) 
       SELECT $1,$2,$3,$4
       WHERE NOT EXISTS (
       SELECT 1 FROM customers WHERE cpf = $1
       );`, [name, phone, cpf, birthday])
      res.sendStatus(201)
   } catch (e) {
      console.log(e)
      res.status(500).send("deu pau  no  servidor")
   }
}

