import Joi from 'joi'

export const stockSchema = Joi.object({
    carburant_id : Joi.number().required(),
    quantite : Joi.number().required(),

})