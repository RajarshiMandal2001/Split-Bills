import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import connectDB from "./config/database.js";
import session from 'express-session';
import userRoute from './routes/userRoute.js';
import expenseRoute from './routes/expenseRoute.js';
dotenv.config({});

const PORT = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Session Middleware
app.use(session({
    secret: 'splitwise-secret-key', // Change this to a strong secret
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});
  
// routes
app.use('/user', userRoute)
app.use('/expense', expenseRoute)


app.listen(PORT, ()=>{
    connectDB();
    console.log(`Server started at port ${PORT}`);
});
