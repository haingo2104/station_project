import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../AuthContext';
import SideBar from '../sidebar/Sidebar';
import logo from "../../images/logo_station.png";
import { Row, Toast } from 'react-bootstrap';

const CommanderCarburant = () => {

    const { user } = useAuth();
    if (!user) {
        return <div>Loading...</div>;
    }

    const [commandes, setCommandes] = useState([])
    const [fournisseurs, setFournisseurs] = useState([]);
    const [carburants, setCarburants] = useState([]);
    const [selectedFournisseur, setSelectedFournisseur] = useState('');
    const [selectedCarburant, setSelectedCarburant] = useState('');
    const [quantite, setQuantite] = useState('');
    const [prix, setPrix] = useState('');
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("success");
    const [showA, setShowA] = useState(false);
    const [loading, setLoading] = useState(true);
    const userId = user.user_id;


    const handleSubmit = (e) => {
        e.preventDefault();


        axios.post('http://localhost:9000/commandes', {
            user_id: parseInt(userId, 10),
            quantite: parseInt(quantite, 10),
            prix_unitaire: parseInt(prix, 10),
            fournisseur_id: parseInt(selectedFournisseur, 10),
            carburant_id: parseInt(selectedCarburant, 10)
        }, { withCredentials: true })
            .then(res => {
                setUser(prevCommandes => [...prevCommandes, res.data.commandes]);
                setToastMessage('Email envoyé avec succès');
                setToastVariant("success");
                setShowA(true);
            })
            .catch(err => {
                setToastMessage('Erreur lors de l\'envoie du commande');
                setToastVariant("danger");
                setShowA(true);
            });
    };
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
        const fetchData = async () => {
            try {
                const fournisseursRes = await axios.get('http://localhost:9000/fournisseurs');
                const carburantsRes = await axios.get('http://localhost:9000/carburants');
                axios.get('http://localhost:9000/commandes')
                    .then(res => {
                        setCommandes(res.data.commandes.map(commande => (
                            {
                                ...commande,
                                date_commande: formatDate(commande.date_commande)
                            }

                        )))
                    })

                setFournisseurs(fournisseursRes.data.fournisseurs);
                setCarburants(carburantsRes.data.carburants);
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


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
                        <h1 className="text-center">Commandes</h1>
                    </div>
                    <div style={{ width: "25%", marginRight: "25px" }} className="text-end">
                        <button onClick={logout} className="btn btn-primary p-3">Déconnexion</button>
                    </div>
                </div>
                <Row>
                    <form onSubmit={handleSubmit}>
                        <div className="d-flex mb-3 input-container">
                            <div className='input-content'>
                                <label>Fournisseur :</label>
                                <select
                                    className='form-select'
                                    value={selectedFournisseur}
                                    onChange={(e) => setSelectedFournisseur(e.target.value)}>
                                    <option value="">Sélectionnez un fournisseur</option>
                                    {fournisseurs.map(fournisseur => (
                                        <option key={fournisseur.id} value={fournisseur.id}>
                                            {fournisseur.nom}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className='input-content'>
                                <label>Carburant :</label>
                                <select
                                    className='form-select'
                                    value={selectedCarburant}
                                    onChange={(e) => setSelectedCarburant(e.target.value)}>
                                    <option value="">Sélectionnez un carburant</option>
                                    {carburants.map(carburant => (
                                        <option key={carburant.carburant_id} value={carburant.carburant_id}>
                                            {carburant.nom}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="d-flex mb-3 input-container">
                            <div className='input-content'>
                                <label>Quantité (en litres) :</label>
                                <input
                                    className='form-control'
                                    type="number"
                                    value={quantite}
                                    onChange={(e) => setQuantite(e.target.value)}
                                />
                            </div>
                            <div className='input-content'>
                                <label>Prix (en Ariary) :</label>
                                <input
                                    className='form-control'
                                    type="number"
                                    value={prix}
                                    onChange={(e) => setPrix(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="d-flex mb-3 input-container">
                            <div className='input-content'>
                                <label>Total (en Ariary) :</label>
                                <input
                                    className='form-control'
                                    type="number"
                                    value={quantite && prix ? quantite * prix : 0}
                                    disabled
                                    
                                />
                            </div>
                        </div>
                        <div>
                            <Toast onClose={() => setShowA(false)} show={showA} delay={5000} autohide>
                                <Toast.Header>
                                    <strong className="me-auto">Notification</strong>
                                </Toast.Header>
                                <Toast.Body className={`text-${toastVariant}`}>
                                    {toastMessage}
                                </Toast.Body>
                            </Toast>
                        </div>
                        <button type="submit" className='btn btn-primary'>Passer la commande</button>
                    </form>
                </Row>
                <Row>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Carburant</th>
                                <th>Fournisseurs</th>
                                <th>Quantité</th>
                                <th>Date du commande</th>
                            </tr>
                        </thead>

                        <tbody>
                            {commandes.map(item => (

                                <tr>
                                    <td>{item.Carburants.nom}</td>
                                    <td>{item.Fournisseurs.nom}</td>
                                    <td>{item.quantite}</td>
                                    <td>{item.date_commande}</td>

                                </tr>
                            ))
                            }
                        </tbody>
                    </table>

                </Row>
            </div>
        </div>
    )
}

export default CommanderCarburant