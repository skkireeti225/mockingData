/* Define some initial variables. */
var applicationRoot = __dirname.replace(/\\/g,"/"),
   ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
  port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
  mockRoot = applicationRoot + '/test',
  mockFilePattern = '.json',
  mockRootPattern = mockRoot + '/**/*' + mockFilePattern,
  apiRoot = '/api',
  fs = require("fs"),
  glob = require("glob");

/* Create Express application */
var express = require("express");
var app = express();

/* Configure a simple logger and an error handler. */
// app.configure(function() {
//   app.use(express.logger());
//   app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
// });

/* Read the directory tree according to the pattern specified above. */
var files = glob.sync(mockRootPattern);

/* Register mappings for each file found in the directory tree. */
if(files && files.length > 0) {
  files.forEach(function(fileName) {

    var mapping = apiRoot + fileName.replace(mockRoot, '').replace(mockFilePattern,'');


        // Add headers
    app.use(function (req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
    });

    app.get(mapping, function (req, res) {
      var data =  fs.readFileSync(fileName, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(data);
      res.end();
    });

    console.log('Registered mapping: %s -> %s', mapping, fileName);
  })
} else {
    console.log('No mappings found! Please check the configuration.');
}

/* Start the API mock server. */
console.log('Application root directory: [' + applicationRoot +']');
console.log('Mock Api Server listening: [http://' + ipaddress + ':' + port + ']');
app.listen(port, ipaddress);
