import express from "express";
import { getCategories, postCategories } from "../controllers/categoriesController.js";
import validateCategory from "../middlewares/validateCategory.js";

const categoriesRouter = express.Router()

categoriesRouter.get('/categories', getCategories)
categoriesRouter.post('/categories', validateCategory, postCategories)

export default categoriesRouter