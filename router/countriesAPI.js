import { Router } from "express";
import validateCountryData from "../middlewares/validateCountryData.js";
import pool from "../db/pg.js";
import countryExist from "../middlewares/countryExist.js";
import countryDontExist from "../middlewares/countryDontExist.js";
import { flagAsVisited, getCountries } from "../models/countryModel.js";

const countriesAPIRouter = Router();



countriesAPIRouter.get("/", (req, res) => {
    const { query: { sort, visited } } = req;

    getCountries(visited, sort).then(countries => res.json(countries));
})

countriesAPIRouter.post(
    "/",
    validateCountryData,
    countryDontExist,
    (req, res) => {
        const { name, alpha2code, alpha3code } = req.body;

        const query = "INSERT INTO countries (name, alpha2code, alpha3code) VALUES ($1, $2, $3) RETURNING  *";
        pool
            .query(query, [name, alpha2code, alpha3code])
            .then(({ rows }) =>
                res
                    .status(201)
                    .json(rows)
            )
            .catch(e => {
                console.error(e);

                res
                    .status(400)
                    .json({ error: e.message })
            })
            ;
    })


countriesAPIRouter.get("/:code", (req, res, next) => {
    const { code } = req.params;
    const query = "SELECT * FROM countries WHERE alpha2code = $1 OR alpha3code = $1 LIMIT 1";

    pool
        .query(query, [code])
        .then(({ rows: [country] }) => {
            if (!country)
                return next("Non existant country")

            return res.json(country);

        });
})

countriesAPIRouter.delete(
    "/:code",
    countryExist,
    (req, res) => {
        const { code } = req.params;
        flagAsVisited(code)
        .then(
            country => res.json(country)
        )
    })




countriesAPIRouter.put(
    "/:code",
    validateCountryData,
    countryExist,
    (req, res) => {
        const { params: { code } } = req;
        const { name, alpha2code, alpha3code } = req.body;
        const query = "UPDATE countries SET name = $1, alpha2code = $2, alpha3code = $3 WHERE alpha2code = $4 OR alpha3code = $4 RETURNING  *";

        pool
            .query(
                query,
                [name, alpha2code, alpha3code, code])
            .then(({ rows }) =>
                res
                    .status(201)
                    .json(rows)
            )
            .catch(e => {
                console.error(e);

                res
                    .status(400)
                    .json({ error: e.message })
            })
            ;
    })



export default countriesAPIRouter;