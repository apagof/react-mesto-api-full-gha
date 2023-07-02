import React, { useEffect } from "react";
import { PopupWithForm } from "./PopupWithForm";
import { useForm } from "../hooks/useForm";

export default function AddPlacePopup({
  isOpen,
  onClose,
  onAddCard,
  isLoading,
}) {
  const { values, handleChange, setValues } = useForm({});

  function handleSubmit(e) {
    e.preventDefault();

    onAddCard({
      name: values.name,
      link: values.link,
    });
  }

  useEffect(() => {
    setValues({ name: "", link: "" });
  }, [isOpen]);

  return (
    <PopupWithForm
      name="add-pic"
      title="Новое место"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonText={isLoading ? "Добавление..." : "Добавить"}
    >
      <input
        type="text"
        className="popup__input popup__input_type_place popup__input_type_error"
        placeholder="Название"
        name="name"
        minLength="2"
        maxLength="30"
        required
        noValidate
        id="popup__pick"
        onChange={handleChange}
        value={values.name}
      />
      <span className="popup__input-error popup__pick-error"></span>
      <input
        className="popup__input popup__input_type_link popup__input_type_error"
        value={values.link}
        onChange={handleChange}
        placeholder="Ссылка на картинку"
        type="url"
        name="link"
        required
        noValidate
        id="popup__link"
      />
      <span className="popup__input-error popup__link-error"></span>
    </PopupWithForm>
  );
}
