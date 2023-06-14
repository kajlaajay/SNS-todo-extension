document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.getElementById('taskForm');
    const titleInput = document.getElementById('titleInput');
    const descriptionInput = document.getElementById('descriptionInput');
    const taskList = document.getElementById('taskList');
    document.getElementById('addTaskBtn').addEventListener('click', function() { showsubbtn('taskForm'); });

    function showsubbtn(clname)
    {
      var section = document.getElementById(clname);
      var button = document.getElementById("addTaskBtn");
      if (section.classList.contains('hide')) {
        section.classList.remove('hide');
        button.classList.add('hide');
      } else {
        section.classList.add('hide');
        button.classList.remove('hide');
      }
    }
  
    taskForm.addEventListener('submit', function (event) {
      event.preventDefault();
  
      const title = titleInput.value;
      const description = descriptionInput.value;
      const task = { title, description };
  
      chrome.storage.sync.get(['tasks'], function (result) {
        const tasks = result.tasks || [];
        tasks.push(task);
        chrome.storage.sync.set({ tasks }, function () {
          renderTaskList(tasks);
          titleInput.value = '';
          descriptionInput.value = '';
        });
      });
      showsubbtn('taskForm');
    });
  
    taskList.addEventListener('click', function (event) {
      const target = event.target;
      if (target.matches('input[type="checkbox"]')) {
        const index = parseInt(target.getAttribute('data-index'));
        chrome.storage.sync.get(['tasks'], function (result) {
          const tasks = result.tasks || [];
          tasks[index].completed = target.checked;
          chrome.storage.sync.set({ tasks }, function () {
            renderTaskList(tasks);
          });
        });
      } else if (target.matches('button[data-index]')) {
        const index = parseInt(target.getAttribute('data-index'));
        chrome.storage.sync.get(['tasks'], function (result) {
          const tasks = result.tasks || [];
          tasks.splice(index, 1);
          chrome.storage.sync.set({ tasks }, function () {
            renderTaskList(tasks);
          });
        });
      } else if (target.matches('span[data-index]')) {
        const index = parseInt(target.getAttribute('data-index'));
        chrome.storage.sync.get(['tasks'], function (result) {
          const tasks = result.tasks || [];
          const task = tasks[index];
          taskList.innerHTML = '';
          const form = document.createElement('form');
          form.innerHTML = `
            <input type="text" id="editTitle" value="${task.title}" required>
            <input type="text" id="editDescription" value="${task.description}" required>
            <button type="submit">Save</button>
          `;
          taskList.appendChild(form);
  
          form.addEventListener('submit', function (event) {
            event.preventDefault();
  
            const newTitle = document.getElementById('editTitle').value;
            const newDescription = document.getElementById('editDescription').value;
  
            tasks[index].title = newTitle;
            tasks[index].description = newDescription;
  
            chrome.storage.sync.set({ tasks }, function () {
              renderTaskList(tasks);
            });
          });
        });
      }
    });
  
    function renderTaskList(tasks) {
      taskList.innerHTML = '';
      tasks.forEach(function (task, index) {
        const item = document.createElement('div');
        item.className = `task-item ${task.completed ? 'settaskbg' : 'settaskbgw'}`;
        item.innerHTML = `
          <input class="task-item-checkbox" type="checkbox" ${task.completed ? 'checked' : ''} data-index="${index}">
          <div class="task-content"><span class="task-item-title ${task.completed ? 'completed' : ''}" data-index="${index}">${task.title}</span>
          <span class="task-item-description ${task.completed ? 'completed' : ''}" data-index="${index}">${task.description}</span></div>
          <button class="task-item-delete" data-index="${index}">Delete</button>
        `;
        taskList.appendChild(item);
      });
    }
  
    chrome.storage.sync.get(['tasks'], function (result) {
      const tasks = result.tasks || [];
      renderTaskList(tasks);
    });
  });
  