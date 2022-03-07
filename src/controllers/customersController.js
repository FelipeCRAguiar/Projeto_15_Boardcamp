import db from "../../db.js";

export async function getClients(req, res) {
    const cpf = req.query.cpf

    try {
        
        if(cpf) {
            const resultQuery = await db.query('SELECT * FROM customers WHERE cpf LIKE $1', [`${cpf}%`])
        }

        const result = await db.query('SELECT * FROM customers')

        res.send(result).status(201)

    } catch (error) {
        res.send(error).status(500)
    }
}