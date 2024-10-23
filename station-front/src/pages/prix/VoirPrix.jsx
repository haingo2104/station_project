import axios from "axios"
import { useRef, useState } from "react"
import { useEffect } from "react"
import { Col, Row, Modal } from "react-bootstrap"
import SideBar from "../sidebar/Sidebar"
import { useNavigate } from "react-router-dom"

const VoirPrix = () => {

    const nouvelprix = useRef(null)
    const carburant_id = useRef(null)
    const [carburants, setCarburant] = useState([])
    const navigate = useNavigate()
    const ajouterPrix = (e) => {
        e.preventDefault()
        axios.post('http://localhost:9000/prix', {
            prix: nouvelprix.current.value,
            carburant_id: carburant_id.current.value,

        }, { withCredentials: true })
            .then(() => {
                navigate('/voirPrix')
            })
            .catch(e => {
                console.log(e);
            })
    }

    const [prix, setPrix] = useState([])
    const nouvelleValeurRef = useRef();
    const [selectedId, setSelectedId] = useState(null)
    const [isButton, setIsButton] = useState(true)

    const handleClick = (id) => {
        setSelectedId(id);
        setIsButton(!isButton);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await axios.put(`http://localhost:9000/prix/${selectedId}`, {
                prix: nouvelleValeurRef.current.value,
            });
            setIsButton(true);

        } catch (error) {
            console.error('Erreur lors de la modification :', error.response.data);
        }
    };

    // const voir = (id) => {
    //     axios.get('http://localhost:9000/prix/' + id)
    //         .then(res => {
    //             // console.log(res.data.prix);
    //             setPrixDetail(res.data.prix)
    //         })
    //         .catch(e => console.log(e))

    // }
    const supprimer = (id) => {
        axios.delete('http://localhost:9000/prix/' + id)
            .then(() => {
                console.log('ok');
                setPrix(prix.filter(value => value.prix_id !== id))
            })
            .catch(e => {
                console.error(e.response.data);

            })
    }


    useEffect(() => {
        axios.get('http://localhost:9000/prix')
            .then(res => {
                console.log(res.data.prix);
                setPrix(res.data.prix)
            })
            .catch(e => console.log(e))

        axios.get('http://localhost:9000/carburants', { withCredentials: true })
            .then((res) => {
                setCarburant(res.data.carburants)
            })
            .catch(e => {
                console.log(e);
            })
    }, [prix])

    return (
        <div className="app">
            <div className="">
                <SideBar />
            </div>
            <div className="col py-3 content">
                <Row>
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
                </Row>
                <Row>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>prix_id</th>
                                <th>carburant</th>
                                <th>prix</th>
                                <th>date</th>
                                <th>Action 1</th>
                                <th>Action 2</th>
                            </tr>
                        </thead>

                        <tbody>
                            {prix.map(item => (

                                <tr>
                                    <td>{item.prix_id}</td>
                                    <td>{item.carburant.nom}</td>
                                    <td>{item.prix}</td>
                                    <td>{item.Date}</td>
                                    <td><button className="btn btn-success" onClick={() => handleClick(item.prix_id)}>Modifier</button></td>
                                    <td><button className="btn btn-danger" onClick={() => supprimer(item.prix_id)}>Supprimer</button></td>
                                </tr>
                            ))
                            }
                        </tbody>
                    </table>

                </Row>
                {!isButton && (
                    <Modal show={true} onHide={() => setIsButton(true)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Prix</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={handleSubmit}>
                                <div className="d-flex input-group mb-5">
                                    <input type="number" ref={nouvelleValeurRef} name="prix" className="input" />
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


export default VoirPrix

