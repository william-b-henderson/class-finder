import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';

import classesRouter from './routes/classes.js'
import buildingRouter from './routes/buildings.js'

dotenv.config()

const app = express();
var corsOptions = {
  origin: ['https://berkeleyclassfinder.com', 'https://www.berkeleyclassfinder.com', 'https://main.d1r59odgujpru7.amplifyapp.com/'],
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.REACT_APP_PORT || 8080;

var router = express.Router();

router.get('/', function(req, res) {
    res.json({ message: 'API for class finder' });   
});



app.use("/", router)



app.use('/api/v1/classes', classesRouter);

app.use('/api/v1/buildings', buildingRouter)

app.listen(port, (req, res) => {
    console.log(`Class Finder API Started at PORT ${port}`);
});