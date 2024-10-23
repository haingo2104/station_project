import { Card, CardBody, Col, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

const MenuPrix = () =>{
    const navigate = useNavigate()
    const handleAdd = () =>{
        navigate('/ajouterPrix')
    }
    const handleView = () =>{
        navigate('/voirPrix')
    }
    return(
    <div className="container-fluid">
      <Row className='d-flex justify-content-center align-items-center h-100'>
        <Col className="col-12">
          <Card className='bg-dark text-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '400px'}}>
            <CardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>
              
                <div className="mt-3">
                  <button id="bouton" onClick={handleAdd} className="btn btn-success">Ajouter prix</button>
                </div>
                <div className="mt-3">
                  <button id="bouton" onClick={handleView} className="btn btn-success">Voir Tous les prix des carburants</button>
                </div>
                
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
    )
}
export default MenuPrix