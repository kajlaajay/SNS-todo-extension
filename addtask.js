document.addEventListener('DOMContentLoaded', function () {
  const taskForm = document.getElementById('taskForm');
  const titleInput = document.getElementById('titleInput');
  const descriptionInput = document.getElementById('descriptionInput');

  taskForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const title = titleInput.value;
    const description = descriptionInput.value;
    const task = { title, description };

    chrome.storage.sync.get(['tasks'], function (result) {
      const tasks = result.tasks || [];
      tasks.push(task);
      chrome.storage.sync.set({ tasks }, function () {
        window.close();
      });
    });
  });
});
