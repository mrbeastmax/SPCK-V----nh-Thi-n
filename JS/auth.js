// Đợi DOM load xong mới chạy code để tránh lỗi null
document.addEventListener('DOMContentLoaded', function() {
    const signupBtn = document.getElementById('signupBtn');

    if (signupBtn) {
        signupBtn.addEventListener("click", function(e) {
            e.preventDefault();

            // Lấy dữ liệu - Hãy chú ý ID phải khớp hoàn toàn với HTML
            const fullName = document.getElementById("username").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            // Kiểm tra rỗng
            if (!fullName || !email || !password) {
                alert("Please fill in all fields.");
                return;
            }

            // Kiểm tra độ dài
            if (password.length < 6) {
                alert("Password must be at least 6 characters long.");
                return;
            }

            // Kiểm tra khớp mật khẩu (Sửa lỗi chính tả confirm)
            if (password !== confirmPassword) {
                alert("Passwords do not match.");
                return;
            }

            const userData = {
                fullName: fullName,
                email: email,
                password: password,
                createdAt: new Date().toISOString()
            };

            // Lưu vào localStorage
            localStorage.setItem('userAccount', JSON.stringify(userData));
            
            alert("Signup successful!");
            window.location.href = "home.html";
        });
    }
});

// Lấy chuỗi JSON từ localStorage
const savedData = localStorage.getItem('userAccount');

if (savedData) {
    // Chuyển chuỗi JSON ngược lại thành Object
    const user = JSON.parse(savedData);
    
    console.log("Chào mừng bạn trở lại, " + user.fullName);
    console.log("Email của bạn là: " + user.email);
}