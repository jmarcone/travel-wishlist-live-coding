import pool from "../db/pg.js";

const countryExist = (req, res, next) => {
    const { params: { code } } = req;

    const query = "SELECT * FROM countries WHERE alpha2code = $1 OR alpha3code = $1 LIMIT 1";

    pool
        .query(query, [code])
        .then(({ rows: [country] }) => {
            console.log(country)
            if (!country)
                return next("Non existant country")

            return next();
        })
        .catch(e => next(e));
}

export default countryExist;