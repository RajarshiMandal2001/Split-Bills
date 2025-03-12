import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },

    amount: {
        type: Number,
        required: true,
        min: 1
    },

    paidBy: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    
    splitAmong: [
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
}, {
    timestamps: true
});

export const Expense = mongoose.model("Expense", ExpenseSchema);  