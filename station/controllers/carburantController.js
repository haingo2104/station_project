import { Router } from "express";
import { AjouterCarburant, ModifierCarburant, ObtenirCarburant, ObtenirTousLesCarburants, SupprimerCarburant } from "../services/carburantService.js";

export default Router()

    .post('/', async(req, res , next)=>{
        try {
            const {nom} = req.body
            return res.status(201).json({carburants : await AjouterCarburant(nom)})
        } catch (error) {
            next(error)
        }

    })

    .get('/', async (req, res, next) => {
        try {
            return res.status(200).json({ carburants: await ObtenirTousLesCarburants() })
        } catch (error) {
            next(error)
        }
    })

    .get('/:id', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            return res.status(200).json({ carburant: await ObtenirCarburant(id) })
        } catch (error) {
            next(error)
            console.log(error)
        }
    })

    .patch('/:id', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            const {nom} = req.body
            return res.status(200).json({ carburant: await ModifierCarburant(id, nom) })
        } catch (error) {
            next(error)
        }
    })

    .put('/:id', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            const { nom } = req.body
            return res.status(200).json({ carburant: await ModifierCarburant(id, nom) })
        } catch (error) {
            next(error)
        }
    })

    .delete('/:id', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            return res.status(200).json({ carburant: await SupprimerCarburant(id) })
        } catch (error) {
            next(error)
        }
    })