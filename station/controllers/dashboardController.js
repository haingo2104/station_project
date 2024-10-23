import { Router } from "express";
import { getDashboardMetrics } from "../services/dashboardService.js";

export default Router()
.get('/', async (req, res, next) => {
    try {
        const metrics = await getDashboardMetrics();
        return res.status(200).json({ success: true, metrics });
    } catch (error) {
        next(error);
    }
});
