import Joi from 'joi'

export const releverSchema = Joi.object({
    quantiteAvant : Joi.number().required(),
    quantiteApres : Joi.number().required(),
    carburant_id : Joi.number().required(),
    pompe_id : Joi.number().required(),

})