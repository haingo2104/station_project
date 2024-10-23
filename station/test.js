import prisma from "./config/prisma.js";
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
export const getDashboardMetrics = async () => {
    // Récupération des commandes, stocks, et ventes avec Prisma
    const commandes = await prisma.commandesCarburant.findMany({
        include: {
            Carburants: true,
            Fournisseurs: true
        }
    });

    const stocks = await prisma.stock.findMany({
        include: {
            carburant: true
        }
    });

    const ventes = await prisma.vente.findMany({
        include: {
            pompe: true,
            modeDePaie: true,
            pompiste: true
        }
    });

    // Calcul des métriques du tableau de bord
    const metrics = calculateMetrics(commandes, stocks, ventes);
    return metrics;
};

const calculateMetrics = (commandes, stocks, ventes) => {
    const dashboardMetrics = {
        commandes: [],
        livraisons: [],
        ventesParModeDePaie: {}, // Initialiser ventesParModeDePaie
        totalGlobalVentes: 0
    };

    commandes.forEach(commande => {
        const totalCommande = commande.quantite * commande.prix_unitaire;
        dashboardMetrics.commandes.push({
            carburantNom: commande.Carburants.nom,
            quantite: commande.quantite,
            prixUnitaire: commande.prix_unitaire,
            totalCommande,
            fournisseurNom: commande.Fournisseurs.nom,
            date: formatDate(commande.date_commande) // Formater la date
        });
    });

    stocks.forEach(stock => {
        dashboardMetrics.livraisons.push({
            carburantNom: stock.carburant.nom,
            quantite: stock.quantite,
            date: formatDate(stock.Date) // Formater la date
        });
    });

    ventes.forEach(vente => {
        const modeDePaiement = vente.modeDePaie.nom;
        const totalVente = vente.total;

        // Vérifier si ce mode de paiement existe déjà dans ventesParModeDePaie
        if (!dashboardMetrics.ventesParModeDePaie[modeDePaiement]) {
            dashboardMetrics.ventesParModeDePaie[modeDePaiement] = {
                totalVentes: 0,
                ventes: []
            };
        }

        // Ajouter la vente au mode de paiement correspondant
        dashboardMetrics.ventesParModeDePaie[modeDePaiement].ventes.push({
            totalVente,
            date: formatDate(vente.date) // Formater la date
        });

        // Additionner le total des ventes pour ce mode de paiement
        dashboardMetrics.ventesParModeDePaie[modeDePaiement].totalVentes += totalVente;

        // Additionner au total global des ventes
        dashboardMetrics.totalGlobalVentes += totalVente;
    });

    return dashboardMetrics;
};

(async () => {
    try {
        const metrics = await getDashboardMetrics();
        console.log('metrics :', metrics);
    } catch (error) {
        console.error('Erreur lors du calcul des metrics :', error);
    }
})();