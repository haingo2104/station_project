import { Button } from "react-bootstrap"

const CardVente = ({title}) =>{
  return(
    <Button className="card-button button-card card-btn-vente" style={{borderRadius: '1rem', background:"linear-gradient(to right, rgb(43, 105, 105), rgb(221, 159, 188))"}}>
        <h5 style={{textTransform:'capitalize'}}>{title}</h5>
    </Button>
  )
}
export default CardVente