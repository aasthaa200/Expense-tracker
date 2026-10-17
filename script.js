const transactionForm = document.getElementById("transactionForm");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");

const balanceElement = document.getElementById("balance");
const incomeElement = document.getElementById("income");
const expenseElement = document.getElementById("expense");

const transactionList = document.getElementById("transactionList");
const clearAllButton = document.getElementById("clearAll");


// Get transactions from Local Storage
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];


// Add Transaction
transactionForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;
    const category = categoryInput.value;

    if (description === "" || amount <= 0) {
        alert("Please enter valid transaction details.");
        return;
    }

    const transaction = {
        id: Date.now(),
        description: description,
        amount: amount,
        type: type,
        category: category,
        date: new Date().toLocaleDateString()
    };

    transactions.push(transaction);

    saveTransactions();

    transactionForm.reset();

    displayTransactions();
    updateSummary();
});


// Save transactions to Local Storage
function saveTransactions() {
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}


// Display Transactions
function displayTransactions() {

    transactionList.innerHTML = "";

    if (transactions.length === 0) {

        transactionList.innerHTML = `
            <p class="empty-message">
                No transactions yet.
            </p>
        `;

        return;
    }

    transactions
        .slice()
        .reverse()
        .forEach(transaction => {

            const transactionElement = document.createElement("div");

            transactionElement.classList.add("transaction-item");

            const sign = transaction.type === "income" ? "+" : "-";

            transactionElement.innerHTML = `
                <div class="transaction-info">
                    <h3>${transaction.description}</h3>
                    <span>
                        ${transaction.category} • ${transaction.date}
                    </span>
                </div>

                <div class="transaction-amount ${transaction.type}">
                    ${sign} ₹${transaction.amount.toFixed(2)}
                </div>

                <button
                    class="delete-btn"
                    onclick="deleteTransaction(${transaction.id})"
                >
                    Delete
                </button>
            `;

            transactionList.appendChild(transactionElement);
        });
}


// Delete Transaction
function deleteTransaction(id) {

    transactions = transactions.filter(
        transaction => transaction.id !== id
    );

    saveTransactions();

    displayTransactions();
    updateSummary();
}


// Calculate Income, Expense and Balance
function updateSummary() {

    let income = 0;
    let expense = 0;

    transactions.forEach(transaction => {

        if (transaction.type === "income") {
            income += transaction.amount;
        } else {
            expense += transaction.amount;
        }

    });

    const balance = income - expense;

    incomeElement.textContent =
        `₹${income.toFixed(2)}`;

    expenseElement.textContent =
        `₹${expense.toFixed(2)}`;

    balanceElement.textContent =
        `₹${balance.toFixed(2)}`;
}


// Clear All Transactions
clearAllButton.addEventListener("click", function () {

    if (transactions.length === 0) {
        return;
    }

    const confirmDelete = confirm(
        "Are you sure you want to delete all transactions?"
    );

    if (confirmDelete) {

        transactions = [];

        saveTransactions();

        displayTransactions();
        updateSummary();
    }
});


// Load saved transactions when page opens
displayTransactions();
updateSummary();