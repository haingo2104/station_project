import React, { useContext } from 'react';
import {  Row } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import SideBar from "./sidebar/Sidebar";
import logo from "../images/logo_station.png";
import { useAuth } from '../AuthContext';


const TDBFinancier = () => {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const logout = async (e) => {
    // e.preventDefault();
    try {
      const response = await axios.delete('http://localhost:9000/logout', { withCredentials: true });
      console.log("message", response.data.message);
      navigate('/')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {

    axios.get('http://localhost:9000/dashboard')
      .then((response) => {
        console.log("metrics", response.data.metrics);
        setMetrics(response.data.metrics);
      })
      .catch(e => {
        console.error("Erreur lors de la récupération des données : ", e);
        setError("Erreur lors de la récupération des données.");
      })
      .finally(() => {
        setLoading(false); // Arrêter le chargement après la requête
      });



  }, []);




  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  if (loading) {
    return <div>Chargement...</div>;
}

// Affichage d'un message d'erreur si la requête échoue
if (error) {
    return <div>{error}</div>;
}

  return (
    <div className=" ">
      
        <Row className='mb-5 mt-5'>
          <div className="dashboard">
            <h2>Tableau de Bord Financier</h2>

            {/* Commandes */}
            <h3>Commandes</h3>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Carburant</th>
                  <th>Quantité</th>
                  <th>Prix Unitaire</th>
                  <th>Total</th>
                  <th>Fournisseur</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {metrics.commandes.map((commande, index) => (
                  <tr key={index}>
                    <td>{commande.carburantNom}</td>
                    <td>{commande.quantite}</td>
                    <td>{commande.prixUnitaire}</td>
                    <td>{commande.totalCommande}</td>
                    <td>{commande.fournisseurNom}</td>
                    <td>{formatDate(commande.date_commande)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Livraisons */}
            <h3>Livraisons reçues</h3>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Carburant</th>
                  <th>Quantité Reçue</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {metrics.livraisons.map((livraison, index) => (
                  <tr key={index}>
                    <td>{livraison.carburantNom}</td>
                    <td>{livraison.quantite}</td>
                    <td>{formatDate(livraison.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Ventes */}
            <h3>Ventes</h3>
            {Object.keys(metrics.ventesParModeDePaie).map((modeDePaiement) => (
              <div key={modeDePaiement}>
                <h4>{modeDePaiement}</h4>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Total Vente</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.ventesParModeDePaie[modeDePaiement].ventes.map((vente, index) => (
                      <tr key={index}>
                        <td>{vente.date}</td>
                        <td>{vente.totalVente}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th>Total Ventes pour {modeDePaiement}</th>
                      <th>{metrics.ventesParModeDePaie[modeDePaiement].totalVentes}</th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ))}

            {/* Total Global des Ventes */}
            <h3>Total Global des Ventes: {metrics.totalGlobalVentes} Ariary</h3>
          </div>
        </Row>
    </div >

  );
};

export default TDBFinancier;
