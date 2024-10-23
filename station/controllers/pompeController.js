import { Router } from "express";
import { AjouterPompe, ObtenirPompe, ObtenirTousLesPompes, SupprimerPompe } from "../services/pompeService.js";

export default Router()

    .post('/', async(req, res , next)=>{
        try {
            return res.status(201).json({pompes : await AjouterPompe()})
        } catch (error) {
            next(error)
        }

    })

    .get('/', async (req, res, next) => {
        
        try {
            return res.status(200).json({ pompes: await ObtenirTousLesPompes() })
        } catch (error) {
            next(error)
        }
    })

    .get('/:id', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            return res.status(200).json({ pompe: await ObtenirPompe(id) })
        } catch (error) {
            next(error)
        }
    })


    .delete('/:id', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            return res.status(200).json({ pompiste: await SupprimerPompe(id) })
        } catch (error) {
            next(error)
        }
    })