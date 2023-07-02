import React, { useState, useContext, useEffect } from "react";
import { PopupWithForm } from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { useForm } from "../hooks/useForm";

export default function EditProfilePopup({
  isOpen,
  onClose,
  onUpdateUser,
  isLoading,
}) {
  const currentUser = useContext(CurrentUserContext);

  const { values, handleChange, setValues } = useForm({});

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateUser({
      name: values.name,
      about: values.profession,
    });
  }

  useEffect(() => {
    setValues({ name: currentUser.name, profession: currentUser.about });
  }, [currentUser, isOpen]);

  return (
    <PopupWithForm
      name="edit"
      title="Редактировать профиль"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonText={isLoading ? "Сохранение..." : "Сохранить"}
    >
      <input
        className="popup__input popup__input_type_name"
        placeholder="Имя"
        type="text"
        name="name"
        value={values.name}
        minLength="2"
        maxLength="40"
        required
        noValidate
        id="popup__name"
        onChange={handleChange}
      />
      <span className="popup__input-error popup__name-error"></span>

      <input
        className="popup__input popup__input_type_profession"
        placeholder="О себе"
        type="text"
        name="profession"
        minLength="2"
        maxLength="200"
        required
        noValidate
        id="popup__prof"
        onChange={handleChange}
        value={values.profession}
      />
      <span className="popup__input-error popup__prof-error"></span>
    </PopupWithForm>
  );
}
