import prisma from "../config/prisma.js"
import { ClientError, NotFoundError } from "../utils/errors/errorResponse.js"
import { stockSchema } from "../utils/validators/stockValidator.js"

export const AjouterStock = async(carburant_id , quantite) =>{
    const {error , value} = stockSchema.validate({carburant_id , quantite})
    if (error) {
        throw new ClientError(error.message)
    }
    return await prisma.stock.create({
        data : {
            carburant_id : value.carburant_id,
            quantite : value.quantite
        }
    })
}

export const ObtenirTousLesStocks = async() => {
    return await prisma.stock.findMany({
        include : {
            carburant : {
                select : {
                    nom : true
                }
            }
        }
    })
}

export const ObtenirStock = async(id) =>{
    const stock = await prisma.stock.findUnique({where : {stock_id:id}})
    if(!stock) {
        throw new NotFoundError("stock not found or don't exist")
    }
    return stock
}

export const SupprimerStock = async(id)=>{
    const stock = await prisma.stock.findUnique({where : {stock_id:id}})
    if(!stock) {
        throw new NotFoundError("stock not found or don't exist")
    }
    return await prisma.stock.delete({where : {stock_id:id}})
}

export const ModifierStock = async(id, carburant_id, quantite) =>{
    const stock = await prisma.stock.findUnique({where : {stock_id:id}})
    if(!stock) {
        throw new NotFoundError("stock not found or don't exist")
    }
    const {error, value} = stockSchema.validate({carburant_id , quantite})
    if (error) {
        throw new ClientError(error.message)
    }
    return await prisma.stock.update({
        data : {
           carburant_id : value.carburant_id,
           quantite : value.quantite
        },
        where : {
            stock_id : id
        }
    })
}

export const ObtenirStocksParDate = async(date) =>{
    const stocks = await prisma.stock.findMany({
        include : {
            carburant : {
                select : {
                    nom : true
                }
            }
        },
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

    if (!stocks) {
        throw new NotFoundError({message : "stocks not found or doesn't exist"})
        
    }
    return stocks
}

export const ObtenirStocksPlusAncien = async() =>{
    const stocks = await prisma.stock.findMany({
        include : {
            carburant : {
                select : {
                    nom : true
                }
            }
        },
        orderBy: {
            Date: 'asc'
          }
    })

    if (!stocks) {
        throw new NotFoundError({message : "stock not found or don't exist"})
        
    }
    return stocks
}

export const ObtenirStocksPlusRecent = async() =>{
    const stocks = await prisma.stock.findMany({
        include : {
            carburant : {
                select : {
                    nom : true
                }
            }
        },
        orderBy: {
            Date: 'desc'
          }
    })

    if (!stocks) {
        throw new NotFoundError({message : "stock not found or don't exist"})
        
    }
    return stocks
}



export const ObtenirStocksParCarburant = async(carburant_id) =>{
    const stocks = await prisma.stock.findMany({

        where : {
            carburant_id : carburant_id
        }
        ,
        include : {
            carburant : {
                select : {
                    nom : true
                }
            }
        },
        orderBy: {
            Date: 'asc'
          }
    })

    if (!stocks) {
        throw new NotFoundError({message : "stocks not found or don't exist"})

    }
    return stocks
}
export const ObtenirStocksParCarburantParDate = async(carburant_id , date) =>{
    const stocks = await prisma.stock.findMany({

        where : {
            carburant_id : carburant_id,
            Date: {
                gte: new Date(`${date}T00:00:00.000Z`),
                lt: new Date(`${date}T23:59:59.999Z`)
            }
        }
        ,
        include : {
            carburant : {
                select : {
                    nom : true
                }
            }
        },
        orderBy: {
            Date: 'asc'
          }
    })

    if (!stocks) {
        throw new NotFoundError({message : "stocks not found or don't exist"})

    }
    return stocks
}

export const afficherStock = async() =>{
    const relevers = await prisma.relever.findMany({
        distinct: ['pompe_id', 'carburant_id'],
        orderBy: {
          date: 'desc',
        },
        select: {
          pompe_id: true,
          carburant : {
            select : {
                nom : true
            }
          },
          quantiteApres: true,
        },
      });

      return relevers
}