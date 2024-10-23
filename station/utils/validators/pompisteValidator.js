import Joi from 'joi' 

export const pompisteSchema = Joi.object({
    nom : Joi.string().required(),
    salaire : Joi.number().required()
})