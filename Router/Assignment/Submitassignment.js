const express = require("express");

module.exports = (submitAssignmentCollection) => {
  const router = express.Router();

  router.post("/", async (req, res) => {
    try {
      const data = req.body;

      const result = await submitAssignmentCollection.insertOne(data);

      res.status(201).send({
        success: true,
        message: "Assignment submitted successfully",
        insertedId: result.insertedId,
      });
    } catch (err) {
      console.error("Error submitting assignment:", err);

      res.status(500).send({
        success: false,
        message: "Failed to submit assignment",
        error: err.message,
      });
    }
  });

  return router;
};