document.addEventListener('DOMContentLoaded', () => {
    // === 1. LẤY PHẦN TỬ HTML ===
    const taskInput = document.getElementById('taskInput'),
          taskDeadline = document.getElementById('taskDeadline'),
          taskNote = document.getElementById('taskNote'),
          addTaskBtn = document.getElementById('addTaskBtn'),
          taskList = document.getElementById('taskList'),
          categoryTitle = document.getElementById('current-category'),
          todoSection = document.getElementById('todoSection'),
          settingsSection = document.getElementById('settingsSection'),
          quoteContainer = document.getElementById('quoteContainer');

    // === 2. KIỂM TRA ĐĂNG NHẬP ===
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) { window.location.href = 'login.html'; return; }

    document.getElementById('user-display-name').textContent = currentUser.username;
    document.getElementById('user-initial').textContent = currentUser.username.charAt(0).toUpperCase();
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' });

    let tasks = JSON.parse(localStorage.getItem(`tasks_${currentUser.email}`)) || [];
    let currentFilter = 'inbox';

    // === 3. LOGIC WIDGET QUOTE ===
    // Hàm fetchQuote cải tiến với logic đổi tag ngẫu nhiên
    const fetchQuote = async () => {
        try {
            const tags = ['motivation', 'wisdom', 'inspirational'];
            const randomTag = tags[Math.floor(Math.random() * tags.length)];
            
            const res = await fetch(`https://quoteslate.vercel.app/api/quotes/random?tags=${randomTag}`);
            const data = await res.json();
            
            const quoteBox = document.getElementById('quoteContainer');
            const quoteText = document.getElementById('quoteText');
            const quoteAuthor = document.getElementById('quoteAuthor');

            if (currentUser.showQuote && quoteBox) {
                // Thêm hiệu ứng mờ dần khi đổi chữ
                quoteBox.style.opacity = 0;
            
                setTimeout(() => {
                    quoteBox.style.display = 'flex';
                    quoteText.textContent = `"${data.quote}"`;
                    quoteAuthor.textContent = `— ${data.author}`;
                    quoteBox.style.opacity = 1;
                }, 400);
            }
        } catch (e) {
            console.error("Không thể tải Quote");
        }
    };

    // Khởi chạy lần đầu khi load trang
    if (currentUser.showQuote) {
        fetchQuote();
    
        // Thiết lập tự động đổi sau mỗi 30 giây (30000 ms)
        setInterval(() => {
            fetchQuote();
        }, 30000); 
    }

    // === 4. BỘ LỌC & HIỂN THỊ ===
    const getFilteredTasks = () => {
        const todayStr = new Date().toISOString().split('T')[0];
        if (currentFilter === 'today') return tasks.filter(t => t.deadline.startsWith(todayStr));
        if (currentFilter === 'upcoming') return tasks.filter(t => t.deadline !== "No deadline" && new Date(t.deadline) > new Date()).sort((a,b) => new Date(a.deadline) - new Date(b.deadline));
        if (currentFilter === 'completed') return tasks.filter(t => t.completed);
        return tasks;
    };

    const renderTasks = () => {
        taskList.innerHTML = '';
        getFilteredTasks().forEach((task) => {
            const idx = tasks.findIndex(t => t === task);
            const isUrgent = !task.completed && task.deadline !== "No deadline" && (new Date(task.deadline) - new Date()) / 864e5 <= 2;
            
            const li = document.createElement('div');
            li.className = 'task-wrapper';
            li.innerHTML = `
                <div class="task-item ${task.completed ? 'completed' : ''} ${isUrgent ? 'urgent' : ''}">
                    <div class="task-left">
                        <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${idx})">
                        <span>${task.text}</span>
                        <button class="btn-see-more" onclick="toggleDetails(${idx})">See more</button>
                    </div>
                    <div class="task-actions">
                        <button class="btn-edit" onclick="editTask(${idx})"><i class="fas fa-edit"></i></button>
                        <button class="btn-delete" onclick="deleteTask(${idx})"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                <div id="details-${idx}" class="task-details">
                    <p><strong>Deadline:</strong> ${task.deadline}</p>
                    <p><strong>Note:</strong> ${task.note}</p>
                </div>`;
            taskList.appendChild(li);
        });
    };

    // === 5. CÁC HÀM TƯƠNG TÁC (Gắn vào window) ===
    window.toggleTask = (i) => { tasks[i].completed = !tasks[i].completed; save(); };
    window.deleteTask = (i) => { if(confirm("Xóa việc này?")) { tasks.splice(i,1); save(); }};
    window.toggleDetails = (i) => { const d = document.getElementById(`details-${i}`); d.style.display = d.style.display === 'block' ? 'none' : 'block'; };
    
    window.editTask = (i) => {
        const t = tasks[i];
        const name = prompt("Tên mới:", t.text), date = prompt("Hạn mới:", t.deadline), note = prompt("Lưu ý:", t.note);
        if (name) { tasks[i] = {...t, text: name, deadline: date || "No deadline", note: note || "No notes"}; save(); }
    };

    const save = () => { localStorage.setItem(`tasks_${currentUser.email}`, JSON.stringify(tasks)); renderTasks(); };

    // === 6. ĐIỀU HƯỚNG SIDEBAR ===
    document.querySelectorAll('#navLinks li').forEach(li => {
        li.addEventListener('click', function() {
            document.querySelectorAll('#navLinks li').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            categoryTitle.textContent = this.innerText;

            if (currentFilter === 'settings') {
                todoSection.style.display = 'none';
                settingsSection.style.display = 'block';
                document.getElementById('editUsername').value = currentUser.username;
                document.getElementById('editEmail').value = currentUser.email;
                document.getElementById('enableQuote').checked = currentUser.showQuote;
            } else {
                settingsSection.style.display = 'none';
                todoSection.style.display = 'block';
                renderTasks();
            }
        });
    });

    // === 7. LƯU SETTINGS ===
    document.getElementById('saveSettingsBtn').addEventListener('click', () => {
        const name = document.getElementById('editUsername').value, pass = document.getElementById('editPassword').value;
        currentUser.username = name;
        currentUser.showQuote = document.getElementById('enableQuote').checked;
        if(pass) currentUser.password = pass;

        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        let users = JSON.parse(localStorage.getItem('users'));
        const uIdx = users.findIndex(u => u.email === currentUser.email);
        users[uIdx] = {...users[uIdx], ...currentUser};
        localStorage.setItem('users', JSON.stringify(users));
        
        alert("Đã lưu!"); location.reload();
    });

    addTaskBtn.addEventListener('click', () => {
        const val = taskInput.value.trim();
        if(val) { tasks.push({text: val, completed: false, deadline: taskDeadline.value || "No deadline", note: taskNote.value || "No notes"}); save(); taskInput.value=''; taskDeadline.value=''; taskNote.value=''; }
    });

    document.getElementById('logoutBtn').onclick = () => { localStorage.removeItem('currentUser'); window.location.href = 'login.html'; };

    renderTasks();
});