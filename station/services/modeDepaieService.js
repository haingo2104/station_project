import prisma from "../config/prisma.js"
import { ClientError, NotFoundError } from "../utils/errors/errorResponse.js"
import { modeDePaieSchema } from "../utils/validators/modeDePaieValidator.js"

export const AjouterModeDePaie = async(nom) =>{
    const {error , value} = modeDePaieSchema.validate({nom})
    if (error) {
        throw new ClientError(error.message)
    }
    return await prisma.modeDePaie.create({
        data : {
            nom : value.nom
        }
    })
}

export const ObtenirTousLesModeDePaies = async() => {
    const data =  await prisma.modeDePaie.findMany()
    return data
    // return [
    //     data.find(v => v.nom === "espece"),
    //     ...data.filter(v => v.nom != "espece")
    // ]
}

export const ObtenirModeDePaie = async(id) =>{
    const modeDePaie = await prisma.modeDePaie.findUnique({where : {modeDePaie_id:id}})
    if(!modeDePaie) {
        throw new NotFoundError("mode de paiement not found or don't exist")
    }
    return modeDePaie
}

export const SupprimerModeDePaie = async(id)=>{
    const modeDePaie = await prisma.modeDePaie.findUnique({where : {modeDePaie_id:id}})
    if(!modeDePaie) {
        throw new NotFoundError("mode de paiement not found or don't exist")
    }
    return await prisma.modeDePaie.delete({where : {modeDePaie_id:id}})
}

export const ModifierModeDePaie = async(id, nom) =>{
    const modeDePaie = await prisma.modeDePaie.findUnique({where : {modeDePaie_id:id}})
    if(!modeDePaie) {
        throw new NotFoundError("mode de paiement not found or don't exist")
    }
    const {error, value} = modeDePaieSchema.validate({nom})
    if (error) {
        throw new ClientError(error.message)
    }
    return await prisma.modeDePaie.update({
        data : {
           nom : value.nom
        },
        where : {
            modeDePaie_id : id
        }
    })
}