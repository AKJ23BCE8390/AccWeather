import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_key = '335bf844d648e0ba8eff49cc08db7ba3';

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req,res)=>{
    res.render("index");
});

app.get("/Features", (req,res)=>{
    res.render("features");
});

app.get("/FAQs", (req,res)=>{
    res.render("faqs");
})

app.get("/About", (req,res)=>{
    res.render("about");
})

app.post("/post-city", async (req,res)=>{
    const limit = 5;
    const city = req.body.location;
    try{
    const geoResponse = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${API_key}`);

   console.log(geoResponse.data);
   console.log(geoResponse.data[0].name);

    if (geoResponse.data.length>0){
        const geoData = geoResponse.data[0];
        const nameOfCity = geoData.name;
        const latitudeOfCity = geoData.lat;
        const longitudeOfCity = geoData.lon;
        console.log(nameOfCity);
        console.log(latitudeOfCity);
        console.log(longitudeOfCity);
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitudeOfCity}&lon=${longitudeOfCity}&appid=${API_key}`);
        console.log(weatherResponse.data);
        const weatherData = weatherResponse.data;
        const temperatureOfCity = weatherData.main.temp;
        res.render("index",{name: nameOfCity, state: geoData.state, country: geoData.country, latitude: latitudeOfCity, longitude: longitudeOfCity, temperature: temperatureOfCity, feelsLike: weatherData.main.feels_like });
       

    }else{
        const nameOfCity = "not found";
    }
} catch (error){
    res.sendStatus(404);
}
})

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});
