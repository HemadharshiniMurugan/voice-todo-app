const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("todo-list");

// Load tasks on startup
window.onload = () => {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach(task => createTaskElement(task.text, task.completed));
};

// Create task element (with complete/delete)
function createTaskElement(text, completed = false) {
  const li = document.createElement("li");
  li.textContent = text;

  if (completed) li.classList.add("completed");

  // ✅ Complete button
  const completeBtn = document.createElement("button");
  completeBtn.textContent = "✔️";
  completeBtn.style.marginLeft = "10px";
  completeBtn.onclick = () => {
    li.classList.toggle("completed");
    saveTasks();
  };

  // 🗑️ Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑️";
  deleteBtn.style.marginLeft = "5px";
  deleteBtn.onclick = () => {
    li.remove();
    saveTasks();
  };

  li.appendChild(completeBtn);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);

  saveTasks(); // Save to localStorage
}

// Add task manually or from voice
function addTask() {
  const task = taskInput.value.trim();
  if (task) {
    createTaskElement(task);
    taskInput.value = "";
  }
}

// Voice input using Web Speech API
function startListening() {
  if (!('webkitSpeechRecognition' in window)) {
    alert("Your browser doesn't support speech recognition.");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.start();

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    taskInput.value = transcript;
    addTask();
  };

  recognition.onerror = function (event) {
    console.error("Error:", event.error);
  };
}

// Save all tasks to localStorage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#todo-list li").forEach(li => {
    const text = li.firstChild.textContent;
    const completed = li.classList.contains("completed");
    tasks.push({ text, completed });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
