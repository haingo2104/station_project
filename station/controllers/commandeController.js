import { Router } from "express";
import { AjouterCommande, ObtenirTousLesCommandes } from "../services/commandeService.js";

export default Router()

    .post('/', async (req, res, next) => {
        try {
            console.log('Données reçues dans req.body:', req.body);
            
            const { user_id, fournisseur_id, quantite,prix_unitaire, carburant_id } = req.body;

            if (!user_id || !fournisseur_id || !quantite || !prix_unitaire || !carburant_id) {
                return res.status(400).json({
                    error: "Tous les champs doivent être fournis."
                });
            }

            // Convertissez les valeurs en entiers et appelez la fonction AjouterCommande
            const nouvelleCommande = await AjouterCommande(
                parseInt(user_id, 10),
                parseInt(fournisseur_id, 10),
                parseInt(quantite, 10),
                parseInt(prix_unitaire, 10),
                parseInt(carburant_id, 10)
            );

            return res.status(201).json({
                message: "Commande enregistrée avec succès",
                commande: nouvelleCommande,
            });

        } catch (error) {
            console.error("Erreur lors de l'ajout de la commande:", error.message);
            next(error);
        }

    })
    .get('/' , async(req, res, next)=>{
        try {
            return res.status(200).json({ commandes: await ObtenirTousLesCommandes() })
        } catch (error) {
            next(error)
        }
    })