import React, { useEffect, useState } from 'react';
import {
    CDBSidebar,
    CDBSidebarContent,
    CDBSidebarFooter,
    CDBSidebarHeader,
    CDBSidebarMenu,
    CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import logo from "../../images/logo_station.png";
import { useAuth } from '../../AuthContext';
import axios from 'axios';

function SideBar() {
    const [permissions, setPermissions] = useState([]);
    const [isCollapsedVente, setCollapsedVente] = useState(false);
    const { user } = useAuth();

    const toggleCollapseVente = () => {
        setCollapsedVente(!isCollapsedVente);
    };

    useEffect(() => {
        // Assurez-vous que user est disponible avant de faire des requêtes
        if (user && user.user_id && user.role !== 'ADMIN') {
            const userId = user.user_id;
            console.log('Fetching permissions for user:', userId);
            axios.get(`http://localhost:9000/permissions/${userId}/`)
                .then(res => {
                    console.log('Permissions récupérées:', res.data.permissions);
                    setPermissions(res.data.permissions); // Mise à jour des permissions
                })
                .catch(e => console.log('Erreur lors de la récupération des permissions:', e));
        }
    }, [user]);

    const hasPermission = (permissionName) => {
        return user && (user.role === 'ADMIN' || permissions.includes(permissionName));
    };

    // Si user n'est pas encore disponible, afficher un indicateur de chargement
    if (!user) {
        return <div>Loading...</div>;
    }
    return (
        <div className='sidebar' style={{ position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>

            <CDBSidebar textColor="#fff" backgroundColor="#222831" className='' >
                <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
                    <div>
                        <a href="/" >
                            {/* <img src={logo} width = "75%" alt="Logo de la société" className="softwelllogo" /> */}
                        </a>
                        <h3>Paramètres</h3>
                    </div>
                </CDBSidebarHeader>

                <CDBSidebarContent className="sidebar-content">
                    <CDBSidebarMenu>
                        {hasPermission('dashboard') ? (
                            <NavLink exact to="/menu" activeClassName="activeClicked">
                                <CDBSidebarMenuItem icon="columns">Tableau de bord</CDBSidebarMenuItem>
                            </NavLink>
                        ) : (
                            <div></div>
                        )}


                        {user.role === 'ADMIN' ? (
                            <NavLink exact to="/register" activeClassName="activeClicked">
                                <CDBSidebarMenuItem icon="fas fa-users-cog">Utilisateurs</CDBSidebarMenuItem>
                            </NavLink>
                        ) : (
                            <div></div>
                        )}
                        {hasPermission('gestion_carburant') ? (
                            <NavLink exact to="/voirCarburants" activeClassName="activeClicked">
                                <CDBSidebarMenuItem icon="fas fa-gas-pump">Carburants</CDBSidebarMenuItem>
                            </NavLink>
                        ) : (
                            <div></div>
                        )}

                        {hasPermission('gestion_pompe') ? (
                            <NavLink exact to="/pompe" activeClassName="activeClicked">
                                <CDBSidebarMenuItem icon="fas fa-tachometer-alt">Pompes</CDBSidebarMenuItem>
                            </NavLink>
                        ) : (
                            <div></div>
                        )}

                        {hasPermission('gestion_pompiste') ? (
                            <NavLink exact to="/voirPompistes" activeClassName="activeClicked">
                                <CDBSidebarMenuItem icon="fas fa-user-tie">Pompistes</CDBSidebarMenuItem>
                            </NavLink>
                        ) : (
                            <div></div>
                        )}

                        {hasPermission('gestion_modeDePaie') ? (
                            <NavLink exact to="/voirModeDepaie" activeClassName="activeClicked">
                                <CDBSidebarMenuItem icon="fas fa-money-bill ">Mode de paiement</CDBSidebarMenuItem>
                            </NavLink>
                        ) : (
                            <div></div>
                        )}
                        {hasPermission('gestion_reference') ? (
                            <NavLink exact to="/voirReferences" activeClassName="activeClicked">
                                <CDBSidebarMenuItem icon="fas fa-file-alt">Références</CDBSidebarMenuItem>
                            </NavLink>
                        ) : (
                            <div></div>
                        )}
                        {hasPermission('gestion_fournisseur') ? (
                            <NavLink exact to="/fournisseur" activeClassName="activeClicked">
                                <CDBSidebarMenuItem icon="fas fa-book">Fournisseurs</CDBSidebarMenuItem>
                            </NavLink>

                        ) : (
                            <div></div>
                        )}
                        {hasPermission('gestion_commande') ? (
                            <NavLink exact to="/commande" activeClassName="activeClicked">
                                <CDBSidebarMenuItem icon="fas fa-book">Commandes</CDBSidebarMenuItem>
                            </NavLink>

                        ) : (
                            <div></div>
                        )}



                        {hasPermission('gestion_relever') ? (
                            <NavLink exact to="/voirReleves" activeClassName="activeClicked">
                                <CDBSidebarMenuItem icon="fas fa-book">Relevés</CDBSidebarMenuItem>
                            </NavLink>
                        ) : (
                            <div></div>
                        )}
                        {hasPermission('gestion_stock') ? (
                            <NavLink exact to="/voirStock" activeClassName="activeClicked">
                                <CDBSidebarMenuItem icon="fas fa-boxes">Stocks</CDBSidebarMenuItem>
                            </NavLink>
                        ) : (
                            <div></div>
                        )}

                        {hasPermission('gestion_vente') ? (
                            <div>
                                <div
                                    className="d-flex align-items-center"
                                    onClick={toggleCollapseVente}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <CDBSidebarMenuItem style={{ marginRight: "100px" }} icon="file-alt">Ventes</CDBSidebarMenuItem>
                                    <span className="ms-0">
                                        <i className={`fa ${isCollapsedVente ? 'fa-chevron-right' : 'fa-chevron-up'}`}></i>
                                    </span>
                                </div>
                                <div className={`collapse ${isCollapsedVente ? '' : 'show'}`}>
                                    <NavLink exact to="/Ajoutervente" activeClassName="activeClicked">
                                        <CDBSidebarMenuItem icon="plus">Ajout vente</CDBSidebarMenuItem>
                                    </NavLink>
                                    <NavLink exact to="/Voirvente" activeClassName="activeClicked">
                                        <CDBSidebarMenuItem icon="plus">Tous les ventes</CDBSidebarMenuItem>
                                    </NavLink>
                                </div>
                            </div>
                        ) : (
                            <div></div>
                        )}



                    </CDBSidebarMenu>


                </CDBSidebarContent>


            </CDBSidebar>
        </div>

    )
}

export default SideBar;