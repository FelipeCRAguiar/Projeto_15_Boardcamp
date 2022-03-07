import express from "express";
import { getRentals, postRental } from "../controllers/rentalsController.js";
import validateRental from "../middlewares/validateRental.js";

const rentalsRouter = express.Router()

rentalsRouter.get('/rentals', getRentals)
rentalsRouter.post('/rentals', validateRental, postRental)

export default rentalsRouter