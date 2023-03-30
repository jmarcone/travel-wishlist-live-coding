import Express from "express";
import { uploader, publicFolder } from "./file-upload-config.js";
import countriesRouter from "./router/countries.js";
import countriesAPIRouter from "./router/countriesAPI.js";


const app = Express()

app.use(Express.static(publicFolder));
app.use(Express.json())


//Router for API 
app.use("/api/countries", countriesAPIRouter);
// Router for html web => TODO 
app.use("/countries", countriesRouter);


app.post('/upload-profile-picture', uploader.single('profile_pic'), (req, res, err) => {
    const { file, fileValidationError } = req;
    if (fileValidationError) {
        return res.status(500).send(fileValidationError);
    }

    if (!file) {
        return res.status(400).send('Please upload a file');
    }

    res.json({
        file: `http://localhost:5000/pulic/upload/${req.file.filename}`
    });
})


app.listen(5000, () => {
    console.log("server running on port 5000");
})