import express from "express";
import { getTrips } from "../../controllers/TripController";
import { getTripsValidator } from "./middlewares/TripValidators";

const router = express.Router();

router.get("/trips", getTripsValidator, getTrips);

export default router;
