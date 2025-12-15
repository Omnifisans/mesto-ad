// Функция показа ошибки
const showInputError = (formElement, inputElement, errorMessage, settings) => {
  // Находим элемент ошибки внутри формы
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  if (!errorElement) return;
  
  // Добавляем класс ошибки к полю ввода
  inputElement.classList.add(settings.inputErrorClass);
  // Показываем текст ошибки
  errorElement.textContent = errorMessage;
  // Делаем ошибку видимой
  errorElement.classList.add(settings.errorClass);
};

// Функция скрытия ошибки
const hideInputError = (formElement, inputElement, settings) => {
  // Находим элемент ошибки
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  if (!errorElement) return;
  
  // Убираем класс ошибки с поля ввода
  inputElement.classList.remove(settings.inputErrorClass);
  // Очищаем текст ошибки
  errorElement.textContent = '';
  // Скрываем ошибку (убираем класс видимости)
  errorElement.classList.remove(settings.errorClass);
};

// Проверка валидности поля
const checkInputValidity = (formElement, inputElement, settings) => {
  // Если поле невалидно
  if (!inputElement.validity.valid) {
    // Проверяем, есть ли кастомное сообщение для patternMismatch
    if (inputElement.validity.patternMismatch) {
      // Используем data-error-message если есть, иначе стандартное сообщение
      const customMessage = inputElement.dataset.errorMessage || inputElement.validationMessage;
      showInputError(formElement, inputElement, customMessage, settings);
    } else {
      // Для других ошибок используем стандартное сообщение
      showInputError(formElement, inputElement, inputElement.validationMessage, settings);
    }
  } else {
    // Если поле валидно - скрываем ошибку
    hideInputError(formElement, inputElement, settings);
  }
};

// Проверка, есть ли невалидные поля
const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => !inputElement.validity.valid);
};

// Отключение кнопки
const disableSubmitButton = (buttonElement, settings) => {
  if (!buttonElement) return;
  buttonElement.classList.add(settings.inactiveButtonClass);
  buttonElement.disabled = true;
};

// Включение кнопки
const enableSubmitButton = (buttonElement, settings) => {
  if (!buttonElement) return;
  buttonElement.classList.remove(settings.inactiveButtonClass);
  buttonElement.disabled = false;
};

// Переключение состояния кнопки
const toggleButtonState = (inputList, buttonElement, settings) => {
  if (hasInvalidInput(inputList)) {
    disableSubmitButton(buttonElement, settings);
  } else {
    enableSubmitButton(buttonElement, settings);
  }
};

// Установка обработчиков событий
const setEventListeners = (formElement, settings) => {
  // Находим все поля ввода внутри формы
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  // Находим кнопку отправки формы
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);
  
  if (!buttonElement) return;
  
  // Блокируем кнопку при первом открытии формы
  toggleButtonState(inputList, buttonElement, settings);
  
  // Добавляем обработчик input для каждого поля
  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(formElement, inputElement, settings);
      toggleButtonState(inputList, buttonElement, settings);
    });
  });
};

// Очистка валидации
export const clearValidation = (formElement, settings) => {
  // Находим все поля ввода внутри формы
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  // Находим кнопку отправки формы
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);
  
  // Очищаем ошибки у всех полей
  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, settings);
  });
  
  // Блокируем кнопку
  if (buttonElement) {
    disableSubmitButton(buttonElement, settings);
  }
};

// Включение валидации всех форм
export const enableValidation = (settings) => {
  // Находим все формы на странице
  const formList = Array.from(document.querySelectorAll(settings.formSelector));
  
  // Для каждой формы устанавливаем обработчики
  formList.forEach((formElement) => {
    setEventListeners(formElement, settings);
  });
};
