import { Router } from "express";
import { AjouterModeDePaie, ModifierModeDePaie, ObtenirModeDePaie, ObtenirTousLesModeDePaies, SupprimerModeDePaie } from "../services/modeDepaieService.js";

export default Router()

    .post('/', async(req, res , next)=>{
        try {
            const {nom} = req.body
            return res.status(201).json({modeDePaie : await AjouterModeDePaie(nom)})
        } catch (error) {
            next(error)
        }

    })

    .get('/', async (req, res, next) => {
        try {
            return res.status(200).json({ modeDePaies: await ObtenirTousLesModeDePaies() })
        } catch (error) {
            next(error)
        }
    })

    .get('/:id', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            return res.status(200).json({ modeDePaie: await ObtenirModeDePaie(id) })
        } catch (error) {
            next(error)
        }
    })

    .patch('/:id', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            const {nom} = req.body
            return res.status(200).json({ modeDePaie: await ModifierModeDePaie(id, nom) })
        } catch (error) {
            next(error)
        }
    })

    .put('/:id', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            const { nom } = req.body
            return res.status(200).json({ modeDePaie: await ModifierModeDePaie(id, nom) })
        } catch (error) {
            next(error)
        }
    })

    .delete('/:id', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            return res.status(200).json({ modeDePaie: await SupprimerModeDePaie(id) })
        } catch (error) {
            next(error)
        }
    })