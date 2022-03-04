import db from "../../db.js";

export async function getGames(req, res) {
    const name = req.query.name

    try {

        if (name) {
            const resultQuery = await db.query(`
                SELECT 
                    games.*, 
                    categories.name AS "categoryName"
                FROM games 
                    JOIN categories ON categories.id=games."categoryId"
                WHERE name LIKE $1`, [`${name}%`])

            return res.send(resultQuery.rows).status(201)
        }
        
        const result = await db.query(`
                SELECT 
                    games.*, 
                    categories.name AS "categoryName"
                FROM games 
                    JOIN categories ON categories.id=games."categoryId"`)
        
        res.send(result.rows).status(201)

    } catch (error) {
        res.send(error).status(500)
    }
}