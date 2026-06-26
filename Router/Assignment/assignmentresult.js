const express = require("express");

module.exports = (submitassignmentCollection) => {
  const router = express.Router();

  router.get("/:email", async (req, res) => {
    try {
      const { email } = req.params;

      if (!email) {
        return res.status(400).send({ message: "Email is required" });
      }

      const result = await submitassignmentCollection.find({
        submitterEmail: email,
      }).toArray();

      if (!result) {
        return res.status(404).send({ message: "No submission found" });
      }

      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  });

  return router;
};