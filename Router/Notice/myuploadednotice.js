const express = require("express");

const { ObjectId } = require("mongodb");

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





router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({
        success: false,
        message: "ID is required",
      });
    }

    const result = await noticeCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "Notice not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Notice deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Delete Notice Error:", error);

    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

  return router;
};