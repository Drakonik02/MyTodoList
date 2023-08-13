const elementUser = document.querySelector('#buttonAdd');
const ulElement = document.getElementById('ulElement');
const textList = document.getElementById('textList');
const buttonDone = document.getElementById('done');
const buttonUnDone = document.getElementById('unDone');
const field = document.getElementById('field');
const circle = document.getElementById('circle');
const word = document.getElementById('word');
let filterValue = 'unDone';
const filterMap = {
    done: '1',
    unDone: '0',
};

const creatTaskInput = (text) => {
    const input = document.createElement('input');
    input.value = text;
    input.classList.add('buttonLeft');
    
    return input;
} //Эта функция создает поле ввода в котором после появляется задача

const createDiv = (text) => {
    const div = document.createElement('div');
    div.innerHTML = text;
    div.classList.add('buttonLeft');

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
    li.classList.add('tuskStyle');
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

async function changeFilterTask(){
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

    console.log(filteredTasks);
    return filteredTasks;
} // фильтрует БД и записывает в объект нудные задачи


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

async function pos() {
    const data = await getAll();
    if(circle.style.left === '100px') {
      circle.style.left = '0';
      filterValue = 'unDone';
      redrowAllTasks(data);
      setTimeout(() => { 
        field.style.background='#24fc90';
        circle.style.background='#18ad63';
        word.innerHTML='DONE';
        word.style.color='#18ad63';
        word.style.left='70px';
      }, 100);
    } else {
      circle.style.left = '100px';
      filterValue = 'done';
      redrowAllTasks(data);
      setTimeout(() => { 
        field.style.background='rgb(150, 150, 150)';
        circle.style.background='rgb(60, 60, 60)';
        word.innerHTML='UNDONE';
        word.style.color='rgb(60, 60, 60)';
        word.style.left='3px'
      }, 100);
    }
}



startApp();

elementUser.addEventListener('click', addNewTusk);
circle.addEventListener('click',pos);

