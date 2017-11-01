var express = require('express');
var app = express();

app.post("/", function(req, res){
  if(req.query)
  {
    console.log(req.query.Analytics);
  }
}).on("error", function(e){
  console.log("Got error: " + e.message);
});

// Tell our app to listen on port 8080
app.listen(process.env.PORT || 5000, function (err) {
  if (err) {
    throw err
  }
console.log('Server started on port 8080')
})