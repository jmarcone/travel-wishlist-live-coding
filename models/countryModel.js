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
        .then(({ rows: countries }) => countries);

}

const flagAsVisited = (code) => {
    const query = "UPDATE countries SET visited = TRUE WHERE alpha2code = $1 OR alpha3code = $1 RETURNING *";

    return pool
        .query(query, [code])
        .then(({ rows: [country] }) => country);
}

const createCountry = (name, alpha2code, alpha3code) => {
    const query = "INSERT INTO countries (name, alpha2code, alpha3code) VALUES ($1, $2, $3) RETURNING  *";
    return pool
        .query(query, [name, alpha2code, alpha3code])
        .then(({ rows: newCountry }) => newCountry)

}

const getCountryByCode = (code) => {
    const query = "SELECT * FROM countries WHERE alpha2code = $1 OR alpha3code = $1 LIMIT 1";

    return pool
        .query(query, [code])
        .then(({ rows: [country] }) => country);
}

const updateCountry = (code, name, alpha2code, alpha3code, visited) => {
    const query = "UPDATE countries SET name = $2, alpha2code = $3, alpha3code = $4, visited = $5 WHERE alpha2code = $1 OR alpha3code = $1 RETURNING  *";

    return pool
        .query(
            query,
            [code, name, alpha2code, alpha3code, visited])
        .then(({ rows: [row] }) => row)
        ;
}

export { getCountries, flagAsVisited, createCountry, getCountryByCode, updateCountry }