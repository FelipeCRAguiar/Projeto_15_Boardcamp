import db from "../../db.js";

export async function getGames(req, res) {
    const name = req.query.name

    try {

        if (name) {
            const gamesQuery = await db.query(`
            SELECT 
                games.*, 
                categories.name AS "categoryName"
            FROM games
                JOIN categories ON categories.id=games."categoryId"
            WHERE LOWER(games.name) LIKE LOWER($1)`, [`${name}%`])
            

            return res.send(gamesQuery.rows).status(201)
        }
        
        const games = await db.query(`
                SELECT 
                    games.*, 
                    categories.name AS "categoryName"
                FROM games
                    JOIN categories ON categories.id=games."categoryId"`)
        
        res.send(games.rows).status(201)

    } catch (error) {
        res.send(error).status(500)
    }
}

export async function postGames(req, res) {
    const game = req.body

    if(parseInt(game.stockTotal) <= 0 || parseInt(game.pricePerDay) <= 0) {
        return res.sendStatus(400)
    }

    try {

        const resultCategory = await db.query('SELECT * FROM categories WHERE id=$1', [game.categoryId])
        if(resultCategory.rowCount === 0) {
            return res.sendStatus(400)
        }

        const resultName = await db.query('SELECT * FROM games WHERE name=$1', [game.name])
        if(resultName.rowCount !== 0) {
            return res.sendStatus(400)
        }

        await db.query('INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)', [game.name, game.image, parseInt(game.stockTotal), game.categoryId, parseInt(game.pricePerDay)])
        res.sendStatus(201)
        
    } catch (error) {
        res.send(error).status(500)
    }
}