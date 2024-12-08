import React, { useContext, useState, useEffect } from 'react';
import { Row } from "react-bootstrap";
import axios from "axios";
import SideBar from "./sidebar/Sidebar";
import logo from "../images/logo_station.png";
import { useAuth } from '../AuthContext';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from 'react-icons/fa'; // Import de l'icône du calendrier

const TDBFinancier = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null); // Date sélectionnée pour le filtrage des commandes
  const [selectedDateLivraison, setSelectedDateLivraison] = useState(null); // Date sélectionnée pour le filtrage des livraisons
  const [showDatePicker, setShowDatePicker] = useState(false); // État pour afficher ou masquer le DatePicker
  const [showDatePickerLivraison, setShowDatePickerLivraison] = useState(false); // État pour afficher ou masquer le DatePicker de livraison

  const logout = async (e) => {
    try {
      const response = await axios.delete('http://localhost:9000/logout', { withCredentials: true });
      console.log("message", response.data.message);
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const CustomInput = React.forwardRef((props, ref) => (
    <div ref={ref} {...props} style={{ display: "none" }} />
  ));
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
        console.log("metrics", response.data.metrics.commandes);
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
    <div>
      <Row className='mb-5 mt-5'>
        <div className="dashboard">
          <h2>Tableau de Bord Financier</h2>

          {/* Commandes */}
          <h3>Commandes</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Carburant</th>
                <th>Quantité (L)</th>
                <th>Prix Unitaire (Ar)</th>
                <th>Total (Ar)</th>
                <th>Fournisseur</th>
                <th>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    Date
                    {/* Bouton icône pour afficher le DatePicker */}
                    <button
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      style={{ background: "transparent", border: "none", cursor: "pointer" }}
                    >
                      <FaCalendarAlt size={20} />
                    </button>

                    {/* Afficher DatePicker si showDatePicker est vrai */}
                    {showDatePicker && (
                      <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)} // Mise à jour de la date sélectionnée
                        dateFormat="yyyy-MM-dd"
                        isClearable
                        
                      />
                    )}
                  </div>
                </th>


              </tr>
            </thead>
            <tbody>
              {/* Filtrage des commandes selon la date sélectionnée */}
              {metrics.commandes
                .filter((commande) => {
                  if (!selectedDate) return true; // Affiche toutes les commandes si aucune date n'est sélectionnée
                  const commandeDate = new Date(commande.date).setHours(0, 0, 0, 0); // Normaliser l'heure
                  const selectedDateOnly = selectedDate.setHours(0, 0, 0, 0); // Normaliser l'heure
                  return commandeDate === selectedDateOnly;
                })
                .map((commande, index) => (
                  <tr key={index}>
                    <td>{commande.carburantNom}</td>
                    <td>{commande.quantite}</td>
                    <td>{commande.prixUnitaire}</td>
                    <td>{commande.totalCommande}</td>
                    <td>{commande.fournisseurNom}</td>
                    <td>{formatDate(commande.date)}</td>
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
                <th>Quantité Reçue (L)</th>
                <th>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                    Date
                    {/* Bouton icône pour afficher le DatePicker de livraison */}
                    <button onClick={() => setShowDatePickerLivraison(!showDatePickerLivraison)} style={{ background: "transparent", border: "none", cursor: "pointer" }}>
                      <FaCalendarAlt size={20} />
                    </button>
                    {/* Afficher DatePicker si showDatePickerLivraison est vrai */}
                    {showDatePickerLivraison && (
                      <DatePicker
                        selected={selectedDateLivraison}
                        onChange={(date) => setSelectedDateLivraison(date)} // Mise à jour de la date sélectionnée
                        dateFormat="yyyy-MM-dd"
                        isClearable
                      />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Filtrage des livraisons selon la date sélectionnée */}
              {metrics.livraisons
                .filter((livraison) => {
                  if (!selectedDateLivraison) return true; // Affiche toutes les livraisons si aucune date n'est sélectionnée
                  const livraisonDate = new Date(livraison.date).setHours(0, 0, 0, 0); // Normaliser l'heure
                  const selectedDateOnly = selectedDateLivraison.setHours(0, 0, 0, 0); // Normaliser l'heure
                  return livraisonDate === selectedDateOnly;
                })
                .map((livraison, index) => (
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
                    <th>Total Vente (Ar)</th>
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
    </div>
  );
};

export default TDBFinancier;
