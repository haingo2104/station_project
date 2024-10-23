import { Router } from "express";
import { AjouterPompiste, ModifierPompiste, ObtenirPerformancesPompistes, ObtenirPompiste, ObtenirTousLesPompistes, SupprimerPompiste } from "../services/pompisteService.js";

export default Router()

    .post('/', async(req, res , next)=>{
        try {
            const {nom , salaire} = req.body
            return res.status(201).json({pompistes : await AjouterPompiste(nom , salaire)})
        } catch (error) {
            next(error)
        }

    })

    .get('/performances', async (req, res, next) => {
        try {
            const performances = await ObtenirPerformancesPompistes();
            return res.status(200).json({ performances });
        } catch (error) {
            next(error);
        }
    })

    .get('/', async (req, res, next) => {
        try {
            
            return res.status(200).json({ pompistes: await ObtenirTousLesPompistes() })
        } catch (error) {
            next(error)
        }
    })

    .get('/:id', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            return res.status(200).json({ pompiste: await ObtenirPompiste(id) })
        } catch (error) {
            next(error)
        }
    })

    .patch('/:id', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            const {nom , salaire} = req.body
            return res.status(200).json({ pompiste: await ModifierPompiste(id, nom , salaire) })
        } catch (error) {
            next(error)
        }
    })

    .put('/:id', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            const { nom , salaire} = req.body
            return res.status(200).json({ pompiste: await ModifierPompiste(id, nom , salaire) })
        } catch (error) {
            next(error)
        }
    })

    .delete('/:id', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            return res.status(200).json({ pompiste: await SupprimerPompiste(id) })
        } catch (error) {
            next(error)
        }
    })


