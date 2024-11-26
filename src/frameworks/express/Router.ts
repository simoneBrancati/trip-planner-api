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
import { getGithubPageCors } from "./Cors";

const router = express.Router();

router.get("/trips", getGithubPageCors(["GET"]), getTripsValidator, getTrips);

const myTripCors = getGithubPageCors(["POST", "OPTIONS", "DELETE"]);
router.options("/my-trip", myTripCors);
router.post(
  "/my-trip",
  myTripCors,
  express.json(),
  saveTripValidator,
  saveTrip,
);
router.delete("/my-trip", myTripCors, deleteTripValidator, deleteTrip);
router.get("/my-trips", getGithubPageCors(["GET"]), listSavedTrips);

export default router;
