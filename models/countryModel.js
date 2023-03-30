import pool from "../db/pg.js";

const getCountries = async (visited, sort) => {
    let query = "SELECT * FROM countries "

    if (visited) {
        query += " WHERE visited = TRUE "
    }

    if (sort) {
        query += " ORDER BY name ASC"
    }

    return await pool
        .query(query)
        .then(({rows: countries}) => countries);       

}

const flagAsVisited = (code) => {
    const query = "UPDATE countries SET visited = TRUE WHERE alpha2code = $1 OR alpha3code = $1 RETURNING *";

    return pool
        .query(query, [code])
        .then(({rows: [country]}) => country);
}

export {getCountries, flagAsVisited}