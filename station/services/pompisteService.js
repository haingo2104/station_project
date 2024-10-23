import prisma from "../config/prisma.js"
import { ClientError, NotFoundError } from "../utils/errors/errorResponse.js"
import { pompisteSchema } from "../utils/validators/pompisteValidator.js"

export const AjouterPompiste = async(nom ,  salaire) =>{
    const {error , value} = pompisteSchema.validate({nom , salaire})
    if (error) {
        throw new ClientError(error.message)
    }
    return await prisma.pompiste.create({
        data : {
            nom : value.nom,
            salaire : value.salaire
        }
    })
}

export const ObtenirTousLesPompistes = async() => {
    return await prisma.pompiste.findMany()
}

export const ObtenirPompiste = async(id) =>{
    const pompiste = await prisma.pompiste.findUnique({where : {pompiste_id:id}})
    if(!pompiste) {
        throw new NotFoundError("pompiste not found or don't exist")
    }
    return pompiste
}

export const SupprimerPompiste = async(id)=>{
    const pompiste = await prisma.pompiste.findUnique({where : {pompiste_id:id}})
    if(!pompiste) {
        throw new NotFoundError("pompiste not found or don't exist")
    }
    return await prisma.pompiste.delete({where : {pompiste_id:id}})
}

export const ModifierPompiste = async(id, nom , salaire) =>{
    const pompiste = await prisma.pompiste.findUnique({where : {pompiste_id:id}})
    if(!pompiste) {
        throw new NotFoundError("pompiste not found or don't exist")
    }
    const {error, value} = pompisteSchema.validate({nom , salaire})
    if (error) {
        throw new ClientError(error.message)
    }
    return await prisma.pompiste.update({
        data : {
           nom : value.nom,
           salaire : value.salaire
        },
        where : {
            pompiste_id : id
        }
    })
}


export const ObtenirPerformancesPompistes = async () => {
    const performances = await prisma.vente.groupBy({
        by: ['pompiste_id'],
        _sum: {
            total: true,
        },
        orderBy: {
            pompiste_id: 'asc',
        },
    });

    return performances;
};