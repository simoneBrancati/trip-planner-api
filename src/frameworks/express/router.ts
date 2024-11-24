import express from "express";
import { getTrips } from "../../controllers/TripController";
import { getTripsValidator } from "./middlewares/validators";

const router = express.Router();

router.get("/trips", getTripsValidator, getTrips);

export default router;
