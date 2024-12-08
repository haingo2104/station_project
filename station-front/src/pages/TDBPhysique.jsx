import React, { useContext } from 'react';
import { Card, CardBody, Col, Row } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import SideBar from "./sidebar/Sidebar";
import { Chart } from 'react-google-charts';
import logo from "../images/logo_station.png";
import html2canvas from 'html2canvas';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { useNavigate } from "react-router-dom";
import { Tooltip } from 'react-tooltip';
import { useAuth } from '../AuthContext';


const TDBPhysique = () => {

  const [venteBymois, setVenteByMois] = useState({ labels: [], datasets: [] })
  const [pompistes, setPompistes] = useState([]);
  const [carburant, setCarburant] = useState([]);
  const [pompe, setPompe] = useState([]);
  const [totauxParMode, setTotauxParMode] = useState({});
  const [totalGlobal, setTotalGlobal] = useState(0);
  const [prixCarburants, setPrixCarburants] = useState([]);
  const [performances, setPerformances] = useState([]);
  const [deletedCarburants, setDeletedCarburants] = useState([]);
  const [benefits, setBenefits] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate()
  const [date, setDate] = useState('2024-06-21');
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, chartRef: null });
  const chartRef1 = useRef(null);
  const chartRef2 = useRef(null);
  const chartRef3 = useRef(null);

  const handlePompiste = (e) => {
    e.preventDefault()
    navigate('/voirPompistes')
  }
  const handlePompe = (e) => {
    e.preventDefault()
    navigate('/pompe')
  }
  const handleViewwCarburant = (e) => {
    e.preventDefault()
    navigate('/voirCarburants')
  }
  const handleContextMenu = (event, chartRef) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      chartRef: chartRef
    });
  };


  const logout = async (e) => {
    // e.preventDefault();
    try {
      const response = await axios.delete('http://localhost:9000/logout', { withCredentials: true });
      console.log("message", response.data.message);
      navigate('/')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }



  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  function getDateToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0, donc +1
    const day = String(today.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {

    const storedDeletedCarburants = localStorage.getItem('deletedCarburants');
    if (storedDeletedCarburants) {
      setDeletedCarburants(JSON.parse(storedDeletedCarburants));
    }

    axios.get('http://localhost:9000/pompistes')
      .then(res => {
        setPompistes(res.data.pompistes);
      })
      .catch(e => console.log(e));

    axios.get('http://localhost:9000/carburants')
      .then(res => {
        setCarburant(res.data.carburants);
      })
      .catch(e => console.log(e));
    axios.get('http://localhost:9000/pompes')
      .then(res => {
        setPompe(res.data.pompes);
      })
      .catch(e => console.log(e));

    // La date souhaitée
    const dateChoisie = getDateToday();
    const formattedDate = formatDate(dateChoisie);

    axios.get('http://localhost:9000/ventes/ObtenirTotalVentesJour', {
      params: {
        date: "2024-12-07",
      }
    })
      .then((response) => {
        setTotauxParMode(response.data.ventes.totauxParMode);
        setTotalGlobal(response.data.ventes.totalGlobal);
      })
      .catch(e => {
        console.log(e);
      });

    axios.get('http://localhost:9000/prix/obtenirPrixCarburants')
      .then((response) => {
        // setPrixCarburants(response.data.prix.map(prix => ({
        //   ...prix,
        //   date: formatDate(prix.Date),
        //   carburant: prix.carburant.nom
        // })));
        const prixCarburants = response.data.prix.filter(prix => !deletedCarburants.includes(prix.carburant_id));

        // Mettre à jour l'état avec les prix des carburants filtrés
        setPrixCarburants(prixCarburants.map(prix => ({
          ...prix,
          date: formatDate(prix.Date),
          carburant: prix.carburant.nom
        })));
      })
      .catch(e => {
        console.log(e);
      });
    axios.get('http://localhost:9000/pompistes/performances')
      .then((response) => {
        // console.log('Prix Carburants:', response.data.prix);
        setPerformances(response.data.performances);
      })
      .catch(e => {
        console.log(e);
      });

    axios.get('http://localhost:9000/ventes/obtenirVentesParMois')
      .then((response) => {
        const ventes = response.data.ventes;

        const ventesParMois = ventes.reduce((acc, vente) => {
          const mois = vente.date.slice(0, 7); // Format YYYY-MM
          if (!acc[mois]) {
            acc[mois] = 0;
          }
          acc[mois] += vente.total; // Remplacez 'total' par le champ correspondant aux ventes
          return acc;
        }, {});
        const chartData = [
          ['Date', 'Total des ventes'], // Entêtes de colonnes
          ...Object.entries(ventesParMois).map(([mois, total]) => [mois, total]),
        ];
        setVenteByMois(chartData);

      })
      .catch(e => {
        console.error('Erreur lors de la requête:', e.response ? e.response.data : e.message);
      });


    const fetchBenefits = async () => {
      try {
        const today = new Date();
        const response = await axios.get(`http://localhost:9000/ventes/benefits`, {
          params: { date: today.toISOString().split('T')[0] }
        });
        setBenefits(response.data.benefits);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchBenefits();

  }, [date]);

  const chartData = [
    ['Mode de Paiement', 'Total Ventes']
  ];

  for (const [mode, total] of Object.entries(totauxParMode)) {
    chartData.push([mode, total]);
  }

  chartData.push(['Total Global', totalGlobal]);

  const dates = [...new Set(prixCarburants.map(prix => prix.date))];

  const carburants = [...new Set(prixCarburants.map(prix => prix.carburant))];

  const chartDataPrix = [
    ['Date', ...carburants]
  ];

  dates.forEach(date => {
    const row = [date];
    carburants.forEach(carburant => {
      const prixObj = prixCarburants.find(prix => prix.date === date && prix.carburant === carburant);
      row.push(prixObj ? prixObj.prix : 0);
    });
    chartDataPrix.push(row);
  });

  const chartDataPerformances = [
    ['Pompiste', 'Total Ventes']
  ];

  performances.forEach(performance => {
    const pompiste = pompistes.find(p => p.pompiste_id === performance.pompiste_id);
    if (pompiste) {
      chartDataPerformances.push([pompiste.nom, performance._sum.total]);
    }
  });

  const pieChartData = [
    ['Carburant', 'Bénéfice Net']
  ];

  Object.keys(benefits).forEach(key => {
    pieChartData.push([key, benefits[key].netBenefit]);
  });

  const pieChartOptions = {
    title: 'Bénéfices par Carburant',
    is3D: true,
  };

  const dataByMonth = [

  ]

  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  if (loading) {
    return <div>Chargement...</div>;
}

// Affichage d'un message d'erreur si la requête échoue
if (error) {
    return <div>{error}</div>;
}

  return (
    <div className="">
      
        <Row className="mb-5 mt-5">
          {user.role === "ADMIN" && (
            <Col xs={12} md={4} className="mb-4">
              <Chart
                chartType="PieChart"
                data={pieChartData}
                options={pieChartOptions}
                width="100%"
                height="300px"
              />
            </Col>
          )}

          <Col xs={12} md={4} className='mb-4'>
            <Chart
              ref={chartRef2}
              height={'300px'}
              chartType="AreaChart"
              data={venteBymois.length > 1 ? venteBymois : [['Date', 'Total des ventes'], [null, 0]]}
              options={{
                title: 'Évolution des ventes par mois',
                chartArea: { width: '60%' },
                hAxis: {
                  title: 'Date',
                  format: 'yyyy-MM',
                },
                vAxis: {
                  title: 'Total des ventes',
                },
                series: {
                  0: { color: '#e2431e' },  // Ajustez les couleurs selon vos besoins
                },
              }}
            />

          </Col>
          <Col xs={12} md={4} className="mb-4">
            <div
              onContextMenu={(e) => handleContextMenu(e, chartRef1)}
              style={{ position: 'relative', width: '100%', height: '300px' }}
            >
              <Chart
                onContextMenu={(e) => handleContextMenu(e, chartRef1)}
                ref={chartRef1}
                // width={'400px'}
                height={'300px'}
                chartType="Bar"
                data={chartData}
                options={{
                  title: 'Total des ventes par mode de paiement',
                  chartArea: { width: '100%' },
                  hAxis: {
                    title: 'Total Ventes',
                    minValue: 0,
                  },
                  vAxis: {
                    title: 'Mode de Paiement',
                  },
                  legend: { position: 'none' }, // Pour éviter que la légende ne chevauche les labels
                  bar: { groupWidth: '75%' },
                  isStacked: true // Pour s'assurer que les barres ne se chevauchent pas
                }}
              />
            </div>
          </Col>
          {/* <div>
            <h2>Bénéfices du {date}</h2>
            {Object.keys(benefits).map((carburant, index) => (
              <div key={index} style={{ marginBottom: '20px' }}>
                <h3>{`Bénéfice net pour ${carburant}`}</h3>
                <div className="bar-container">
                  <div
                    className="bar"
                    // style={{ height: `${benefits[carburant].totalNetBenefit / 100}px` }}
                  >
                    <span>{`${benefits[carburant].totalNetBenefit}`}</span>
                  </div>
                </div>
                <div>
                  <p>Revenue: {benefits[carburant].totalRevenue}</p>
                  <p>Coût: {benefits[carburant].totalCost}</p>
                  <p>Montant TVA: {benefits[carburant].totalTvaAmount}</p>
                  <p>Montant taxe carburant: {benefits[carburant].totalFuelTaxAmount}</p>
                </div>
              </div>
            ))}
          </div> */}
        </Row>


        <Row className="mt-5">
          <Col xs={12} md={4} className="mb-4">
            <div>
              <Col className="col">

                <Card className="bg-success mb-5" onClick={handlePompiste} style={{ width: "100%", height: "65px" }}>
                  <CardBody>
                    <div>
                      <h5 className="text-center">{pompistes.length} pompistes</h5>
                    </div>
                  </CardBody>
                </Card>

              </Col>

              <Col className="col">
                <Card className="bg-warning mb-5" onClick={handleViewwCarburant} style={{ width: "100%", height: "65px" }}>
                  <CardBody>
                    <h5 className="text-center">{carburant.length} types de carburants</h5>
                    {/* <p className="text-center">types de carburants</p> */}
                  </CardBody>
                </Card>
              </Col>
              <Col className="col">
                <Card className="bg-primary mb-5" onClick={handlePompe} style={{ width: "100%", height: "65px" }}>
                  <CardBody>
                    <h5 className="text-center">{pompe.length} pompes</h5>
                  </CardBody>
                </Card>
              </Col>

            </div>
          </Col>
          <Col xs={12} md={4} className="mb-4">
            <div
              onContextMenu={(e) => handleContextMenu(e, chartRef2)}
              style={{ position: 'relative', width: '100%', height: '300px' }}
            >
              <Chart
                onContextMenu={(e) => handleContextMenu(e, chartRef2)}
                ref={chartRef2}
                // width={'600px'}
                height={'300px'}
                chartType="AreaChart"
                data={chartDataPrix.length > 1 ? chartDataPrix : [['Date', 'Prix'], [null, 0]]}
                options={{
                  title: 'Évolution des prix des carburants',
                  chartArea: { width: '60%' },
                  hAxis: {
                    title: 'Date',
                    format: 'yyyy-MM-dd'
                  },
                  vAxis: {
                    title: 'Prix',
                  },
                  series: {
                    0: { color: '#e2431e' },  // Ajustez les couleurs selon vos besoins
                  },
                }}
              />
            </div>
          </Col>
          <Col xs={12} md={4} className="mb-4">
            <div
              onContextMenu={(e) => handleContextMenu(e, chartRef3)}
              style={{ position: 'relative', width: '100%', height: '300px' }}
            >
              <Chart
                onContextMenu={(e) => handleContextMenu(e, chartRef3)}
                ref={chartRef3}
                // width={'600px'}
                height={'300px'}
                chartType="Bar"
                data={chartDataPerformances}
                options={{
                  title: 'Performances des pompistes',
                  chartArea: { width: '60%' },
                  hAxis: {
                    title: 'Total Ventes',
                    minValue: 0,
                  },
                  vAxis: {
                    title: 'Pompiste',
                  },
                  colors: ['#FF5733'],
                  legend: { position: 'none' },
                  bar: { groupWidth: '75%' },
                  isStacked: true
                }}
              />
            </div>
          </Col>
        </Row>

     
    </div >

  );
};

export default TDBPhysique;
