import { useState, useEffect } from 'react';
import axios from 'axios';
import { Col, ProgressBar, Row } from 'react-bootstrap';

const StockPompes = () => {
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:9000/stocks/afficherStock')
    .then(res => {
        
        setStockData(res.data.stocks);
    })
    .catch(e=>{
        console.log(e);
    })
    // const fetchStockData = async () => {
    //   try {
    //     const response = await axios.get('http://localhost:9000/stocks/afficherStock');
    //     setStockData(response.data.relevers);
    //   } catch (error) {
    //     console.error('Erreur lors de la récupération des données de stock:', error);
    //   }
    // };

    // fetchStockData();
  }, []);

  return (
    <div>
      <h1>Quantités après vente par Pompe et Carburant</h1>
      <Row>
                {stockData.map((item, index) => (
                    <Col key={index} xs={12} md={6} lg={4}>
                        <div className="stock-tube">
                            <h2>{item.pompe_id} - {item.carburant_id}</h2>
                            <ProgressBar 
                                now={(item.quantiteApres / item.capacite) * 100} 
                                label={`${item.quantiteApres} / ${item.capacite}`} 
                                variant={item.quantiteApres < item.stockSeuil ? 'danger' : 'success'}
                            />
                        </div>
                    </Col>
                ))}
            </Row>
    </div>
  );
};

export default StockPompes;