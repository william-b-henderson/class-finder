import express from 'express';
import { runQuery } from '../libs/queryCommands.js';
import fs from 'fs'

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 
let buildingRouter = express.Router();

// Get Classes in :building starting from :startTime on :dayCondition
buildingRouter.get("/getBuildingGeoJSON", async (req, res) => {
    try {
        const rawData = fs.readFileSync(path.resolve(__dirname, '../data/building_geojson.json'));
        const data = JSON.parse(rawData);
        res.json(data);
    } catch(e) {
        console.error('error fetching geoJSON', e);
        res.status(400).send({"error running query": e})
    }
})

export default buildingRouter;