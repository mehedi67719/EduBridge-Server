const express = require("express");

module.exports = (noticeCollection) => {
  const router = express.Router();

  router.get("/:email", async (req, res) => {
    try {
      const { email } = req.params;

      const result = await noticeCollection.find({
        "createdBy.email": email,
      }).toArray();

      res.send(result);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

  return router;
};