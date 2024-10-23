import axios from "axios"
import { useEffect } from "react"
import { useState } from "react"
import { useRef } from "react"
import { Card, CardBody, Col, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import SideBar from "../sidebar/Sidebar"


const AjoutStock = () => {
  const nouvellequantite = useRef(null)
  const nouveaucarburant_id = useRef(null)
  const [datacarburant, setDataCarburant] = useState([])
  const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post('http://localhost:9000/stocks', {
      carburant_id: nouveaucarburant_id.current.value,
      quantite: nouvellequantite.current.value

    }, { withCredentials: true })
      .then(() => {
        navigate('/voirStock')
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
              <select className="form-select" ref={nouveaucarburant_id}>
                {
                  datacarburant.map(item => (
                    <option key={item.carburant_id} value={item.carburant_id}>{item.nom}</option>
                  ))
                }
              </select>
            </div>
            <div className="form-group input-content mb-3">
              <label htmlFor="quantite">Quantité</label>
              <input type="number" ref={nouvellequantite} className="form-control" />
            </div>

            <div className="mt-3">
              <button type="submit" id="bouton" className="btn btn-success">Ajouter</button>
            </div>

          </form>

        </div>
    </div>

  )
}

export default AjoutStock