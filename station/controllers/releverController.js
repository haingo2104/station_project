import { Router } from "express";
import { AjouterRelever, modifierRelever, ObtenirCarburantParPompe, obtenirDernierQuantite, ObtenirReleverParDate, ObtenirReleverParPompe, ObtenirReleverParPompeParDate, obtenirTousLesRelevers, obtenirUnRelever, supprimerRelever, totalReleversParPompe } from "../services/releverService.js";

export default Router()
    .post('/' , async(req, res , next)=>{
        try {
            const {quantiteAvant , quantiteApres , carburant_id , pompe_id} = req.body
            return res.status(201).json({relever : await AjouterRelever(quantiteAvant , quantiteApres , carburant_id , pompe_id)})
        } catch (error) {
            next(error)
        }
    })
    .get('/' , async(req,res , next)=>{
        try {
            return res.status(200).json({relevers : await obtenirTousLesRelevers()})
        } catch (error) {
            next(error)
        }
    })

    // .get('/:id', async (req, res, next) => {
    //     try {
    //         const id = parseInt(req.params.id)
    //         return res.status(200).json({ relever: await obtenirUnRelever(id) })
    //     } catch (error) {
    //         next(error)
    //     }
    // })
    .get('/obtenirReleversParDate', async (req, res,next) => {
        try {
            const {date} = req.query;
            return res.status(200).json({relevers : await ObtenirReleverParDate(date)})
        } catch (error) {
            next(error)

        }
    })
    .get('/obtenirReleversParPompe', async (req, res,next) => {
        try {
            const {pompe_id } =req.query;
            return res.status(200).json({relevers : await ObtenirReleverParPompe(parseInt(pompe_id))})
        } catch (error) {
            next(error)

        }
    })
    .get('/obtenirReleversParPompeParDate', async (req, res,next) => {
        try {
            const {pompe_id , date} = req.query
            return res.status(200).json({relevers : await ObtenirReleverParPompeParDate(parseInt(pompe_id),date)})
        } catch (error) {
            next(error)

        }
    })
    .patch('/:id', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            const {quantiteAvant , quantiteApres ,carburant_id , pompe_id} = req.body
            return res.status(200).json({ relever: await modifierRelever(id, carburant_id,quantiteAvant , quantiteApres  , pompe_id) })

        } catch (error) {
            next(error)
        }
    })

    .put('/:id', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            const {quantiteAvant , quantiteApres ,carburant_id , pompe_id} = req.body
            return res.status(200).json({ relever: await modifierRelever(id, carburant_id,quantiteAvant , quantiteApres  , pompe_id) })
            
        } catch (error) {
            next(error)
        }
    })

    .delete('/:id', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            return res.status(200).json({ relever: await supprimerRelever(id) })
        } catch (error) {
            next(error)
        }
    })

    .get('/obtenirCarburantParPompe/:id', async (req, res,next) => {
        try {
            const id = parseInt(req.params.id)
            return res.status(200).json({carburants : await ObtenirCarburantParPompe(id)})
        } catch (error) {
            next(error)

        }
    })

    .get('/obtenirDernierRelever/:pompeId/:carburantId' , async(req, res , next) =>{
        try {
            const {pompeId , carburantId} = req.params 
            return res.status(200).json({quantiteApres : await obtenirDernierQuantite(parseInt(pompeId), parseInt(carburantId))})
        } catch (error) {
            next(error)
        }
    })

    .get('/obtenirTotalParPompe/:id', async (req, res,next) => {
        try {
            const {id} = req.params
            return res.status(200).json({relevers : await totalReleversParPompe(parseInt(id))})
        } catch (error) {
            next(error)

        }
    })