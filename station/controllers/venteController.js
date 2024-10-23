import { Router } from "express";
import { AjouterVente,  getBenefitsByCarburant,  ObtenirTotalVentesJour,  obtenirTousLesVentes, ObtenirVenteParMois, ObtenirVentesParDate, ObtenirVentesParPompeParDate, ObtenirVentesParPompiste, ObtenirVentesPlusAncien, ObtenirVentesPlusRecent, totalVentesParPompe } from "../services/venteService.js";

export default Router()
    .post('/' , async(req, res , next)=>{
        try {
            const {pompe_id , pompiste_id,modeDePaie_id , total} = req.body
            return res.status(201).json({vente : await AjouterVente(pompe_id , pompiste_id,modeDePaie_id , total)})
        } catch (error) {
            next(error)
        }
    })
    .get('/' , async(req,res , next)=>{
        try {
            return res.status(200).json({ventes : await obtenirTousLesVentes()})
        } catch (error) {
            next(error)
        }
    })


    .get('/obtenirVentesParDate/', async (req, res,next) => {
        try {
            
            const { date } = req.query;
            return res.status(200).json({ventes : await ObtenirVentesParDate(date)})
        } catch (error) {
            next(error)

        }
    })

    .get('/obtenirVentesParMois/', async (req, res,next) => {
        try {
            return res.status(200).json({ventes : await ObtenirVenteParMois()})
        } catch (error) {
            next(error)

        }
    })

    .get('/ObtenirTotalVentesJour/', async (req, res,next) => {
        try {
            
            const { date } = req.query;
            return res.status(200).json({ventes : await ObtenirTotalVentesJour(date)})
        } catch (error) {
            next(error)

        }
    })
    .get('/totalVenteParPompe/:id', async (req, res,next) => {
        try {
            
            const id = parseInt(req.params.id)
            return res.status(200).json({ventes : await totalVentesParPompe(id)})
        } catch (error) {
            next(error)

        }
    })
    .get('/obtenirVentesParPompiste', async (req, res,next) => {
        try {
            const {pompiste_id} = req.query
            return res.status(200).json({ventes : await ObtenirVentesParPompiste(parseInt(pompiste_id))})
        } catch (error) {
            next(error)

        }

    })
    .get('/obtenirVentesParPompeParDate', async (req, res,next) => {
        try {
            const {pompe_id , date} = req.query
            return res.status(200).json({ventes : await ObtenirVentesParPompeParDate(parseInt(pompe_id),date)})
        } catch (error) {
            next(error)

        }
    })
    .get('/plusAncien', async (req, res, next) => {
        try {
            return res.status(200).json({ventes : await ObtenirVentesPlusAncien()})

        } catch (error) {
            next(error)
        }
    })

    .get('/plusRecent', async (req, res, next) => {

        try {
            return res.status(200).json({ventes : await ObtenirVentesPlusRecent()})
        } catch (error) {
            next(error)
        }
    })

    // .get('/dailyBenefits', async (req, res, next) => {
    //     try {
    //         const { date } = req.query;
    //         const dailyBenefits = await benefits(date);
    //         res.status(200).json({ benefits: dailyBenefits });
    //     } catch (error) {
    //         next(error);
    //     }
    // });

    .get('/benefits', async (req, res , next) => {
        try {
 
            return res.status(200).json({benefits : await getBenefitsByCarburant()})

        } catch (error) {
            next(error);
            // res.status(500).json({ message: 'Error calculating benefits', error: error.message });
        }
    });

    // .patch('/:id', async (req, res, next) => {
    //     try {
    //         const id = parseInt(req.params.id)
    //         const {pompe_id , pompiste_id,modeDePaie_id , total} = req.body
    //         return res.status(200).json({ vente: await modifierVente(id, pompe_id , pompiste_id,modeDePaie_id , total) })

    //     } catch (error) {
    //         next(error)
    //     }
    // })

    // .put('/:id', async (req, res, next) => {
    //     try {
    //         const id = parseInt(req.params.id)
    //         const {pompe_id , pompiste_id,modeDePaie_id , total} = req.body
    //         return res.status(200).json({ vente: await modifierVente(id, pompe_id , pompiste_id,modeDePaie_id , total) })

    //     } catch (error) {
    //         next(error)
    //     }
    // })

    // .delete('/:id', async (req, res, next) => {
    //     try {
    //         const id = parseInt(req.params.id)
    //         return res.status(200).json({ vente: await supprimerVente(id) })
    //     } catch (error) {
    //         next(error)
    //     }
    // })
    
    