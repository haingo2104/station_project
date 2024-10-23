import Joi from 'joi' 

export const tuyauSchema = Joi.object({
    carburant_id : Joi.number().required(),
    pompe_id : Joi.number().required()
})