import express from "express";
import {
  getTrips,
  listSavedTrips,
  saveTrip,
  deleteTrip,
} from "../../controllers/TripController";
import {
  getTripsValidator,
  saveTripValidator,
  deleteTripValidator,
} from "./middlewares/TripValidators";

const router = express.Router();

router.get("/trips", getTripsValidator, getTrips);
router.post("/my-trip", express.json(), saveTripValidator, saveTrip);
router.get("/my-trips", listSavedTrips);
router.delete("/my-trip", deleteTripValidator, deleteTrip);

export default router;
