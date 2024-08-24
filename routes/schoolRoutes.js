import express from "express";
import { addController, allSchoolsController } from "../controllers/schoolControllers.js";

//router object
const router = express.Router();

//Adding a New School
router.post("/addSchool", addController);

//Fetching List of Schools and sorting them on proximity
router.get("/listSchools", allSchoolsController);

export default router;