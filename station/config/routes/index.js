import carburantController from "../../controllers/carburantController.js";
import commandeController from "../../controllers/commandeController.js";
import dashboardFinancier from "../../controllers/dashboardController.js";
import fournisseurController from "../../controllers/fournisseurController.js";
import modeDePaieController from "../../controllers/modeDePaieController.js";
import pompeController from "../../controllers/pompeController.js";
import pompisteController from "../../controllers/pompisteController.js";
import prixController from "../../controllers/prixController.js";
import referenceController from "../../controllers/referenceController.js";
import releverController from "../../controllers/releverController.js";
import { securityRoute } from "../../controllers/securityController.js";
import stockController from "../../controllers/stockController.js";
import tuyauController from "../../controllers/tuyauController.js";
import userController from "../../controllers/userController.js";
import venteController from "../../controllers/venteController.js";

export default [
    {prefix: "" , group: securityRoute},
    {prefix: "/carburants" , group: carburantController},
    {prefix : '/modeDePaies' , group : modeDePaieController},
    {prefix : '/pompes' , group : pompeController},
    {prefix : '/pompistes' , group : pompisteController},
    {prefix : '/tuyaux' , group : tuyauController},
    {prefix : '/stocks' , group : stockController},
    {prefix : '/prix' , group : prixController},
    {prefix : '/relevers' , group : releverController},
    {prefix : '/ventes' , group : venteController},
    {prefix : '/references' , group : referenceController},
    {prefix : '/users' , group : userController},
    {prefix : '/commandes' , group : commandeController},
    {prefix : '/fournisseurs' , group : fournisseurController},
    {prefix : '/dashboard' , group : dashboardFinancier},


]

