let addButton = document.querySelector('.add-task');
let taskInput = document.querySelector('.input');
let todo = document.querySelector('.tasks');
let tasklist = [];


addButton.addEventListener('click', function() {

    let newTask = {
        task: taskInput.value,
        isChecked: false
    };

    todo.insertAdjacentHTML('afterbegin', 
    `<li>${newTask.task}</li>
        <input  type="checkbox" class="checkbox">
        <div class="itemIcon">
        </div>
        <hr>
    `);

    tasklist.push(newTask); 

    taskInput.value = '';

    console.log(tasklist);

})

