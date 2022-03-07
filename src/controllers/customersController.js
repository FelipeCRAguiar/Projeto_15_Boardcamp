import dayjs from "dayjs";
import db from "../../db.js";

export async function getCustomers(req, res) {
    const cpf = req.query.cpf

    try {
        
        if(cpf) {
            const customersQuery = await db.query('SELECT * FROM customers WHERE cpf LIKE $1', [`${cpf}%`])

            return res.send(customersQuery.rows).status(201)
        }

        const customers = await db.query('SELECT * FROM customers')

        const customersFixed = customers.rows.map(el => ({...el, birthday: dayjs(el.birthday).format('YYYY-MM-DD')}))

        res.send(customersFixed).status(201)

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

        const customerFixed = customer.rows.map(el => ({...el, birthday: dayjs(el.birthday).format('YYYY-MM-DD')}))

        res.send(customerFixed).status(201)

    } catch (error) {
        res.send(error).status(500)
    }
}

export async function postCustomer(req, res) {
    const customer = req.body

    try {

        await db.query('INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)', [customer.name, customer.phone, customer.cpf, customer.birthday])

        res.sendStatus(201)
        
    } catch (error) {
        res.send(error).status(500)
    }
}

export async function updateCustomer(req, res) {
    const customer = req.body
    const id = req.params.id

    try {
        
        await db.query(`
            UPDATE customers 
            SET name = $2, 
                phone = $3,
                cpf = $4,
                birthday = $5
            WHERE id = $1`, [id, customer.name, customer.phone, customer.cpf, customer.birthday])

        res.sendStatus(200)

    } catch (error) {
        res.send(error).status(500)
    }
}