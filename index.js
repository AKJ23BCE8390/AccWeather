import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_key = '335bf844d648e0ba8eff49cc08db7ba3';

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index", {
        name: "",
        hindi: "",
        state: "",
        latitude: "",
        longitude: ""
    });
});

app.post("/post-city", async (req, res) => {
    const city = req.body.location;
    const limit = 5;
    try {
        console.log(`Searching for city: ${city}`);
        const geoResponse = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${API_key}`);
        if (geoResponse.data.length > 0) {
            const cityData = geoResponse.data[0];
            res.render("index", {
                name: cityData.name,
                hindi: cityData.local_names?.hi || "N/A",
                state: cityData.state || "N/A",
                latitude: cityData.lat,
                longitude: cityData.lon
            });
        } else {
            res.render("index", {
                name: "Not Found",
                hindi: "Not Found",
                state: "Not Found",
                latitude: "Not Found",
                longitude: "Not Found"
            });
        }
    } catch (error) {
        console.error(`Error fetching data: ${error.message}`);
        res.sendStatus(500);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});
