import { Router } from "express";
import { controllerJoyas } from "../controller/controllerJoyas.js";

const router = Router();

const displayConsulta = async (req, res, next) => {
    const parametros = req.params;
    const querys = req.query;
    const url = req.url;
    const metodo = req.method;

    console.log(`
        El día de hoy ${new Date()}
        Se ha recibido una consulta en la ruta ${url} 
        con los siguientes detalles:
        Método: ${metodo}
        Parámetros: ${JSON.stringify(parametros)}
        Query Strings: ${JSON.stringify(querys)}
    `);

    next();
};

router.get("/", displayConsulta, controllerJoyas.read);
router.get("/filtros", displayConsulta, controllerJoyas.readByFiltro);
router.get("/:id", displayConsulta, controllerJoyas.readByid);

export default router;