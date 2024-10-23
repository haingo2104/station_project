import React from 'react';
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { Col, Row } from "react-bootstrap"
import SideBar from "../sidebar/Sidebar"
import { useNavigate } from "react-router-dom"

const MenuPompe = () => {

    const [pompes, setPompes] = useState([])
    const [pompeDetail, setPompeDetail] = useState({})
    const pompe_id = useRef(null)
    const carburant_id = useRef(null)
    const [carburants, setCarburant] = useState([])
    const [tuyaux, setTuyaux] = useState([])
    const [selectedId, setSelectedId] = useState(null)
    const [isButton, setIsButton] = useState(true)
    const [deletedPompes, setDeletedPompes] = useState([]);
    const navigate = useNavigate()

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const voir = (id) => {
        axios.get('http://localhost:9000/pompes/' + id)
            .then(res => {
                setPompeDetail(res.data.pompe)
            })
            .catch(e => console.log(e))
    }
    const supprimer = (id) => {
        // axios.delete('http://localhost:9000/pompes/' + id)
        //     .then(() => {
        //         console.log('ok');
        //         setPompes(pompes.filter(value => value.pompe_id !== id))
        //     })
        //     .catch(e => {
        //         console.error(e.response.data);

        //     })
        setDeletedPompes((prevState) => {
            const updatedDeleted = [...prevState, id];
            localStorage.setItem('deletedPompes', JSON.stringify(updatedDeleted));
            return updatedDeleted;
        });
    }

    const ajouter = (event) => {
        event.preventDefault();
        axios.post('http://localhost:9000/pompes')
            .then((response) => {
            })
            .catch(e => {
                console.error(e.response.data);

            })
    }

    const ajoutTuyaux = (e) => {
        e.preventDefault()
        axios.post('http://localhost:9000/tuyaux', {
            pompe_id: pompe_id.current.value,
            carburant_id: carburant_id.current.value,

        }, { withCredentials: true })
            .then(() => {
                navigate('/pompe')
            })
            .catch(e => {
                console.log(e);
            })
    }

    useEffect(() => {

        const storedDeletedPompes = localStorage.getItem('deletedPompes');
        if (storedDeletedPompes) {
            setDeletedPompes(JSON.parse(storedDeletedPompes));
        }
        axios.get('http://localhost:9000/pompes')
            .then(res => {

                setPompes(res.data.pompes)

            })
            .catch(e => console.log(e))


        // axios.get('http://localhost:9000/pompes')
        //     .then(res => {
        //         setPompes(res.data.pompes)
        //     })
        //     .catch(e => console.log(e))
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
    }, [pompes])

    return (
        <div className="app">
            <div className="">
                <SideBar />
            </div>
            <div className="py-3 content">
                <Row>
                    <Col className="border p-3">
                        <div>
                            <h4>Ajouter pompe</h4>
                            <button className="btn btn-success mb-3 mt-3" onClick={ajouter}>Ajouter</button>
                        </div>
                    </Col>
                    <Col className="border p-3">
                        <h4>Configuration du pompe</h4>
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

                    </Col>

                </Row>
                <Row>

                    <table className='table'>
                        <thead>
                            <tr>
                                <th>pompe_id</th>
                                <th>tuyau_id</th>
                                <th>carburant</th>
                                <th>Action </th>
                            </tr>
                        </thead>

                        <tbody>
                            {pompes.map(item => (

                                <tr>
                                    <td>{item.pompe_id}</td>
                                    <td>
                                        {item.tuyaux.map((tuyauxItem, index) => (
                                            <div key={index}>{tuyauxItem.tuyau_id}</div>
                                        ))}
                                    </td>
                                    <td>
                                        {item.tuyaux.map((tuyauxItem, index) => (
                                            <div key={index}>{tuyauxItem.carburant.nom}</div>
                                        ))}
                                    </td>
                                    <td>
                                        {deletedPompes.includes(item.pompe_id) ? (
                                            <span>ne plus actif</span>
                                        ) : (
                                            <button className="btn btn-danger" onClick={() => supprimer(item.pompe_id)}  >Supprimer</button>
                                        )}
                                    </td>

                                    {/* <td><button className="btn btn-danger" onClick={() => supprimer(item.pompe_id)}>Supprimer</button></td> */}

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


export default MenuPompe