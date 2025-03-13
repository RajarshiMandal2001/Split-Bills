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
  const users = await User.find({},{
    _id: 1,
    name: 1,
    email: 1
  });

  const expenses = await Expense.find()
                    .populate('paidBy')
                    .populate('splitAmong');

  let balances = {};

  // users.forEach(user => balances[user._id] = { name: user.name, balance: 0 });

  expenses.forEach(expense => {
    const perPersonShare = expense.amount / expense.splitAmong.length;

    expense.splitAmong.forEach(user => {
      if (!balances[user.email]) {
        balances[user.email] = 0;
      }
      if (!balances[expense.paidBy.email]) {
        balances[expense.paidBy.email] = 0;
      } 

      if (user.email === expense.paidBy.email) {
        balances[user.email] += expense.amount - perPersonShare;
      } else {
        balances[user.email] -= perPersonShare;
        // balances[expense.paidBy.email] += perPersonShare;
      }
    });

    // if the user paid which is NOT split with them
    if(!expense.splitAmong.find((user) => user.email === expense.paidBy.email)){
      balances[expense.paidBy.email] += expense.amount;
    }
  });

  console.log("balance:", balances)
  const loggedInUserBalance = balances[req.session.user.email];
  let transactions = settleBalances(balances);
  res.render('balance', { transactions, users, loggedInUserBalance });
  // res.render('balance', { balances: Object.values(balances) });
};


// utility function to convert balance to transaction
function settleBalances(balances) {
  let creditors = [];
  let debtors = [];

  Object.entries(balances).forEach(([email, amount]) => {
    if (amount > 0) {
      creditors.push({ email, amount });
    } else if (amount < 0) {
      debtors.push({ email, amount: -amount }); // Convert to positive
    }
  });

  let transactions = [];

  // Step 3: Match debtors to creditors
  while (debtors.length > 0 && creditors.length > 0) {
    let debtor = debtors[0];
    let creditor = creditors[0];

    let amountToSettle = Math.min(debtor.amount, creditor.amount);
    transactions.push({
      from: debtor.email,
      to: creditor.email,
      amount: amountToSettle.toFixed(2),
    });

    // Adjust balances
    debtor.amount -= amountToSettle;
    creditor.amount -= amountToSettle;

    // Remove settled users
    if (debtor.amount === 0) debtors.shift();
    if (creditor.amount === 0) creditors.shift();
  }

  return transactions;
}
