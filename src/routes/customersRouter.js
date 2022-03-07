import express from "express";
import { getCustomerId, getCustomers, postCustomer } from "../controllers/customersController.js";
import validateCustomer from "../middlewares/validateCustomer.js";

const customersRouter = express.Router()

customersRouter.get('/customers', getCustomers)
customersRouter.get('/customers/:id', getCustomerId)
customersRouter.post('/customers', validateCustomer, postCustomer)

export default customersRouter