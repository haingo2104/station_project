import React, { useContext } from 'react';
import { Card, CardBody, Col, Row } from "react-bootstrap";
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
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="app ">
      <div>
        <button onClick={() => setIsPhysique(true)}>Tableau de Bord Physique</button>
        <button onClick={() => setIsPhysique(false)}>Tableau de Bord Financier</button>
      </div>
      <div>
        {isPhysique ? <TDBPhysique /> : <TDBFinancier />}
      </div>
    </div >

  );
};

export default Menu;
