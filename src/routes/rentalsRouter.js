import express from "express";
import { deleteRental, getRentals, postRental, updateRental } from "../controllers/rentalsController.js";
import { validateRental, validateReturn } from "../middlewares/validateRental.js";

const rentalsRouter = express.Router()

rentalsRouter.get('/rentals', getRentals)
rentalsRouter.post('/rentals', validateRental, postRental)
rentalsRouter.post('/rentals/:id/return', validateReturn, updateRental)
rentalsRouter.delete('/rentals/:id', validateReturn, deleteRental)

export default rentalsRouter