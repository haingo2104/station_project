import React from 'react';
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { Button, Card, CardBody, Col, Modal, Row, Toast } from "react-bootstrap"
import SideBar from "./sidebar/Sidebar"
import logo from "../images/logo_station.png";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userPermissionsActual, setUserPermissionsActual] = useState([]);
    const [availablePermissions, setAvailablePermissions] = useState([]);
    const [modalAvailablePermissions, setModalAvailablePermissions] = useState([]);
    const [userPermissions, setUserPermissions] = useState([]);
    const fullname = useRef()
    const email = useRef()
    const password = useRef()
    const confirmation = useRef()
    const navigate = useNavigate()
    const [users, setUser] = useState([])
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("success");
    const [showA, setShowA] = useState(false);

    const handleEditPermissions = (user) => {
        setSelectedUser(user);
        const userPermissionIds = user.permissions.map(p => p.permission.id);
        console.log("userPermissionIds" , userPermissionIds);
        setUserPermissionsActual(userPermissionIds);
        setShowModal(true); // Afficher le modal
    };

    const handleModalCheckboxChange = (permissionId) => {
        setUserPermissionsActual(prevState => {
            if (prevState.includes(permissionId)) {
                return prevState.filter(id => id !== permissionId);
            } else {
                return [...prevState, permissionId];
            }
        });
    };

    const handleSavePermissions = () => {
        modifierPermissions(selectedUser.user_id, userPermissionsActual);
        setShowModal(false);
    };

    const modifierPermissions = async (userId, permissions) => {
        try {
            await axios.put(`http://localhost:9000/users/${userId}/permissions`, { permissions });
            alert('Permissions mises à jour avec succès');
            // Mettez à jour la liste des utilisateurs si nécessaire
        } catch (error) {
            console.error('Erreur lors de la mise à jour des permissions:', error);
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:9000/register', {
            fullname: fullname.current.value,
            email: email.current.value,
            password: password.current.value,
            confirmation: confirmation.current.value,
            permissions: userPermissions,
        }, { withCredentials: true })
            .then(res => {
                setUser(prevUsers => [...prevUsers, res.data.user]);
                fullname.current.value = '';
                email.current.value = '';
                password.current.value = '';
                confirmation.current.value = '';
                setUserPermissions([]);
                setToastMessage('succès');
                setToastVariant("success");
                setShowA(true);
            })
            .catch(e => {
                setToastMessage('Erreur lors de l\'ajout de l\'utilisateur');
                setToastVariant("danger");
                setShowA(true);
            })
    }
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

    const supprimer = (id) => {
        axios.delete('http://localhost:9000/users/' + id, { withCredentials: true })
            .then(() => {
                setUser(users.filter(value => value.user_id !== id))
            })
            .catch(e => {
                console.error(e.response.data);

            })
    };

    const modifierRole = async (userId, newRole) => {
        try {
            const response = await axios.put(`http://localhost:9000/users/modifierRole/${userId}`, { role: newRole });
            console.log(response.data.message);
        } catch (error) {
            console.error("Erreur lors de la mise à jour du rôle", error);
        }
    };

    const handleCheckboxChange = (permissionId) => {
        setUserPermissions(prevState => {
            if (prevState.includes(permissionId)) {
                return prevState.filter(id => id !== permissionId);
            } else {
                return [...prevState, permissionId];
            }
        });
    };

    useEffect(() => {
        axios.get('http://localhost:9000/users')
            .then(res => {
                setUser(res.data.utilisateurs)
            })
            .catch(e => console.log(e))

        axios.get('http://localhost:9000/permissions')
            .then(res => {
                setAvailablePermissions(res.data.permissions)
                setModalAvailablePermissions(res.data.permissions)
            })
            .catch(e => console.log(e))

    }, [])

    return (
        <div className="app ">
            <div>
                <SideBar />
            </div>
            <div className="content">
                <div className="mt-5 mb-5 titre-stat d-flex" style={{ width: "100%" }}>
                    <div style={{ width: "25%" }}>
                        <img src={logo} alt="" style={{ width: "50%", marginTop: "-20px" }} />
                    </div>
                    <div style={{ width: "50%" }}>
                        <h1 className="text-center">Utilisateurs</h1>
                    </div>
                    <div style={{ width: "25%", marginRight: "25px" }} className="text-end">
                        <button onClick={logout} className="btn btn-primary p-3">Déconnexion</button>
                    </div>
                </div>
                <Row className="mt-3">
                    <form>
                        <Row className="mb-3">
                            <Col>
                                <div className="form-group">
                                    <label htmlFor="fullname">Nom(s) et Prénom(s) :</label>
                                    <input type="text" name="fullname" ref={fullname} placeholder='Fullname' className="form-control form-control-lg" />
                                </div>
                            </Col>
                            <Col>
                                <div className="form-group ">
                                    <label htmlFor="fullname">Email :</label>
                                    <input type="email" name="email" ref={email} placeholder='Email' className="form-control form-control-lg" />
                                </div>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col>
                                <div className="form-group">
                                    <label htmlFor="fullname">Mot de passe :</label>
                                    <input type="password" name="password" ref={password} placeholder='Password' className="form-control form-control-lg" />
                                </div>
                            </Col>
                            <Col>
                                <div className="form-group">
                                    <label htmlFor="fullname">Confirmation de mot de passe :</label>
                                    <input type="password" name="password" ref={confirmation} placeholder='Confirmation' className="form-control form-control-lg" />
                                </div>
                            </Col>

                        </Row>
                        <Row>
                            <h3>Manage Permissions for User</h3>
                            {availablePermissions.map(permission => (
                                <div key={permission.id}>
                                    <input
                                        type="checkbox"
                                        id={`form-permission-${permission.id}`}
                                        name="permissions"
                                        value={permission.id}
                                        checked={userPermissions.includes(permission.id)}
                                        onChange={() => handleCheckboxChange(permission.id)}
                                    />
                                    <label htmlFor={`form-permission-${permission.id}`}>{permission.name}</label>
                                </div>
                            ))}
                        </Row>
                        <div className="d-grid gap-2 mt-3 col-2 mx-auto">
                            <button type="submit" onClick={handleSubmit} id="bouton" className="btn btn-add btn-outline-success btn-lg">Ajouter</button>
                        </div>
                        <div>
                            <Toast onClose={() => setShowA(false)} show={showA} delay={5000} autohide>
                                <Toast.Header>
                                    <strong className="me-auto">Notification</strong>
                                </Toast.Header>
                                <Toast.Body className={`text-${toastVariant}`}>
                                    {toastMessage}
                                </Toast.Body>
                            </Toast>
                        </div>
                    </form>
                </Row>
                <Row className="mt-5">
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Email</th>
                                <th>Rôle</th>
                                <th>Action </th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map(item => (

                                <tr>
                                    <td>{item.fullname}</td>
                                    <td>
                                        {item.email}
                                    </td>
                                    <td>
                                        <select
                                            value={item.role}
                                            onChange={(e) => modifierRole(item.user_id, e.target.value)}
                                            className="form-select"
                                        >
                                            <option value="USER">USER</option>
                                            <option value="ADMIN">ADMIN</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button className="btn btn-primary" style={{ marginRight: "10px" }} onClick={() => handleEditPermissions(item)}> Modifier</button>
                                        <button className="btn btn-danger" style={{ marginLeft: "15px" }} onClick={() => supprimer(item.user_id)}>Supprimer</button>
                                    </td>

                                </tr>
                            ))
                            }
                        </tbody>
                    </table>
                </Row>
                <Row>
                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Modifier les permissions de {selectedUser?.fullname}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <h3>Permissions actuelles de l'utilisateur</h3>
                            {modalAvailablePermissions.map(permission => (
                                <div key={permission.id}>
                                    <input
                                        type="checkbox"
                                        id={`modal-permission-${permission.id}`}
                                        name="permissions"
                                        value={permission.id}
                                        checked={userPermissionsActual.includes(permission.id)}
                                        onChange={() => handleModalCheckboxChange(permission.id)}
                                    />
                                    <label htmlFor={`modal-permission-${permission.id}`}>{permission.name}</label>
                                </div>
                            ))}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>Fermer</Button>
                            <Button variant="primary" onClick={handleSavePermissions}>Sauvegarder</Button>
                        </Modal.Footer>
                    </Modal>

                </Row>
            </div>
        </div>


    )

}

export default Register