import axios from "axios"
import { useRef, useState } from "react"
import { useEffect } from "react"
import { Col, Row, Modal } from "react-bootstrap"
import SideBar from "../sidebar/Sidebar"
import { useNavigate } from "react-router-dom"

const VoirTuyaux = () => {
    const [tuyaux, setTuyaux] = useState([])
    const [tuyauxDetail, setTuyauxDetail] = useState({})
    const nouvelleValeurRef = useRef();
    const [selectedId, setSelectedId] = useState(null)
    const [isButton, setIsButton] = useState(true)
    const pompe_id = useRef(null)
    const carburant_id = useRef(null)
    const [carburants, setCarburant] = useState([])
    const [pompes, setPompes] = useState([])
    const navigate = useNavigate()

    const handleClick = (id) => {
        setSelectedId(id);
        setIsButton(!isButton);
    }

    const ajoutTuyaux = (e) => {
        e.preventDefault()
        axios.post('http://localhost:9000/tuyaux', {
            pompe_id: pompe_id.current.value,
            carburant_id: carburant_id.current.value,

        }, { withCredentials: true })
            .then(() => {
                navigate('/voirTuyaux')
            })
            .catch(e => {
                console.log(e);
            })
    }


    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await axios.patch(`http://localhost:9000/tuyaux/${selectedId}`, {
                carburant: nouvelleValeurRef.current.value,
            });
            setIsButton(true);

        } catch (error) {
            console.error('Erreur lors de la modification :', error.response.data);
        }
    };

    const voir = (id) => {
        axios.get('http://localhost:9000/tuyaux/' + id)
            .then(res => {
                // console.log(res.data.prix);
                setTuyauxDetail(res.data.tuyau)
            })
            .catch(e => console.log(e))

    }
    const supprimer = (id) => {
        axios.delete('http://localhost:9000/tuyaux/' + id)
            .then(() => {
                console.log('ok');
                setTuyaux(tuyaux.filter(value => value.tuyau_id !== id))
            })
            .catch(e => {
                console.error(e.response.data);

            })
    }


    useEffect(() => {
        axios.get('http://localhost:9000/tuyaux')
            .then(res => {
                setTuyaux(res.data.tuyaux)
            })
            .catch(e => console.log(e))

        axios.get('http://localhost:9000/carburants', { withCredentials: true })
            .then((res) => {
                setCarburant(res.data.carburants)
            })
            .catch(e => {
                console.log(e);
            })

        axios.get('http://localhost:9000/pompes', { withCredentials: true })
            .then((res) => {
                setPompes(res.data.pompes)
            })
            .catch(e => {
                console.log(e);
            })
    }, [selectedId, tuyaux])

    return (
        <div className="app">
            <div className="">
                <SideBar />
            </div>
            <div className="col py-3 content">
                <Row>
                    <form onSubmit={ajoutTuyaux}>
                        <div className="form-group input-content mb-3">
                            <label htmlFor="carburant">Carburant :</label>
                            <select className="form-select" ref={carburant_id}>
                                {
                                    carburants.map(item => (
                                        <option key={item.carburant_id} value={item.carburant_id}>{item.nom}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="form-group input-content mb-3">
                            <label htmlFor="pompe">IDPompe :</label>
                            <select className="form-select" ref={pompe_id}>
                                {
                                    pompes.map(item => (
                                        <option key={item.pompes_id} value={item.pompe_id}>{item.pompe_id}</option>
                                    ))
                                }
                            </select>
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
                                <th>tuyaux_id</th>
                                <th>carburant</th>
                                <th>pompe_id</th>
                                <th>Action 1</th>
                                <th>Action 2</th>
                            </tr>
                        </thead>

                        <tbody>
                            {tuyaux.map(item => (

                                <tr>
                                    <td>{item.tuyau_id}</td>
                                    <td>{item.carburant.nom}</td>
                                    <td>{item.pompe_id}</td>
                                    <td><button className="btn btn-success" onClick={() => handleClick(item.tuyau_id)}>Modifier</button></td>
                                    <td><button className="btn btn-danger" onClick={() => supprimer(item.tuyau_id)}>Supprimer</button></td>
                                </tr>
                            ))
                            }
                        </tbody>
                    </table>

                </Row>
                {!isButton && (
                    <Modal show={true} onHide={() => setIsButton(true)}>
                        <Modal.Header closeButton>
                            <Modal.Title>tuyau</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={handleSubmit}>
                                <div className="d-flex input-group mb-5">
                                    <input type="text" ref={nouvelleValeurRef} name="carburant" className="input" />
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
        // <div className="container-fluid">
        //     <div className="container">
        //         <Row>
        //             {tuyaux.map(item => (
        //                 <Row className="mb-3 bg-light p-2" style={{ borderRadius: '1rem' }} key={item.tuyau_id}>
        //                     <Col className="col-8 ">
        //                         {item.tuyau_id}
        //                         {item.tuyau_id === tuyauxDetail.tuyau_id && (
        //                             <div>

        //                                     <div>
        //                                         <h4>Carburant : {tuyauxDetail.carburant.nom}</h4>
        //                                         <h4>pompe_id : {tuyauxDetail.pompe_id} </h4>

        //                                     </div>


        //                             </div>
        //                         )}
        //                     </Col>
        //                     <Col className="col-4">
        //                         <div className="d-flex">
        //                             <button className="btn btn-warning" onClick={() => voir(item.tuyau_id)} style={{ marginRight: "10px" }}>Voir</button>
        //                             <button className="btn btn-info" onClick={() => handleClick(item.tuyau_id)} style={{ marginRight: "10px" }}>Modifier</button>
        //                             <button className="btn btn-danger" onClick={() => supprimer(item.tuyau_id)}>Supprimer</button>
        //                         </div>

        //                     </Col>
        //                 </Row>
        //             ))}
        //         </Row>
        //         {!isButton && (
        //             <Modal show={true} onHide={() => setIsButton(true)}>
        //                 <Modal.Header closeButton>
        //                     <Modal.Title>tuyau</Modal.Title>
        //                 </Modal.Header>
        //                 <Modal.Body>
        //                     <form onSubmit={handleSubmit}>
        //                         <div className="d-flex input-group mb-5">
        //                             <input type="text" ref={nouvelleValeurRef} name="carburant" className="input" />
        //                         </div>
        //                         <div className="mt-3">
        //                             <button type="submit" id="bouton" className="btn btn-success form-control">
        //                                 Valider
        //                             </button>
        //                         </div>
        //                     </form>
        //                 </Modal.Body>
        //             </Modal>
        //         )}
        //     </div>

        // </div>
    )
}


export default VoirTuyaux

