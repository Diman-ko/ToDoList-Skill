(function () {

//  массив  задач TodoList
  let listArray = [];
  listName = '';

  // создаем и возвращаем заголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  // создаём и возвращаем форму приложения
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.innerHTML = 'Добавить дело';

    //  делаем кнопку "Добавить дело " неактивной в случае пустого инпута
    button.setAttribute('disabled', 'true');// добавляем аттрибут
    input.addEventListener('input', function () {
      if (input.value.length > 0) {
        button.removeAttribute('disabled');
      } else if (input.value.length === 0) {
        button.setAttribute('disabled', 'true');
      }
    })

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);
    /*  вот так выглядит реализация нашего кода
  <form action="" className="input-group mb-3">
    <input type="text" className="form-control" placeholder="Введите название нового дела"/>
    <div className="input-group-append">
      <button className="btn btn-primary">
        Добавить дело
      </button>
    </div>
  </form>
    */

    return {
      form,
      input,
      button,
    }
  }

  // создаём и возвращаем список приложения
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

//  создание функции  createTodoItem  создаст элемент для списка дел и вернёт всё необходимое
//  урок 8.3  создаём кнопки удалить и готово
  function createTodoItem(object) {
    let item = document.createElement('li');
    //  кнопки помещаем в элемент, который красиво покажет их в одной группе
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement(`button`);

    // устанавливаем стили для элемента списка, а также для размещения кнопок
    // в его правой части с помощью flex
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-item-center');
    item.textContent = object.name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.innerHTML = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.innerHTML = 'Удалить';

    // for localStorage && listArray  создаём в функции createTodoItem
    if (object.done === true) item.classList.add('list-group-item-success');

    //========================================================================
    // добавляем обработчики на кнопки
    doneButton.addEventListener('click', function () {
      item.classList.toggle('list-group-item-success');
      // console.log(object.id)//   проверяем id   работает
      const id = object.id;
      object = listArray.find((object) => object.id === id);
      object.done = !object.done;
      // console.log(listArray)
      saveList(listArray, listName);
    });


    deleteButton.addEventListener('click', function () {
      if (confirm('Вы уверены')) {
        item.remove();
      }
      // console.log(object.id)// проверяем. работает ловится id задачи
      const id = object.id;
      listArray = listArray.filter((object) => object.id !== id);
      // console.log(listArray)
      saveList(listArray, listName);
    });
//=================================================================
    // Вкладываем кнопки в отдельный элемент, что бы они объединились в один блок

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    // приложению нужен доступ к самому элемента и кнопкам, что бы обрабатывать события нажатия
    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  // ============== создание уникального id===========
  // === 1st
  let getNewId = (arr) => {
    let max = 0;
    for (const item of arr) {
      if (item.id > max) max = item.id
    }
    return max + 1
  }
// === 2nd
  const timeStamp = Date.now();

  // ============== создание уникального id===========


//document.addEventListener('DOMContentLoaded', createDomElement)

  // ====================
  const saveList = (arr, keyName) => {
    console.log(JSON.stringify(arr));// [{"id":1706203904624,"name":"1","done":false}]  выводит в виде строки
    localStorage.setItem(keyName, JSON.stringify(arr));
  }
  //=================


  //  урок 8.4 , вынесем в отдельную функцию содержимое обработчика DOMContentLoaded
  function createTodoApp(container, title = 'Список дел', keyName, defArray=[]) {


    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    listName = keyName;
    listArray = defArray;
    /*    //// для наглядности примера  и демонстрации уроке в 8.3 добавим наши элементы в todoList
        let todoItems = [createTodoItem('123'), createTodoItem('321')];
        todoList.append(todoItems[0].item)
        todoList.append(todoItems[1].item)  */

    //  это запуск приложения
    container.append(todoAppTitle)
    container.append(todoItemForm.form);
    container.append(todoList);
    // localStorage ====
    let localData = localStorage.getItem(listName);
    // console.log(localData);
    if (localData !== null && localData !== '') listArray = JSON.parse(localData);
      // console.log(listArray);
      listArray.forEach((task) => {
        let todoItem = createTodoItem(task);
        todoList.append(todoItem.item);
      });

    /*for(const itemList of listArray) {
      let todoItem = createTodoItem(itemList);
      todoList.append(todoItem.item);
    };*/

    // localStorage ====
    // браузер создает событие submit  на форме по нажатию на  Enter  или на кнопку создания дела
    todoItemForm.form.addEventListener('submit', function (e) {
      //  эта строчка необходима, что бы предотвратить стандартное действие браузера
      // в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
      e.preventDefault();
      //  игнорируем создание элемента, если пользователь ничего не ввёл в поле
      if (!todoItemForm.input.value) {
        return
      }
      //=========== запись в массив ===========
      let newItem = {
        // id: getNewId(listArray),
        id: timeStamp,
        name: todoItemForm.input.value,
        done: false,
      }
      listArray.push(newItem)
      saveList(listArray, listName)  // saveLIst
      console.log(listArray)

      //================================
      /*//этот код для добавления элементов в список заменим на код обработчика событий
      // создаём и добавляем в список новое дело с названием из поля для ввода
      todoList.append(createTodoItem(todoItemForm.input.value).item);*/
      // заменим код добавления элемента в список на код в который мы будем добавлять обработчики событий
      // let todoItem = createTodoItem(todoItemForm.input.value);// переписываем функцию
      let todoItem = createTodoItem(newItem);// переписываем функцию, что бы принимала не имя, а объект


      // ============================================

      //   создаём и добавляем в список новое дело с названием из поля для ввода
      todoList.append(todoItem.item);
      // обнуляем значение в поле, чтобы не пришлось стирать его вручную
      todoItemForm.input.value = ''; //  для очистки поля ввода, присваиваем ему пустую строку

      // оставляем фокус на поле ввода  input
      todoItemForm.input.focus(); //  теперь после очистки поля фокус будет перемещаться на поле ввода  input

      // делаем кнопку "Добавить дело" неактивной  после добавления дела и пустом инпуте input
      todoItemForm.button.disabled = true;
    });

  };

  window.createTodoApp = createTodoApp;
})();


