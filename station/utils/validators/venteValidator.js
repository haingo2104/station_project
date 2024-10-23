import Joi from 'joi'

export const venteSchema = Joi.object({
    pompe_id : Joi.number().required(),
    pompiste_id : Joi.number().required(),
    modeDePaie_id : Joi.number().required(),
    total : Joi.number().required(),

})