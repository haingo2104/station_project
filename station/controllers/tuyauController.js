import { Router } from "express";
import { AjouterTuyaux, ModifierTuyau, ObtenirTousLestuyaux, Obtenirtuyau, SupprimerTuyaux } from "../services/tuyauService.js";

export default Router()

    .post('/', async(req, res , next)=>{
        try {
            const {carburant_id , pompe_id} = req.body
            return res.status(201).json({tuyau : await AjouterTuyaux(carburant_id, pompe_id)})
        } catch (error) {
            next(error)
        }

    })

    .get('/', async (req, res, next) => {
        try {
            return res.status(200).json({ tuyaux: await ObtenirTousLestuyaux() })
        } catch (error) {
            next(error)
        }
    })

    .get('/:id', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            return res.status(200).json({ tuyau: await Obtenirtuyau(id) })
        } catch (error) {
            next(error)
            console.log(error)
        }
    })

    .patch('/:id', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            const {carburant_id , pompe_id} = req.body
            return res.status(200).json({ tuyau: await ModifierTuyau(id, carburant_id , pompe_id) })
        } catch (error) {
            next(error)
        }
    })

    .patch('/:id', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            const {carburant_id , pompe_id} = req.body
            return res.status(200).json({ tuyau: await ModifierTuyau(id, carburant_id , pompe_id) })
        } catch (error) {
            next(error)
        }
    })

    .delete('/:id', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            return res.status(200).json({ tuyau: await SupprimerTuyaux(id) })
        } catch (error) {
            next(error)
        }
    })