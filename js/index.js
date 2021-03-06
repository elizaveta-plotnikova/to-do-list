var LOCAL_STORAGE_KEY = 'tasks';

var $createTaskButton = document.querySelector('.btn');
var $taskTextInput = document.querySelector('.input');
var $priorityBlock = document.querySelector('#priority');
var $priorityItem = document.querySelectorAll('.priority_tem');
var $sortSelect = document.querySelector('#sortSelect');
var $checkbox = document.querySelectorAll('.checkbox');

var state = getFromLocalStorage() || {};

function generateId() {
    return new Date().getTime() + '_' + Math.round(Math.random() * 1000);
}

function getCurrentTime() {
    return new Date().getTime();
}

function getDate(timestamp) {
    var date = new Date(timestamp);
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    return [year, month, day].join('.') + ' ' + [hours, minutes].join(':');
}

function taskStatusChecked() {
    var checkedStatus = Array.from($priorityItem).find(function(item) {
        return item.checked;
    });
    return checkedStatus.value;
}

function getInputValues() {
    return {
        inputIsCheked: false,
        text: $taskTextInput.value,
        priority: taskStatusChecked(),
        date: getCurrentTime(),
        id: generateId()
    };
}

function saveToLocalStorage(state) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
}

function getFromLocalStorage() {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
}

function addTask(text, date, priority, id, inputIsCheked) {

    var taskConteiner = document.querySelector('.task-conteiner');

    var task = document.createElement('div');
    task.classList.add('task');

    var taskContent = document.createElement('div');
    taskContent.classList.add('task__content');

    var taskText = document.createElement('div');
    taskText.classList.add('task__text');
    taskText.innerText = text;

    var checkbox = document.createElement('input');
    checkbox.classList.add('checkbox');
    checkbox.checked = inputIsCheked;
    checkbox.type = 'checkbox';
    if (inputIsCheked) taskText.classList.add('task__text-checked');
    checkbox.addEventListener('change', function() {
        if (checkbox.checked) {
            taskText.classList.add('task__text-checked');
        } else {
            taskText.classList.remove('task__text-checked');
        }
        state[id].inputIsCheked = checkbox.checked;
        saveToLocalStorage(state);
    });

    var taskPrioritet = document.createElement('div');
    taskPrioritet.classList.add('task__prioritet');
    var taskPrioritetImg = document.createElement('img');
    taskPrioritet.append(taskPrioritetImg);
    if (priority == '1') {
        taskPrioritetImg.src = 'img/hight-priority.png';
    } else if (priority == '0') {
        taskPrioritetImg.src = 'img/mid-priority.png';
    } else {
        taskPrioritetImg.src = 'img/low-priority.png';
    }
    
    var taskDeleteIcon = document.createElement('div');
    taskDeleteIcon.classList.add('task__delite-icon');
    var taskDeleteIconImg = document.createElement('img');
    taskDeleteIconImg.classList.add('task__delite-icon');
    taskDeleteIconImg.src = 'img/delete-icon.png';
    taskDeleteIcon.append(taskDeleteIconImg);
    taskDeleteIcon.addEventListener('click', function() {
        task.parentNode.removeChild(task);
        delete state[id];
        saveToLocalStorage(state);
    });

    var taskDate = document.createElement('div');
    taskDate.classList.add('task__date');
    taskDate.innerText = getDate(date);

    task.appendChild(taskContent);
    task.appendChild(taskDate);
    taskContent.append(checkbox);
    taskContent.append(taskText);
    taskContent.append(taskPrioritet);
    taskContent.append(taskDeleteIcon);
    taskConteiner.prepend(task);
}

$taskTextInput.addEventListener('focus', function() {
    $priorityBlock.classList.add('priority--active');
});

$createTaskButton.addEventListener('click', function() {
    if ($taskTextInput.value == '') {
        return $taskTextInput.classList.add('input--warning');
    } else {
        $taskTextInput.classList.remove('input--warning');
        var values = getInputValues();
        state[values.id] = values;
        addTask(values.text, values.date, values.priority, values.id, values.inputIsCheked);
        saveToLocalStorage(state);
        $taskTextInput.value = '';
    }
});

function addTasks(tasks) {
    if (tasks) {
        Object.keys(tasks).forEach(function(taskId) {
            var task = tasks[taskId];
            addTask(task.text, task.date, task.priority, task.id, task.inputIsCheked);
        });
    } 
}

function updateTaskConteiner(state) {
    var taskConteiner = document.querySelector('.task-conteiner');
    saveToLocalStorage(state);
    taskConteiner.innerHTML = '';
    addTasks(state);
}

function sortObject(obj, callback) {
    return Object.keys(obj).sort(function(a, b) {
        return callback(obj[a], obj[b]);
    }).reduce(function(acc, key) {
        acc[key] = state[key];
        return acc; 
    }, {});
}

$sortSelect.addEventListener('change', function() {
    if ($sortSelect.value === 'priorityHight') {
        state = sortObject(state, function(a, b) {
            return b.priority - a.priority;
        });
        updateTaskConteiner(state);
        
    } else if ($sortSelect.value === 'priorityLow') { 
        state = sortObject(state, function(a, b) {
            return a.priority - b.priority;
        });
        updateTaskConteiner(state);

    } else if ($sortSelect.value === 'dateNew') { 
        state = sortObject(state, function(a, b) {
            return a.date - b.date;
        });
        updateTaskConteiner(state);

    } else if ($sortSelect.value === 'dateOld') { 
        state = sortObject(state, function(a, b) {
            return b.date - a.date;
        });
        updateTaskConteiner(state);
    }
});

addTasks(state);











