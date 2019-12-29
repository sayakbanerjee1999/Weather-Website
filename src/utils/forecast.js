const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = 'https://api.darksky.net/forecast/f1c6e718d4c7ba0bb1fa7644f1aff283/' + latitude + ',' + longitude + '?units=si'
    request({url, json:true}, (error, {body}) => {    //shorthand as url: url has same nam and destructing response to body as it is the only property we are using 
        if(error){
            callback("Unable to access weather service",undefined)
        }else if(body.error){
            callback("Unable to find Location",undefined)
        }else{
            callback(undefined, body.daily.data[0].summary + "It is currently " + body.currently.temperature +" degrees out. There is " + body.currently.precipProbability*100 + "% chance of rain.")
        }
    })
}

module.exports = forecast