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
    
}