import express from "express";
import { getCategories } from "../controllers/categoriesController.js";

const categoriesRouter = express.Router()

categoriesRouter.get('/categories', getCategories)

export default categoriesRouter