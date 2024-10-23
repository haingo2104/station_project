import axios from "axios"
import { useRef } from "react"
import { Card, CardBody, Col, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import SideBar from "../sidebar/Sidebar"


const AjoutCarburant = () => {
  const nom = useRef("")

  const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post('http://localhost:9000/carburants', {
      nom: nom.current.value
    }, { withCredentials: true })
      .then(() => {
        navigate('/voirCarburants')
      })
      .catch(e => {
        console.log(e);
      })
  }
  return (

    <div className="app d-flex" >
      <div>
        <SideBar />
      </div>

      <div className="col-6 py-3 content">
        <form onSubmit={handleSubmit}>
          <div className="form-group input-content mb-3">
            <label htmlFor="" className="form-label">Nom du carburant :</label>
            <input type="text" ref={nom} className="form-control" />
          </div>
          <div className="mt-1 mx-auto">
            <button type="submit" id="bouton" className="btn btn-success">Ajouter</button>
          </div>

        </form>

      </div>
    </div>


  )
}

export default AjoutCarburant