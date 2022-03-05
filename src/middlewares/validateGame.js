import gamesSchema from "../schemas/gamesSchema.js";

export default function validateGame(req, res, next) {
    const validation = gamesSchema.validate(req.body)

    if (validation.error) {
        res.sendStatus(400)
        return
    }

    next()
}