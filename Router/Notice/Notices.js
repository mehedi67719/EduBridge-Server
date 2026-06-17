const express = require("express");
const { ObjectId } = require("mongodb");

module.exports = (noticecollection) => {
  const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { category, role, search, page } = req.query;

    const limit = 10;
    const pageNum = Number(page) || 1;

    let filter = {
      ...(category && category !== "all" ? { category } : {}),
      ...(role
        ? { targetRoles: { $in: ["public", role.toLowerCase()] } }
        : { targetRoles: "public" }),
    };

    if (search) {
      filter.$and = [
        {
          $or: [
            { noticeTitle: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
          ],
        },
      ];
    }

    const skip = (pageNum - 1) * limit;

    const total = await noticecollection.countDocuments(filter);

    const notice = await noticecollection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    res.status(200).send({
      data: notice,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "server error" });
  }
});




  router.get("/category", async (req, res) => {
    try {
      const categories = await noticecollection.aggregate([
        {
          $group:{
            _id:"$category"
          },
        }
      ]).toArray();




      res.status(200).send(categories);
    } catch (error) {
      res.status(500).send({
        message: "Failed to load categories",
        error: error.message,
      });
    }
  });



  router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({ message: "ID is required" });
    }

    const notice = await noticecollection.findOne({
      _id: new ObjectId(id),
    });

    if (!notice) {
      return res.status(404).send({ message: "Notice not found" });
    }

    res.send(notice);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server error" });
  }
});
  return router;
};
