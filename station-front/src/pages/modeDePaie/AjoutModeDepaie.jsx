import axios from "axios"
import { useRef } from "react"
import { Card, CardBody, Col, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import SideBar from "../sidebar/Sidebar"


const AjoutModeDepaie = () => {
  const nom = useRef("")

  const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post('http://localhost:9000/modeDePaies', {
      nom: nom.current.value
    }, { withCredentials: true })
      .then(() => {
        navigate('/menu')
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
              <label htmlFor="" className="form-label">Mode de paiement :</label>
              <input type="text" name="nom " ref={nom} className="form-control" />
            </div>

            <div className="mt-3">
              <button type="submit" id="bouton" className="btn btn-success">Create</button>
            </div>

          </form>
        </div>
    </div>

  )
}

export default AjoutModeDepaie