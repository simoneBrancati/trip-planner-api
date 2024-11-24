import express from "express";
import { getTrips } from "../../controllers/TripController";

const router = express.Router();

router.get("/trips", getTrips);

export default router;
