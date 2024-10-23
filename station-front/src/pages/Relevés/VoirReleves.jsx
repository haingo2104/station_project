import React from 'react';
import axios from "axios"
import { useRef, useState } from "react"
import { useEffect } from "react"
import { Col, Row, Modal, Form, Toast } from "react-bootstrap"
import SideBar from "../sidebar/Sidebar"
import { useNavigate } from "react-router-dom"

const VoirReleves = () => {
    const [relevers, setRelevers] = useState([])
    // const [selectedId, setSelectedId] = useState(null)
    const [isButton, setIsButton] = useState(true)
    const [pompes, setPompes] = useState([])
    const [carburants, setCarburant] = useState([])
    const quantiteAvant = useRef('')
    const quantiteApres = useRef('')
    const pompe_id = useRef('')
    const carburant_id = useRef('')
    const [triParType, setTriParType] = useState(null)
    const pompeId = useRef(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedDatePompe, setSelectedDatePompe] = useState("");
    const [showA, setShowA] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("success");
    const [selectedId, setSelectedId] = useState(null);

    // const nouveauQuantiteAvant = useRef(null)
    const nouveauQuantiteApres = useRef('')
    const [dataCarburant, setDataCarburant] = useState([])
    const [datapompes, setdataPompes] = useState([])
    const nouveauPompe_id = useRef('')
    const nouveauCarburant_id = useRef('')
    const navigate = useNavigate()

    const storedDeletedPompes = localStorage.getItem('deletedPompes');
    const deletedPompes = storedDeletedPompes ? JSON.parse(storedDeletedPompes) : [];
    const [nouveauQuantiteAvant, setNouveauQuantiteAvant] = useState(null);

    const [isPompeDisabled, setIsPompeDisabled] = useState(false)

    const handleTerminer = async () => {
        console.log("réussi");
         setIsPompeDisabled(false)
         const pompe_id = nouveauPompe_id.current.value;
         try {
             const ventesResponse = await axios.get(`http://localhost:9000/ventes/totalVenteParPompe/${pompe_id}`);
             const totalVentes = ventesResponse.data.ventes.totalGlobal;

             const releversResponse = await axios.get(`http://localhost:9000/relevers/obtenirTotalParPompe/${pompe_id}`);
             const totalReleves = releversResponse.data.relevers.totalReleves;

              console.log("totalVentes" + totalVentes);
              console.log("totalReleves" + totalReleves);
             if (totalVentes === totalReleves) {
                 setToastMessage("Succès : Les totaux correspondent !");
                 setToastVariant("success");
                 setShowA(true);
             } else if (totalReleves > totalVentes) {
                 setToastMessage(`Erreur : Total relevé (${totalReleves}) est plus grand que total vente (${totalVentes}) !`);
                 setToastVariant("danger");
                 setShowA(true);
             } else {
                 setToastMessage(`Erreur : Total vente (${totalVentes}) est supérieur à total relevé (${totalReleves}) !`);
                 setToastVariant("danger");
                 setShowA(true);
             }
         } catch (error) {
             setToastMessage('Erreur lors de la vérification des totaux. Veuillez vérifier la console pour plus de détails.');
             setToastVariant("danger");
             setShowA(true);
         }
    }

    const ajouterRelever = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:9000/relevers', {
                pompe_id: nouveauPompe_id.current.value,
                carburant_id: nouveauCarburant_id.current.value,
                quantiteAvant: parseFloat(nouveauQuantiteAvant), // Assurez-vous que c'est un nombre
                quantiteApres: parseFloat(nouveauQuantiteApres.current.value) // Assurez-vous que c'est un nombre
            }, { withCredentials: true });
            setIsPompeDisabled(true);
            navigate('/voirReleves');
        } catch (e) {
            console.log(e);
        }
    };

    const handlePompeChange = async (id) => {
        await axios.get("http://localhost:9000/relevers/obtenirCarburantParPompe/" + id)
            .then(res => {
                setDataCarburant(res.data.carburants)
            })
    }

    const handleCarburantChange = async (carburant_id = nouveauCarburant_id.current.value) => {
        const pompe_id = nouveauPompe_id.current.value;

        try {
            const response = await axios.get(`http://localhost:9000/relevers/obtenirDernierRelever/${pompe_id}/${carburant_id}`);
            setNouveauQuantiteAvant(response.data.quantiteApres);
        } catch (error) {
            console.error('Erreur lors de la récupération de la dernière quantité après:', error);
        }
    };

    const trier = (typeTri) => {
        setTriParType(typeTri);
    }

    const handleClick = (id) => {
        setSelectedId(id);
        setIsButton(!isButton);
    }

    const rechercherParDateEtPompe = async () => {
        await axios.get('http://localhost:9000/relevers/obtenirReleversParPompeParDate', {
            params: {
                pompe_id: pompeId.current.value,
                date: selectedDatePompe
            }
        })
            .then(res => {
                setRelevers(res.data.relevers.map(relever => ({
                    ...relever,
                    date: formatDate(relever.date)
                })));
            })
            .catch(error => {
                console.log(error);
            });
    }
    const rechercherParPompe = async () => {
        await axios.get('http://localhost:9000/relevers/obtenirReleversParPompe', {
            params: {
                pompe_id: pompeId.current.value
            }
        })
            .then(res => {
                setRelevers(res.data.relevers.map(relever => ({
                    ...relever,
                    date: formatDate(relever.date)
                })));
            })
            .catch(error => {
                console.log(error);
            });
    }
    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    }
    const handleDateEtPompeChange = (e) => {
        setSelectedDatePompe(e.target.value);
    }
    const rechercherParDate = async () => {
        await axios.get('http://localhost:9000/relevers/obtenirReleversParDate', {
            params: {
                date: selectedDate
            }
        })
            .then(res => {
                setRelevers(res.data.relevers.map(relever => ({
                    ...relever,
                    date: formatDate(relever.date)
                })));
            })
            .catch(error => {
                console.log(error);
            });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            console.log(carburant_id.current.value);
            // await axios.patch(`http://localhost:9000/relevers/${selectedId}`, {
            //     pompe_id: parseInt(pompe_id.current.value),
            //     carburant_id: parseInt(carburant_id.current.value),
            //     quantiteAvant: parseFloat(quantiteAvant.current.value),
            //     quantiteApres: parseFloat(quantiteApres.current.value)
            // })

            setIsButton(true);

        } catch (error) {
            console.error('Erreur lors de la modification :', error.response.data);
        }
    };


    const supprimer = (id) => {
        axios.delete('http://localhost:9000/relevers/' + id)
            .then(() => {
                setRelevers(relevers.filter(value => value.relever_id !== id))
            })
            .catch(e => {
                console.error(e.response.data);

            })
    }
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    useEffect(() => {

        axios.get('http://localhost:9000/pompes', { withCredentials: true })
            .then((response) => {
                const pompes = response.data.pompes.filter(pompe => !deletedPompes.includes(pompe.pompe_id));
                setdataPompes(pompes)
            })
            .catch(e => {
                console.log(e);
            })
        axios.get('http://localhost:9000/pompes')
            .then(res => {
                setPompes(res.data.pompes)
            })
            .catch(e => console.log(e))
        axios.get('http://localhost:9000/carburants', { withCredentials: true })
            .then((res) => {
                setCarburant(res.data.carburants)
            })
            .catch(e => {
                console.log(e);
            })

        const fetchData = async () => {
            try {
                let res;
                if (triParType === "date" && selectedDate) {
                    rechercherParDate();
                } else if (triParType === "pompe" && pompeId) {
                    rechercherParPompe();
                } else if (triParType === "pompeEtDate" && selectedDatePompe) {
                    rechercherParDateEtPompe();
                } else {
                    res = await axios.get('http://localhost:9000/relevers');
                }
                setRelevers(res.data.relevers.map(relever => ({
                    ...relever,
                    date: formatDate(relever.date)
                })));
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [relevers]);




    return (
        <div className="app">
            <div className="">
                <SideBar />
            </div>
            <div className="col py-3 content">
                <Row className="mb-5">
                    <form action="" >
                        <div className="d-flex mb-3 input-container">
                            <div className="input-content">
                                <label htmlFor="carburant">IDPompe</label>
                                <select className="form-select" ref={nouveauPompe_id} onChange={(e) => handlePompeChange(e.target.value)} disabled={isPompeDisabled}>
                                    <option></option>
                                    {
                                        datapompes.map(item => (
                                            <option key={item.pompe_id} value={item.pompe_id}>{item.pompe_id}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="input-content">
                                <label htmlFor="carburant ">Carburant</label>
                                <select className="form-select" ref={nouveauCarburant_id} onChange={() => handleCarburantChange()}>
                                <option></option>
                                    {
                                        dataCarburant.map(item => (
                                            <option key={item.carburant_id} value={item.carburant_id}>{item.nom}</option>
                                        ))
                                    }
                                </select>
                            </div>

                        </div>
                        <div className="d-flex mb-3 input-container">
                            <div className="form-group input-content">
                                <label htmlFor="" className="form-label">Quantité du départ :</label>
                                <input type="number" value={nouveauQuantiteAvant || ''} className="form-control" onChange={(e) => setNouveauQuantiteAvant(parseFloat(e.target.value) || 0)} />
                            </div>
                            <div className="form-group input-content">
                                <label htmlFor="" className="form-label">Quantité Après vente :</label>
                                <input type="number" ref={nouveauQuantiteApres} className="form-control" defaultValue={0} />
                            </div>
                        </div>

                        <div>
                            <button onClick={ajouterRelever} className="btn btn-primary mt-4">Ajouter</button>
                            <button type="button" className="btn btn-danger" onClick={handleTerminer}>Terminer</button>
                        </div>
                    </form>

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

                </Row>
                <Row>
                    <Col>
                        <Form.Select onChange={(e) => trier(e.target.value)}>
                            <option disabled selected>Trier par...</option>
                            <option value="date">Tri par date</option>
                            <option value="pompe">Tri par pompe</option>
                            <option value="pompeEtDate">Tri par pompe et par date</option>
                        </Form.Select>

                        {triParType === "date" && (
                            <div className="d-flex mt-3 mb-3" style={{ gap: "15px" }}>

                                <input type="date" value={selectedDate} onChange={handleDateChange} placeholder="Date" />

                                <button className="btn btn-primary mt-2" onClick={rechercherParDate}>Rechercher</button>
                            </div>

                        )}
                        {triParType === "pompeEtDate" && (
                            <div className="d-flex mt-3 mb-3" style={{ gap: "15px" }}>
                                <select ref={pompeId}>
                                    {pompes.map(pompe => {
                                        return (
                                            <option key={pompe.pompe_id} value={pompe.pompe_id}>{pompe.pompe_id}</option>
                                        )
                                    })}
                                </select>
                                <input type="date" value={selectedDatePompe} onChange={handleDateEtPompeChange} placeholder="Date" />
                                <button className="btn btn-primary mt-2" onClick={rechercherParDateEtPompe}>Rechercher</button>
                            </div>

                        )}
                        {triParType === "pompe" && (
                            <div className="d-flex mt-3 mb-3" style={{ gap: "15px" }}>
                                <select ref={pompeId}>
                                    {pompes.map(pompe => {
                                        return (
                                            <option key={pompe.pompe_id} value={pompe.pompe_id}>{pompe.pompe_id}</option>
                                        )
                                    })}
                                </select>
                                <button className="btn btn-primary" onClick={rechercherParPompe}>Rechercher</button>
                            </div>

                        )}

                    </Col>
                </Row>
                <Row>
                    <table className='table'>
                        <thead>
                            <tr>
                                {/* <th>index_id</th> */}
                                <th>Carburant</th>
                                <th>Pompe_id</th>
                                <th>Quantité avant</th>
                                <th>Quantité après</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {relevers.map(item => (

                                <tr>
                                    {/* <td>{item.relever_id}</td> */}
                                    <td>{item.carburant.nom}</td>
                                    <td>{item.pompe_id}</td>
                                    <td>{item.quantiteAvant}</td>
                                    <td>{item.quantiteApres}</td>
                                    <td>{item.date}</td>
                                    {/* <td><button className="btn btn-success" onClick={() => handleClick(item.relever_id)}>Modifier</button></td> */}
                                    <td><button className="btn btn-danger" onClick={() => supprimer(item.relever_id)}>Supprimer</button></td>
                                </tr>
                            ))
                            }
                        </tbody>
                    </table>

                </Row>
                {/* {!isButton && (
                    <Modal show={true} onHide={() => setIsButton(true)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Relevés</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={handleSubmit}>
                                <div className="d-flex mb-5">
                                    <label htmlFor="carburant">Carburant</label>
                                    <select className="form-select" ref={carburant_id}>
                                        {
                                            carburants.map(item => (
                                                <option key={item.carburant_id} value={item.carburant_id}>{item.nom}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div className="d-flex form-group mb-5">
                                    <label htmlFor="pompe">IDPompe</label>
                                    <select className="form-select" ref={pompe_id}>
                                        {
                                            pompes.map(item => (
                                                <option key={item.pompes_id} value={item.pompe_id}>{item.pompe_id}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="" className="form-label">Quantité du départ :</label>
                                    <input type="number" ref={quantiteAvant} className="form-control" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="" className="form-label">Quantité du départ :</label>
                                    <input type="number" ref={quantiteApres} className="form-control" />
                                </div>

                                <div className="mt-3">
                                    <button type="submit" id="bouton" className="btn btn-success form-control">
                                        Valider
                                    </button>
                                </div>
                            </form>
                        </Modal.Body>
                    </Modal>
                )} */}
            </div>
        </div>

    )
}


export default VoirReleves

