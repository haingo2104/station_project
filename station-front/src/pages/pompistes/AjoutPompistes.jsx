import axios from "axios"
import { useRef } from "react"
import { Card, CardBody, Col, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import SideBar from "../sidebar/Sidebar"


const AjoutPompiste = () => {
  const nom = useRef("")

  const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post('http://localhost:9000/pompistes', {
      nom: nom.current.value
    }, { withCredentials: true })
      .then(() => {
        navigate('/voirPompistes')
      })
      .catch(e => {
        console.log(e);
      })
  }
  return (
    <div className="app">
          <div className="">
            <SideBar />
          </div>
        <div className="col py-3 content">


          <form onSubmit={handleSubmit}>
            <div className="form-group input-content mb-3 ">
              <label htmlFor="" className="form-label">Nom du pompiste :</label>
              <input type="text" name="nom " ref={nom} className="form-control" />
            </div>
            
            <div className="mt-3">
              <button type="submit" id="bouton" className="btn btn-success">Ajouter</button>
            </div>

          </form>

      </div>
    </div>

  )
}

export default AjoutPompiste