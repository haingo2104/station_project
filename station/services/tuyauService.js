import prisma from "../config/prisma.js"
import { ClientError, NotFoundError } from "../utils/errors/errorResponse.js"
import { tuyauSchema } from "../utils/validators/tuyauValidator.js"

export const AjouterTuyaux = async(carburant_id , pompe_id) =>{
    const {error , value} = tuyauSchema.validate({carburant_id , pompe_id})
    if (error) {
        throw new ClientError(error.message)
    }
    return await prisma.tuyaux.create({
        data : {
            carburant_id : value.carburant_id,
            pompe_id : value.pompe_id
        }
    })
}

export const ObtenirTousLestuyaux = async() => {
    return await prisma.tuyaux.findMany({
        include : {
            carburant : {
                select : {
                    nom : true
                }
            }
        }
    } )
}

export const Obtenirtuyau = async(id) =>{
    const tuyau = await prisma.tuyaux.findUnique({
        where : {tuyau_id:id},
        include : {
            carburant : {
                select : {
                    nom : true
                }
            }
        }
    })
    if(!tuyau) {
        throw new NotFoundError("tuyau not found or don't exist")
    }
    return tuyau
}

export const SupprimerTuyaux = async(id)=>{
    const tuyau = await prisma.tuyaux.findUnique({where : {tuyau_id:id}})
    if(!tuyau) {
        throw new NotFoundError("tuyau not found or don't exist")
    }
    return await prisma.tuyaux.delete({where : {tuyau_id:id}})
}

export const ModifierTuyau = async(id, carburant_id, pompe_id) =>{
    const tuyau = await prisma.tuyaux.findUnique({where : {tuyau_id:id}})
    if(!tuyau) {
        throw new NotFoundError("tuyau not found or don't exist")
    }
    const {error, value} = tuyauSchema.validate({carburant_id , pompe_id})
    if (error) {
        throw new ClientError(error.message)
    }
    return await prisma.tuyaux.update({
        data : {
           carburant_id : value.carburant_id,
           pompe_id : value.pompe_id
        },
        where : {
            tuyau_id : id
        }
    })
}