import express from 'express';
import { isAuthenticated } from '../middleware/isUserAuthenticated.js';
import { addExpense, getAllBalence, getAllExpense, showAddExpense, settleExpense } from '../controllers/expense.controller.js';

const router = express.Router();

// home page - show all expenses of all users
// @GET
router.route("/").get(isAuthenticated, getAllExpense);

// fetch balance of all users
// @GET
router.route("/balance").get(isAuthenticated, getAllBalence);

// render add expense page
// @GET
router.route("/add-expense").get(isAuthenticated, showAddExpense);

// handle add expense
// @POST
router.route("/add-expense").post(isAuthenticated, addExpense);

// handle add expense
// @POST
router.route("/settle").post(isAuthenticated, settleExpense);

export default router;