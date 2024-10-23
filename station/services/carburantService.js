import prisma from "../config/prisma.js"
import { ClientError, NotFoundError } from "../utils/errors/errorResponse.js"
import { carburantSchema } from "../utils/validators/carburantValidator.js"

export const AjouterCarburant = async(nom) =>{
    const {error , value} = carburantSchema.validate({nom})
    if (error) {
        throw new ClientError(error.message)
    }
    return await prisma.carburants.create({
        data : {
            nom : value.nom
        }
    })
}

export const ObtenirTousLesCarburants = async() => {
    return await prisma.carburants.findMany({
        include : {prix : true}
    })
}

export const ObtenirCarburant = async(id) =>{
    const carburant = await prisma.carburants.findUnique({where : {carburant_id:id},include : {prix : true}})
    if(!carburant) {
        throw new NotFoundError("carburant not found or don't exist")
    }
    return carburant
}

export const SupprimerCarburant = async(id)=>{
    const carburant = await prisma.carburants.findUnique({where : {carburant_id:id}})
    if(!carburant) {
        throw new NotFoundError("carburant not found or don't exist")
    }
    return await prisma.carburants.delete({where : {carburant_id:id}})
}

export const ModifierCarburant = async(id, nom) =>{
    const carburant = await prisma.carburants.findUnique({where : {carburant_id:id}})
    if(!carburant) {
        throw new NotFoundError("carburant not found or don't exist")
    }
    const {error, value} = carburantSchema.validate({nom})
    if (error) {
        throw new ClientError(error.message)
    }
    return await prisma.carburants.update({
        data : {
           nom : value.nom
        },
        where : {
            carburant_id : id
        }
    })
}