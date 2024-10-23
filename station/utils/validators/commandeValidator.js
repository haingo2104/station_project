import Joi from 'joi';

export const CommandeSchema = Joi.object({
    user_id : Joi.number().required(),
    fournisseur_id : Joi.number().required(),
    quantite : Joi.number().required(),
    prix_unitaire : Joi.number().required(),
    carburant_id : Joi.number().required(),
});

