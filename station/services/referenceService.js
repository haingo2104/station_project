import prisma from "../config/prisma.js"
import { ClientError, NotFoundError } from "../utils/errors/errorResponse.js"
import { referenceSchema } from "../utils/validators/referenceValidator.js"

export const AjouterReference = async(ref_value , modeDePaie_id,montant, vente_id ) =>{
    const {error , value} = referenceSchema.validate({ref_value , modeDePaie_id,montant,vente_id})
    if (error) {
        throw new ClientError(error.message)
    }
    return await prisma.references.create({
        data : {
            ref_value: value.ref_value,
            modeDePaie_id : value.modeDePaie_id,
            montant : value.montant,
            vente_id : value.vente_id,
        }
    })
}

export const obtenirTousLesReferences = async() =>{
    return await prisma.references.findMany({
       include:{
            modeDePaie : {
                select : {
                    nom : true
                }
            }
        }
    })
}

export const obtenirUnReference = async(id)=>{
    const reference = await prisma.references.findUnique({where : {reference_id : id}})

    if(!reference){
        throw new NotFoundError({message : "reference not found or don't exist"})
    }

    return reference
}

export const supprimerReference = async(id)=>{
    const reference = await prisma.references.findUnique({where : {reference_id : id}})
    if(!reference){
        console.log("test");
        throw new NotFoundError({message : "reference not found or don't exist"})
    }
   
    return await prisma.references.delete({where : {reference_id :id}})
}

export const modifierReference= async(id , ref_value , modeDePaie_id,montant,vente_id)=>{
    const reference = await prisma.references.findUnique({where : {reference_id : id}})

    if(!reference){
        throw new NotFoundError({message : "reference not found or don't exist"})
    }
    const {error , value} = referenceSchema.validate({ref_value , modeDePaie_id,montant,vente_id})
    if (error) {
        throw new ClientError(error.message)
    }
    return await prisma.references.update({
        data : {
            ref_value: value.ref_value,
            modeDePaie_id : value.modeDePaie_id,
            montant : value.montant,
            vente_id : value.vente_id,
        },
        where : {
            reference_id :id
        }
    })
}

export const ObtenirReferenceParmodeDePaie = async (modeDePaie_id , page = 1 , limit = 10) =>{
    const references = await prisma.references.findMany({
        where : {
            modeDePaie_id : modeDePaie_id
        },
        take : limit,
        skip : (page -1)*limit,
        orderBy: {
            Date: 'asc'
          }
    })

    if (!references) {
        throw new NotFoundError({message : "reference not found or don't exist"})
        
    }
    return references
}
export const ObtenirReferenceParmodeDePaieDate = async (modeDePaie_id ,date, page = 1 , limit = 10) =>{
    const references = await prisma.references.findMany({
        where : {
            modeDePaie_id : modeDePaie_id,
            date : {
                gte: new Date(`${date}T00:00:00.000Z`),
                lt: new Date(`${date}T23:59:59.999Z`) 
            }
        },
        take : limit,
        skip : (page -1)*limit,
        orderBy: {
            Date: 'asc'
          }
    })

    if (!references) {
        throw new NotFoundError({message : "reference not found or don't exist"})
        
    }
    return references
}
export const ObtenirReferencePardate = async (date , page = 1 , limit = 10) =>{
    const references = await prisma.references.findMany({
        where : {
            date : {
                gte: new Date(`${date}T00:00:00.000Z`),
                lt: new Date(`${date}T23:59:59.999Z`) 
            }
        },
        take : limit,
        skip : (page -1)*limit,
        orderBy: {
            date: 'asc'
          }
    })

    if (!references) {
        throw new NotFoundError({message : "reference not found or don't exist"})
        
    }
    return references
}
