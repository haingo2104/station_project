import { transporter } from "../config/mailer.js"
import prisma from "../config/prisma.js"
import { ClientError } from "../utils/errors/errorResponse.js";
import { CommandeSchema } from "../utils/validators/commandeValidator.js"

export const AjouterCommande = async (user_id, fournisseur_id, quantite, prix_unitaire, carburant_id) => {
    const { error, value } = CommandeSchema.validate({ user_id, fournisseur_id, quantite, prix_unitaire, carburant_id });
    if (error) {
        throw new ClientError(error.message);
    }

    try {
        const fournisseur = await prisma.fournisseurs.findUnique({
            where: { id: parseInt(value.fournisseur_id) }
        });

        if (!fournisseur) {
            throw new ClientError("Fournisseur non trouvé");
        }

        const carburant = await prisma.carburants.findUnique({
            where: { carburant_id: parseInt(value.carburant_id) }
        });

        const utilisateur = await prisma.users.findUnique({ where: { user_id: user_id } });

        if (!utilisateur) {
            throw new ClientError('Utilisateur non trouvé');
        }

        const nouvelleCommande = await prisma.commandesCarburant.create({
            data: {
                user_id: value.user_id,
                quantite: value.quantite,
                prix_unitaire : value.prix_unitaire,
                fournisseur_id: value.fournisseur_id,
                carburant_id: value.carburant_id,
            },
        });

        const mailOptions = {
            from: utilisateur.email,
            to: fournisseur.email,
            subject: `Nouvelle commande de carburant ${carburant.nom}`,
            text: `Une commande de ${value.quantite} litres a été passée pour ${fournisseur.nom} par l'utilisateur ${value.user_id}.`
        };
        await transporter.sendMail(mailOptions);
        console.log('Email envoyé avec succès');

        return nouvelleCommande;
    } catch (error) {

    }
}

export const ObtenirTousLesCommandes = async () => {
    return await prisma.commandesCarburant.findMany({
        include : {
            Fournisseurs: {
                select: {
                    nom: true
                }
            },
            Carburants: {
                select: {
                    nom: true
                }
            }
        }
    })
}