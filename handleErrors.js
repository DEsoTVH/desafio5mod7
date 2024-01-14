export const handleError = (code) => {
    switch (code) {
        case "22P02":
            return {
            status: 400,
            message: "Formato invalido en el input",
        };
        case "23502":
            return {
                status: 400,
                message: "Query missing data, faltan datos",
            }; 
        case "400":
            return {
            status: 400,
            message: "Faltan datos en la petición",
        };
        case "404":
            return {
            status: 404,
            message: "Ese registro no existe",
        };
        default:
        return {
            status: 500,
            message: "Error de servidor",
        };
    }
};