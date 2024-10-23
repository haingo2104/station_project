import Joi from 'joi' 

export const carburantSchema = Joi.object({
    nom : Joi.string().required()
})