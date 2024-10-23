import axios from "axios"
import { useRef, useState } from "react"
import { useEffect } from "react"



const Vente = () => {

    const [pompiste, setPompiste] = useState([])
    const [pompe, setPompe] = useState([])
    const [modeDePaies, setModeDePaies] = useState([])
    const [activeMode , setActiveMode] = useState(0)
    const [vente , setVente] = useState([])
    const [isDisable , setDisable] = useState(false)

    const ref = useRef(null)
    const montant = useRef(null)
    const total = useRef(0)
    const pompeIdValue = useRef(null)
    const pompisteIdValue = useRef(null)



    useEffect(() => {
        axios.get('http://localhost:9000/pompistes')
            .then(res => {
                setPompiste(res.data.pompistes)
            })
            .catch(e => console.log(e))

        axios.get('http://localhost:9000/pompes')
            .then(res => {
                setPompe(res.data.pompes)
            })
            .catch(e => console.log(e))

        axios.get('http://localhost:9000/modeDePaies')
            .then(res => {
                console.log(res.data.modeDePaies);
                setModeDePaies(res.data.modeDePaies)
            })
            .catch(e => console.log(e))
    }, [])

    const handleModeChange = (e) => {
        setActiveMode(parseInt(e.target.value))
    }

    const addData = (e) => {
        e.preventDefault()
        setVente([
            ...vente ,
            {
                ref_value: activeMode === 0 ? "" : ref.current.value,
                montant: parseInt(montant.current.value),
                modeDePaie_id: modeDePaies[activeMode].modeDePaie_id
            }
        ])
        if(ref.current) {
            ref.current.value = ""
        }
        montant.current.value = ""
        setDisable(true)
    }

    const submitAll = (e) => {
        e.preventDefault()
        const data = {
            total: parseInt(total.current.textContent),
            pompe_id: parseInt(pompeIdValue.current.value),
            pompiste_id: parseInt(pompisteIdValue.current.value),
            modeDePaie_id: modeDePaies[activeMode].modeDePaie_id
        }
        axios.post('http://localhost:9000/ventes',data)
        .then((res)=>{
            vente.forEach(item =>{
                axios.post('http://localhost:9000/references',{...item , vente_id: res.data.vente.vente_id} )
                .then(res=>{
                    setDisable(false)
                    setVente([])
                })
                .catch(e=>{
                    console.log(e);
                })
            })
        })
    }

    return (
        <>
            <div>
                <form onSubmit={submitAll} className="d-flex justify-content-between">
                    <div>
                    <select ref={pompisteIdValue}>
                        {
                            pompiste.map(v => {
                                return (<option value={v.pompiste_id}>{v.nom}</option>)
                            })
                        }
                    </select>
                    <select ref={pompeIdValue}>
                        {
                            pompe.map(v => {
                                return (<option value={v.pompe_id}>{v.pompe_id}</option>)
                            })
                        }
                    </select>
                    <select onChange={handleModeChange} disabled={isDisable}>
                        {
                            modeDePaies.map((v , i) => {
                                return (<option value={i}>{v.nom}</option>)
                            })
                        }
                    </select>
                    </div>
                    <div>
                        <button type="submit" >submit all</button>
                    </div>
                </form>
            </div>

            <div>
                <form onSubmit={addData}>
                   {
                        activeMode !== 0 && (<input type="text" placeholder="reference" ref={ref} />)
                   }
                   <input type="number" placeholder="montant" ref={montant} />
                   <button>Add</button>
                </form>
            </div>

            <div className="container">
                <div className="row text-light">
                    <h3>Total:  <span ref={total}> {vente.length > 0 && vente.map((v => v.montant)).reduce((v , s) => s +=v)}</span></h3>
                    {
                        vente.map((v , i) => {
                            return (
                                <div key={i}>
                                    <ul>
                                        <li>ref: <b>{v.ref_value}</b></li>
                                        <li>montant: <b>{v.montant}</b></li>
                                    </ul>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

        </>
    )
}

export default Vente