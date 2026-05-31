const express = require("express");

module.exports = (noticecollection) => {
  const router = express.Router();

  router.get("/", async (req, res) => {
    try {
      const notice = await noticecollection.find().toArray();
      res.send(notice);
    } catch (error) {
      console.log("something wrong", error);
      res.status(500).send({ message: "Server error" });
    }
  });

  return router;
};
