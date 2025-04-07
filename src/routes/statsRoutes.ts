import { Router } from "express";
import { getAverageTemperature, 
    getMaxTemperature, 
    getMinTemperature,
    getFlujoAguaData,
    getCalidadAguaData,
    onFeed,
    offLight,
    getMInFlujoAguaData,
    getNivelAguaData,
    onLight,
     } from "../controllers/statsController";
const router = Router();


router.get("/temperatura/:deviceID", (req, res) => {
    getAverageTemperature(req, res);
});

router.get("/flujo/min/:deviceID", (req, res) => {
    getMInFlujoAguaData(req, res);
});

router.get("/temperatura/max/:deviceID", (req, res) => {
    getMaxTemperature(req, res);
});

router.get("/temperatura/min/:deviceID", (req, res) => {
    getMinTemperature(req, res);
});

router.get("/flujo/:deviceID", (req, res) => {
    getFlujoAguaData(req, res);
});

router.get("/turbidez/:deviceID", (req, res) => {
    getCalidadAguaData(req, res);
});

router.post("/feed/:deviceID", (req, res) => {
    onFeed(req, res);
})

router.get("/nivel/:deviceID", (req, res) => {
    getNivelAguaData(req, res);
});

router.post("/led/:deviceID", (req, res) => {
    onLight(req, res);
})

router.post("/led/off/:deviceID", (req, res) => {
    offLight(req, res);
})



export default router;
