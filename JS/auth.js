// Function to handle Sign Up
const handleSignup = (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // 1. Check if passwords match
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // 2. Get existing users from LocalStorage or create empty array
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // 3. Check if email already exists
    const userExists = users.some(user => user.email === email);
    if (userExists) {
        alert("Email is already registered!");
        return;
    }

    // 4. Save new user
    const newUser = { username, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert("Registration successful! Redirecting to login...");
    window.location.href = 'login.html';
};

// Function to handle Login
const handleLogin = (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // 1. Get users from LocalStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // 2. Find user with matching email and password
    const foundUser = users.find(user => user.email === email && user.password === password);

    if (foundUser) {
        alert(`Welcome back, ${foundUser.username}!`);
        // Save logged in state if needed
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        window.location.href = 'home.html'; // Redirect to your To-Do list
    } else {
        alert("Invalid email or password!");
    }
};

// Logic to detect which form is being used
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');

    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});