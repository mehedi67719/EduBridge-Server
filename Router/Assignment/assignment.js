const express = require("express");

module.exports = (assignmentcollection) => {
    const router = express.Router();

    router.get("/", async (req, res) => {
        try {
            const result = await assignmentcollection.find().toArray();

            res.status(200).send({
                message: "routine load successful",
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