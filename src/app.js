//Setting up the libraries
const path = require('path')
const express = require('express')
const hbs = require('hbs')
const request = require('request')
const forecast = require('./utils/forecast.js')
const geocode = require('./utils/geocode.js')

//Firing up Express
const app = express()

//Define Paths for Express Configuration
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

//Setup Handlebars Engine and Views Location(if you want dynamic content)
app.set('view engine', 'hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)                           //if you want some common content in all pages like header and footer use partials

//Set up static directory to serve (use this if you only want Static Web Page)
app.use(express.static(publicDirectoryPath))

app.get('', (req,res)=>{
    res.render('index', {
        title:"Weather App",
        name: "Sayak Banerjee"
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title:"About!!!!!!",
        name:"Sayak Banerjee"
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: "This is the help Page",
        title: "Help",
        name: "Sayak Banerjee"
    })
})

// app.get('/help', (req, res) => {
//     res.send('Help Page!')
// })
// app.get('/about', (req, res) => {
//     res.send('<h1>About Page!</h1>')
// })

app.get('/weather', (req, res) => {
    if(!req.query.address){                                                     //need a query string address  ?address=place
        return res.send({
            error:"You must provide an Address as a Query"
        })
    }
    geocode(req.query.address, (error, {latitude, longitude, location} = {})=> {     //we set dafault params of destructured elements to null(empty set). If not and we give a wrong address then error will pop up that shows cannot destructure undefined element(coz earlier too it was null) and app would crash
        if(error){
            return res.send({error})
        }
        forecast(latitude, longitude, (error, forecastData)=>{
            if(error){
                return res.send({error})
            }
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/help/*', (req, res) => {
    res.render("404", {
        title: "404",
        name:"Sayak Banerjee",
        errorMessage:"Help Article not Found"
    })
})

//Setting up 404 page(always set up at the last)    * -> is a wild character matches anything except the ones listed (like help,about,weather etc) 
app.get('*', (req,res) => {
    res.render("404", {
        title:"404",
        name:"Sayak Banerjee",
        errorMessage:"Page Not Found"
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000')
})