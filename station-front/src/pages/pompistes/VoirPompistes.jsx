import React from 'react';
import axios from "axios"
import { useRef, useState } from "react"
import { useEffect } from "react"
import { Col, Row, Modal } from "react-bootstrap"
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
            salaire : salaire.current.value
        }, { withCredentials: true })
            .then((res) => {
                setPompistes(prevPompistes => [...prevPompistes, res.data.pompistes]);
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

    const handleClick = (id) => {
        setSelectedId(id);
        setIsButton(!isButton);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await axios.put(`http://localhost:9000/pompistes/${selectedId}`, {
                nom: nouvelleValeurRef.current.value,
                salaire : nouveauSalaire.current.value
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
                        <h1 className="text-center">Pompistes</h1>
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
                            <label htmlFor="" className="form-label">Salaire :</label>
                            <input type="number" name="salaire " ref={salaire} className="form-control" />
                        </div>
                        <div className="mt-3">
                            <button type="submit" id="bouton" className="btn btn-success">Ajouter</button>
                        </div>

                    </form>
                </Row>
                <Row>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Salaire</th>
                                <th>Action </th>
                            </tr>
                        </thead>

                        <tbody>
                            {pompistes.map(item => (

                                <tr key={item.pompiste_id}>
                                    <td>{item.nom}</td>
                                    <td>{item.salaire}</td>
                                    <td>
                                        <button className="btn btn-success" onClick={() => handleClick(item.pompiste_id)}>Modifier</button>
                                        {deletedPompistes.includes(item.pompiste_id) ? (
                                            <span style={{ marginLeft: "15px" }}>Licencié</span>
                                        ) : (
                                            <button className="btn btn-danger" style={{ marginLeft: "15px" }} onClick={() => supprimer(item.pompiste_id)}>Supprimer</button>
                                        )}
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

