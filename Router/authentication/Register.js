const express = require("express");
const bcrypt = require("bcrypt");

module.exports = (userCollection) => {
  const router = express.Router();

  router.post("/", async (req, res) => {
    try {
      const data = req.body;

      const existingUser = await userCollection.findOne({
        email: data.email,
      });

      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const newUser = {
        userType: data.userType,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        department: data.department,
        institutionName: data.institutionName,
        secretCode: data.secretCode,
        password: hashedPassword,
        createdAt: new Date(),
      };

      console.log(newUser);

      const result = await userCollection.insertOne(newUser);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        userId: result.insertedId,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  return router;
};
