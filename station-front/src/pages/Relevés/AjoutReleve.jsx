import axios from "axios"
import { useRef, useState } from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import SideBar from "../sidebar/Sidebar"



const AjoutReleve = () => {

    const nouveauQuantiteAvant = useRef(null)
    const nouveauQuantiteApres = useRef(null)
    const [dataCarburant, setDataCarburant] = useState([])
    const [datapompes, setdataPompes] = useState([])
    const nouveauPompe_id = useRef(null)
    const nouveauCarburant_id = useRef(null)
    const navigate = useNavigate()

    const handleSubmit = () => {
        axios.post('http://localhost:9000/relevers', {
            pompe_id: nouveauPompe_id.current.value,
            carburant_id: nouveauCarburant_id.current.value,
            quantiteAvant: nouveauQuantiteAvant.current.value,
            quantiteApres: nouveauQuantiteApres.current.value

        }, { withCredentials: true })
            .then(() => {
                navigate('/voirTuyaux')
            })
            .catch(e => {
                console.log(e);
            })
    }
    useEffect(() => {
        axios.get('http://localhost:9000/carburants', { withCredentials: true })
            .then((res) => {
                setDataCarburant(res.data.carburants)
            })
            .catch(e => {
                console.log(e);
            })

        axios.get('http://localhost:9000/pompes', { withCredentials: true })
            .then((res) => {
                setdataPompes(res.data.pompes)
            })
            .catch(e => {
                console.log(e);
            })
    }, [])

    return (
        <div className="app">
            <div className="">
                <SideBar />
            </div>
            <div className="col py-3 content">
                <form action="" >
                    <div className="d-flex mb-3 input-container">
                        <div className="form-group input-content">
                            <label htmlFor="" className="form-label">Quantité du départ :</label>
                            <input type="number" ref={nouveauQuantiteAvant} className="form-control" />
                        </div>
                        <div className="form-group input-content">
                            <label htmlFor="" className="form-label">Quantité Après vente :</label>
                            <input type="number" ref={nouveauQuantiteApres} className="form-control" />
                        </div>
                    </div>
                    <div className="d-flex mb-3 input-container">
                        <div className="input-content">
                            <label htmlFor="carburant ">Carburant</label>
                            <select className="form-select" ref={nouveauCarburant_id}>
                                {
                                    dataCarburant.map(item => (
                                        <option key={item.carburant_id} value={item.carburant_id}>{item.nom}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="input-content">
                            <label htmlFor="carburant">IDPompe</label>
                            <select className="form-select" ref={nouveauPompe_id}>
                                {
                                    datapompes.map(item => (
                                        <option key={item.pompe_id} value={item.pompe_id}>{item.pompe_id}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <div>
                        <button onClick={handleSubmit} className="btn btn-primary mt-4">Ajouter</button>
                    </div>
                </form>

            </div>
        </div>

    )
}

export default AjoutReleve