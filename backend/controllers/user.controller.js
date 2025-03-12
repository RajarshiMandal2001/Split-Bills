import { User } from "../models/userModel.js";
import bcrypt from 'bcrypt';


/**
 * Registration methods
 */

// * Show registration page 
export const showRegister = (req, res) => {
    res.render('register', {error: null});
};

// * Register new user
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.render('register', { error: 'User already exists. Try a different email.' });
        }

        const hashedPassword = await bcrypt.hash(password, 2);

        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.redirect('/user/login'); // Redirect to login page after registration
    } catch (err) {
        res.status(500).send('Error registering user');
    }
};

/**
 * Login methods
 */

// * Show Login page
export const showLogin = (req, res) => {
    res.render('login', { error: null });
};
  
// * Login existing user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
        return res.render('login', { error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
        return res.render('login', { error: 'Invalid email or password' });
        }

        // Store user in session
        req.session.user = { id: user._id, name: user.name, email: user.email };
        res.redirect('/expense');
    } catch (err) {
        res.status(500).send('Error logging in');
    }
};

// * Logout loggedin user
export const logutUser =  (req, res) => {
    req.session.destroy(() => {
        res.redirect('/user/login');
    });
};