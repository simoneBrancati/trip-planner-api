import express from "express";
import { getTrips, saveTrip } from "../../controllers/TripController";
import {
  getTripsValidator,
  saveTripValidator,
} from "./middlewares/TripValidators";

const router = express.Router();

router.get("/trips", getTripsValidator, getTrips);
router.post("/trip", saveTripValidator, saveTrip);

export default router;
