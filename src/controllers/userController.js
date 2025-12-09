import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

//register user
export async function registerUser(req, res) {
    try {
        const data = req.body;

        data.password = bcrypt.hashSync(data.password, 10);

        const newUser = new User(data);

        await newUser.save()

        return res.status(201).json({
            message: "User registered successfully"

        });

    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ error: "Internal server error" });

    };

}

//login user
export function loginUser(req, res) {
    const data = req.body;

    User.findOne({
        email: data.email
    }).then((user) => {
        if (user == null) {
            res.status(404).json({ error: "User not found" })
        } else {
            if (user.isBlocked) {
                res.status(403).json({ error: "User is blocked" })
                return;
            }

            const isPasswordValid = bcrypt.compareSync(data.password, user.password);

            if (isPasswordValid) {
                const token = jwt.sign({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }, process.env.JWT_SECRET, { expiresIn: '24h' });

                res.json({ message: "Login successful", token: token, user: user })

            } else {
                res.status(401).json({ error: "Invalid password" });
            }
        }
    })
}

//check if user is admin
export function isAdmin(req, res) {
    let isAdmin = false;

    if (req.user != null) {
        if (req.user.role == "admin") {
            isAdmin = true;
        }
    }
    return isAdmin;
}


// check if user is a general user
export default function isUser(req, res) {
    let isUser = false;

    if (req.user != null) {
        if (req.user.role == "user") {
            isUser = true;
        }

    }
    return isUser;
}

//get all users
export async function getAllUsers(req, res) {
    if (isAdmin(req)) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (e) {
            res.status(500).json({ error: "Failed to get users" });
        }

    } else {
        res.status(403).json({ error: "Unauthorized" });
    }

}

//get logged user deatils
export async function getLoggedUser(req, res) {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        return res.status(200).json(user);
    } catch (error) {

    }

}

// delete logged users account
export async function deleteUserAccount(req, res) {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({
            message: "Account deleted successfully",
        });

    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}
