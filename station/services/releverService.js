import prisma from "../config/prisma.js"
import { ClientError, NotFoundError } from "../utils/errors/errorResponse.js"
import { releverSchema } from "../utils/validators/releverValidator.js"

export const AjouterRelever = async(quantiteAvant , quantiteApres,carburant_id , pompe_id) =>{
    const {error , value} = releverSchema.validate({quantiteAvant , quantiteApres,carburant_id , pompe_id})
    if (error) {
        throw new ClientError(error.message)
    }
    if (value.quantiteApres >= value.quantiteAvant) {
        throw new ClientError('La quantité après doit être inférieure à la quantité avant.');
    }

    // Calcul de la quantité utilisée
    const quantiteVendue = value.quantiteAvant - value.quantiteApres;

    const relever = await prisma.relever.create({
        data : {
            quantiteAvant: value.quantiteAvant,
            quantiteApres : value.quantiteApres,
            carburant_id : value.carburant_id,
            pompe_id : value.pompe_id
        }
    })

    const updatedStock = await prisma.stock.updateMany({
        where: {
            carburant_id: value.carburant_id,
        },
        data: {
            quantite: {
                decrement: quantiteVendue, // Décrémente la quantité en stock
            },
        },
    });

    return { relever, updatedStock };
}

export const obtenirTousLesRelevers = async() =>{
    return await prisma.relever.findMany({
        include : {
            carburant : {
                select : {
                    nom : true
                }
            },
            pompe : {
                select : {
                    pompe_id : true
                }
            }
        }
    })
}

export const obtenirUnRelever = async(id)=>{
    const relever = await prisma.relever.findUnique({where : {relever_id : id}})

    if(!relever){
        throw new NotFoundError({message : "relever not found or don't exist"})
    }

    return relever
}

export const supprimerRelever = async(id)=>{
    const relever = await prisma.relever.findUnique({where : {relever_id : id}})

    if(!relever){
        throw new NotFoundError({message : "relever not found or don't exist"})
    }
    return await prisma.relever.delete({where : {relever_id :id}})
}

export const modifierRelever= async(id , quantiteAvant , quantiteApres,carburant_id , pompe_id)=>{
    const relever = await prisma.relever.findUnique({where : {relever_id : id}})

    if(!relever){
        throw new NotFoundError({message : "relever not found or don't exist"})
    }
    const {error , value} = releverSchema.validate({quantiteAvant , quantiteApres,carburant_id , pompe_id})
    if (error) {
        throw new ClientError(error.message)
    }
    return await prisma.relever.update({
        data : {
            quantiteAvant: value.quantiteAvant,
            quantiteApres : value.quantiteApres,
            carburant_id : value.carburant_id,
            pompe_id : value.pompe_id
        },
        where : {
            relever_id :id
        }
    })
}

export const ObtenirReleverParDate = async(date) =>{
    const relevers = await prisma.relever.findMany({
        
        where : {
            date : {
                gte: new Date(`${date}T00:00:00.000Z`),
                lt: new Date(`${date}T23:59:59.999Z`) 
            }
            
        }
        ,
        include: {
            carburant : {
                select : {
                    nom : true
                }
            },
            pompe : {
                select : {
                    pompe_id : true
                }
            }
        },
        orderBy: {
            date: 'desc'
          }
    })

    if (!relevers) {
        throw new NotFoundError({message : "relevers not found or doesn't exist"})
        
    }
    return relevers
}

export const ObtenirReleverParPompe = async (pompe_id) =>{
    const relevers = await prisma.relever.findMany({
        where : {
            pompe_id : pompe_id
        },
        include: {
            carburant : {
                select : {
                    nom : true
                }
            },
            pompe : {
                select : {
                    pompe_id : true
                }
            }
        },
        orderBy: {
            date: 'asc'
          }
    })

    if (!relevers) {
        throw new NotFoundError({message : "relevers not found or doesn't exist"})
        
    }
    return relevers
}

export const ObtenirReleverParPompeParDate = async (pompe_id, date) => {
    const relevers = await prisma.relever.findMany({

        where: {
            pompe_id: pompe_id,
            date: {
                gte: new Date(`${date}T00:00:00.000Z`),
                lt: new Date(`${date}T23:59:59.999Z`)
            }

        }
        ,
        include: {
            carburant : {
                select : {
                    nom : true
                }
            },
            pompe : {
                select : {
                    pompe_id : true
                }
            }
        },
        orderBy: {
            date: 'desc'
        }
    })
    return relevers
}

export const ObtenirCarburantParPompe = async(pompe_id) =>{
    const carburants = await prisma.carburants.findMany({
        where: {
            tuyaux: {
                some: {
                    pompe_id: pompe_id
                }
            }
        }
    });

    if(carburants.length > 0){

        return carburants
    }else{
      return []
    }


}

export const obtenirDernierQuantite = async (pompe_id,carburant_id) => {
   
        const dernierRelever = await prisma.relever.findFirst({
            where: {
                carburant_id,
                pompe_id,
            },
            orderBy: {
                date: 'desc',
            },
        });

        if (!dernierRelever) {
            return null;
        }

        
        return dernierRelever.quantiteApres;
    
};

const today = new Date();
today.setHours(0, 0, 0, 0);
const getLatestPrice = async (carburantId) => {
    const latestPrice = await prisma.prix.findFirst({
      where: { carburant_id: carburantId },
      orderBy: { Date: 'desc' },
    });
    return latestPrice ? latestPrice.prix : null;
  };

export const totalReleversParPompe = async(pompe_id)=>{
    const relevers = await prisma.relever.findMany({
        where: {
            pompe_id: pompe_id,
            date: {
              gte: today,
            },
          },
          orderBy: {
            date: 'desc',
          },
          include: { carburant: true }


    });

    let totalReleves = 0;

    for (const relever of relevers) {
        const dernierPrix = await getLatestPrice(relever.carburant_id);
        if (dernierPrix) {
            totalReleves += dernierPrix * (relever.quantiteAvant - relever.quantiteApres);
        }
    }

    return totalReleves
}