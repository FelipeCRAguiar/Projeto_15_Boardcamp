import db from "../../db.js";
import rentalSchema from "../schemas/rentalSchema.js";

export default async function validateRental(req, res, next) {
    const validation = rentalSchema.validate(req.body)

    if(validation.error) {
        res.sendStatus(400)
        return
    }
    
    const rental = req.body

    try {
    
        const customer = await db.query('SELECT * FROM customers WHERE id=$1', [rental.customerId])

        if(customer.rowCount === 0) {
            return res.sendStatus(400)
        }
        
        if(rental.daysRented <= 0) {
            return res.sendStatus(400)
        }

        const game = await db.query('SELECT * FROM games WHERE id=$1', [rental.gameId])

        if(game.rowCount === 0) {
            return res.sendStatus(400)
        }

        const availability = await db.query('SELECT * FROM rentals WHERE "gameId"=$1 AND "returnDate"=null', [rental.gameId])

        const stock = game.rows[0].stockTotal
        const gamesRented = availability.rowCount

        if(stock - gamesRented === 0) {
            return res.sendStatus(400)
        }

    } catch (error) {
        res.send(error).status(500)
    }

    next()
}