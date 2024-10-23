import { Router } from "express";
import { ModifierRoleUtilisateur, ModifierUtilisateur, ObtenirTousLesUtilisateurs, ObtenirUnUtilisateur, SupprimerUtilisateur } from "../services/userService.js";

export default Router()


    .get('/', async (req, res, next) => {
        try {
            return res.status(200).json({ utilisateurs: await ObtenirTousLesUtilisateurs() })
        } catch (error) {
            next(error)
        }
    })

    // .get('/:id', async (req, res, next) => {
    //     try {
    //         const id = parseInt(req.params.id)
    //         return res.status(200).json({ utilisateur: await ObtenirUnUtilisateur(id) })
    //     } catch (error) {
    //         next(error)
    //         console.log(error)
    //     }
    // })

    .patch('/:id', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            const {fullname, email , password, confirmation} = req.body
            return res.status(200).json({ utilisateur: await ModifierUtilisateur(id, fullname, email , password, confirmation) })
        } catch (error) {
            next(error)
        }
    })

    .put('/:id', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            const {fullname, email , password, confirmation} = req.body
            return res.status(200).json({ utilisateur: await ModifierUtilisateur(id, fullname, email , password, confirmation) })
        } catch (error) {
            next(error)
        }
    })

    .put('/modifierRole/:id' , async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            const { role } = req.body;
            return res.status(200).json({ utilisateur: await ModifierRoleUtilisateur(id, role) })
        } catch (error) {
            next(error)
        }
    })

    .delete('/:id', async (req, res, next) => {
        try {
            const id = parseInt(req.params.id)
            return res.status(200).json({ utilisateur: await SupprimerUtilisateur(id) })
        } catch (error) {
            next(error)
        }
    })