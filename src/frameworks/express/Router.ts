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
router.post(
  "/my-trip",
  getGithubPageCors(["POST", "OPTIONS"]),
  express.json(),
  saveTripValidator,
  saveTrip,
);
router.get("/my-trips", getGithubPageCors(["GET"]), listSavedTrips);
router.delete(
  "/my-trip",
  getGithubPageCors(["DELETE", "OPTIONS"]),
  deleteTripValidator,
  deleteTrip,
);

export default router;
