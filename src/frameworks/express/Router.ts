import express from "express";
import {
  getTrips,
  listSavedTrips,
  saveTrip,
} from "../../controllers/TripController";
import {
  getTripsValidator,
  saveTripValidator,
} from "./middlewares/TripValidators";

const router = express.Router();

router.get("/trips", getTripsValidator, getTrips);
router.post("/my-trip", saveTripValidator, saveTrip);
router.get("/my-trips", listSavedTrips);

export default router;
