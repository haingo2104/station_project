import axios from "axios"
import { useEffect } from "react"
import { useState } from "react"
import { useRef } from "react"
import { Card, CardBody, Col, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import SideBar from "../sidebar/Sidebar"


const AjoutTuyaux = () => {
  const pompe_id = useRef(null)
  const carburant_id = useRef(null)
  const [carburants, setCarburant] = useState([])
  const [pompes, setPompes] = useState([])
  const navigate = useNavigate()
  const handleSubmit = (e) => {
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

  useEffect(() => {
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
  }, [])
  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <SideBar />
          </div>
        </div>
        <div className="col py-3">
          <form onSubmit={handleSubmit}>
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

        </div>
      </div>
    </div>

  )
}

export default AjoutTuyaux