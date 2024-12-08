import React, { useContext } from 'react';
import { Card, CardBody, Col, Row, Toast, ToastContainer } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import SideBar from "./sidebar/Sidebar";
import { Chart } from 'react-google-charts';
import logo from "../images/logo_station.png";
import { useAuth } from '../AuthContext';
import TDBPhysique from './TDBPhysique';
import TDBFinancier from './TDBFinancier';


const Menu = () => {

  const [isPhysique, setIsPhysique] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [showToast, setShowToast] = useState(false);
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

  useEffect(() => {
    const fetchStockAlerts = async () => {
      try {
        const carburants = await axios.get('http://localhost:9000/stocks/stock-restant'); // Remplace avec ton endpoint
        const seuilCritique = 500; // Exemple de seuil critique
        const alerts = carburants.data.filter(
          (carburant) => carburant.stockRestant < seuilCritique
        );
        setLowStockAlerts(alerts);
        if (alerts.length > 0) {
          setShowToast(true); // Affiche le toast si des stocks sont bas
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des alertes de stock :', error);
      }
    };

    fetchStockAlerts();
  }, []);

  return (
    <div className="app ">

      <div>
        <SideBar />
      </div>
      <div className="content">
        <div className="mt-5 mb-5 titre-stat d-flex" style={{ width: "100%" }}>
          <div style={{ width: "25%" }}>
            <img src={logo} alt="" style={{ width: "50%", marginTop: "-20px" }} />
          </div>
          <div style={{ width: "50%" }}>
            <h1 className="text-center">Statistiques</h1>
          </div>
          <div style={{ width: "25%", marginRight: "25px" }} className="text-end">
            <button onClick={logout} className="btn btn-primary p-3">Déconnexion</button>
          </div>
        </div>
        <div>
          <button className='btn btn-warning' style={{ marginRight: '10px' }} onClick={() => setIsPhysique(true)}>Tableau de Bord Physique</button>
          <button className='btn btn-warning' onClick={() => setIsPhysique(false)}>Tableau de Bord Financier</button>
        
        </div>
        <div>
        {showToast && (
            <Toast
              onClose={() => setShowToast(false)}
              show={showToast}
              // delay={5000}
              // autohide
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                zIndex: 1000,
                minWidth: "300px",
              }}
            >
              <Toast.Header>
                 Stock Bas
              </Toast.Header>
              <Toast.Body className={`text-danger`}>
                Les carburants suivants sont sous le seuil critique :
                <ul>
                  {lowStockAlerts.map((carburant, index) => (
                    <li key={index}>
                      {carburant.nom} : {carburant.stockRestant} litres restants
                    </li>
                  ))}
                </ul>
              </Toast.Body>
            </Toast>
          )}
          
        </div>
        <div>
          {isPhysique ? <TDBPhysique /> : <TDBFinancier />}

        </div>
      </div>

    </div >

  );
};

export default Menu;
