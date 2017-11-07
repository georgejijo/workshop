// grab the packages we need
var nJwt = require('jws');

var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var http = require('http');
var signKey = process.env.signKey || 'secret';
var encrypKey = process.env.encrypKey;

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// parameters sent with 
app.post('/', function(req, res) {
    var token=null;
    if(req.query)
    {
      token = req.query.Analytics; 
    }

    if(token)
    {
      try {
        var jwtverified = nJwt.verify(token, 'HS256', signKey);

        if(jwtverified)
          {
            var decodedJwt = nJwt.decode(token, {complete: true});

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(CreateHtml('Token Details', JSON.stringify(decodedJwt.payload)), 'utf-8');
          }
        else
          {
            console.log('Token verification failed..!!');
          }        
      }
      catch(err) 
      {
        console.log(err);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(CreateHtml('Token Error', err.message), 'utf-8');   
      }               
    }
    else
    {
        console.log('This is not valid token');
    }
}).on("error", function(e){
  console.log("Got error: " + e.message);
});

// Tell our app to listen on port 8080
app.listen(port, function (err) {
  if (err) {
    throw err
  }
  
  console.log('Server started! At http://localhost:' + port);
});

function CreateHtml(title, content){
  var html = '<!DOCTYPE html><html><head><title>JWT Token Details</title></head><body><div style="max-width: 600px;overflow-wrap: break-word;"><h2>';
  html += title;
  html += '</h2></ br>';
  html += content;
  html += '</div></body></html>';

  return html;
}