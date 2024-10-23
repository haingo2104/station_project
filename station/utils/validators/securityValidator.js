import Joi from 'joi';

export const registerSchema = Joi.object({
    fullname: Joi.string().required(),
    email: Joi.string().email().required(),  
    password: Joi.string().min(8).max(60).required(),
    confirmation: Joi.ref('password')
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),  
    password: Joi.string().min(8).max(60).required(),
});
