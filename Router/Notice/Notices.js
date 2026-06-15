const express = require("express");

module.exports = (noticecollection) => {
  const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { category, role, search } = req.query;

    

    let filter = {};

   
    if (role) {
      filter.targetRoles = { $in: ["public", role] };
    } else {
      filter.targetRoles = "public";
    }

   
    if (category && category !== "all") {
      filter.category = category;
    }


    if (search) {
      filter.$or = [
        { noticeTitle: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const notice = await noticecollection
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).send(notice);
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

  return router;
};
