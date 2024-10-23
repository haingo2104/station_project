import { Router } from "express";
import { AjouterStock, ModifierStock, ObtenirStock, ObtenirStocksParCarburantParDate, ObtenirStocksParDate, ObtenirStocksPlusAncien, ObtenirStocksPlusRecent, ObtenirTousLesStocks, SupprimerStock, afficherStock } from "../services/stockService.js";

export default Router()

    .post('/', async(req, res , next)=>{
        try {
            const {carburant_id , quantite} = req.body
            return res.status(201).json({stock : await AjouterStock(carburant_id, quantite)})
        } catch (error) {
            next(error)
        }

    })

    .get('/', async (req, res, next) => {
        try {
            const { page, limit } = req.params
            return res.status(200).json({ stocks: await ObtenirTousLesStocks(parseInt(page), parseInt(limit)) })
        } catch (error) {
            next(error)
        }
    })

    // .get('/:id', async (req, res, next) => {
    //     try {
    //         const id = parseInt(req.params.id)
    //         return res.status(200).json({ stock: await ObtenirStock(id) })
    //     } catch (error) {
    //         next(error)
    //         console.log(error)
    //     }
    // })

    .get('/obtenirStocksParDate', async (req, res,next) => {
        try {
            const {date} = req.query
            return res.status(200).json({stocks : await ObtenirStocksParDate(date)})
        } catch (error) {
            next(error)

        }
    })
    .get('/obtenirStocksParCarburant', async (req, res,next) => {
        try {
            const {carburant_id} = req.query
            return res.status(200).json({stocks : await ObtenirStocksParDate(parseInt(carburant_id))})
        } catch (error) {
            next(error)

        }
    })
    .get('/obtenirStocksParCarburantParDate', async (req, res,next) => {
        try {
            const {carburant_id , date} = req.query
            return res.status(200).json({stocks : await ObtenirStocksParCarburantParDate(parseInt(carburant_id) , date)})
        } catch (error) {
            next(error)

        }
    })
    .get('/plusAncien', async (req, res, next) => {
        try {
            return res.status(200).json({stocks : await ObtenirStocksPlusAncien()})

        } catch (error) {
            next(error)
        }
    })

    .get('/plusRecent', async (req, res, next) => {
        try {
            return res.status(200).json({stocks : await ObtenirStocksPlusRecent()})

        } catch (error) {
            next(error)
        }
    })
    .patch('/:id', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            const {carburant_id , quantite} = req.body
            return res.status(200).json({ stock: await ModifierStock(id, carburant_id , quantite) })
        } catch (error) {
            next(error)
        }
    })

    .patch('/:id', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            const {carburant_id , quantite} = req.body
            return res.status(200).json({ stock: await ModifierStock(id, carburant_id , quantite) })
        } catch (error) {
            next(error)
        }
    })

    .delete('/:id', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            return res.status(200).json({ stock: await SupprimerStock(id) })
        } catch (error) {
            next(error)
        }
    })

    .get('/afficherStock', async (req, res, next) => {
        try {
            return res.status(200).json({stocks : await afficherStock()})

        } catch (error) {
            next(error)
        }
    })