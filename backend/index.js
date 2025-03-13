import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import connectDB from "./config/database.js";
import session from 'express-session';
import userRoute from './routes/userRoute.js';
import expenseRoute from './routes/expenseRoute.js';
import MongoStore from "connect-mongo";
dotenv.config({});

const PORT = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Session Middleware
// app.use(session({
//     secret: 'splitwise-secret-key', // Change this to a strong secret
//     resave: false,
//     saveUninitialized: false
// }));
app.use(session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
      ttl: 24 * 60 * 60 // Session expiration (1 day)
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      httpOnly: true,
      sameSite: "strict"
    }
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
