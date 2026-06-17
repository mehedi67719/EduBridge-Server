const express = require("express");
const { ObjectId } = require("mongodb");

module.exports = (assignmentcollection) => {
  const router = express.Router();

  router.get("/", async (req, res) => {
    try {
      const { role, search, page, secretcode, subject } = req.query; 

      const limit = 10;
      const pagenum = Number(page) || 1;

      let filter = {};

  
      if (secretcode) {
    
        const allowedRoles = role ? ["public", role.toLowerCase()] : ["public"];
        filter.secretCode = secretcode;
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

  
      if (subject && subject.toLowerCase() !== "all") {
        filter["subjects.name"] = subject; 
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
        { 
          $unwind: { 
            path: "$subjects", 
            preserveNullAndEmptyArrays: true 
          } 
        }, 
        { 
          $group: { 
            _id: "$subjects.name" 
          } 
        }, 
        { $sort: { _id: 1 } } 
      ]).toArray();

    
      const allSubjects = subjectsResult
        .map(item => item._id)
        .filter(name => name !== null && name !== undefined && name !== "");

     
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



router.get("/detels", async (req, res) => {
  try {
    const { id, role } = req.query;

    if (!id) {
      return res.status(400).send({ message: "id is required" });
    }

    const doc = await assignmentcollection.findOne({
      _id: new ObjectId(id),
    });

    if (!doc) {
      return res.status(404).send({ message: "not found" });
    }

  
    if (doc.isPrivate) {
      const allowedRoles = role
        ? ["public", role.toLowerCase()]
        : ["public"];

      const roleMatch =
        doc.targetRoles &&
        doc.targetRoles.some((r) => allowedRoles.includes(r));

      if (!roleMatch) {
        return res.status(403).send({
          message: "You are not allowed to access this assignment",
        });
      }
    }

    res.status(200).send(doc);
  } catch (err) {
    res.status(500).send({
      message: "server error",
      error: err.message,
    });
  }
});

  return router; 
};