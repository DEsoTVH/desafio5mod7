import { obtenerJoyeria, setHATEOAS, obtenerJoyeriaPorFiltros, obtenerJoyeriaPorId } from "../database/consultas.js";
import { handleError } from "../handleErrors.js";

const read = async (req, res) => {
    try {
        const { limits, order_by, page } = req.query;

        const isPageValid = /^[1-9]\d*$/.test(page);

        if (!isPageValid) {
            return res.status(400).json({ message: "Invalid page number, number > 0" });
        }

        console.log("Valor limits, order_by, page antes de llamado: ", limits, order_by, page);

        const joyas = await obtenerJoyeria({ limits, order_by, page });

        const HATEOAS = await setHATEOAS(joyas, limits, page);
        res.json(HATEOAS);
    } catch (error) {
        const { status, message } = handleError(error.code);
        return res.status(status).json({ ok: false, result: message });
    }
};

const readByFiltro = async (req, res) => {
    const { precio_min, precio_max, categoria, metal } = req.query;



    // PROFE TOTE: PARA CONCEPTOS DE EVALUACION AGREGUE ESTAS VALIDACIONES YA QUE CUANDO HICE LAS CONSULTAS POR THUNDER
    // 2 VECES ESCRIBI MAL EL PARAMETRO DEL METAL Y ME TOMO IGUAL LAS PETICIONES, ES POR ESA RAZON QUE AUNQUE NO FUE SOLICITADO QUISE AGREGAR LA VALIDACION 
    // PARA QUE ENTRE OTRAS COSAS SOLO ACEPTARA 2 METALES, QUE ERAN LOS 2 PRESENTES; ORO Y PLATA.



    
    // Validar que los parámetros obligatorios estén presentes
    if (!precio_min || !precio_max || !categoria || !metal) {
        return res.status(400).json({ ok: false, message: 'Todos los parámetros son obligatorios' });
    }

    // Validar que solo se están utilizando parámetros válidos
    const parametrosValidos = ['precio_min', 'precio_max', 'categoria', 'metal'];
    const parametrosInvalidos = Object.keys(req.query).filter(param => !parametrosValidos.includes(param));
    if (parametrosInvalidos.length > 0) {
        return res.status(400).json({ ok: false, message: `Parámetros no válidos: ${parametrosInvalidos.join(', ')}` });
    }

    // Validar que el valor del parámetro 'metal' sea válido
    const valoresMetalValidos = ['oro', 'plata']; // Solo oro y plata son válidos para 'metal'
    if (metal && !valoresMetalValidos.includes(metal.toLowerCase())) {
        return res.status(400).json({ ok: false, message: `Valor no válido para el parámetro 'metal'` });
    }

    try {
        const joyas = await obtenerJoyeriaPorFiltros({ precio_min, precio_max, categoria, metal });

        if (!joyas) {
            res.status(404).json({ message: "Joyas is not found" });
        }

        const HATEOAS = await setHATEOAS(joyas);
        res.json(HATEOAS);
    } catch (error) {
        const { status, message } = handleError(error.code);
        return res.status(status).json({ ok: false, result: message });
    }
};

const readByid = async (req, res) => {
    const { id } = req.params;
    
    try {
        const joya = await obtenerJoyeriaPorId({ id });

        if (!joya) {
            return res.status(404).json({ message: "Joyas not found" });
        }

        const detailedResponse = {
            id: joya.id,
            nombre: joya.nombre,
            precio: joya.precio,
        };

        res.json(detailedResponse);
    } catch (error) {
        const { status, message } = handleError(error.code);
        return res.status(status).json({ ok: false, result: message });
    }
};

export const controllerJoyas = {
    read,
    readByFiltro,
    readByid
};