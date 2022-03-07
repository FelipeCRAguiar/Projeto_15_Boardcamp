import BaseJoi from 'joi';
import JoiDate from '@joi/date';

const joi = BaseJoi.extend(JoiDate);


const customerSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().required().pattern(/^[0-9]{10,11}$/),
    cpf: joi.string().required().pattern(/^[0-9]{11}$/),
    birthday: joi.date().format("YYYY-MM-DD").required()
});

export default customerSchema