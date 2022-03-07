import db from "../../db.js";

export async function getCustomers(req, res) {
    const cpf = req.query.cpf

    try {
        
        if(cpf) {
            const customersQuery = await db.query('SELECT * FROM customers WHERE cpf LIKE $1', [`${cpf}%`])

            return res.send(customersQuery).status(201)
        }

        const customers = await db.query('SELECT * FROM customers')

        res.send(customers).status(201)

    } catch (error) {
        res.send(error).status(500)
    }
}

export async function getCustomerId(req, res) {
    const id = req.params.id

    try {
        
        const customer = await db.query('SELECT * FROM customers WHERE id=$1', [id])

        if(customer.rowCount === 0) {
            return res.sendStatus(404)
        }

        res.send(customer).status(201)

    } catch (error) {
        res.send(error).status(500)
    }
}