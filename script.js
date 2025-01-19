document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const emptyImage = document.querySelector('.empty-image');
    const todoContainer = document.querySelector('.todo-container');
    const progressBar = document.getElementById('progress');
    const progressNumbers = document.getElementById('numbers');

    const toggleEmpty = () => {
        emptyImage.style.display = taskList.children.length === 0 ? 'block' : 'none';
        todoContainer.style.width = taskList.children.length > 0 ? '100%' : '50%';
    };

    const updateProgess = (checkCompletion = true) => {
        const totalTask = taskList.children.length;
        const taskCompleted = taskList.querySelectorAll('.checkbox:checked').length;

        progressBar.style.width = totalTask ? `${(taskCompleted / totalTask) * 100}%` : '0%';
        progressNumbers.textContent = `${taskCompleted} / ${totalTask}`;
    };

    const saveTask = () => {
        const tasks = Array.from(taskList.querySelectorAll('li')).map(li => ({
            text: li.querySelector('span').textContent,
            completed: li.querySelector('.checkbox').checked
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const loadTask = () => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        savedTasks.forEach(({ text, completed }) => addTask(text, completed, false));
        toggleEmpty();
        updateProgess();
    };

    const addTask = (text, completed = false, checkCompletion = true) => {
        const taskText = text || taskInput.value.trim();
        console.log('Adding task:', taskText); // Debugging log
        if (!taskText) {
            console.log('Task text is empty'); // Debugging log
            return;
        }

        const li = document.createElement('li');
        li.innerHTML = `<input type="checkbox" class="checkbox" ${completed ? 'checked' : ''}/>
        <span>${taskText}</span>
        <div class="task-buttons">
            <button class="edit-btn"><i class='bx bxs-edit-alt' ></i></button>
            <button class="delete-btn"><i class='bx bx-trash-alt' ></i></button>
        </div>`;

        const checkbox = li.querySelector('.checkbox');
        const editBtn = li.querySelector('.edit-btn');

        if (completed) {
            li.classList.add('completed');
            editBtn.disabled = true;
            editBtn.style.opacity = '0.5';
            editBtn.style.pointerEvents = 'none';
        }

        checkbox.addEventListener('change', () => {
            const isChecked = checkbox.checked;
            li.classList.toggle('completed', isChecked);
            editBtn.disabled = isChecked;
            editBtn.style.opacity = isChecked ? '0.5' : '1';
            editBtn.style.pointerEvents = isChecked ? 'none' : 'auto';
            updateProgess();
            saveTask();
        });

        editBtn.addEventListener('click', () => {
            if (!checkbox.checked) {
                taskInput.value = li.querySelector('span').textContent;
                li.remove();
                toggleEmpty();
                updateProgess(false);
                saveTask();
            }
        });

        li.querySelector('.delete-btn').addEventListener('click', () => {
            li.remove();
            toggleEmpty();
            updateProgess();
            saveTask();
        });

        taskList.appendChild(li);
        taskInput.value = '';
        toggleEmpty();
        updateProgess();
        saveTask();
    };

    addTaskBtn.addEventListener('click', () => addTask());
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTask();
        }
    });

    loadTask();
});