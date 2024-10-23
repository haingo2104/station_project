import { Router } from "express";
import { AjouterFournisseur, ObtenirTousLesFournisseurs } from "../services/fournisseurService.js";

export default Router()

    .post('/', async(req, res , next)=>{
        try {
            const {nom , email , telephone} = req.body
            return res.status(201).json({fournisseurs : await AjouterFournisseur(nom, email , telephone)})
        } catch (error) {
            next(error)
        }

    })

    .get('/', async (req, res, next) => {
        try {
            return res.status(200).json({ fournisseurs: await ObtenirTousLesFournisseurs() })
        } catch (error) {
            next(error)
        }
    })