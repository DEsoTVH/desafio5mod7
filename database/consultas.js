import pkg from 'pg';
import format from "pg-format";
const { Pool } = pkg;

const pool = new Pool({
    allowExitOnIdle: true,
});

const obtenerJoyeria = async ({ limits = 10, order_by = "id_ASC", pagina = 1 }) => {
    const [campo, direccion] = order_by.split("_");

    if (pagina <= 0) {
        pagina = 1;
    }

    const offset = (pagina - 1) * limits;

    console.log("campo y dire: ", campo + " " + direccion);
    console.log("pagina y offset: ", pagina + " " + offset);

    const consultaFormateada = format('SELECT * FROM inventario ORDER BY %I %s LIMIT %s OFFSET %s', campo, direccion, limits, offset);

    const { rows: joyas } = await pool.query(consultaFormateada);
    return joyas;
};

const obtenerJoyeriaPorFiltros = async ({ precio_minimo, precio_maximo, categoria, metal }) => {
    const valores = [];
    const filtros = [];

    const agregarFiltro = (campo, comparador, valor) => {
        valores.push(valor);
        const index = valores.length;
        filtros.push(`${campo} ${comparador} $${index}`);
    };

    if (precio_minimo !== undefined) agregarFiltro('precio', '>=', precio_minimo);
    if (precio_maximo !== undefined) agregarFiltro('precio', '<=', precio_maximo);
    if (categoria) agregarFiltro('categoria', '=', categoria);
    if (metal) agregarFiltro('metal', '=', metal);

    let consulta = 'SELECT * FROM inventario';

    if (filtros.length > 0) {
        consulta += ` WHERE ${filtros.join(' AND ')}`;
    }

    console.log("query base: ", consulta);

    const { rows: joyas } = await pool.query(consulta, valores);
    return joyas;
};

const obtenerJoyeriaPorId = async ({ id }) => {
    const query = "SELECT * FROM inventario WHERE id = $1";
    const { rows } = await pool.query(query, [id]);
    return rows[0];
};

const setHATEOAS = async (joyas, limites = 10, pagina = 1) => {
    const resultados = joyas.map((j) => {
        return {
            nombre: j.nombre,
            precio: j.precio,
            url: `http://localhost:3000/joyas/${j.id}`,
        }
    });

    console.log("valor de resultados: ", resultados);

    const texto = "SELECT * FROM inventario";
    const { rows: datos } = await pool.query(texto);

    const total = datos.length
    const total_paginas = Math.ceil(total / limites);
    console.log("total registros limites total paginas: ", total, limites, total_paginas);

    const HATEOAS = {
        total,
        resultados,
        meta: {
            total: total,
            limit: parseInt(limites),
            page: parseInt(pagina),
            total_paginas: total_paginas,
            siguiente:
                total_paginas <= pagina
                    ? null
                    : `http://localhost:3000/joyas?limits=${limites}&page=${parseInt(pagina) + 1}`,
            anterior:
                pagina <= 1
                    ? null
                    : `http://localhost:3000/joyas?limits=${limites}&page=${parseInt(pagina) - 1}`,
        }
    };

    console.log("valor de HATEOAS: ", HATEOAS);

    return HATEOAS;
};

export { setHATEOAS, obtenerJoyeria, obtenerJoyeriaPorFiltros, obtenerJoyeriaPorId };