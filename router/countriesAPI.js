import { Router } from "express";
import validateCountryData from "../middlewares/validateCountryData.js";
import pool from "../db/pg.js";
import countryExist from "../middlewares/countryExist.js";
import countryDontExist from "../middlewares/countryDontExist.js";
import { createCountry, flagAsVisited, getCountries, getCountryByCode, updateCountry } from "../models/countryModel.js";

const countriesAPIRouter = Router();



countriesAPIRouter
    .route("/")
    .get((req, res) => {
        const { query: { sort, visited } } = req;

        getCountries(visited, sort).then(countries => res.json(countries));
    })
    .post(
        validateCountryData,
        countryDontExist,
        (req, res) => {
            const { name, alpha2code, alpha3code } = req.body;

            createCountry(name, alpha2code, alpha3code)
                .then(newCountry =>
                    res
                        .status(201)
                        .json(newCountry)
                ).catch(e => {
                    res
                        .status(400)
                        .json({ error: e.message })
                })
                ;
        })


countriesAPIRouter
    .route("/:code")
    .get((req, res, next) => {
        const { code } = req.params;
        getCountryByCode(code)

            .then(country => {
                if (!country)
                    return next("Non existant country")

                return res.json(country);

            });
    })
    .delete(
        countryExist,
        (req, res) => {
            const { code } = req.params;
            flagAsVisited(code)
                .then(
                    country => res.json(country)
                )
        })
    .put(
        validateCountryData,
        countryExist,
        (req, res) => {
            const { params: { code } } = req;
            const { name, alpha2code, alpha3code, visited } = req.body;
            updateCountry(code, name, alpha2code, alpha3code, visited)
                .then(country =>
                    res
                        .status(201)
                        .json(country)
                )
                .catch(e => {
                    res
                        .status(400)
                        .json({ error: e.message })
                })
                ;
        })



export default countriesAPIRouter;