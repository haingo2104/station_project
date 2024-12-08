import React from 'react';
import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { Toast } from "react-bootstrap";
import SideBar from "../sidebar/Sidebar";
import logo from "../../images/logo_station.png";
import { useNavigate } from "react-router-dom";

const AjouterVente = () => {
    const [pompiste, setPompiste] = useState([]);
    const [pompe, setPompe] = useState([]);
    const [modeDePaies, setModeDePaies] = useState([]);
    const [activeMode, setActiveMode] = useState(0);
    const [vente, setVente] = useState([]);
    const [isDisable, setDisable] = useState(false);
    const [editable, setEditable] = useState(false);
    const [timer, setTimer] = useState(null);
    const [showToast, setShowToast] = useState(false);

    const ref = useRef(null);
    const montant = useRef(null);
    const total = useRef(0);
    const pompeIdValue = useRef(null);
    const pompisteIdValue = useRef(null);

    const navigate = useNavigate()

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
        axios.get('http://localhost:9000/pompistes')
            .then(res => {
                setPompiste(res.data.pompistes);
            })
            .catch(e => console.log(e));

        axios.get('http://localhost:9000/pompes')
            .then(res => {
                setPompe(res.data.pompes);
            })
            .catch(e => console.log(e));

        axios.get('http://localhost:9000/modeDePaies')
            .then(res => {
                setModeDePaies(res.data.modeDePaies);
            })
            .catch(e => console.log(e));
    }, []);

    useEffect(() => {
        if (editable) {
            setShowToast(true);
            const timeout = setTimeout(() => {
                setEditable(false);
                setShowToast(false);
                clearTimeout(timer);
            }, 300000); // 300000ms = 5 minutes
            setTimer(timeout);
        }
    }, [editable]);

    const handleModeChange = (e) => {
        setActiveMode(parseInt(e.target.value));
    };

    const addData = (e) => {
        e.preventDefault();
        setVente([
            ...vente,
            {
                ref_value: activeMode === 0 ? "" : ref.current.value,
                montant: parseInt(montant.current.value), // Convertir en nombre
                modeDePaie_id: modeDePaies[activeMode].modeDePaie_id
            }
        ]);
        if (ref.current) {
            ref.current.value = "";
        }
        montant.current.value = "";
        setDisable(true);
        setEditable(true); // Activer l'édition après l'ajout
    };

    const handleEdit = (index, field, value) => {
        const updatedVente = [...vente];
        updatedVente[index][field] = field === 'montant' ? parseInt(value) : value; // Convertir en nombre si le champ est 'montant'
        setVente(updatedVente);
    };

    const handleInputChange = (index, field, event) => {
        const value = event.target.value;
        handleEdit(index, field, value);
    };

    const submitAll = (e) => {
        e.preventDefault();
        const data = {
            total: vente.reduce((acc, curr) => acc + curr.montant, 0), // Calculer le total en additionnant les nombres
            pompe_id: parseInt(pompeIdValue.current.value),
            pompiste_id: parseInt(pompisteIdValue.current.value),
            modeDePaie_id: modeDePaies[activeMode].modeDePaie_id
        };
        axios.post('http://localhost:9000/ventes', data)
            .then((res) => {
                vente.forEach(item => {
                    axios.post('http://localhost:9000/references', { ...item, vente_id: res.data.vente.vente_id })
                        .then(res => {
                            setDisable(false);
                            setVente([]);
                        })
                        .catch(e => {
                            console.log(e);
                        });
                });
            });
    };

    const calculateTotal = () => {
        return vente.reduce((acc, curr) => acc + curr.montant, 0); // Calculer le total en additionnant les nombres
    };

    return (
        <div className="app">
            <div className="">
                <SideBar />
            </div>
            <div className="col py-3 content">
                <div className="mt-5 mb-5 titre-stat d-flex" style={{ width: "100%" }}>
                    <div style={{ width: "25%" }}>
                        <img src={logo} alt="" style={{ width: "45%", marginTop: "-20px" }} />
                    </div>
                    <div style={{ width: "50%" }}>
                        <h1 className="text-center">Ajout des ventes</h1>
                    </div>
                    <div style={{ width: "25%", marginRight: "25px" }} className="text-end">
                        <button onClick={logout} className="btn btn-primary p-3">Déconnexion</button>
                    </div>
                </div>
                <form onSubmit={submitAll} className="d-flex justify-content-between">
                    <div style={{ width: "75%" }} className="d-flex">
                        <div className="mb-3" style={{ width: "25%" }}>
                            <label htmlFor="pompiste">Pompiste :</label>
                            <select ref={pompisteIdValue} className="form-select">
                                {
                                    pompiste.map(v => (
                                        <option key={v.pompiste_id} value={v.pompiste_id}>{v.nom}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="mb-3" style={{ width: "25%", marginLeft: "25px" }}>
                            <label htmlFor="pompe">ID pompe :</label>
                            <select ref={pompeIdValue} className="form-select">
                                {
                                    pompe.map(v => (
                                        <option key={v.pompe_id} value={v.pompe_id}>{v.pompe_id}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="mb-3" style={{ width: "25%", marginLeft: "25px" }}>
                            <label htmlFor="modeDePaie">Mode de paiement</label>
                            <select onChange={handleModeChange} disabled={isDisable} className="form-select">
                                {
                                    modeDePaies.map((v, i) => (
                                        <option key={i} value={i}>{v.nom}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <div style={{ width: "25%" }} className="mt-4">
                        <button type="submit" className="btn btn-success">submit all</button>
                    </div>
                </form>
                <div>
                    <form onSubmit={addData}>
                        <div className="d-flex" style={{ width: "75%" }}>
                            {
                                activeMode !== 0 && (
                                    <div className="mb-3" style={{ width: "25%", marginRight: "25px" }}>
                                        <label htmlFor="reference">Références :</label>
                                        <input type="text" placeholder="reference" className="form-control" ref={ref} />
                                    </div>
                                )
                            }
                            <div style={{ width: "25%", marginRight: "25px" }}>
                                <label htmlFor="montant">Montant (Ar):</label>
                                <input type="number" placeholder="montant" className="form-control" ref={montant} />
                            </div>
                            <div className="mt-4" style={{ width: "25%" }}>
                                <button className="btn btn-warning">Add</button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="container">
                    <div className="row text-dark">
                        <div className="total mt-4 mb-5" style={{ width: "25%" }}>
                            <h3>Total: <span ref={total}>{calculateTotal()}</span></h3>
                        </div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Référence</th>
                                    <th>Montant</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    vente.map((v, i) => (
                                        <tr key={i}>
                                            <td>
                                                {editable ? (
                                                    <input
                                                        type="text"
                                                        value={v.ref_value}
                                                        onChange={(e) => handleInputChange(i, 'ref_value', e)}
                                                    />
                                                ) : (
                                                    v.ref_value
                                                )}
                                            </td>
                                            <td>
                                                {editable ? (
                                                    <input
                                                        type="number"
                                                        value={v.montant}
                                                        onChange={(e) => handleInputChange(i, 'montant', e)}
                                                    />
                                                ) : (
                                                    v.montant
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                <Toast show={showToast} onClose={() => setShowToast(false)}>
                    <Toast.Header>
                        <strong className="mr-auto">Notification</strong>
                    </Toast.Header>
                    <Toast.Body>Vous avez 5 minutes pour modifier les erreurs de frappes.</Toast.Body>
                </Toast>
            </div>
        </div>
    );
};

export default AjouterVente;
