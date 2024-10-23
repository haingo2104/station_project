import { Button } from "react-bootstrap"

const CardButton = ({title, image,onClick}) =>{
  return(
    <Button className="card-button button-card card-btn" onClick={onClick} style={{borderRadius: '1rem', background:"linear-gradient(to right, rgb(43, 105, 105), rgb(221, 159, 188))"}}>
        <h5 style={{textTransform:'capitalize'}}>{title}</h5>
        <img src={image} style={{width:"100%", height:'80%'}}/>
    </Button>
  )
}
export default CardButton