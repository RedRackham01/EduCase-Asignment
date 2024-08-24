import pool from "../config/db.js";

//Validating Latitude and Longitude
const validateCoordinates = (latitude, longitude) => {
  const isValidLatitude = latitude >= -90 && latitude <= 90;
  const isValidLongitude = longitude >= -180 && longitude <= 180;
  return isValidLatitude && isValidLongitude;
};

//-----------------------Adding a New School-----------------------

export const addController = async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;
    // Input validation
    if (
      !name ||
      !address ||
      !latitude ||
      !longitude ||
      typeof name !== "string" ||
      typeof address !== "string" ||
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      !validateCoordinates(latitude, longitude)
    ) {
      return res.status(400).send({
        success: false,
        message: "Invalid input data",
      });
    }
    const data = await pool.query("INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)", [name, address, latitude, longitude]);
    res.status(201).send({
      success: true,
      message: "New School added",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in adding new school",
      error,
    });
  }
};

//-----------------------Getting list of schools-----------------------

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const allSchoolsController = async (req, res) => {
  try {
    // const { latitude, longitude } = req.query;
    const latitude = parseFloat(req.query.latitude);
    const longitude = parseFloat(req.query.longitude);

    // Input validation
    if (typeof latitude !== "number" || typeof longitude !== "number" || !validateCoordinates(latitude, longitude)) {
      return res.status(400).send({
        success: false,
        message: "Invalid query",
      });
    }

    // Fetching all Schools
    const data = await pool.query("SELECT * FROM schools");
    const schoolsWithDistance = data[0].map((school) => {
      const distance = haversineDistance(latitude, longitude, school.latitude, school.longitude);
      return { ...school, distance };
    });

    // Sort schools by distance
    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.status(201).send({
      success: true,
      message: "School list fetched and sorted according to closest distance",
      schoolsWithDistance,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching schools",
      error,
    });
  }
};
