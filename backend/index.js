import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import classesRouter from './routes/classes.js'
import buildingRouter from './routes/buildings.js'

dotenv.config()

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.REACT_APP_PORT || 8080;

var router = express.Router();

router.get('/', function(req, res) {
    res.json({ message: 'API for class finder' });   
});

app.use("/", router)

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
  next();
});

app.use('/api/v1/classes', classesRouter);

app.use('/api/v1/buildings', buildingRouter)

app.listen(port, (req, res) => {
    console.log(`Class Finder API Started at PORT ${port}`);
});