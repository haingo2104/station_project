import Joi from 'joi' 

export const prixSchema = Joi.object({
    carburant_id : Joi.number().required(),
    prix : Joi.number().required()
})