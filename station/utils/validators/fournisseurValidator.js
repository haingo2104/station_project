import Joi from 'joi';

export const FournisseurSchema = Joi.object({
    nom: Joi.string().required(),
    email: Joi.string().email().required(),  
    telephone: Joi.string().required()
});
