import prisma from "../config/prisma.js"
import { ClientError, NotFoundError } from "../utils/errors/errorResponse.js"
import { prixSchema } from "../utils/validators/prixValidator.js"

export const AjouterPrix = async(carburant_id , prix) =>{
    const {error , value} = prixSchema.validate({carburant_id , prix})
    if (error) {
        throw new ClientError(error.message)
    }
    return await prisma.prix.create({
        data : {
            carburant_id : value.carburant_id,
            prix : value.prix
        }
    })
}

export const ObtenirTousLesPrix = async() => {
    return await prisma.prix.findMany(
        {
            include : {
                carburant : {
                    select : {
                        nom : true
                    }
                }
            }
        }
    )
}

export const ObtenirUnPrix = async(id) =>{
    const prix = await prisma.prix.findUnique({where : {prix_id:id},
        include : {
            carburant : {
                select : {
                    nom : true
                }
            }
        }
    })
    if(!prix) {
        throw new NotFoundError("prix not found or don't exist")
    }
    return prix
}

export const SupprimerPrix = async(id)=>{
    const prix = await prisma.prix.findUnique({where : {prix_id:id}})
    if(!prix) {
        throw new NotFoundError("prix not found or don't exist")
    }
    return await prisma.prix.delete({where : {prix_id:id}})
}

export const ModifierPrix = async(id, carburant_id, prix) =>{
    const selectedprix = await prisma.prix.findUnique({where : {prix_id:id}})
    if(!selectedprix) {
        throw new NotFoundError("prix not found or don't exist")
    }
    const {error, value} = prixSchema.validate({carburant_id , prix})
    if (error) {
        throw new ClientError(error.message)
    }
    return await prisma.prix.update({
        data : {
           carburant_id : value.carburant_id,
           prix : value.prix
        },
        where : {
            prix_id : id
        }
    })
}

export const ObtenirPrixParDate = async(date,page = 1 ,limit= 10) =>{
    const prix = await prisma.prix.findMany({
        take : limit,
        skip : (page-1)*limit,
        where : {
            Date : {
                gte: new Date(`${date}T00:00:00.000Z`),
                lt: new Date(`${date}T23:59:59.999Z`) 
            }
            
        }
        ,
        orderBy: {
            Date: 'desc'
          }
    })

    if (!prix) {
        throw new NotFoundError({message : "prix not found or don't exist"})
        
    }
    return prix
}

export const ObtenirPrixParCarburant = async (carburant_id , page = 1 , limit = 10) =>{
    const prix = await prisma.prix.findMany({
        where : {
            carburant_id : carburant_id
        },
        take : limit,
        skip : (page -1)*limit,
        orderBy: {
            Date: 'asc'
          }
    })

    if (!prix) {
        throw new NotFoundError({message : "prix not found or doesn't exist"})
        
    }
    return prix
}


export const ObtenirPrixCarburants = async () => {
    const prixCarburants = await prisma.prix.findMany({
      include: {
        carburant: {
          select: {
            nom: true
          }
        }
      },
      orderBy: {
        Date: 'asc'
      }
    });
    return prixCarburants;
  }


  export const getLatestPrice=async(carburantId) => {
    
      const latestPrice = await prisma.prix.findFirst({
        where: {
          carburant_id: carburantId,
        },
        orderBy: {
          Date: 'desc', 
        },
      });
  
      return latestPrice;
    
  }