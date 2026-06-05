const express = require("express");

module.exports = (usercollection) => {
  const router = express.Router();

  router.get("/", async (req, res) => {
    try {
      const email = req.query.email;

      const user = await usercollection.findOne({ email });

      res.status(200).send(user);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

  return router;
};