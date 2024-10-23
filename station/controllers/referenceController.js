import { Router } from "express";
import { AjouterReference, modifierReference, ObtenirReferencePardate, ObtenirReferenceParmodeDePaie, ObtenirReferenceParmodeDePaieDate, obtenirTousLesReferences, obtenirUnReference, supprimerReference } from "../services/referenceService.js";

export default Router()
    .post('/' , async(req, res , next)=>{
        try {
            const {ref_value , modeDePaie_id,montant, vente_id} = req.body
            return res.status(201).json({reference : await AjouterReference(ref_value , modeDePaie_id,montant,vente_id)})
        } catch (error) {
            next(error)
        }
    })
    .get('/' , async(req,res , next)=>{
        try {
//            const {page, limit} = req.params
            return res.status(200).json({references : await obtenirTousLesReferences()})
        } catch (error) {
            next(error)
        }
    })

    .get('/:id', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            return res.status(200).json({ reference: await obtenirUnReference(id) })
        } catch (error) {
            next(error)
        }
    })
    .post('/obtenirReferencesParDate/:page/:limit', async (req, res,next) => {
        try {
            const {page, limit } = req.params;
            const {date} = req.body
            return res.status(200).json({references : await ObtenirReferencePardate(date ,parseInt(page), parseInt(limit))})
        } catch (error) {
            next(error)

        }
    })
    .post('/obtenirReferencesParModePaie/:page/:limit', async (req, res,next) => {
        try {
            const {page, limit } = req.params;
            const {modeDePaie_id} = req.body
            return res.status(200).json({references : await ObtenirReferenceParmodeDePaie(parseInt(modeDePaie_id) ,parseInt(page), parseInt(limit))})
        } catch (error) {
            next(error)

        }
    })
    .post('/obtenirReferencesParModePaieDate/:page/:limit', async (req, res,next) => {
        try {
            const {page, limit } = req.params;
            const {modeDePaie_id , date} = req.body
            return res.status(200).json({references : await ObtenirReferenceParmodeDePaieDate(parseInt(modeDePaie_id),date ,parseInt(page), parseInt(limit))})
        } catch (error) {
            next(error)

        }
    })
    .patch('/:id', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            const {ref_value , modeDePaie_id,vente_id} = req.body
            return res.status(200).json({ reference: await modifierReference(id, ref_value , modeDePaie_id,vente_id) })

        } catch (error) {
            next(error)
        }
    })

    .put('/:id', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            const {ref_value , modeDePaie_id,montant,vente_id} = req.body
            return res.status(200).json({ reference: await modifierReference(id, ref_value , modeDePaie_id,montant,vente_id) })

        } catch (error) {
            next(error)
        }
    })

    .delete('/:id', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            return res.status(200).json({ reference: await supprimerReference(id) })
        } catch (error) {
            next(error)
        }
    })
