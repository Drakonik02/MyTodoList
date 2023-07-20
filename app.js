const elementUser = document.querySelector('#buttonAdd');
const ulElement = document.getElementById('ulElement');
const textList = document.getElementById('textList');
const buttonDone = document.getElementById('done');
const buttonUnDone = document.getElementById('unDone');
const two = document.getElementsByClassName('two');
const one = document.getElementsByClassName('one');
let filterValue = 'unDone';
const filterMap = {
    done: '1',
    unDone: '0',
};

const creatTaskInput = (text) => {
    const input = document.createElement('input');
    input.value = text;
    
    return input;
} //Эта функция создает поле ввода в котором после появляется задача

const createDiv = (text) => {
    const div = document.createElement('div');
    div.innerHTML = text;

    return div;
}// Эта функция создает див


const creatTaskButton = (nameButton, onclickHendler, id) => {
    const button = document.createElement('button');
    button.innerHTML = nameButton
    button.onclick = () => {
        onclickHendler(id);
    }

    return button;
} // Эта функция создает кнопки. Для ее работы нужно имя, функция и айди

const createTask = (task) => {
    const { text, id, done } = task;
    const li = document.createElement('li');
    li.id = id

    const buttonDone= creatTaskButton('<img src="icon/checkIcon.png">', doneLi, id);

    const buttonDelete= creatTaskButton('<img src="icon/deletIcon.png">', deleteLi, id);

    const buttonChange = creatTaskButton('<img src="icon/changeIcon.png">', changeTask, id);

    const input = createDiv(text);

    li.appendChild(input);
    if(done === '0') {
        li.appendChild(buttonDone);
    } else {
        li.appendChild(buttonDelete);
    }
    li.appendChild(buttonChange);
    return li;
} // эта функция создает задачу, в ней создается ЛИ элемент, кнопка, поле ввода

async function changeFilterTask(event){
    filterValue = event.currentTarget.id;
    changeColorButton(filterValue);
    const data = await getAll();
    redrowAllTasks(data);
} // эта функция меняет переменную фильтр на то значние которое пришло с нажатой кнопки

const filterTask = (data) => {
    const filteredTasks = {};
    for(let key in data) {
        if (data[key].done === filterMap[filterValue]) {
            filteredTasks[key] = data[key];
        } 
    }
    return filteredTasks;
} // фильтрует БД и записывает в объект нудные задачи

const changeColorButton = (filterValue) => {
    if(filterValue == 'unDone') {
        buttonUnDone.style.border = '2px solid red';
        buttonDone.style.border = '2px solid gray';
    } else if (filterValue == 'done') {
        buttonDone.style.border = '2px solid red';
        buttonUnDone.style.border = '2px solid gray';
    }
}

const drawAllTasks = (data) => {
    const filteredTasks = filterTask(data);

    for (let key in filteredTasks) {
        const li = createTask(filteredTasks[key]);
        ulElement.appendChild(li);
    }
} // та функция отрисовывает все задачи

const removeAllTasks = () => {
    while(ulElement.firstChild) {
        ulElement.removeChild(ulElement.firstChild);
    }    
}

const redrowAllTasks = (data) => {
    removeAllTasks();
    drawAllTasks(data);
}
    

async function addNewTusk() {
    const textTask = textList.value;
    
    if (textTask === '') {
        alert('');
    } else {
        const data = await addNewTaskIntoBD(textTask);
        redrowAllTasks(data);
    }
    textList.value = '';
} // добавление новой задачи

async function saveTaskIntoBD(id, text){
    let response = await fetch('http://i99520kb.beget.tech/server.php', {
        method: "POST",
        body: JSON.stringify({
            'action': `saveTask`,
            'text': text,
            'id': id,
        }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'*',
        },
    });
    const test = await response.json();
    return test.data;
} // феатч запрос для изменения 

async function deleteTaskIntoBD(id) {
    let response = await fetch('http://i99520kb.beget.tech/server.php', {
        method: "POST",
        body: JSON.stringify({
            'action': `deleteTask`,
            'id': id,
        }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'*',
        },
    });
    console.log('delete');
    const test = await response.json();
    return test.data;

} // феатч запрос для удаление строки из БД

async function doneTaskIntoBD(id) {
    let response = await fetch('http://i99520kb.beget.tech/server.php', {
        method: "POST",
        body: JSON.stringify({
            'action': `doneTask`,
            'id': id,
        }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'*',
        },
    });
    console.log('done');
    const test = await response.json();
    return test.data;

} // феатч запрос для удаление строки из БД

async function addNewTaskIntoBD(textTask) {
    let response = await fetch('http://i99520kb.beget.tech/server.php', {
        method: "POST",
        body: JSON.stringify({
            'action': `addTask`,
            'textTask': textTask,
        }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'*',
        },
    });
    console.log('add');
    const test = await response.json();
    return test.data;
} // феатч запрос для добавления задачи в БД

async function getAll(){
    let response = await fetch('http://i99520kb.beget.tech/server.php', {
      method: "POST",
      body: JSON.stringify({ 'action': `getAll`}),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*',
      },
    });
    const test = await response.json();
    console.log('get', test);
    return test.data;
} // феатч запрос для чего не понимаю

async function startApp() {
    const data = await getAll();
    drawAllTasks(data);
    changeColorButton(filterValue);
} // функция на кнопке, добавляет задачу

async function deleteLi (id) {
    const data = await deleteTaskIntoBD(id);
    redrowAllTasks(data);
}

async function doneLi (id) {
    const data = await doneTaskIntoBD(id);
    redrowAllTasks(data);

} // функция на кнопке делет, удаляет задачу

async function saveTask (id, text) {
    const data = await saveTaskIntoBD(id, text);
    redrowAllTasks(data);
}

const changeTask = (id) => {
    const task = document.getElementById(id);
    const text = task.firstChild.innerHTML;
    
    const input = creatTaskInput(text);
    task.replaceChild(input, task.firstChild);
    task.lastChild.innerHTML = '<img src="icon/saveIcon.png">';
    task.lastChild.onclick = () => {
        saveTask(id, task.firstChild.value);
    }
}

const pos = () => {
    if(two[0].style.left === '200px') {
      two[0].style.left = '0';
      one[0].style.background='#24fc90';
    } else {
      two[0].style.left = '200px';
      one[0].style.background='gray';
    }
}



startApp();

buttonDone.onclick = (event) => changeFilterTask(event);
buttonUnDone.onclick = (event) => changeFilterTask(event);
elementUser.addEventListener('click', addNewTusk);
one[0].addEventListener('click',pos);

