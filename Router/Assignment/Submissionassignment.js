const express = require("express");

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

      const result = await submitassignmentcollection.aggregate([
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

            // ✅ ADD DEADLINE HERE
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
            totalSubmissions: 1,
            submissions: 1,
          },
        },
      ]).toArray();

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

  return router;
};