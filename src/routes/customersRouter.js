import express from "express";
import { getCustomerId, getCustomers } from "../controllers/customersController.js";

const customersRouter = express.Router()

customersRouter.get('/customers', getCustomers)
customersRouter.get('/customers/:id', getCustomerId)

export default customersRouter