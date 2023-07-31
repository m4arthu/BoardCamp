

import { db } from "../database_connection/database.js";
import dayjs from "dayjs"


// games controllers
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

// customers controllers

export async function getCustomers(req, res) {
   try {
      let customers
      if (req.params.id) {
         customers = await db.query(`SELECT *,TO_CHAR(birthday,'YYYY-MM-DD') as "formatedBirthday" FROM customers WHERE id= $1`, [req.params.id])
         if (customers.rows.length === 0) {
            res.sendStatus(404)
            return
         }
         customers.rows[0].birthday = customers.rows[0].formatedBirthday
         delete customers.rows[0].formatedBirthday
         res.send(customers.rows[0])
      } else {
         customers = await db.query(`SELECT *,TO_CHAR(birthday,'YYYY-MM-DD') as "formatedBirthday" FROM customers`)
         customers.rows.forEach((r) => {
            r.birthday = r.formatedBirthday
            delete r.formatedBirthday
         })
         res.send(customers.rows)
      }

   } catch (e) {
      console.log(e)
      res.status(500).send("deu pau  no  servidor")
   }
}

export async function postCustomers(req, res) {
   const { name, phone, cpf, birthday } = req.body
   try {
      if (isNaN(Number(cpf))) {
         return res.sendStatus(400)
      }
      const existName = await db.query("SELECT cpf FROM customers WHERE cpf = $1", [cpf])
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

export async function putCustomers(req, res) {
   const { name, phone, cpf, birthday } = req.body
   try {
      if (isNaN(Number(cpf))) {
         return res.sendStatus(400)
      }
      const existName = await db.query("SELECT * FROM customers WHERE id = $1", [req.params.id])
      if (existName.rows[0].cpf === cpf) {
         await db.query(`UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 
         WHERE id = $5;`, [name, phone, cpf, dayjs(birthday).format('YYYY-MM-DD'), req.params.id])
         res.sendStatus(400)
      } else {
         const existCpf = await db.query("SELECT * FROM customers WHERE cpf = $1", [cpf])
         if (existCpf.rows.length > 0) {
            res.sendStatus(409)
         } else {
            await db.query(`UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 
            WHERE id = $5;`, [name, phone, cpf, birthday, req.params.id])
            res.sendStatus(200)
         }
      }

   } catch (e) {
      console.log(e)
      res.status(500).send("deu pau  no  servidor")
   }
}

// rentals controllers

export async function getRents(req, res) {
   try {
      const rents = await db.query("SELECT * FROM rentals")

      for (let i = 0; i < rents.rows.length; i++) {
         const customer = await db.query("SELECT * FROM customers WHERE id = $1", [rents.rows[i].customerId])
         const games = await db.query("SELECT * from games WHERE id = $1", [rents.rows[i].gameId])
         rents.rows[i].customer = {
            id: rents.rows[i].customerId,
            name: customer.rows[0].name
         }
         rents.rows[i].game = {
            id: rents.rows[i].gameId,
            name: games.rows[0].name
         }
      }


      res.send(rents.rows)
   } catch (e) {
      console.log(e)
      res.status(500).send("deu pau  no  servidor")
   }
}

export async function postRentals(req, res) {
   const { customerId, gameId, daysRented } = req.body
   try {
      const customer = await db.query("SELECT * FROM customers WHERE id = $1", [customerId])
      const game = await db.query("SELECT * FROM games WHERE id = $1", [gameId])
      const rentals = await db.query("SELECT * FROM rentals WHERE id=$1", [gameId])
      if (game.rows[0].stockTotal - rentals.rows.length >= 0) {
         res.sendStatus(400)
         return
      }
      if (customer.rows.length !== 0 && game.rows.length !== 0 && daysRented > 0) {
         console.log(dayjs().format('YYYY-MM-DD'))
         const newRent = {
            customerId: customerId,
            gameId: gameId,
            rentDate: dayjs().format('YYYY-MM-DD'),
            daysRented: daysRented,
            returnDate: null, // troca pra uma data quando já devolvido
            originalPrice: game.rows[0].pricePerDay * daysRented,
            delayFee: null
         }
         await db.query(`INSERT INTO rentals
         ("customerId","gameId","rentDate","daysRented","returnDate","originalPrice","delayFee")
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
            [newRent.customerId, newRent.gameId, newRent.rentDate,
            newRent.daysRented, newRent.returnDate, newRent.originalPrice, newRent.delayFee])
         res.sendStatus(201)
      } else {
         res.sendStatus(400)
      }
   } catch (e) {
      console.log(e)
      res.status(500).send("deu pau  no  servidor")
   }

}
export async function deleteRental(req, res) {
   const { id } = req.params
   try {
      const idExist = await db.query("SELECT * FROM rentals WHERE id = $1", [id])
      if (idExist.rows.length > 0) {
         if (!idExist.rows[0].returnDate) {
            res.sendStatus(400)
         } else {
            await db.query("DELETE FROM rentals WHERE id = $1", [id])
            res.sendStatus(200)
         }
      } else {
         res.sendStatus(404)
      }
   } catch (e) {
      console.log(e)
      res.status(500).send("deu pau no  servidos")
   }
}

export async function putRentals(req, res) {
   const { id } = req.params
   try {
      const rental = await db.query("SELECT *  FROM rentals WHERE id = $1", [id])
      if (rental.rows.length === 0) {
         res.sendStatus(404)
         return
      }
      console.log(rental.rows[0].returnDate)
      if (rental.rows[0].returnDate !== null) {
         res.sendStatus(400)
         return
      }
   
      const diffInMs = new Date(rental.rows[0].rentDate) - new Date(dayjs().format("YYYY-MM-DD"))
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
      const game = await db.query("SELECT * FROM games WHERE id = $1",[rental.rows[0].gameId])
      var delayFee = 0
      const  returnDate = dayjs().format("YYYY-MM-DD")
      if (diffInDays > 0){
      delayFee = Math.ceil(diffInDays) *  game.rows[0].pricePerDay
      }
      await db.query(`UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3`, [returnDate,delayFee,id])
      res.sendStatus(200)
   } catch(e){
      console.log(e)
      res.status(500).send(e)
   }
}
