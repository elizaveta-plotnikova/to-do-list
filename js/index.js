var LOCAL_STORAGE_KEY = 'task';

let $createTaskButton = document.querySelector('.btn');
let $taskTextInput = document.querySelector('.input');
let $priorityBlock = document.querySelector('#priority');
let $priorityItem = document.querySelectorAll('.priority-item');
let $sortSelect = document.querySelector('#sortSelect');
let $checkbox = document.querySelectorAll('.checkbox');

let arr = getFromLocalStorage() || [];

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

function saveToLocalStorage(arr) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(arr));
}

function getFromLocalStorage() {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
}

function addTask(text, date, priority, id, inputIsCheked) {

    let taskConteiner = document.querySelector('.task-conteiner');

    let task = document.createElement('div');
    task.classList.add('task');

    let taskContent = document.createElement('div');
    taskContent.classList.add('task__content');

    let taskText = document.createElement('div');
    taskText.classList.add('task__text');
    taskText.innerText = text;

    let checkbox = document.createElement('input');
    checkbox.classList.add('checkbox');
    checkbox.checked = inputIsCheked;
    checkbox.type = 'checkbox';

    checkbox.addEventListener('change', function() {
        if(checkbox.checked) {
            taskText.classList.add('task__text-checked');
        } else {
            taskText.classList.remove('task__text-checked');
        }
    });

    let taskPrioritet = document.createElement('div');
    taskPrioritet.classList.add('task__prioritet');
    let taskPrioritetImg = document.createElement('img');
    taskPrioritet.append(taskPrioritetImg);

    if (priority == '1') {
        taskPrioritetImg.src = 'img/hight-priority.png';
    } else if (priority == '0') {
        taskPrioritetImg.src = 'img/mid-priority.png';
    } else {
        taskPrioritetImg.src = 'img/low-priority.png';
    }
    
    let taskDeleteIcon = document.createElement('div');
    taskDeleteIcon.classList.add('task__delite-icon');

    let taskDeleteIconImg = document.createElement('img');
    taskDeleteIconImg.classList.add('task__delite-icon');
    taskDeleteIconImg.src = 'img/delete-icon.png';
    taskDeleteIcon.append(taskDeleteIconImg);

    taskDeleteIcon.addEventListener('click', function() {
        task.parentNode.removeChild(task);
        arr = arr.filter(function(item) {
            return item.id !== id;
        });

        saveToLocalStorage(arr);
    });

    let taskDate = document.createElement('div');
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
})

$createTaskButton.addEventListener('click', function() {
    if ($taskTextInput.value == '') {
        return $taskTextInput.classList.add('input--warning');
    } else {
        $taskTextInput.classList.remove('input--warning');
        var values = getInputValues();
        arr.push(values);
        addTask(values.text, values.date, values.priority, values.id, values.inputIsCheked);
        saveToLocalStorage(arr);
        $taskTextInput.value = '';
    }
})

function addTasks(arr) {
    if (Array.isArray(arr)) {
        arr.forEach(function(task) {
            addTask(task.text, task.date, task.priority, task.id, task.inputIsCheked);
        });
    } 
}

function updateTaskConteiner(arr) {
    var taskConteiner = document.querySelector('.task-conteiner');
    saveToLocalStorage(arr);
    taskConteiner.innerHTML = '';
    addTasks(arr);
}

$sortSelect.addEventListener('change', function() {
    if ($sortSelect.value === 'priorityHight') {
        arr = arr.sort(function(a, b) {
            return b.priority - a.priority;
        });
        updateTaskConteiner(arr);
        
    } else if ($sortSelect.value === 'priorityLow') { 
        arr = arr.sort(function(a, b) {
            return a.priority - b.priority;
        });
        updateTaskConteiner(arr);

    } else if ($sortSelect.value === 'dateNew') { 
        arr = arr.sort(function(a, b) {
            return a.date - b.date;
        });
        updateTaskConteiner(arr);

    } else if ($sortSelect.value === 'dateOld') { 
        arr = arr.sort(function(a, b) {
            return  b.date - a.date;
        });
        updateTaskConteiner(arr);
    }
})

addTasks(arr);











