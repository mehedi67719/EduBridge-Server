const express = require("express");
const { ObjectId } = require("mongodb");

module.exports = (submitassignmentcollection) => {
  const router = express.Router();

  router.get("/", async (req, res) => {
    try {
      const { email, role } = req.query;

      if (!email || !role) {
        return res.status(400).json({
          success: false,
          message: "Email and role are required",
        });
      }

      const result = await submitassignmentcollection
        .aggregate([
          {
            $match: {
              assignmentCreatorEmail: email,
            },
          },

          {
            $group: {
              _id: "$assignmentId",

              assignmentId: { $first: "$assignmentId" },
              assignmentTitle: { $first: "$assignmentTitle" },

              assignmenttotalmarks: { $first: "$assignmenttotalmarks" },
              assignmentdeadline: { $first: "$assignmentdeadline" },

              totalSubmissions: { $sum: 1 },

              submissions: {
                $push: {
                  _id: "$_id",
                  submitterId: "$submitterId",
                  submitterName: "$submitterName",
                  submitterEmail: "$submitterEmail",
                  submitterUserType: "$submitterUserTypeLabel",
                  submitterInstitution: "$submitterInstitution",
                  fileUrl: "$fileUrl",
                  fileName: "$fileName",
                  notes: "$notes",
                  marks:"$marks",
                  submittedAt: "$submittedAt",
                },
              },
            },
          },

          {
            $project: {
              _id: 0,
              assignmentId: 1,
              assignmentTitle: 1,
              assignmentdeadline: 1,
              assignmenttotalmarks: 1,
              totalSubmissions: 1,
              marks:1,
              submissions: 1,
            },
          },
        ])
        .toArray();

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      console.error("GET / error:", err);

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });




  router.post("/post-marks", async (req, res) => {
    try {
      const { Id, marks } = req.body;
      if (!Id || marks === undefined) {
        return res.status(400).send({
          success: false,
          message: "Id and marks are required",
        });
      }

      const numericMarks = Number(marks);

      if (isNaN(numericMarks) || numericMarks < 0) {
        return res.status(400).send({
          success: false,
          message: "Marks must be a valid positive number",
        });
      }

      const result = await submitassignmentcollection.updateOne(
        {
          _id:new ObjectId(Id),
        },
        {
          $set: {
            marks: numericMarks,
            isMarked: true,
            markedAt: new Date(),
          },
        },
      );

      if (result.matchedCount === 0) {
        return res.status(404).send({
          success: false,
          message: "Submission not found",
        });
      }

      return res.status(200).send({
        success: true,
        message: "Marks added successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error submitting marks:", error);
      res.status(500).send({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  });

  return router;
};
