const express = require("express");

module.exports = (routinecollection) => {
  const router = express.Router();

  router.post("/", async (req, res) => {
    try {
      const routinedata = req.body;

      if (!routinedata || Object.keys(routinedata).length === 0) {
        return res.status(400).send({ message: "Routine data is not found" });
      }

      const result = await routinecollection.insertOne(routinedata);

      res.status(201).send({
        message: "Data upload successful",
        success: true,
        result,
      });

    } catch (error) {
      res.status(500).send({
        message: "Server error",
        success: false,
        error: error.message,
      });
    }
  });

  return router;
};