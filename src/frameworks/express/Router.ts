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

const getCors = getGithubPageCors(["GET"]);
const postCors = getGithubPageCors(["POST", "OPTIONS"]);
const deleteCors = getGithubPageCors(["DELETE", "OPTIONS"]);

router.get("/trips", getCors, getTripsValidator, getTrips);
router.post("/my-trip", postCors, express.json(), saveTripValidator, saveTrip);
router.get("/my-trips", getCors, listSavedTrips);
router.delete("/my-trip", deleteCors, deleteTripValidator, deleteTrip);

export default router;
