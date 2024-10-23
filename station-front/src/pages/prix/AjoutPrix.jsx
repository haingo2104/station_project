import axios from "axios"
import { useEffect } from "react"
import { useState } from "react"
import { useRef } from "react"
import { Card, CardBody, Col, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import SideBar from "../sidebar/Sidebar"


const AjoutPrix = () => {
  const prix = useRef(null)
  const carburant_id = useRef(null)
  const [carburants, setCarburant] = useState([])
  const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post('http://localhost:9000/prix', {
      prix: prix.current.value,
      carburant_id: carburant_id.current.value,

    }, { withCredentials: true })
      .then(() => {
        navigate('/voirPrix')
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
  }, [])
  return (
    <div className="app">
          <div className="">
            <SideBar />
          </div>
        <div className="col py-3 content">

          <form onSubmit={handleSubmit}>
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
              <input type="number" name="prix " ref={prix} className="form-control" />
            </div>

            <div className="mt-3">
              <button type="submit" id="bouton" className="btn btn-success">Ajouter</button>
            </div>

          </form>

        </div>
    </div>

  )
}

export default AjoutPrix