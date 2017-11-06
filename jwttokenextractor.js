// grab the packages we need
var nJwt = require('jws');

//var rijndael = require('node-rijndael');
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var http = require('http');
var signKey = 'secret';
var encrypKey ='abcdefghijklmnopqrstuvwxyzabcdef'

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// POST http://localhost:8080/
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
        var jwtverified = nJwt.verify(token, 'HS256', signKey)

        if(jwtverified)
          {
            var decodedJwt = nJwt.decode(token, {complete: true});
            console.log(decodedJwt.header);
            console.log(decodedJwt.payload);

            // Will contain the header and body
            //var plaintext = rijndael.decrypt(decodedJwt.ctxt, encrypKey, iv);
            //req.decoded = decodedJwt;
            res.writeHead(200, { 'Content-Type': 'text/html' });
            var html = '<!DOCTYPE html><html><head><title>JWT Token Details</title></head><body><div style="max-width: 600px;overflow-wrap: break-word;">';
            html += '<h2>Token Details</h2></ br>';
            html += JSON.stringify(decodedJwt.payload);
            html += '</div></body></html>';
            res.end(html, 'utf-8');
          }
        else
          {
            console.log('Token verification failed..!!');
          }        
      } 
      catch(err) 
      {
        console.log('##### ERROR ######' + err); // Token has expired, has been tampered with, etc  
        res.writeHead(200, { 'Content-Type': 'text/html' });
        var html = '<!DOCTYPE html><html><head><title>JWT Token Details</title></head><body><div style="max-width: 600px;overflow-wrap: break-word;">';
        html += '<h2>Token Error</h2></ br>';
        html += err;
        html += '</div></body></html>';
        res.end(html, 'utf-8');   
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
 
