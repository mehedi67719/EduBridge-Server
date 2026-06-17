const express = require("express");

module.exports = (assignmentcollection) => {
  const router = express.Router();

  router.get("/", async (req, res) => {
    try {
      const { role, search, page, secreatecode } = req.query; 

      const limit = 10;
      const pagenum = Number(page) || 1;

      let filter = {};

      
      if (secreatecode) {
        const allowedRoles = role ? ["public", role.toLowerCase()] : ["public"];
        
        filter.secretCode = secreatecode;
        filter.isPrivate = true;
        filter.targetRoles = { $in: allowedRoles };
      } else {
        filter.isPrivate = { $ne: true }; 
        
        if (role) {
          filter.targetRoles = { $in: ["public", role.toLowerCase()] };
        } else {
          filter.targetRoles = "public";
        }
      }


      if (search) {
        filter.$or = [
          { assignmentTitle: { $regex: search, $options: "i" } },
          { assignmentDescription: { $regex: search, $options: "i" } },
          { "assignmentTypes.name": { $regex: search, $options: "i" } },
        ];
      }

      const skip = (pagenum - 1) * limit;

 
      const total = await assignmentcollection.countDocuments(filter);

      const subjectsResult = await assignmentcollection.aggregate([
        { $unwind: "$subjects" }, 
        { $group: { _id: "$subjects" } }, 
        { $sort: { _id: 1 } } 
      ]).toArray();

      const allSubjects = subjectsResult.map(item => item._id);

  
      const result = await assignmentcollection
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray();

     
      res.status(200).send({
        message: "routine load successful",
        subjects: allSubjects, 
        total,
        page: pagenum,
        limit,
        data: result,
      });

    } catch (err) {
      res.status(500).send({
        message: "something went wrong",
        error: err.message,
      });
    }
  });

  return router; 
};