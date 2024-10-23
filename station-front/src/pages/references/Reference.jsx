import React from 'react';
import axios from "axios"
import { useState } from "react"
import { useEffect } from "react"
import { Row } from "react-bootstrap"
import SideBar from "../sidebar/Sidebar"
import logo from "../../images/logo_station.png";
import { useNavigate } from "react-router-dom"

const Reference = () => {
    const [references, setReferences] = useState([])
    const navigate = useNavigate()
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

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


    const supprimer = (id) => {
        axios.delete('http://localhost:9000/references/' + id)
            .then(() => {
                console.log('ok');
                setReferences(references.filter(value => value.reference_id !== id))
            })
            .catch(e => {
                console.log(e.response.data);

            })
    }


    useEffect(() => {
        axios.get('http://localhost:9000/references')
            .then(res => {
                setReferences(res.data.references)
            })
            .catch(e => console.log(e))
    }, [references])

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
                        <h1 className="text-center">Références</h1>
                    </div>
                    <div style={{ width: "25%", marginRight: "25px" }} className="text-end">
                        <button onClick={logout} className="btn btn-primary p-3">Déconnexion</button>
                    </div>
                </div>
                <Row>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>reference_id</th>
                                <th>vente_id</th>
                                <th>ModeDePaie</th>
                                <th>Montant</th>
                                <th>référence</th>
                                <th>Date</th>
                                <th>Action</th>

                            </tr>
                        </thead>
                        <tbody>
                            {references.map(item => (
                                <tr>
                                    <td>{item.reference_id}</td>
                                    <td>{item.vente_id}</td>
                                    <td>{item.modeDePaie.nom}</td>
                                    <td>{item.montant}</td>
                                    <td>{item.ref_value}</td>
                                    <td>{formatDate(item.date)}</td>
                                    <td><button className="btn btn-danger" onClick={() => supprimer(item.reference_id)}>Supprimer</button></td>
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


export default Reference

