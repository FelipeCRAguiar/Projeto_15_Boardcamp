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
                category.id AS "category_Id",
                category.name AS "category_Name"
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