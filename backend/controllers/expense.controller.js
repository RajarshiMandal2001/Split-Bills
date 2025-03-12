import { Expense } from "../models/expenseModel.js";
import { User } from "../models/userModel.js";


// Home Route - Show All Expenses
export const getAllExpense = async (req, res) => {
  const expenses = await Expense.find()
                    .populate('paidBy')
                    .populate('splitAmong')
                    .sort( { _id: -1 });
  res.render('index', { expenses });
};

// Show add Expense Page
export const showAddExpense = async (req, res) => {
  const users = await User.find();
  res.render('add-expense', { users });
};

// Add new Expense 
export const addExpense = async (req, res) => {
  const { description, amount, paidBy, splitAmong } = req.body;
  
  const expense = new Expense({
    description,
    amount,
    paidBy,
    splitAmong
  });

  await expense.save();
  res.redirect('/expense');
};

// Fetch all balances of users
export const getAllBalence = async (req, res) => {
  const users = await User.find();

  const expenses = await Expense.find()
                    .populate('paidBy')
                    .populate('splitAmong');

  let balances = {};

  users.forEach(user => balances[user._id] = { name: user.name, balance: 0 });

  expenses.forEach(expense => {
    balances[expense.paidBy._id].balance += expense.amount;

    const splitAmount = expense.amount / expense.splitAmong.length;
    
    expense.splitAmong.forEach(user => {
      balances[user._id].balance -= splitAmount;
    });
  });

  res.render('balance', { balances: Object.values(balances) });
};