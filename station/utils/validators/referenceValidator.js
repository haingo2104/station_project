import Joi from 'joi'

export const referenceSchema = Joi.object({
    ref_value : Joi.string().required(),
    modeDePaie_id : Joi.number().required(),
    montant : Joi.number().required(),
    vente_id : Joi.number().required()

})