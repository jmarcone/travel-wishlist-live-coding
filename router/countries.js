import { Router } from "express";
import validateCountryData from "../middlewares/validateCountryData.js";

import countryExist from "../middlewares/countryExist.js";
import countryDontExist from "../middlewares/countryDontExist.js";
import ejs from "ejs";
import { flagAsVisited, getCountries } from "../models/countryModel.js";

const countriesRouter = Router();



countriesRouter.get("/", (req, res) => {
    const { query: { sort, visited } } = req;

    console.log(getCountries);

    getCountries(visited, sort)
        .then(countries => {
            console.log(countries);
            let html = ejs.render(`
                <h1>countries</h1>
                <ul>
                
                    <% for (let i = 0; i < iterator; i++) { %>
                        <li> <%= countries[i].name %> </li>
                    <% } %>
            
                </ul>`,
                {
                    countries: countries,
                    iterator: countries.length
                }
            );

            res.send(html)
        });
})

countriesRouter
    .delete(
        "/:code",
        countryExist,
        (req, res) => {
            const { code } = req.params;
            flagAsVisited(code).then(
                country =>
                    res.send(`
                    <h1>${country.name}</>
                    <h2>Alpha 2: ${country.alpha2code}</h2>
                    <h2>Alpha 3: ${country.alpha3code}</h2>
                    <h3>Visited: ${country.visited}</h3>
                `)
            )
        })




export default countriesRouter;