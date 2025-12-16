/*
  Файл index.js является точкой входа в наше приложение
  и только он должен содержать логику инициализации нашего приложения
  используя при этом импорты из других файлов
  Из index.js не допускается что то экспортировать
*/

// Импорты модулей
import { initialCards } from "./cards.js";
import { createCardElement, deleteCard, likeCard } from "./components/card.js";
import { openModalWindow, closeModalWindow, setCloseModalWindowEventListeners } from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";

// Конфигурация приложения
const config = {
  validation: {
    formSelector: ".popup__form",
    inputSelector: ".popup__input",
    submitButtonSelector: ".popup__button",
    inactiveButtonClass: "popup__button_disabled",
    inputErrorClass: "popup__input_type_error",
    errorClass: "popup__error_visible",
  },
  selectors: {
    placesWrap: ".places__list",
    profile: {
      title: ".profile__title",
      description: ".profile__description",
      avatar: ".profile__image",
      editButton: ".profile__edit-button",
      addButton: ".profile__add-button",
    },
    modals: {
      editProfile: ".popup_type_edit",
      newCard: ".popup_type_new-card",
      image: ".popup_type_image",
      editAvatar: ".popup_type_edit-avatar",
    },
    forms: {
      profile: ".popup__form",
      card: ".popup__form",
      avatar: ".popup__form",
    },
    inputs: {
      profile: {
        name: ".popup__input_type_name",
        description: ".popup__input_type_description",
      },
      card: {
        name: ".popup__input_type_card-name",
        link: ".popup__input_type_url",
      },
      avatar: ".popup__input",
    },
    imageModal: {
      image: ".popup__image",
      caption: ".popup__caption",
    },
  }
};

// DOM узлы - сгруппированы по функциональности
const elements = {
  // Основные контейнеры
  placesWrap: document.querySelector(config.selectors.placesWrap),
  
  // Профиль
  profile: {
    title: document.querySelector(config.selectors.profile.title),
    description: document.querySelector(config.selectors.profile.description),
    avatar: document.querySelector(config.selectors.profile.avatar),
    editButton: document.querySelector(config.selectors.profile.editButton),
    addButton: document.querySelector(config.selectors.profile.addButton),
  },
  
  // Модальные окна
  modals: {
    editProfile: document.querySelector(config.selectors.modals.editProfile),
    newCard: document.querySelector(config.selectors.modals.newCard),
    image: document.querySelector(config.selectors.modals.image),
    editAvatar: document.querySelector(config.selectors.modals.editAvatar),
  },
  
  // Формы и их элементы
  forms: {
    profile: {
      modal: document.querySelector(config.selectors.modals.editProfile),
      form: document.querySelector(config.selectors.modals.editProfile).querySelector(config.selectors.forms.profile),
      inputs: {
        name: document.querySelector(config.selectors.modals.editProfile).querySelector(config.selectors.inputs.profile.name),
        description: document.querySelector(config.selectors.modals.editProfile).querySelector(config.selectors.inputs.profile.description),
      }
    },
    card: {
      modal: document.querySelector(config.selectors.modals.newCard),
      form: document.querySelector(config.selectors.modals.newCard).querySelector(config.selectors.forms.card),
      inputs: {
        name: document.querySelector(config.selectors.modals.newCard).querySelector(config.selectors.inputs.card.name),
        link: document.querySelector(config.selectors.modals.newCard).querySelector(config.selectors.inputs.card.link),
      }
    },
    avatar: {
      modal: document.querySelector(config.selectors.modals.editAvatar),
      form: document.querySelector(config.selectors.modals.editAvatar).querySelector(config.selectors.forms.avatar),
      input: document.querySelector(config.selectors.modals.editAvatar).querySelector(config.selectors.inputs.avatar),
    }
  },
  
  // Элементы модального окна изображения
  imageModal: {
    image: document.querySelector(config.selectors.modals.image).querySelector(config.selectors.imageModal.image),
    caption: document.querySelector(config.selectors.modals.image).querySelector(config.selectors.imageModal.caption),
  }
};

// Функции-обработчики
const handlers = {
  previewPicture: ({ name, link }) => {
    elements.imageModal.image.src = link;
    elements.imageModal.image.alt = name;
    elements.imageModal.caption.textContent = name;
    openModalWindow(elements.modals.image);
  },
  
  profileFormSubmit: (evt) => {
    evt.preventDefault();
    elements.profile.title.textContent = elements.forms.profile.inputs.name.value;
    elements.profile.description.textContent = elements.forms.profile.inputs.description.value;
    closeModalWindow(elements.forms.profile.modal);
  },
  
  avatarFormSubmit: (evt) => {
    evt.preventDefault();
    elements.profile.avatar.style.backgroundImage = `url(${elements.forms.avatar.input.value})`;
    closeModalWindow(elements.forms.avatar.modal);
  },
  
  cardFormSubmit: (evt) => {
    evt.preventDefault();
    elements.placesWrap.prepend(
      createCardElement(
        {
          name: elements.forms.card.inputs.name.value,
          link: elements.forms.card.inputs.link.value,
        },
        {
          onPreviewPicture: handlers.previewPicture,
          onLikeIcon: likeCard,
          onDeleteCard: deleteCard,
        }
      )
    );
    closeModalWindow(elements.forms.card.modal);
  },
  
  // Обработчики открытия модальных окон
  openProfileForm: () => {
    elements.forms.profile.inputs.name.value = elements.profile.title.textContent;
    elements.forms.profile.inputs.description.value = elements.profile.description.textContent;
    openModalWindow(elements.forms.profile.modal);
    clearValidation(elements.forms.profile.form, config.validation);
  },
  
  openAvatarForm: () => {
    elements.forms.avatar.form.reset();
    openModalWindow(elements.forms.avatar.modal);
    clearValidation(elements.forms.avatar.form, config.validation);
  },
  
  openCardForm: () => {
    elements.forms.card.form.reset();
    openModalWindow(elements.forms.card.modal);
    clearValidation(elements.forms.card.form, config.validation);
  }
};

// Инициализация обработчиков событий
const initEventListeners = () => {
  // Отправка форм
  elements.forms.profile.form.addEventListener("submit", handlers.profileFormSubmit);
  elements.forms.card.form.addEventListener("submit", handlers.cardFormSubmit);
  elements.forms.avatar.form.addEventListener("submit", handlers.avatarFormSubmit);
  
  // Открытие модальных окон
  elements.profile.editButton.addEventListener("click", handlers.openProfileForm);
  elements.profile.avatar.addEventListener("click", handlers.openAvatarForm);
  elements.profile.addButton.addEventListener("click", handlers.openCardForm);
  
  // Закрытие всех модальных окон
  const allPopups = document.querySelectorAll(".popup");
  allPopups.forEach(popup => {
    setCloseModalWindowEventListeners(popup);
  });
};

// Инициализация отображения карточек
const renderInitialCards = () => {
  initialCards.forEach(data => {
    elements.placesWrap.append(
      createCardElement(data, {
        onPreviewPicture: handlers.previewPicture,
        onLikeIcon: likeCard,
        onDeleteCard: deleteCard,
      })
    );
  });
};

// Инициализация валидации
const initValidation = () => {
  enableValidation(config.validation);
};

// Запуск приложения
const initApp = () => {
  initEventListeners();
  renderInitialCards();
  initValidation();
};

// Инициализация приложения при загрузке DOM
document.addEventListener('DOMContentLoaded', initApp);
