import Joi from 'joi' 

export const modeDePaieSchema = Joi.object({
    nom : Joi.string().required()
})