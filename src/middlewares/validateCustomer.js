import customerSchema from "../schemas/customerSchema.js"
import db from "../../db.js"

export default async function validateCustomer(req, res, next) {
    const validation = customerSchema.validate(req.body)
    
    if (validation.error) {
        res.sendStatus(400)
        return
    }
    const customer = req.body
    
    try {

        const result = await db.query('SELECT * FROM customers WHERE cpf=$1', [customer.cpf])

        if(result.rowCount !== 0 && result.rows[0].id !== customer.id) {
            return res.sendStatus(409)
        }
        
    next() 
    } catch (error) {
        res.send(error).status(500)
    }

}