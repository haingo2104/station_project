import React from "react";
import SideBar from "./sidebar/Sidebar";
import logo from "../images/logo_station.png";

const Welcome = () => {
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

          <div  className="logout-container">
            <button onClick={logout} className="btn btn-primary p-3">Déconnexion</button>
          </div>
        </div>

        <div>
          <div style={{ width: "50%" }} className="logo-container">
            <img src={logo} alt="" style={{ width: "100%" }} />
          </div>
          <div className="title-container">
            <h1 className="text-center" style={{fontFamily : "Dancing Script",fontSize : "50px" , letterSpacing : "5px" , lineHeight : "100px"}}>Bienvenue dans l'application de gestion de <br /> station-service</h1>
          </div>

        </div>

      </div>

    </div >
  );
};

export default Welcome;
