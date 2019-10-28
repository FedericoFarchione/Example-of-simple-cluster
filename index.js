'use strict'

const http       = require('http');
const express    = require('express');
const app        = express();
const morgan     = require('morgan');

const mongoose   = require('./db');
const bodyparser = require('body-parser');
const cors       = require('cors');
const chalk      = require('chalk');

const cluster    = require('cluster');
const numCPU     = require('os').cpus().length;
const PORT       = process.env.PORT || 3000

let workers = [];

const setupWorkers = ()=>{
  console.log(chalk.cyan(`Master cluster crate ${numCPU} workers now!`));
  for(let i=0; i<numCPU; i++){
    workers.push(cluster.fork());
    workers[i].on('message', function message(){
      console.log(message);
    });
  }
  cluster.on('online', function(woker){
    console.log(chalk.yellow(`Worker ${process.pid} is ready to listen STA FORKANDO`));
  });
  cluster.on('exit', function(worker, code, signal){
    console.log(chalk.magenta(`Worker ${worker.process.pid} died with code: ` + code + ', and signal: ' + signal));
    console.log(chalk.yellow('Starting a new worker'));
    cluster.fork();
    workers.push(cluster.fork());
    workers[workers.length - 1].on('message', function(message) {
      console.log(message);
    });
  });
};

const setUpExpress = () => {
  app.server = http.createServer(app);
  //con questo splitto i compiti eseguibili express si occuperà di business logic e api mentre HTTP apre il server sulle porte e fornisce file etc
  app.use(morgan('tiny'));
  app.use(cors({
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"]
  }));
  app.use(bodyparser.urlencoded({
    limit: '50mb',
    extended: false
  }));
  app.use(bodyparser.json({
    limit: '2000kb'
  }));
  app.use(bodyparser.raw({
    limit: '2000kb'
  }));
  app.use(bodyparser.text({
    limit: '2000kb'
  }));
  /////////////////////////////////////////////// API
  app.get('/get/:par1', require('./user/user.route'))
     .post('/posta', require('./user/user.route'))

  app.server.listen(PORT, function(){
    console.log(chalk.green(`Server listen at port: localhost://${PORT} for process ID: ${process.pid}`));
  });
}

// const server = app.listen(PORT, function(){
//   console.log(chalk.green(`server listen at port : localhost://${PORT} for process ID ${process.pid}`));
// });

const setupServer = (isClusterRequired) => {
  if (isClusterRequired && cluster.isMaster) {
    setupWorkers();
  } else {
    setUpExpress();
  }
};
setupServer(true);

module.export = app;
