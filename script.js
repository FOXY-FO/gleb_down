const $recordsContainer = document.getElementById('recordsContainer')
const $dateContainer = document.getElementById('dateContainer')
const $newRecordText = document.getElementById('newRecordText')
const $newRecordDate = document.getElementById('newRecordDate')
const $addBtn = document.getElementById('addBtn')

let currentDateId = null

// Как выглядит массив dates
// const dates = [
//   {
//     id: 1,
//     value: '3333-03-31',
//     records: [
//       {
//         id: 1,
//         value: 'gleb down'
//       },
//       {
//         id: 2,
//         value: 'Oh shit here we go again'
//       }
//     ]
//   },
//   {
//     id: 2,
//     value: '2020-01-01',
//     records: [
//       {
//         id: 1,
//         value: '232'
//       },
//       {
//         id: 2,
//         value: '3231'
//       }
//     ]
//   }
// ]

const dates = []

/**
 * Рендерит записи по id даты, к которой они принадлежат
 * @param {number} id - id даты
 * @returns {void}
 */ 
function renderRecords(id) {
  // 1. Создаю массив inner, в котором будут HTML теги в строковом формате, которые потом распарсю
  const inner = []
  // 2. Нахожу нужную дату по id, обращаюсь к её записям, значение каждой записи обёртываю HTML тегом и добавляю в массив
  for (const record of dates.find(date => date.id === id).records) {
    let json = JSON.stringify({
      dateId: id,
      recordId: record.id
    })
    inner.push(`
      <div class="records__item">
        <div>${record.value}</div>
        <button class="delete-btn" data-json='${json}'>удалить</button>
      </div>
    `)
  }
  // 3. массив inner объединяю в одну строку, так как innerHTML принимает строку
  $recordsContainer.innerHTML = inner.join('')
  // 4. добавляем обработчики событий
  // убираем запись и перерендориваем все записи
  addListeners(document.querySelectorAll('.delete-btn'), 'click', e => {
    const { dateId, recordId } = JSON.parse(e.target.dataset.json)
    removeRecord(dateId, recordId)
    renderRecords(currentDateId)
  })
}

/**
 * Рендерит даты
 * @returns {void}
 */ 
function renderDates() {
  // 1. Создаю массив inner, в котором будут HTML теги в строковом формате, которые потом распарсю
  const inner = []
  // 2. Значение каждой даты обёртываю HTML тегом и добавляю в массив
  for (const date of dates) {
    // const json
    inner.push(`<div data-id='${JSON.stringify(date.id)}' class="records__date">${date.value}</div>`)
  } 
  // 3. массив inner объединяю в одну строку, так как innerHTML принимает строку
  $dateContainer.innerHTML = inner.join('')
  // 4. добавляем обработчики событий на элементы
  // При клике получаем id, сетаем в currentDateId и рендерим посты по currentDateId
  addListeners(document.querySelectorAll('.records__date'), 'click', e => {
    const id = JSON.parse(e.target.dataset.id)
    currentDateId = id
    renderRecords(currentDateId)
  })
}

/**
 * Добавляет в dates новую дату с записью, если дата уже существует, то просто добавляет в records запись
 * @param {string} date - значение даты
 * @param {string} record - значение записи
 * @returns {number} - возращает id новой даты
 */ 
function addRecord(date, record) {
  // проверяем существует ли уже данная дата
  const exists = dates.some(item => item.value === date)
  let id = 1
  // если существует, то просто ищем эту дату и добавляем запись, иначе создаём новую дату с этой записью
  if (exists) {
    const records = dates.find(item => item.value === date).records
    id = currentDateId
    records.push({
      id: records.length ? records[records.length - 1].id + 1 : 1,
      value: record
    })
  } else {
    id = dates.length ? dates[dates.length - 1].id + 1 : id
    dates.push({
      id,
      value: date,
      records: [
        {
          id: 1,
          value: record
        }
      ]
    })
  }

  return id
}

/**
 * Удаляет запись по id
 * @param {number} dateId - id даты
 * @param {number} recordId - id записи
 * @returns {void}
 */ 
function removeRecord(dateId, recordId) {
  dates.find(date => date.id === dateId).records = [
    ...dates.find(date => date.id === dateId).records.filter(record => record.id !== recordId)
  ]
}

/**
 * Валидирует текст записи
 * @param {string} value - значение новой записи
 * @returns {boolean} - Возращает false, если валидация не пройдена, true - если пройдена
 */ 
function validate(value) {
  if (value === '') {
    return false
  } else {
    return true
  }
}

/**
 * Принимает массив элементов и навешивает на каждый элемент событие
 * @param {HTMLElement} $elements[] - массив элементов
 * @param {string} listener - событие
 * @param {Function} callback - callback функция
 */ 
function addListeners($elements, listener, callback) {
  for (const $element of $elements) {
    $element.addEventListener(listener, callback)
  }
}

// При клике на кнопку добавить должны добавить запись
$addBtn.addEventListener('click', () => {  
  // Если валидация пройдена, то добавляем запись и рендерим даты, если нет, то говорим, чтобы заполнили все поля
  // trim - метод строки, который просто убирает по бокам пробелы
  if (validate($newRecordText.value.trim()) && validate($newRecordDate.value)) {
    currentDateId = addRecord($newRecordDate.value, $newRecordText.value.trim())
    renderDates()
    renderRecords(currentDateId)
  } else {
    alert('Заполните все поля')
  }
})