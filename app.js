var express = require('express');
var request = require('request');
require('dotenv').config() 

//var User=require('./lib/User')
var mongoose=require('mongoose')
Schema = mongoose.Schema
//const mongoose= require('mongoose');
//var express = require('express')
//var request = require('request')
//var app = express()
const User= mongoose.model('slackUser', new Schema({ }));
var app = express();
const Mongo_URL="mongodb+srv://test:test@chatapp.u9lpo.mongodb.net/slack?retryWrites=true&w=majority"
mongoose.connect(Mongo_URL || 'mongodb://localhost/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected!!!!');
});

var clientId = "1297494653957.1293994070806"
var clientSecret = "b65de9809b21ff96409573920e974947"
var REDIRECT_URI="http://1992e72f7129.ngrok.io "

var app = express();
const PORT=3000;
app.listen(PORT, function () {
    console.log("Example app listening on port " + PORT);
});

app.get('/', function(req, res) {
    res.send('Ngrok is working! Path Hit: ' + req.url);
});

app.get('/oauth', async function(req, res) {
    // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint. If that code is not there, we respond with an error message
    if (!req.query.code) {
        res.status(500);
        res.send({"Error": "Looks like we're not getting code."});
        console.log("Looks like we're not getting code.");
    } else {
        // If it's there...

        // We'll do a GET call to Slack's `oauth.access` endpoint, passing our app's client ID, client secret, and the code we just got as query parameters.
        request({
            url: 'https://slack.com/api/oauth.v2.access', //URL to hit
            qs: {code: req.query.code, client_id: clientId, client_secret: clientSecret}, //Query string data
            method: 'GET', //Specify the method

        }, async function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                console.log(body)
                const jsonResult=await JSON.parse(body);
                let criteria={result:jsonResult}
                console.log(criteria)
                res.send(jsonResult)
                console.log(jsonResult)
                const userDoc = new User(criteria);
                await userDoc.save();
               
               

                console.log("hello")
                
            }
        })
    }
});


app.post('/command', function(req, res) {
    res.send('Your ngrok tunnel is up and running!');
});
app.get('/auth', (req, res) =>{
  res.sendFile(__dirname + '/add_to_slack.html')
})

app.get('/auth/redirect', (req, res) =>{
  var options = {
      uri: 'https://slack.com/api/oauth.v2.access?code='
          +req.query.code+
          '&client_id='+clientId+
          '&client_secret='+clientSecret+
          '&redirect_uri='+REDIRECT_URI,

      method: 'GET'
  }
  
  request(options, (error, response, body) => {
      var JSONresponse = JSON.parse(body)
      if (!JSONresponse.ok){
          console.log(JSONresponse)
          
          res.send("Error encountered: \n"+JSON.stringify(JSONresponse)).status(200).end()
      }else{
        
          console.log(JSONresponse)
          console.log("hello")
          res.send("Success!")
      }
  })
})



