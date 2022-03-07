import dayjs from "dayjs";
import db from "../../db.js";

export async function getRentals(req, res) {
    const customerId = req.query.customerId
    const gameId = req.query.gameId

    try {
        
        const rentals = await db.query(`
            SELECT rentals.*,
                customers.id AS "customer_Id",
                customers.name AS "customer_Name",
                games.id AS "game_Id",
                games.name AS "game_Name",
                categories.id AS "category_Id",
                categories.name AS "category_Name"
            FROM rentals
                JOIN customers ON customers.id=rentals."customerId"
                JOIN games ON games.id=rentals."gameId"
                JOIN categories ON categories.id=games."categoryId"
            ${customerId ? `WHERE rentals."customerId" = ${parseInt(customerId)}` : ""}
            ${gameId ? `WHERE rentals."gameId" = ${parseInt(gameId)}` : ""}
        `)

        const rentalsFixed = rentals.rows.map(el => {
            const item = {
                ...el,
                rentDate: dayjs(el.rentDate).format("YYYY-MM-DD"),
                returnDate: el.returnDate && dayjs(el.returnDate).format("YYYY-MM-DD"),
                customer: {
                    id: el.customer_Id,
                    name: el.customer_Name
                },
                game: {
                    id: el.game_Id,
                    name: el.game_Name,
                    categoryId: el.category_Id,
                    categoryName: el.category_Name
                }
            }

            delete item.customer_Id
            delete item.customer_Name
            delete item.game_Id
            delete item.game_Name
            delete item.category_Id
            delete item.category_Name

            return item
        })

        res.send(rentalsFixed).status(201)

    } catch (error) {
        res.send(error).status(500)
    }
}

export async function postRental(req, res) {
    const rental = req.body
    const rentDate = dayjs().format('YYYY-MM-DD')

    try {

        const pricePerDay = await db.query('SELECT * FROM games WHERE id=$1', [rental.gameId])
        
        await db.query(`
            INSERT INTO 
                rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
            VALUES ($1, $2, $3, $4, null, $5, null)
        `, [rental.customerId, rental.gameId, rentDate, rental.daysRented, pricePerDay.rows[0].pricePerDay * rental.daysRented])

        res.sendStatus(201)

    } catch (error) {
        res.send(error).status(500)
    }
}

export async function updateRental(req, res) {
    const rentalId = req.params.id
    const returnDate = dayjs().format('YYYY-MM-DD')
    const daysDelayed = dayjs().diff(dayjs(req.locals.rentDate).add(parseInt(req.locals.daysRented), 'day'), 'day')
    const pricePerDay = parseInt(req.locals.originalPrice) / parseInt(req.locals.daysRented)
    let delayFee = 0

    if(daysDelayed > 0) {
        delayFee = parseInt(daysDelayed) * pricePerDay
    }

    try {

        await db.query(`
            UPDATE rentals
                SET "returnDate" = $1,
                    "delayFee" = $2
            WHERE id = $3
        `, [returnDate, delayFee, rentalId])

        res.sendStatus(200)
        
    } catch (error) {
        res.send(error).status(500)
    }
}