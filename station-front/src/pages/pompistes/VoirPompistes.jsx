import React from 'react';
import axios from "axios"
import { useRef, useState } from "react"
import { useEffect } from "react"
import { Col, Row, Modal, Button, Form, Table, ModalBody } from "react-bootstrap"
import SideBar from "../sidebar/Sidebar"
import { useNavigate } from "react-router-dom"
import logo from "../../images/logo_station.png";

const VoirPompistes = () => {

    const nom = useRef("")
    const salaire = useRef(0)

    const navigate = useNavigate()
    const ajoutPompiste = (e) => {
        e.preventDefault()
        axios.post('http://localhost:9000/pompistes', {
            nom: nom.current.value,
            salaire: salaire.current.value
        }, { withCredentials: true })
            .then((res) => {
                const nouveauPompiste = res.data.pompistes;
                setDeletedPompistes(prevState => prevState.filter(id => id !== nouveauPompiste.pompiste_id));
                setPompistes(prevPompistes => [...prevPompistes, nouveauPompiste]);
                navigate('/voirPompistes')
            })
            .catch(e => {
                console.log(e);
            })
    }
    const [pompistes, setPompistes] = useState([])
    const nouvelleValeurRef = useRef();
    const nouveauSalaire = useRef();
    const [selectedId, setSelectedId] = useState(null)
    const [isButton, setIsButton] = useState(true)
    const [deletedPompistes, setDeletedPompistes] = useState([]);
    const [showList, setShowList] = useState(false); // État pour afficher ou masquer la liste
    const [showActive, setShowActive] = useState(true); // Case à cocher "Actifs"
    const [showDeleted, setShowDeleted] = useState(false); // Case à cocher "Supprimés"
    const [selectedPompiste, setSelectedPompiste] = useState(null); // Pompiste actuellement sélectionné
    const [showDetailsModal, setShowDetailsModal] = useState(false); // Affichage du modal des détails

    const handleShowDetails = (pompiste) => {
        setSelectedPompiste(pompiste); // Définit le pompiste sélectionné
        setShowDetailsModal(true); // Affiche le modal
    };


    const handleClick = (id) => {
        setSelectedId(id);
        setIsButton(!isButton);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await axios.put(`http://localhost:9000/pompistes/${selectedId}`, {
                nom: nouvelleValeurRef.current.value,
                salaire: nouveauSalaire.current.value
            });
            setIsButton(true);

        } catch (error) {
            console.error('Erreur lors de la modification :', error.response.data);
        }
    };

    const supprimer = (id) => {

        setDeletedPompistes((prevState) => {
            const updatedDeleted = [...prevState, id];
            localStorage.setItem('deletedPompistes', JSON.stringify(updatedDeleted));
            return updatedDeleted;
        });
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
        const storedDeletedPompistes = localStorage.getItem('deletedPompistes');
        if (storedDeletedPompistes) {
            setDeletedPompistes(JSON.parse(storedDeletedPompistes));
        }
        axios.get('http://localhost:9000/pompistes')
            .then(res => {
                setPompistes(res.data.pompistes)
            })
            .catch(e => console.log(e))
    }, [selectedId])

    const filteredPompistes = pompistes.filter((pompiste) => {
        if (showActive && !deletedPompistes.includes(pompiste.pompiste_id)) return true;
        if (showDeleted && deletedPompistes.includes(pompiste.pompiste_id)) return true;
        return false;
    });

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
                        <h3 className="text-center">Gestion des pompistes</h3>
                    </div>
                    <div style={{ width: "25%", marginRight: "25px" }} className="text-end">
                        <button onClick={logout} className="btn btn-primary p-3">Déconnexion</button>
                    </div>
                </div>
                <Row>
                    <form onSubmit={ajoutPompiste}>
                        <div className="form-group input-content mb-3 ">
                            <label htmlFor="" className="form-label">Nom du pompiste :</label>
                            <input type="text" name="nom " ref={nom} className="form-control" />
                        </div>
                        <div className="form-group input-content mb-3 ">
                            <label htmlFor="" className="form-label">Salaire (Ar) :</label>
                            <input type="number" name="salaire " ref={salaire} className="form-control" />
                        </div>
                        <div className="mt-3">
                            <button type="submit" id="bouton" className="btn btn-success">Ajouter</button>
                        </div>

                    </form>
                </Row>
                <Row className="mt-4">
                    <Button variant="info" onClick={() => setShowList(!showList)}>
                        {showList ? "Masquer les pompistes" : "Voir les pompistes"}
                    </Button>
                </Row>
                {showList && (
                    <>
                        <Row className="mt-3">
                            <Form.Check
                                type="checkbox"
                                label="Afficher les employés actuellement en poste"
                                checked={showActive}
                                onChange={() => setShowActive(!showActive)}
                            />
                            <Form.Check
                                type="checkbox"
                                label="Afficher les anciens employés"
                                checked={showDeleted}
                                onChange={() => setShowDeleted(!showDeleted)}
                            />
                        </Row>
                        <Row className="mt-3">
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Nom</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPompistes.map((item) => (
                                        <tr key={item.pompiste_id}>
                                            <td>{item.nom}</td>
                                            <td>
                                                <Button variant="warning" style={{ marginRight: "10px" }} onClick={() => handleShowDetails(item.pompiste_id)}>Détails</Button>
                                                <Button variant="success" onClick={() => handleClick(item.pompiste_id)}>Modifier</Button>
                                                {deletedPompistes.includes(item.pompiste_id) ? (
                                                    <span className="ms-3">Licencié</span>
                                                ) : (
                                                    <Button
                                                        variant="danger"
                                                        className="ms-3"
                                                        onClick={() => supprimer(item.pompiste_id)}
                                                    >
                                                        Supprimer
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Row>
                        {/* Modal Détails */}
                        <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Détails du pompiste</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {selectedPompiste ? (
                                    <div>
                                        <strong>Nom :</strong> {pompistes.find(pompiste => pompiste.pompiste_id === selectedPompiste)?.nom} <br />
                                        <strong>Salaire :</strong> {pompistes.find(pompiste => pompiste.pompiste_id === selectedPompiste)?.salaire} Ar
                                        {deletedPompistes.includes(selectedPompiste) ? (
                                            <div><strong>Statut :</strong> Licencié</div>
                                        ) : (
                                            <div><strong>Statut :</strong> Actif</div>
                                        )}
                                    </div>
                                ) : (
                                    <div>Aucune information disponible.</div>
                                )}
                            </Modal.Body>
                            <Modal.Footer>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowDetailsModal(false)}
                                >
                                    Fermer
                                </button>
                            </Modal.Footer>
                        </Modal>

                    </>
                )}
                {!isButton && (
                    <Modal show={true} onHide={() => setIsButton(true)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Modifier le nom du pompiste</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="" className="form-label">Nom du pompiste</label>
                                    <input type="text" ref={nouvelleValeurRef} name="nom" defaultValue={pompistes.find(pompiste => pompiste.pompiste_id === selectedId)?.nom} className="form-control" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="" className="form-label">Salaire</label>
                                    <input type="number" ref={nouveauSalaire} name="nouveauSalaire" defaultValue={pompistes.find(pompiste => pompiste.pompiste_id === selectedId)?.salaire} className="form-control" />
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


export default VoirPompistes

