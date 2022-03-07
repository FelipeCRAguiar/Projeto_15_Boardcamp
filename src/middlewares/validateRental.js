import db from "../../db.js";
import rentalSchema from "../schemas/rentalSchema.js";

export async function validateRental(req, res, next) {
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

export async function validateReturn(req, res, next) {
    const rentalId = req.params.id

    try {

        const rental = await db.query('SELECT * FROM rentals WHERE id=$1', [rentalId])

        if(rental.rowCount === 0) {
            return res.sendStatus(404)
        }

        if(rental.rows[0].returnDate !== null) {
            return res.sendStatus(400)
        }

        req.locals = rental.rows[0]
        
    } catch (error) {
        res.send(error).status(500)
    }

    next()
}