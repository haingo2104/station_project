import { Router } from "express";
import { AjouterPrix, getLatestPrice, ModifierPrix, ObtenirPrixCarburants, ObtenirPrixParCarburant, ObtenirPrixParDate, ObtenirTousLesPrix, ObtenirUnPrix, SupprimerPrix } from "../services/prixService.js";

export default Router()

    .post('/', async(req, res , next)=>{
        try {
            const {carburant_id , prix} = req.body
            return res.status(201).json({prix : await AjouterPrix(carburant_id, prix)})
        } catch (error) {
            next(error)
        }

    })

    .get('/', async (req, res, next) => {
        try {
            return res.status(200).json({ prix: await ObtenirTousLesPrix() })
        } catch (error) {
            next(error)
        }
    })
    .get('/obtenirPrixCarburants', async (req, res, next) => {
        try {
            return res.status(200).json({ prix: await ObtenirPrixCarburants() })
        } catch (error) {
            next(error)
        }
    })
    .get('/:id', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            return res.status(200).json({ prix: await ObtenirUnPrix(id) })
        } catch (error) {
            next(error)
            console.log(error)
        }
    })
    .get('/lastPrice/:id', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            return res.status(200).json({ prix: await getLatestPrice(id) })
        } catch (error) {
            next(error)
            console.log(error)
        }
    })
    .post('/obtenirPrixparDate/:page/:limit', async (req, res,next) => {
        try {
            const {page, limit } = req.params;
            const {date} = req.body
            return res.status(200).json({prix : await ObtenirPrixParDate(date,parseInt(page), parseInt(limit))})
        } catch (error) {
            next(error)

        }
    })
    .post('/obtenirPrixParCarburant/:page/:limit', async (req, res,next) => {
        try {
            const {page, limit } = req.params;
            const {carburant_id} = req.body
            return res.status(200).json({prix : await ObtenirPrixParCarburant(parseInt(carburant_id),parseInt(page), parseInt(limit))})
        } catch (error) {
            next(error)

        }
    })
    .patch('/:id', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            const {carburant_id , prix} = req.body
            return res.status(200).json({ prix: await ModifierPrix(id, carburant_id , prix) })
        } catch (error) {
            next(error)
        }
    })

    .patch('/:id', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            const {carburant_id , prix} = req.body
            return res.status(200).json({ prix: await ModifierPrix(id, carburant_id , prix) })
        } catch (error) {
            next(error)
        }
    })

    .delete('/:id', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            return res.status(200).json({ prix: await SupprimerPrix(id) })
        } catch (error) {
            next(error)
        }
    })