import prisma from "../config/prisma.js"
import { FournisseurSchema } from "../utils/validators/fournisseurValidator.js"

export const AjouterFournisseur = async(nom, email, telephone) =>{
    const {error , value} = FournisseurSchema.validate({nom, email, telephone})
    if (error) {
        throw new ClientError(error.message)
    }
    return await prisma.fournisseurs.create({
        data : {
            nom : value.nom,
            email :  value.email,
            telephone :  value.telephone
        }
    })
}

export const ObtenirTousLesFournisseurs = async() => {
    return await prisma.fournisseurs.findMany()
}