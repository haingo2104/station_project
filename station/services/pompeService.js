import prisma from "../config/prisma.js"
import { ClientError, NotFoundError } from "../utils/errors/errorResponse.js"
import { pompeSchema } from "../utils/validators/pompeValidator.js"

export const AjouterPompe = async() =>{
    return await prisma.pompe.create({})
}

export const ObtenirTousLesPompes = async() => {
    return await prisma.pompe.findMany({
        include : {tuyaux : {
            include : {
                carburant : {
                    select : {
                        nom : true
                    }
                }
            }
        }} 
    })
}

export const ObtenirPompe = async(id) =>{
    const pompe = await prisma.pompe.findUnique({
        where : {pompe_id:id}
    
    })
    if(!pompe) {
        throw new NotFoundError("pompe not found or don't exist")
    }
    return pompe
}

export const SupprimerPompe = async(id)=>{
    const pompe = await prisma.pompe.findUnique({where : {pompe_id:id}})
    if(!pompe) {
        throw new NotFoundError("pompe not found or don't exist")
    }
    return await prisma.pompe.delete({where : {pompe_id:id}})
}

