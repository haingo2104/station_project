import React from 'react';
import axios from "axios"
import { useRef, useState } from "react"
import { useEffect } from "react"
import { Col, Dropdown, Form, Row } from "react-bootstrap"
import SideBar from "../sidebar/Sidebar"
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun } from 'docx';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import logo from "../../images/logo_station.png";
import { useNavigate } from "react-router-dom"

const VoirVente = () => {
    const [ventes, setVentes] = useState([])
    const [triParType, setTriParType] = useState(null)
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedDatePompe, setSelectedDatePompe] = useState("");
    const [pompes, setPompes] = useState([])
    const [pompistes, setPompistes] = useState([])
    const pompeId = useRef(null);
    const pompisteId = useRef(null);
    const [selectedVentes, setSelectedVentes] = useState([]);
    const navigate = useNavigate()
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


    const exportToWord = () => {
        const filteredVentes = ventes.filter(vente => selectedVentes.includes(vente.vente_id));
        const doc = new Document({
            sections: [
                {
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Ventes",
                                    bold: true,
                                    size: 24,
                                }),
                            ],
                        }),
                        new Table({
                            rows: [
                                new TableRow({
                                    children: [
                                        new TableCell({ children: [new Paragraph("vente_id")] }),
                                        new TableCell({ children: [new Paragraph("pompe_id")] }),
                                        new TableCell({ children: [new Paragraph("pompiste_id")] }),
                                        new TableCell({ children: [new Paragraph("Nom")] }),
                                        new TableCell({ children: [new Paragraph("modeDePaie")] }),
                                        new TableCell({ children: [new Paragraph("Total")] }),
                                        new TableCell({ children: [new Paragraph("Date")] }),
                                    ],
                                }),
                                ...filteredVentes.map((vente) =>
                                    new TableRow({
                                        children: [
                                            new TableCell({ children: [new Paragraph(vente.vente_id.toString())] }),
                                            new TableCell({ children: [new Paragraph(vente.pompe_id.toString())] }),
                                            new TableCell({ children: [new Paragraph(vente.pompiste_id.toString())] }),
                                            new TableCell({ children: [new Paragraph(vente.pompiste.nom)] }),
                                            new TableCell({ children: [new Paragraph(vente.modeDePaie.nom)] }),
                                            new TableCell({ children: [new Paragraph(vente.total.toString())] }),
                                            new TableCell({ children: [new Paragraph(vente.date)] }),
                                        ],
                                    })
                                ),
                            ],
                        }),
                    ],
                },
            ],
        });

        Packer.toBlob(doc).then((blob) => {
            saveAs(blob, "ventes.docx");
        });
    };
    // Fonction pour exporter vers Excel
    const exportToExcel = () => {
        const filteredVentes = ventes.filter(vente => selectedVentes.includes(vente.vente_id));
        const data = filteredVentes.map((vente) => ({
            vente_id: vente.vente_id,
            pompe_id: vente.pompe_id,
            pompiste_id: vente.pompiste_id,
            Nom: vente.pompiste.nom,
            modeDePaie: vente.modeDePaie.nom,
            Total: vente.total,
            Date: vente.date,
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Ventes");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "ventes.xlsx");
    };

    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    const exportToPDF = () => {
        const filteredVentes = ventes.filter(vente => selectedVentes.includes(vente.vente_id));
        const documentDefinition = {
            content: [
                { text: 'Ventes', style: 'header' },
                {
                    table: {
                        headerRows: 1,
                        widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                        body: [
                            ['vente_id', 'pompe_id', 'pompiste_id', 'Nom', 'modeDePaie', 'Total', 'Date'],
                            ...filteredVentes.map(vente => [
                                vente.vente_id.toString(),
                                vente.pompe_id.toString(),
                                vente.pompiste_id.toString(),
                                vente.pompiste.nom,
                                vente.modeDePaie.nom,
                                vente.total.toString(),
                                vente.date,
                            ]),
                        ],
                    },
                },
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10],
                },
            },
        };

        pdfMake.createPdf(documentDefinition).download('ventes.pdf');
    };


    const handleExport = (format) => {
        console.log('okkk')
        if (format === 'word') {
            exportToWord();
        } else if (format === 'excel') {
            exportToExcel();
        } else if (format === 'pdf') {
            exportToPDF();
        }
    };


    const supprimer = (id) => {
        axios.delete('http://localhost:9000/ventes/' + id)
            .then(() => {
                setVentes(ventes.filter(value => value.vente_id !== id))
            })
            .catch(e => {
                console.log(e.response.data);

            })
    }
    const trier = (typeTri) => {
        setTriParType(typeTri);
    }

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    }
    const handleDateEtPompeChange = (e) => {
        setSelectedDatePompe(e.target.value);
    }

    const rechercherParDate = async () => {
        await axios.get('http://localhost:9000/ventes/obtenirVentesParDate', {
            params: {
                date: selectedDate
            }
        })
            .then(res => {
                setVentes(res.data.ventes.map(vente => ({
                    ...vente,
                    date: formatDate(vente.date) // Formatage de la date
                })));
            })
            .catch(error => {
                console.log(error);
            });
    }

    const rechercherParPompiste = async () => {
        await axios.get('http://localhost:9000/ventes/obtenirVentesParPompiste', {
            params: {
                pompiste_id: pompisteId.current.value
            }
        })
            .then(res => {
                setVentes(res.data.ventes.map(vente => ({
                    ...vente,
                    date: formatDate(vente.date) // Formatage de la date
                })));
            })
            .catch(error => {
                console.log(error);
            });
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const rechercherParDateEtPompe = async (selectedDate, pompe_id) => {
        await axios.get('http://localhost:9000/ventes/obtenirVentesParPompeParDate', {
            params: {
                pompe_id: pompeId.current.value,
                date: selectedDatePompe
            }
        })
            .then(res => {
                setVentes(res.data.ventes.map(vente => ({
                    ...vente,
                    date: formatDate(vente.date) // Formatage de la date
                })));
            })
            .catch(error => {
                console.log(error);
            });
    }

    const handleCheckboxChange = (venteId) => {
        setSelectedVentes(prevSelectedVentes =>
            prevSelectedVentes.includes(venteId)
                ? prevSelectedVentes.filter(id => id !== venteId)
                : [...prevSelectedVentes, venteId]
        );
    };



    useEffect(() => {
        axios.get('http://localhost:9000/pompes')
            .then(res => {
                setPompes(res.data.pompes)
            })
            .catch(e => console.log(e))

        axios.get('http://localhost:9000/pompistes')
            .then(res => {
                setPompistes(res.data.pompistes)
            })
            .catch(e => console.log(e))

        const fetchData = async () => {
            try {
                let res;
                if (triParType === "recent") {
                    res = await axios.get('http://localhost:9000/ventes/plusRecent');
                } else if (triParType === "date" && selectedDate) {
                    rechercherParDate();
                } else if (triParType === "pompiste" && pompisteId) {
                    rechercherParPompiste();
                } else if (triParType === "ancien") {
                    res = await axios.get('http://localhost:9000/ventes/plusAncien');
                } else if (triParType === "pompeEtDate" && selectedDatePompe) {
                    rechercherParDateEtPompe();
                } else {
                    res = await axios.get('http://localhost:9000/ventes');
                }
                setVentes(res.data.ventes.map(vente => ({
                    ...vente,
                    date: formatDate(vente.date) // Formatage de la date
                })));
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [triParType, selectedDate, selectedDatePompe]);

    return (
        <div className="app">
            <div className="">
                <SideBar />
            </div>
            <div className="col py-3 content">
                <div className="mt-5 mb-5 titre-stat d-flex" style={{ width: "100%" }}>
                    <div style={{ width: "25%" }}>
                        <img src={logo} alt="" style={{ width: "50%", marginTop: "-20px" }} />
                    </div>
                    <div style={{ width: "50%" }}>
                        <h1 className="text-center">Listes des ventes</h1>
                    </div>
                    <div style={{ width: "25%", marginRight: "25px" }} className="text-end">
                        <button onClick={logout} className="btn btn-primary p-3">Déconnexion</button>
                    </div>
                </div>
                <Row>
                    <Col className="col-4">
                        <Form.Select onChange={(e) => trier(e.target.value)}>
                            <option disabled selected>Trier par...</option>
                            <option value="date">Tri par date</option>
                            <option value="pompiste">Tri par pompiste</option>
                            <option value="pompeEtDate">Tri par pompe et par date</option>
                            <option value="recent">Trier plus récent</option>
                            <option value="ancien">Trier plus ancien</option>
                        </Form.Select>

                        {triParType === "date" && (
                            <div className="d-flex mt-3 mb-3" style={{ gap: "15px" }}>

                                <input type="date" className="form-control" value={selectedDate} onChange={handleDateChange} placeholder="Date" />

                                <button className="btn btn-primary mt-2" onClick={rechercherParDate}>Rechercher</button>
                            </div>

                        )}
                        {triParType === "pompeEtDate" && (
                            <div className="d-flex mt-3 mb-3" style={{ gap: "15px" }}>
                                <select ref={pompeId} className="form-control">
                                    <option value="" disabled>
                                        sélectionnez un pompe..
                                    </option>
                                    {pompes.map(pompe => {
                                        return (
                                            <option key={pompe.pompe_id} value={pompe.pompe_id}>{pompe.pompe_id}</option>
                                        )
                                    })}
                                </select>
                                <input type="date" value={selectedDatePompe} onChange={handleDateEtPompeChange} placeholder="Date" />
                                <button className="btn btn-primary mt-2" onClick={rechercherParDateEtPompe}>Rechercher</button>
                            </div>

                        )}
                        {triParType === "pompiste" && (
                            <div className="d-flex mt-3 mb-3" style={{ gap: "15px" }}>
                                <select className="form-control " ref={pompisteId}>
                                    <option value="" disabled>
                                        sélectionnez un pompiste..
                                    </option>
                                    {pompistes.map(pompiste => {
                                        return (
                                            <option key={pompiste.pompiste_id} value={pompiste.pompiste_id}>{pompiste.pompiste_id}</option>
                                        )
                                    })}
                                </select>
                                <button className="btn btn-primary" onClick={rechercherParPompiste}>Rechercher</button>
                            </div>

                        )}

                    </Col>
                </Row>

                <Row>
                    <div className="dropdown text-end mt-5">
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                Exporter
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleExport('word')}>Exporter vers Word</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleExport('excel')}>Exporter vers Excel</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleExport('pdf')}>Exporter vers PDF</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th></th>
                                <th>pompe_id</th>
                                <th>pompiste_id</th>
                                <th>Nom</th>
                                <th>modeDePaie</th>
                                <th>Total (Ar)</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ventes.map(item => (
                                <tr>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedVentes.includes(item.vente_id)}
                                            onChange={() => handleCheckboxChange(item.vente_id)}
                                        />
                                    </td>
                                    <td>{item.pompe_id}</td>
                                    <td>{item.pompiste_id}</td>
                                    <td>{item.pompiste.nom}</td>
                                    <td>{item.modeDePaie.nom}</td>
                                    <td>{item.total}</td>
                                    <td>{item.date}</td>
                                </tr>
                            ))
                            }
                        </tbody>
                    </table>
                </Row>

            </div>
        </div>

    )
}


export default VoirVente

