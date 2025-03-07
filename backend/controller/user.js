const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSignUp = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const hashPwd = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            email,
            password: hashPwd
        });

        const token = jwt.sign({ email, id: newUser._id }, process.env.SECRET_KEY, { expiresIn: "7d" });

        return res.status(201).json({ token, user: newUser });
    } catch (error) {
        console.error("Error in userSignUp:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        let user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ email, id: user._id }, process.env.SECRET_KEY, { expiresIn: "7d" });

        return res.status(200).json({ token, user });
    } catch (error) {
        console.error("Error in userLogin:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Fetching user with ID:", id); // Debugging log

        if (!id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        if (!id.match(/^[0-9a-fA-F]{24}$/)) { // Validate if it's a valid MongoDB ObjectId
            return res.status(400).json({ error: "Invalid User ID format" });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ email: user.email });
    } catch (error) {
        console.error("Error in getUser:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { userLogin, userSignUp, getUser };
