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
          <button className='btn btn-warning' style={{ marginRight: '10px' }}  onClick={() => setIsPhysique(true)}>Tableau de Bord Physique</button>
          <button className='btn btn-warning' onClick={() => setIsPhysique(false)}>Tableau de Bord Financier</button>
          {isPhysique ? <TDBPhysique /> : <TDBFinancier />}
        </div>
      </div>

    </div >

  );
};

export default Menu;
