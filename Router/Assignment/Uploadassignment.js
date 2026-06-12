const express = require('express');

module.exports = (assignmentcollection) => {
    const router = express.Router();

    router.post("/", async (req, res) => {
        const assignmentdata = req.body;

        if (!assignmentdata) {
            return res.status(400).send({
                message: "assignment data is not found"
            });
        }

        const result = await assignmentcollection.insertOne(assignmentdata);

        res.status(201).send({
            message: "assignment data post successfully",
            success: true,
            result
        });
    });

    return router;
};