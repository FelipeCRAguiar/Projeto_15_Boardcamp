import express from "express";
import { getRentals, postRental, updateRental } from "../controllers/rentalsController.js";
import { validateCheckout, validateRental } from "../middlewares/validateRental.js";

const rentalsRouter = express.Router()

rentalsRouter.get('/rentals', getRentals)
rentalsRouter.post('/rentals', validateRental, postRental)
rentalsRouter.post('/rentals/:id/return', validateCheckout, updateRental)

export default rentalsRouter