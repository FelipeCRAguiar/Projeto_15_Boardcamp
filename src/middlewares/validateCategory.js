import categorySchema from "../schemas/categorySchema.js";

export default function validateCategory(req, res, next) {
    const validation = categorySchema.validate(req.body)

    if (validation.error) {
        res.sendStatus(400)
        return
    }

    next()
}