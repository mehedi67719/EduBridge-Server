const express = require("express");

module.exports = (noticecollection) => {
  const router = express.Router();

  router.post("/", async (req, res) => {
    try {
      const formdata = req.body;


      if (!formdata || Object.keys(formdata).length === 0) {
        return res.status(400).send({
          message: "Form data is required",
        });
      }

      const result = await noticecollection.insertOne(formdata);

      return res.status(201).send({
        message: "Notice created successfully",
        insertedId: result.insertedId,
      });

    } catch (error) {
      console.error(error);
      return res.status(500).send({
        message: "Server error",
      });
    }
  });

  return router;
};