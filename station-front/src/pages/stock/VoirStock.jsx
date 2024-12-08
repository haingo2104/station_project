import React from 'react';
import axios from "axios"
import { useRef, useState } from "react"
import { useEffect } from "react"
import { Col, Row, Modal, Form, ProgressBar } from "react-bootstrap"
import SideBar from "../sidebar/Sidebar"
import { useNavigate } from "react-router-dom"
import logo from "../../images/logo_station.png";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const VoirStock = () => {
    const [stocks, setStock] = useState([])
    const [stockRestant, setStockRestant] = useState([])
    const [carburants, setCarburants] = useState([])
    const carburantId = useRef(null);
    const carburant_id = useRef(null);
    const [selectedId, setSelectedId] = useState(null)
    const [isButton, setIsButton] = useState(true)
    const [triParType, setTriParType] = useState(null)
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedDateCarburant, setSelectedDateCarburant] = useState("");
    const newCarburantId = useRef(null)
    const newQuantity = useRef(null)
    const nouvellequantite = useRef(null)
    const nouveaucarburant_id = useRef(null)
    const [newIdCarburant, setNewIdCarburant] = useState(null)
    const [datacarburant, setDataCarburant] = useState([])
    const navigate = useNavigate()


    const ajouterStock = (e) => {
        e.preventDefault()
        axios.post('http://localhost:9000/stocks', {
            carburant_id: nouveaucarburant_id.current.value,
            quantite: nouvellequantite.current.value

        }, { withCredentials: true })
            .then(() => {
                navigate('/voirStock')
            })
            .catch(e => {
                console.log(e);
            })
    }
    const handleNewCarburant = (e) => {
        setNewIdCarburant(e.target.value)
    }
    const handleClick = (id) => {
        setSelectedId(id);
        setIsButton(!isButton);
    }

    const trier = (typeTri) => {
        setTriParType(typeTri);
    }

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    }
    const handleDateEtCarburantChange = (e) => {
        setSelectedDateCarburant(e.target.value);
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const rechercherParDateEtCarburant = async () => {
        await axios.get('http://localhost:9000/stocks/obtenirStocksParCarburantParDate', {
            params: {
                carburant_id: carburant_id.current.value,
                date: selectedDateCarburant
            }
        })
            .then(res => {
                setStock(res.data.stocks.map(stock => ({
                    ...stock,
                    Date: formatDate(stock.Date)
                })));
            })
            .catch(error => {
                console.log(error);
            });
    }
    const rechercherParCarburant = async () => {
        await axios.get('http://localhost:9000/stocks/obtenirStocksParCarburant', {
            params: {
                carburant_id: carburantId.current.value
            }
        })
            .then(res => {
                setStock(res.data.stocks.map(stock => ({
                    ...stock,
                    Date: formatDate(stock.Date)
                })));
            })
            .catch(error => {
                console.log(error);
            });
    }
    const rechercherParDate = async () => {
        await axios.get('http://localhost:9000/stocks/obtenirStocksParDate', {
            params: {
                date: selectedDate
            }
        })
            .then(res => {
                setStock(res.data.stocks.map(stock => ({
                    ...stock,
                    Date: formatDate(stock.Date)
                })));
            })
            .catch(error => {
                console.log(error);
            });
    }
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await axios.patch(`http://localhost:9000/stocks/${selectedId}`, {
                carburant_id: newCarburantId.current.value,
                quantite: newQuantity.current.value
            });
            setIsButton(true);

        } catch (error) {
            console.error('Erreur lors de la modification :', error.response.data);
        }
    };


    const supprimer = (id) => {
        axios.delete('http://localhost:9000/stocks/' + id)
            .then(() => {
                console.log('ok');
                setStock(stocks.filter(value => value.stock_id !== id))
            })
            .catch(e => {
                console.error(e.response.data);

            })
    }

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
        axios.get('http://localhost:9000/carburants')
            .then(res => {
                setCarburants(res.data.carburants)
            })
            .catch(e => console.log(e))
        axios.get('http://localhost:9000/carburants', { withCredentials: true })
            .then((res) => {
                setDataCarburant(res.data.carburants)
            })
            .catch(e => {
                console.log(e);
            })
        const fetchData = async () => {
            try {
                let res;
                if (triParType === "recent") {
                    res = await axios.get('http://localhost:9000/stocks/plusRecent');
                } else if (triParType === "date" && selectedDate) {
                    rechercherParDate();
                } else if (triParType === "carburant" && carburantId) {
                    rechercherParCarburant();
                } else if (triParType === "ancien") {
                    res = await axios.get('http://localhost:9000/stocks/plusAncien');
                } else if (triParType === "carburantEtDate" && selectedDateCarburant) {
                    rechercherParDateEtCarburant();
                } else {
                    res = await axios.get('http://localhost:9000/stocks');
                }
                setStock(res.data.stocks.map(stock => ({
                    ...stock,
                    Date: formatDate(stock.Date)
                })));
            } catch (error) {
                console.log(error);
            }
        };

        const fetchStocksRestants = async () => {
            try {
                const response = await fetch('http://localhost:9000/stocks/stock-restant');
                const data = await response.json();
                console.log('Stocks restants :', data);
                setStockRestant(data); // Met à jour l'état dans React
            } catch (error) {
                console.error('Erreur lors du chargement des stocks restants :', error);
            }
        };

        fetchData();
        fetchStocksRestants();
    }, [triParType, stocks]);



    return (
        <div className="app">
            <div className="">
                <SideBar />
            </div>
            <div className="col py-3 content">
                <div className="mt-5 mb-5 titre-stat d-flex" style={{ width: "100%" }}>
                    <div style={{ width: "25%" }}>
                        <img src={logo} alt="" style={{ width: "50%", marginTop: "-20px" }} />
                    </div>
                    <div style={{ width: "50%" }}>
                        <h1 className="text-center">Liste des stocks</h1>
                    </div>
                    <div style={{ width: "25%", marginRight: "25px" }} className="text-end">
                        <button onClick={logout} className="btn btn-primary p-3">Déconnexion</button>
                    </div>
                </div>
                <Row className="mb-5">
                    <Col>
                        <form onSubmit={ajouterStock}>
                            <div className="form-group input-content mb-3">
                                <label htmlFor="carburant">Carburant</label>
                                <select className="form-select" ref={nouveaucarburant_id}>
                                    {
                                        datacarburant.map(item => (
                                            <option key={item.carburant_id} value={item.carburant_id}>{item.nom}</option>
                                        ))
                                    }
                                </select>

                            </div>
                            <div className="form-group input-content mb-3">
                                <label htmlFor="quantite">Quantité (L)</label>
                                <input type="number" ref={nouvellequantite} className="form-control" />
                            </div>

                            <div className="mt-3">
                                <button type="submit" id="bouton" className="btn btn-success">Ajouter</button>
                            </div>

                        </form>
                    </Col>

                    <Col>
                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                            {stockRestant.map((stock) => (
                                <div key={stock.nom} style={{ textAlign: 'center', width: '150px' }}>
                                    <h3>{stock.nom}</h3>
                                    <div style={{ width: 100, height: 100 }}>
                                        <CircularProgressbar
                                            value={Math.max(
                                                0,
                                                Math.min(100, (stock.stockRestant * 100) / stock.quantiteLivree)
                                            )}
                                            text={`${Math.round(
                                                (stock.stockRestant * 100) / stock.quantiteLivree
                                            )}%`}
                                            strokeWidth={10}
                                            styles={{
                                                path: {
                                                    stroke: stock.alerteStockBas ? 'red' : 'green',
                                                },
                                                trail: {
                                                    stroke: '#d6d6d6',
                                                },
                                                text: {
                                                    fill: '#000',
                                                    fontSize: '16px',
                                                },
                                            }}
                                        />
                                    </div>
                                    <div>{stock.stockRestant} L restants</div>
                                </div>
                            ))}
                        </div>
                    </Col>

                </Row>
                <Row>
                    <Col>
                        <Form.Select onChange={(e) => trier(e.target.value)}>
                            <option disabled selected>Trier par...</option>
                            <option value="date">Tri par date</option>
                            <option value="carburant">Tri par carburant</option>
                            <option value="carburantEtDate">Tri par carburant et par date</option>
                            <option value="recent">Trier plus récent</option>
                            <option value="ancien">Trier plus ancien</option>
                        </Form.Select>

                        {triParType === "date" && (
                            <div className="d-flex mt-3 mb-3" style={{ gap: "15px" }}>

                                <input type="date" value={selectedDate} onChange={handleDateChange} placeholder="Date" />

                                <button className="btn btn-primary mt-2" onClick={rechercherParDate}>Rechercher</button>
                            </div>

                        )}
                        {triParType === "carburantEtDate" && (
                            <div className="d-flex mt-3 mb-3" style={{ gap: "15px" }}>
                                <select ref={newCarburantId}>
                                    {carburants.map(carburant => {
                                        return (
                                            <option key={carburant.carburant_id} value={carburant.carburant_id}>{carburant.carburant_id}</option>
                                        )
                                    })}
                                </select>
                                <input type="date" value={selectedDateCarburant} onChange={handleDateEtCarburantChange} placeholder="Date" />
                                <button className="btn btn-primary mt-2" onClick={rechercherParDateEtCarburant}>Rechercher</button>
                            </div>

                        )}
                        {triParType === "carburant" && (
                            <div className="d-flex mt-3 mb-3" style={{ gap: "15px" }}>
                                <select ref={carburantId}>
                                    {carburants.map(carburant => {
                                        return (
                                            <option key={carburant.carburant_id} value={carburant.carburant_id}>{carburant.carburant_id}</option>
                                        )
                                    })}
                                </select>
                                <button className="btn btn-primary" onClick={rechercherParCarburant}>Rechercher</button>
                            </div>

                        )}

                    </Col>
                </Row>
                <Row>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Carburant</th>
                                <th>Quantité (L)</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {stocks.map(item => (

                                <tr>
                                    <td>{item.carburant.nom}</td>
                                    <td>{item.quantite}</td>
                                    <td>{item.Date}</td>
                                    <td>
                                        <button className="btn btn-success" style={{marginRight : "5px"}} onClick={() => handleClick(item.stock_id)}>Modifier</button>
                                        <button className="btn btn-danger" onClick={() => supprimer(item.stock_id)}>Supprimer</button>
                                    </td>
                                </tr>
                            ))
                            }
                        </tbody>
                    </table>

                </Row>
                {!isButton && (
                    <Modal show={true} onHide={() => setIsButton(true)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Modifier le stock</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={handleSubmit}>
                                <div className="d-flex mb-5">
                                    <label htmlFor="carburant">Carburant</label>
                                    <select className="form-select" ref={newCarburantId} defaultValue={stocks.find(stock => stock.stock_id === selectedId)?.carburant_id}>
                                        {
                                            carburants.map(item => (
                                                <option key={item.carburant_id} value={item.carburant_id}>{item.nom}</option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="" className="form-label">Quantité :</label>
                                    <input type="number" ref={newQuantity} className="form-control" defaultValue={stocks.find(stock => stock.stock_id === selectedId)?.quantite} />
                                </div>

                                <div className="mt-3">
                                    <button type="submit" id="bouton" className="btn btn-success form-control">
                                        Valider
                                    </button>
                                </div>
                            </form>
                        </Modal.Body>
                    </Modal>
                )}
            </div>
        </div>

    )
}


export default VoirStock

