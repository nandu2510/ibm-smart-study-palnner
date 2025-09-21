
  let currentUser = null;

  // Password strength check
  function checkPasswordStrength(pwd) {
    if (pwd.length < 6 || !/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd) || !/[!@#$%^&*]/.test(pwd)) {
      document.getElementById("passwordHint").innerText =
        "⚠ Weak password. Recommended: Study@12345 or use uppercase, numbers, and symbols.";
    } else {
      document.getElementById("passwordHint").innerText = "✅ Strong password!";
    }
  }

  document.getElementById("password").addEventListener("input", e => {
    checkPasswordStrength(e.target.value);
  });

  function register() {
    let u = document.getElementById("username").value;
    let p = document.getElementById("password").value;
    if (!u || !p) return alert("Enter username & password");
    if (localStorage.getItem("user_" + u)) {
      return alert("User already exists!");
    }
    localStorage.setItem("user_" + u, JSON.stringify({password: p, tasks: []}));
    alert("Registered! Now login.");
  }

  function login() {
    let u = document.getElementById("username").value;
    let p = document.getElementById("password").value;
    let data = localStorage.getItem("user_" + u);
    if (!data) return alert("User not found!");
    let user = JSON.parse(data);
    if (user.password !== p) return alert("Wrong password!");
    currentUser = u;
    document.getElementById("auth").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
    document.getElementById("userDisplay").innerText = u;
    document.getElementById("profileName").innerText = u;
    loadTasks();
  }

  function logout() {
    currentUser = null;
    document.getElementById("auth").classList.remove("hidden");
    document.getElementById("dashboard").classList.add("hidden");
  }

  function addTask() {
    let taskName = document.getElementById("taskInput").value;
    let course = document.getElementById("courseSelect").value;
    let deadline = document.getElementById("deadline").value;
    if (!taskName) return alert("Enter task");
    let user = JSON.parse(localStorage.getItem("user_" + currentUser));
    user.tasks.push({name: taskName, course: course, deadline: deadline, done: false});
    localStorage.setItem("user_" + currentUser, JSON.stringify(user));
    document.getElementById("taskInput").value = "";
    loadTasks();
  }

  function loadTasks() {
    let user = JSON.parse(localStorage.getItem("user_" + currentUser));
    let list = document.getElementById("taskList");
    list.innerHTML = "";
    let completed = 0;
    let courses = new Set();
    user.tasks.forEach((t, i) => {
      courses.add(t.course);
      let div = document.createElement("div");
      div.className = "task";
      if (t.done) div.classList.add("completed");
      div.innerHTML = `${t.name} (${t.course}) - ${t.deadline || "No deadline"}
        <div>
          <button onclick="toggleTask(${i})">${t.done ? "Undo" : "Done"}</button>
          <button onclick="deleteTask(${i})">Delete</button>
        </div>`;
      list.appendChild(div);
      if (t.done) completed++;
    });
    document.getElementById("profileCourses").innerText = [...courses].join(", ") || "None";
    let percent = user.tasks.length ? (completed / user.tasks.length) * 100 : 0;
    document.getElementById("progress").style.width = percent + "%";
    document.getElementById("stats").innerText =
      `Total: ${user.tasks.length}, Completed: ${completed}, Pending: ${user.tasks.length - completed}`;
    document.getElementById("tips").innerText =
      percent < 50 ? "📌 Keep going! Try to complete more tasks." : "🎉 Great progress!";
    showBadges(completed);
  }

  function toggleTask(i) {
    let user = JSON.parse(localStorage.getItem("user_" + currentUser));
    user.tasks[i].done = !user.tasks[i].done;
    localStorage.setItem("user_" + currentUser, JSON.stringify(user));
    loadTasks();
  }

  function deleteTask(i) {
    let user = JSON.parse(localStorage.getItem("user_" + currentUser));
    user.tasks.splice(i, 1);
    localStorage.setItem("user_" + currentUser, JSON.stringify(user));
    loadTasks();
  }

  function setReminder() {
    document.getElementById("reminderMsg").innerText = "⏰ Reminder set! Check your tasks regularly.";
    alert("⏰ Reminder set! Don’t forget to study!");
  }

  function showBadges(completed) {
    let badgeDiv = document.getElementById("badges");
    badgeDiv.innerHTML = "";
    if (completed >= 1) badgeDiv.innerHTML += `<span class="badge">Starter</span>`;
    if (completed >= 5) badgeDiv.innerHTML += `<span class="badge">Achiever</span>`;
    if (completed >= 10) badgeDiv.innerHTML += `<span class="badge">Pro</span>`;
  }