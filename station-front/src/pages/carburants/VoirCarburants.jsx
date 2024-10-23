import axios from "axios"
import React from "react"
import { useRef, useState } from "react"
import { useEffect } from "react"
import { Col, Row, Modal } from "react-bootstrap"
import SideBar from "../sidebar/Sidebar"
import { useNavigate } from "react-router-dom"
import logo from "../../images/logo_station.png";

const VoirCarburants = () => {

    const [carburants, setCarburants] = useState([])
    const carburant_id = useRef(null)
    const nouvelprix = useRef(null)
    const nouvelleValeurRef = useRef();
    const [selectedId, setSelectedId] = useState(null)
    const [isButton, setIsButton] = useState(true)
    const [deletedCarburants, setDeletedCarburants] = useState([]);

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



    const nom = useRef("")

    const navigate = useNavigate()
    const ajoutCarburant = (e) => {
        e.preventDefault()
        axios.post('http://localhost:9000/carburants', {
            nom: nom.current.value
        }, { withCredentials: true })
            .then(() => {
                nom.current.value = "";
                navigate('/voirCarburants')
            })
            .catch(e => {
                console.log(e);
            })
    }
    const ajouterPrix = (e) => {
        e.preventDefault()
        axios.post('http://localhost:9000/prix', {
            prix: nouvelprix.current.value,
            carburant_id: carburant_id.current.value,

        }, { withCredentials: true })
            .then(() => {
                nouvelprix.current.value = "";
                navigate('/voirCarburants')
            })
            .catch(e => {
                console.log(e);
            })
    }

    const handleClick = (id) => {
        console.log(id);
        setSelectedId(id);
        setIsButton(!isButton);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await axios.put(`http://localhost:9000/carburants/${selectedId}`, {
                nom: nouvelleValeurRef.current.value,
            });
            setIsButton(true);

        } catch (error) {
            console.error('Erreur lors de la modification :', error.response.data);
        }
    };


    const supprimer = (id) => {
        setDeletedCarburants((prevState) => {
            const updatedDeleted = [...prevState, id];
            localStorage.setItem('deletedCarburants', JSON.stringify(updatedDeleted));
            return updatedDeleted;
        });
    };


    useEffect(() => {
        const storedDeletedCarburants = localStorage.getItem('deletedCarburants');
        if (storedDeletedCarburants) {
            setDeletedCarburants(JSON.parse(storedDeletedCarburants));
        }
        axios.get('http://localhost:9000/carburants')
            .then(res => {

                setCarburants(res.data.carburants)

            })
            .catch(e => console.log(e))
    }, [selectedId, carburants])

    return (

        <div className="app ">
            <div>
                <SideBar />
            </div>

            <div className="py-3 content ">
                {/* <div className="mt-5 mb-5 titre-stat d-flex" style={{ width: "100%" }}>
                    <div style={{ width: "25%" }}>
                        <img src={logo} alt="" style={{ width: "45%", marginTop: "-20px" }} />
                    </div>
                    <div style={{ width: "50%" }}>
                        <h1 className="text-center"></h1>
                    </div>
                    <div style={{ width: "25%", marginRight: "25px" }} className="text-end">
                        <button onClick={logout} className="btn btn-primary p-3">Déconnexion</button>
                    </div>
                </div> */}
                <Row>
                    <Col className=" border p-3">
                        <h4 className="mb-3">Ajout d'un nouveau carburant</h4>
                        <form onSubmit={ajoutCarburant}>
                            <div className="form-group input-content mb-3">
                                <label htmlFor="" className="form-label">Nom du carburant :</label>
                                <input type="text" ref={nom} className="form-control" />
                            </div>
                            <div className="mt-1 mx-auto">
                                <button type="submit" id="bouton" className="btn btn-success">Ajouter</button>
                            </div>

                        </form>
                    </Col>
                    <Col className=" border p-3">
                        <h4 className="mb-3">Modification du prix du carburant</h4>
                        <form onSubmit={ajouterPrix}>
                            <div className="form-group input-content mb-3">
                                <label htmlFor="carburant">Carburant</label>
                                <select className="form-select" ref={carburant_id}>
                                    {
                                        carburants.map(item => (
                                            <option key={item.carburant_id} value={item.carburant_id}>{item.nom}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="form-group input-content mb-3">
                                <label htmlFor="prix">Prix</label>
                                <input type="number" name="prix " ref={nouvelprix} className="form-control" />
                            </div>

                            <div className="mt-3">
                                <button type="submit" id="bouton" className="btn btn-success">Ajouter</button>
                            </div>

                        </form>
                    </Col>

                </Row>
                <Row>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>nom</th>
                                <th>prix</th>
                                <th>Echéance du prix</th>
                                <th>Action 1</th>
                            </tr>
                        </thead>

                        <tbody>
                            {carburants.map(item => (

                                <tr>
                                    <td>{item.nom}</td>
                                    <td>
                                        {item.prix.slice().reverse().map((prixItem, index) => (
                                            <div key={index} style={{ fontWeight: index === 0 ? 'bold' : 'normal' }}>
                                                {prixItem.prix}
                                            </div>
                                        ))}
                                    </td>
                                    <td>
                                        {item.prix.map((prixItem, index) => (
                                            <div key={index}>{formatDate(prixItem.Date)}</div>
                                        ))}
                                    </td>
                                    <td>
                                        <button className="btn btn-success" onClick={() => handleClick(item.carburant_id)}>Modifier</button>
                                        {deletedCarburants.includes(item.carburant_id) ? (
                                            <span style={{ marginLeft: "15px" }}>ne plus actif</span>
                                        ) : (
                                            <button className="btn btn-danger" style={{ marginLeft: "15px" }} onClick={() => supprimer(item.carburant_id)}>Supprimer</button>
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
                            <Modal.Title>Modifier le nom du carburant</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="" className="form-label">nom</label>
                                    <input type="text" ref={nouvelleValeurRef} name="nom" defaultValue={carburants.find(carburant => carburant.carburant_id === selectedId)?.nom} className="form-control" />
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


export default VoirCarburants