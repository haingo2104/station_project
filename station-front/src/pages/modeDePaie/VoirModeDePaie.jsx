import React from 'react';
import axios from "axios"
import { useRef, useState } from "react"
import { useEffect } from "react"
import { Col, Row, Modal } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import SideBar from "../sidebar/Sidebar"
import logo from "../../images/logo_station.png";

const VoirModeDepaie = () => {

    const [modeDepaies, setModeDePaies] = useState([])
    const nouvelleValeurRef = useRef();
    const [selectedId, setSelectedId] = useState(null)
    const [isButton, setIsButton] = useState(true)
    const [deletedModeDePaie, setDeletedModeDePaie] = useState([]);
    const nom = useRef("")

    const navigate = useNavigate()
    const ajoutModeDePaiement = (e) => {
        e.preventDefault()
        axios.post('http://localhost:9000/modeDePaies', {
            nom: nom.current.value
        }, { withCredentials: true })
            .then(() => {
                navigate('/voirModeDepaie')
            })
            .catch(e => {
                console.log(e);
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
    const handleClick = (id) => {
        console.log(id);
        setSelectedId(id);
        setIsButton(!isButton);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await axios.put(`http://localhost:9000/modeDePaies/${selectedId}`, {
                nom: nouvelleValeurRef.current.value,
            });
            setIsButton(true);

        } catch (error) {
            console.error('Erreur lors de la modification :', error.response.data);
        }
    };

    const supprimer = (id) => {
        // axios.delete('http://localhost:9000/modeDePaies/' + id)
        //     .then(() => {
        //         console.log('ok');
        //         setModeDePaies(modeDepaies.filter(value => value.modeDePaie_id !== id))
        //     })
        //     .catch(e => {
        //         console.error('Erreur lors de la modification :', e.response.data);

        //     })
        setDeletedModeDePaie((prevState) => {
            const updatedDeleted = [...prevState, id];
            localStorage.setItem('deletedModeDePaies', JSON.stringify(updatedDeleted));
            return updatedDeleted;
        });
    }


    useEffect(() => {
        const storedDeletedModeDePaies = localStorage.getItem('deletedModeDePaies');
        if (storedDeletedModeDePaies) {
            setDeletedModeDePaie(JSON.parse(storedDeletedModeDePaies));
        }
        axios.get('http://localhost:9000/modeDePaies')
            .then(res => {
                setModeDePaies(res.data.modeDePaies)
            })
            .catch(e => console.log(e))
    }, [selectedId, modeDepaies])

    return (
        <div className="app">
            <div className="">
                <SideBar />
            </div>
            <div className="content py-3">
                <div className="mt-3 mb-5 titre-stat d-flex" style={{ width: "100%" }}>
                    <div style={{ width: "25%" }}>
                        <img src={logo} alt="" style={{ width: "50%", marginTop: "-20px" }} />
                    </div>
                    <div style={{ width: "50%" }}>
                        <h1 className="text-center">Mode de paiement</h1>
                    </div>
                    <div style={{ width: "25%", marginRight: "25px" }} className="text-end">
                        <button onClick={logout} className="btn btn-primary p-3">Déconnexion</button>
                    </div>
                </div>
                <Row>
                    <form onSubmit={ajoutModeDePaiement}>
                        <div className="form-group input-content mb-3 ">
                            <label htmlFor="" className="form-label">Mode de paiement :</label>
                            <input type="text" name="nom " ref={nom} className="form-control" />
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
                                <th>nom</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {modeDepaies.map(item => (

                                <tr>
                                    <td>{item.nom}</td>
                                    <td>
                                        <button className="btn btn-success" onClick={() => handleClick(item.modeDePaie_id)}>Modifier</button>
                                        {deletedModeDePaie.includes(item.modeDePaie_id) ? (
                                            <span style={{ marginLeft: "15px" }}>ne plus actif</span>
                                        ) : (
                                            <button className="btn btn-danger" style={{ marginLeft: "15px" }} onClick={() => supprimer(item.modeDePaie_id)}>Supprimer</button>
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
                            <Modal.Title>Mode de paiement</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {/* <form onSubmit={handleSubmit}>
                                <div className="d-flex input-group mb-5">
                                    <input type="text" ref={nouvelleValeurRef} name="nom" className="input" />
                                </div>
                                <div className="mt-3">
                                    <button type="submit" id="bouton" className="btn btn-success form-control">
                                        Valider
                                    </button>
                                </div>
                            </form> */}
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="" className="form-label">Nom du pompiste</label>
                                    <input type="text" ref={nouvelleValeurRef} name="nom" defaultValue={modeDepaies.find(modeDePaie => modeDePaie.modeDePaie_id === selectedId)?.nom} className="form-control" />
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


export default VoirModeDepaie

