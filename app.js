var http = require("http");
var express = require("express");
var app = express();
var fs = require("fs");
app.use(express.static("static"))
var server = http.createServer(app).listen(8080);
var shoutbox = require("./index.js")(server);
var existing;
try {
  existing = JSON.parse(fs.readFileSync("existing.json", "utf8"));
} catch(e) {
  console.log(e);
  existing = [];
}

app.get("/buildScript", function(req, res) {
  if(!req.query.key) {
    return res.status(400).send("No key specified");
  } else if(existing.indexOf(req.query.key) > -1) {
    return res.status(409).send("A room with that key already exists");
  }
  fs.readFile("base.js", "utf8", function(err, data) {
    if(err) return res.status(500).send("An error occured");
    fs.readFile("shoutbox.html", "utf8", function(errBody, shoutboxBody) {
      if(errBody) return res.status(500).send("An error occured");
      fs.readFile("shoutbox.css", "utf8", function(errStyle, shoutboxStyle) {
        if(errStyle) return res.status(500).send("An error occured");
        res.set("Content-Type", "application/octet-stream");
        res.set("Content-Disposition", "filename=shoutbox.js");
        data = data.replace("{{body}}", "\`" + shoutboxBody + "\`");
        if(!req.query.customStyle){
          data = data.replace("{{style}}", "\`" + shoutboxStyle + "\`");
        }
        else {
          data = data.replace("{{style}}", "");
        }
        data = data.replace(/{{key}}/g, req.query.key);
        existing.push(req.query.key);
        writeExisting();
        res.send(data);
      });
    });
  });
});

app.get("/exists", function(req, res) {
  if(!req.query.key) return res.status(400).send("No key specified");
  res.json({exists: existing.indexOf(req.query.key) > -1})
})

function writeExisting() {
  fs.writeFile("existing.json", JSON.stringify(existing, null, "  "), "utf8", function(err) {
    if(err) console.log("error updating existing", err);
  });
}