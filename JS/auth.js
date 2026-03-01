const hashPassword = (password) => {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0;
    }
    return hash.toString();
};

const isValidEmail = (email) => {
    const hasAt = email.includes('@');
    const hasDot = email.includes('.');
    const atIndex = email.indexOf('@');
    const lastDotIndex = email.lastIndexOf('.');

    return hasAt && hasDot && atIndex > 0 && lastDotIndex > atIndex + 1;
};

const handleSignup = (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!username || !email || !password || !confirmPassword) {
        alert("Please fill in all fields!");
        return;
    }

    if (!isValidEmail(email)) {
        alert("Please enter a valid email address!");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters!");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const userExists = users.some(user => user.email === email);
    if (userExists) {
        alert("Email is already registered!");
        return;
    }

    const newUser = { username, email, password: hashPassword(password) };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert("Registration successful! Redirecting to login...");
    window.location.href = 'login.html';
};

const handleLogin = (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert("Please fill in all fields!");
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const foundUser = users.find(
        user => user.email === email && user.password === hashPassword(password)
    );

    if (foundUser) {
        alert(`Welcome back, ${foundUser.username}!`);
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        window.location.href = 'home.html';
    } else {
        alert("Invalid email or password!");
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');

    if (signupForm) signupForm.addEventListener('submit', handleSignup);
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
});