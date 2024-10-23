import prisma from "../config/prisma.js"
import { ClientError, NotFoundError } from "../utils/errors/errorResponse.js"
import { venteSchema } from "../utils/validators/venteValidator.js"

export const AjouterVente = async (pompe_id, pompiste_id, modeDePaie_id, total) => {
    const { error, value } = venteSchema.validate({ pompe_id, pompiste_id, modeDePaie_id, total })
    if (error) {
        throw new ClientError(error.message)
    }
    return await prisma.vente.create({
        data: {
            pompe_id: value.pompe_id,
            pompiste_id: value.pompiste_id,
            modeDePaie_id: value.modeDePaie_id,
            total: value.total
        }
    })
}

export const obtenirTousLesVentes = async () => {
    return await prisma.vente.findMany({

        include: {
            pompiste: {
                select: {
                    nom: true
                }
            },
            modeDePaie: {
                select: {
                    nom: true
                }
            }
        }


    })
}

// export const obtenirUnVente = async(id)=>{
//     const vente = await prisma.vente.findUnique({where : {vente_id : id}})

//     if(!vente){
//         throw new NotFoundError({message : "vente not found or don't exist"})
//     }

//     return vente
// }



// export const modifierVente= async(id , pompe_id , pompiste_id,modeDePaie_id , total)=>{
//     const vente = await prisma.vente.findUnique({where : {vente_id : id}})

//     if(!vente){
//         throw new NotFoundError({message : "vente not found or don't exist"})
//     }
//     const {error , value} = venteSchema.validate({pompe_id , pompiste_id,modeDePaie_id , total})
//     if (error) {
//         throw new ClientError(error.message)
//     }
//     return await prisma.vente.update({
//         data : {
//             pompe_id: value.pompe_id,
//             pompiste_id : value.pompiste_id,
//             modeDePaie_id : value.modeDePaie_id,
//             total : value.total
//         },
//         where : {
//             vente_id :id
//         }
//     })
// }

export const ObtenirVentesParDate = async (date) => {
    const ventes = await prisma.vente.findMany({

        where: {
            date: {
                gte: new Date(`${date}T00:00:00.000Z`),
                lt: new Date(`${date}T23:59:59.999Z`)
            }

        }
        ,
        include: {
            pompiste: {
                select: {
                    nom: true
                }
            },
            modeDePaie: {
                select: {
                    nom: true
                }
            }
        },
        orderBy: {
            date: 'desc'
        }
    })
    return ventes
}

//     if (!ventes) {
//         throw new NotFoundError({message : "vente not found or don't exist"})

//     }
//     return ventes
// }

export const ObtenirVentesPlusAncien = async () => {
    const ventes = await prisma.vente.findMany({
        include: {
            pompiste: {
                select: {
                    nom: true
                }
            },
            modeDePaie: {
                select: {
                    nom: true
                }
            }
        },
        orderBy: {
            date: 'asc'
        }
    })

    if (!ventes) {
        throw new NotFoundError({ message: "vente not found or don't exist" })

    }
    return ventes
}

export const ObtenirVentesPlusRecent = async () => {

    const ventes = await prisma.vente.findMany({
        include: {
            pompiste: {
                select: {
                    nom: true
                }
            },
            modeDePaie: {
                select: {
                    nom: true
                }
            }
        },
        orderBy: {
            date: 'desc'
        }

    });

    return ventes

}

export const ObtenirVentesParPompiste = async (pompiste_id) => {
    const ventes = await prisma.vente.findMany({

        where: {
            pompiste_id: pompiste_id
        }
        ,
        include: {
            pompiste: {
                select: {
                    nom: true
                }
            },
            modeDePaie: {
                select: {
                    nom: true
                }
            },
            pompe: {
                select: {
                    pompe_id: true
                }
            }
        },
        orderBy: {
            date: 'asc'
        }
    })

    if (!ventes) {
        throw new NotFoundError({ message: "vente not found or don't exist" })

    }
    return ventes
}

export const ObtenirVentesParPompeParDate = async (pompe_id, date) => {
    const ventes = await prisma.vente.findMany({

        where: {
            pompe_id: pompe_id,
            date: {
                gte: new Date(`${date}T00:00:00.000Z`),
                lt: new Date(`${date}T23:59:59.999Z`)
            }

        }
        ,
        include: {
            pompiste: {
                select: {
                    nom: true
                }
            },
            modeDePaie: {
                select: {
                    nom: true
                }
            }
        },
        orderBy: {
            date: 'desc'
        }
    })
    return ventes
}

export const ObtenirTotalVentesJour = async (date) => {
  
    const dateDebut = new Date(`${date}T00:00:00.000Z`);
    const dateFin = new Date(`${date}T23:59:59.999Z`);

    const ventes = await prisma.vente.findMany({
        where: {
            date: {
                gte: dateDebut,
                lt: dateFin
            }
        },
        include: {
            modeDePaie: {
                select: {
                    nom: true
                }
            }
        }
    });

    console.log("vente" , ventes);
    

    const totauxParMode = ventes.reduce((acc, vente) => {
        const mode = vente.modeDePaie.nom;
        if (!acc[mode]) {
            acc[mode] = 0;
        }
        acc[mode] += vente.total;
        return acc;
    }, {});

    const totalGlobal = ventes.reduce((acc, vente) => acc + vente.total, 0);

    return { totauxParMode, totalGlobal };
}

export const ObtenirVenteParMois = async() =>{
    const ventes = await prisma.vente.findMany({
        where: {
            date: {
                gte: new Date('2024-01-01'),
                lte: new Date('2024-12-31'),
            }
        }
    });

    return ventes
}

const today = new Date();
today.setHours(0, 0, 0, 0);

export const totalVentesParPompe = async (pompe_id) => {
    const ventes = await prisma.vente.findMany({
        where: {
            pompe_id: pompe_id,
            date: {
                gte: today
            }
        }
    })

    const totalGlobal = ventes.reduce((acc, vente) => acc + vente.total, 0);

    return totalGlobal
}


const calculateBenefitsByCarburant = (relevers) => {
    const benefitsByCarburant = {};

    relevers.forEach(relever => {
        const lastPrixObject = relever.carburant.prix[relever.carburant.prix.length - 1];
        const lastPrix = lastPrixObject.prix; 
        const carburantNom = relever.carburant.nom;

        const quantiteVendue = relever.quantiteAvant - relever.quantiteApres;
        const lastCommande = relever.carburant.commandes[relever.carburant.commandes.length - 1];
        const prixUnitaireAchat = lastCommande.prix_unitaire;

        const totalVente = quantiteVendue * lastPrix
        const coutTotal = quantiteVendue * prixUnitaireAchat
        const netBenefit = totalVente - coutTotal 

        if (!benefitsByCarburant[carburantNom]) {
            benefitsByCarburant[carburantNom] = {
                quantiteVendue: 0,
                totalVente: 0,
                coutTotal: 0,
                netBenefit: 0
            };
        }

        benefitsByCarburant[carburantNom].quantiteVendue += quantiteVendue;
        benefitsByCarburant[carburantNom].totalVente += totalVente;
        benefitsByCarburant[carburantNom].coutTotal += coutTotal;
        benefitsByCarburant[carburantNom].netBenefit += netBenefit;
    });

    return benefitsByCarburant;
};

export const getBenefitsByCarburant = async () => {
    try {
        // Récupérer tous les relevés avec les commandes et les détails de prix associés depuis la base de données
        const relevers = await prisma.relever.findMany({
            include: {
                carburant: {
                    include: {
                        commandes: true, // Inclure les commandes
                        prix: true // Inclure seulement les prix, sans détails
                    }
                }
            }
        });

        return calculateBenefitsByCarburant(relevers);
    } catch (error) {
        console.error('Error fetching data from database:', error);
        throw error;
    } finally {
        // Fermer la connexion Prisma
        await prisma.$disconnect();
    }
};
