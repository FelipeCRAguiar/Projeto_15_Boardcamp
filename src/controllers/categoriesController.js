import db from "../../db.js";

export async function getCategories(req, res) {
    try {

        const categories = await db.query('SELECT * FROM categories')

        res.send(categories.rows).status(201)
        
    } catch (error) {
        res.send(error).status(500)
    }
}

export async function postCategories(req, res) {
    const category = req.body

    try {
        
        const result = await db.query('SELECT * FROM categories WHERE name=$1', [category.name])
        if (result.rowCount !== 0) {
            return res.sendStatus(409)
        }

        await db.query('INSERT INTO categories (name) VALUES ($1)', [category.name])

        res.sendStatus(201)

    } catch (error) {
        res.send(error).status(201)
    }
}