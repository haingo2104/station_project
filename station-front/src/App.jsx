import React from "react";
import Auth from "./pages/Auth"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import 'antd/dist/reset.css';
import "mdb-react-ui-kit/dist/css/mdb.min.css"
import { BrowserRouter, Route, Router, Routes } from "react-router-dom"
import Register from "./pages/Register"
import './page.css'
import './page.js'
import Menu from "./pages/Menu"
import AjoutModeDepaie from "./pages/modeDePaie/AjoutModeDepaie"
import MenuModeDepaie from "./pages/modeDePaie/MenuModeDePaie"
import VoirModeDepaie from "./pages/modeDePaie/VoirModeDePaie"
import MenuPompiste from "./pages/pompistes/MenuPompiste"
import VoirPompistes from "./pages/pompistes/VoirPompistes"
import AjoutPompiste from "./pages/pompistes/AjoutPompistes"
import MenuPompe from "./pages/pompes/MenuPompe"
import MenuCarburant from "./pages/carburants/MenuCarburant"
import AjoutCarburant from "./pages/carburants/AjoutCarburant"
import VoirCarburants from "./pages/carburants/VoirCarburants"
import MenuPrix from "./pages/prix/MenuPrix"
import VoirPrix from "./pages/prix/VoirPrix"
import AjoutPrix from "./pages/prix/AjoutPrix"
import MenuTuyaux from "./pages/tuyaux/MenuTuyaux"
import AjoutTuyaux from "./pages/tuyaux/AjoutTuyaux"
import VoirTuyaux from "./pages/tuyaux/VoirTuyaux"
import Reference from "./pages/references/Reference"
import AjouterVente from "./pages/ventes/AjouterVente"
import VoirVente from "./pages/ventes/VoirVentes"
import MenuVente from "./pages/ventes/MenuVente"
import AjoutStock from "./pages/stock/AjoutStock"
import VoirStock from "./pages/stock/VoirStock"
import AjoutReleve from "./pages/Relevés/AjoutReleve"
import VoirReleves from "./pages/Relevés/VoirReleves"
import StockPompes from "./pages/stock/TestStock.jsx"
import TestTooltip from "./pages/testTooltip.jsx"
import CommanderCarburant from "./pages/commandes/CommanderCarburant";
import AjouterFournisseur from "./pages/fournisseurs/AjouterFournisseur";
import Welcome from "./pages/Welcome.jsx";
const App = () => {
    return (


        <BrowserRouter>

            <Routes>
                <Route path="/" element={<Auth />} />
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/register" element={<Register />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/vente" element={<MenuVente />} />
                <Route path="/Ajoutervente" element={<AjouterVente />} />
                <Route path="/Voirvente" element={<VoirVente />} />
                <Route path="/modeDepaie" element={<MenuModeDepaie />} />
                <Route path="/ajouterModeDepaie" element={<AjoutModeDepaie />} />
                <Route path="/voirModeDepaie" element={<VoirModeDepaie />} />
                <Route path="/pompiste" element={<MenuPompiste />} />
                <Route path="/ajouterPompiste" element={<AjoutPompiste />} />
                <Route path="/voirPompistes" element={<VoirPompistes />} />
                <Route path="/pompe" element={<MenuPompe />} />
                <Route path="/carburant" element={<MenuCarburant />} />
                <Route path="/ajouterCarburant" element={<AjoutCarburant />} />
                <Route path="/voirCarburants" element={<VoirCarburants />} />
                <Route path="/prix" element={<MenuPrix />} />
                <Route path="/ajouterPrix" element={<AjoutPrix />} />
                <Route path="/voirPrix" element={<VoirPrix />} />
                <Route path="/tuyaux" element={<MenuTuyaux />} />
                <Route path="/ajouterTuyaux" element={<AjoutTuyaux />} />
                <Route path="/voirTuyaux" element={<VoirTuyaux />} />
                <Route path="/voirReferences" element={<Reference />} />
                <Route path="/ajoutStock" element={<AjoutStock />} />
                <Route path="/voirStock" element={<VoirStock />} />
                <Route path="/ajoutReleve" element={<AjoutReleve />} />
                <Route path="/voirReleves" element={<VoirReleves />} />
                <Route path="/test" element={< StockPompes />} />
                <Route path="/commande" element={< CommanderCarburant />} />
                <Route path="/fournisseur" element={< AjouterFournisseur />} />
                <Route path="/tools" element={< TestTooltip />} />
            </Routes>
        </BrowserRouter>

        // <BrowserRouter>
        //     <AuthProvider>
        //         <div>
        //             {/* <SideBar />  */}
        //             <Routes>
        //                 <Route path="/" element={<Auth />} />
        //                 <Route path="/register" element={<Register />} />
        //                 <Route path="/menu" element={<Menu />} />
        //                 <Route path="/vente" element={<MenuVente />} />
        //                 <Route path="/Ajoutervente" element={<AjouterVente />} />
        //                 <Route path="/Voirvente" element={<VoirVente />} />
        //                 <Route path="/modeDepaie" element={<MenuModeDepaie />} />
        //                 <Route path="/ajouterModeDepaie" element={<AjoutModeDepaie />} />
        //                 <Route path="/voirModeDepaie" element={<VoirModeDepaie />} />
        //                 <Route path="/pompiste" element={<MenuPompiste />} />
        //                 <Route path="/ajouterPompiste" element={<AjoutPompiste />} />
        //                 <Route path="/voirPompistes" element={<VoirPompistes />} />
        //                 <Route path="/pompe" element={<MenuPompe />} />
        //                 <Route path="/carburant" element={<MenuCarburant />} />
        //                 <Route path="/ajouterCarburant" element={<AjoutCarburant />} />
        //                 <Route path="/voirCarburants" element={<VoirCarburants />} />
        //                 <Route path="/prix" element={<MenuPrix />} />
        //                 <Route path="/ajouterPrix" element={<AjoutPrix />} />
        //                 <Route path="/voirPrix" element={<VoirPrix />} />
        //                 <Route path="/tuyaux" element={<MenuTuyaux />} />
        //                 <Route path="/ajouterTuyaux" element={<AjoutTuyaux />} />
        //                 <Route path="/voirTuyaux" element={<VoirTuyaux />} />
        //                 <Route path="/voirReferences" element={<Reference />} />
        //                 <Route path="/ajoutStock" element={<AjoutStock />} />
        //                 <Route path="/voirStock" element={<VoirStock />} />
        //                 <Route path="/ajoutReleve" element={<AjoutReleve />} />
        //                 <Route path="/voirReleves" element={<VoirReleves />} />
        //             </Routes>
        //         </div>
        //     </AuthProvider>
        // </BrowserRouter>

    )
}

export default App