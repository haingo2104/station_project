import React, { useState } from 'react';
import axios from 'axios';
import logo from "../../images/logo_station.png";
import SideBar from '../sidebar/Sidebar';
import { Row } from 'react-bootstrap';
import { useEffect } from 'react';

const AjouterFournisseur = () => {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [fournisseurs, setFournisseurs] = useState([])

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


  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:9000/fournisseurs', {
      nom: nom,
      email: email,
      telephone: telephone
    })
      .then(res => {
        setFournisseurs(prevFournisseurs => [...prevFournisseurs, res.data.fournisseurs]);
        setNom('');
        setEmail('');
        setTelephone('')
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    axios.get('http://localhost:9000/fournisseurs')
      .then(res => {
        setFournisseurs(res.data.fournisseurs)
      })
      .catch(e => {
        console.log(e);
      })
  }, [])
  return (

    <div className="app">
      <div className="">
        <SideBar />
      </div>
      <div className="col py-3 content">
        <div className="mt-3 mb-5 titre-stat d-flex" style={{ width: "100%" }}>
          <div style={{ width: "25%" }}>
            <img src={logo} alt="" style={{ width: "50%", marginTop: "-20px" }} />
          </div>
          <div style={{ width: "50%" }}>
            <h3 className="text-center">Gestion des fournisseurs</h3>
          </div>
          <div style={{ width: "25%", marginRight: "25px" }} className="text-end">
            <button onClick={logout} className="btn btn-primary p-3">Déconnexion</button>
          </div>
        </div>
        <Row>
          <form onSubmit={handleSubmit}>
            <div className="d-flex mb-3 input-container">
              <div className='input-content'>
                <label>Nom du fournisseur :</label>
                <input
                  className='form-control'
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                />
              </div>
              <div className='input-content'>
                <label>Email du fournisseur :</label>
                <input
                  className='form-control'
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="d-flex mb-3 input-container">
              <div className='input-content'>
                <label>Contact du fournisseur :</label>
                <input
                  className='form-control'
                  type="tel"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className='btn btn-primary'>Ajouter</button>
          </form>
        </Row>
        <Row>
          <table className='table'>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Contact</th>
              </tr>
            </thead>

            <tbody>
              {fournisseurs.map(item => (

                <tr>
                  <td>{item.nom}</td>
                  <td>{item.email}</td>
                  <td>{item.telephone}</td>

                </tr>
              ))
              }
            </tbody>
          </table>

        </Row>
      </div>
    </div>
  );
};

export default AjouterFournisseur;
