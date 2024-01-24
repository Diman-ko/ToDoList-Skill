//  массив  задач TodoList
let array = [];


(function () {
  if (localStorage.getItem('dataObject')) {
    console.log(JSON.parse(localStorage.getItem('array')));
    array = JSON.parse(localStorage.getItem('dataObject'));
    array.forEach((task) => createTodoItem(task));
  }

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
  function createTodoItem(name) {
    let item = document.createElement('li');
    //  кнопки помещаем в элемент, который красиво покажет их в одной группе
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement(`button`);

    // устанавливаем стили для элемента списка, а также для размещения кнопок
    // в его правой части с помощью flex
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-item-center');
    item.textContent = name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.innerHTML = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.innerHTML = 'Удалить';

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


//document.addEventListener('DOMContentLoaded', createDomElement)

  //  урок 8.4 , вынесем в отдельную функцию содержимое обработчика DOMContentLoaded
  function createTodoApp(container, title = 'Список дел', listName) {

    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();


    /*    //// для наглядности примера  и демонстрации уроке в 8.3 добавим наши элементы в todoList
        let todoItems = [createTodoItem('123'), createTodoItem('321')];
        todoList.append(todoItems[0].item)
        todoList.append(todoItems[1].item)
    */
    container.append(todoAppTitle)
    container.append(todoItemForm.form);
    container.append(todoList);

    // браузер создает событие submit  на форме по нажатию на  Enter  или на кнопку создания дела
    todoItemForm.form.addEventListener('submit', function (e) {

      //  эта строчка необходима, что бы предотвратить стандартное действие браузера
      // в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
      e.preventDefault();

      //  игнорируем создание элемента, если пользователь ничего не ввёл в поле
      if (!todoItemForm.input.value) {
        return
      }/*
      //этот код для добавления элементов в список заменим на код обработчика событий
      // создаём и добавляем в список новое дело с названием из поля для ввода
      todoList.append(createTodoItem(todoItemForm.input.value).item);
*/
      // заменим код добавления элемента в список на код в который мы будем добавлять обработчики событий
      let todoItem = createTodoItem(todoItemForm.input.value);

      // добавляем обработчики на кнопки
      todoItem.doneButton.addEventListener('click', function () {
        todoItem.item.classList.toggle('list-group-item-success');
        console.log(task.id)//   проверяем id   работает
        const id = task.id;
        task = array.find((task) => task.id === id); // ищет в массиве соответствующую задачу с id
        task.done = !task.done; // меняет запись в массиве
      });


      todoItem.deleteButton.addEventListener('click', function () {
        if (confirm('Вы уверены')) {
          todoItem.item.remove();
        }
        // console.log(task.id)// проверяем. работает ловится id задачи
        const id = task.id;
        array = array.filter((task) => task.id !== id); // удаляет  задачу из массива
        // console.log(array) // возвращает в консоль, что в массиве нет задачи
      });
      // ============================================
//создаем объект task для записи его в массив array, который находиться в не функции для доступа
      const timeStamp = Date.now();// настоящее время в миллисекундах ,универсальная
      // const timeStamp = new Date();// как другой вариант
      let task = {
        id: timeStamp + 'ms',
        name: todoItemForm.input.value,
        done: false,
      };
      array.push(task);
      console.log(array);
      localStorage.setItem('dataObject', JSON.stringify(array));


// ================================================================

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

  // в обработчик событий помещаем три вызова функции с разными id  названиями дел
  // теперь у нас есть несколько независимых списков
  /*  function createDomElement() {
  createTodoApp(document.getElementById('my-todos'), 'Мои дела')
  createTodoApp(document.getElementById('mom-todos'), 'Дела Мамы')
  createTodoApp(document.getElementById('dad-todos'), 'Дела Папы')
    };
    document.addEventListener('DOMContentLoaded', createDomElement)*/

  window.createTodoApp = createTodoApp;
})();

