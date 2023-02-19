import express from 'express';
import { runQuery } from '../libs/queryCommands.js';
 
let classesRouter = express.Router();

// Get Classes in :building starting from :startTime on :dayCondition
classesRouter.get("/getClasses", async (req, res) => {
    let [building, startTime, dayCondition, endRange] = ['', '', '', ''];
    try {
        console.log(req.query)
        building = req.query.building;
        startTime = req.query.startTime;
        dayCondition = req.query.dayCondition;
        endRange = req.query.endRange;
    } catch(e) {
        console.error('invalid query parameters', e);
        res.status(400).send({"nvalid query parameters": e})
    }
    try {
        let data = await runQuery(building, startTime, endRange, dayCondition);
        res.json(data);
    } catch(e) {
        console.error('error running query', e);
        res.status(400).send({"error running query": e})
    }
})

export default classesRouter;