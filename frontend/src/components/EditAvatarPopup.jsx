import React, { useRef, useEffect, useState } from "react";
import { PopupWithForm } from "./PopupWithForm";

export default function EditAvatarPopup({
  isOpen,
  onClose,
  onUpdateAvatar,
  isLoading,
}) {
  const avatarInput = useRef();

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateAvatar({
      avatar: avatarInput.current.value,
    });
  }

  useEffect(() => {
    avatarInput.current.value = "";
  }, [isOpen]);

  return (
    <PopupWithForm
      name="avatar"
      title="обновить аватар"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonText={isLoading ? "Обновление..." : "Обновить"}
    >
      <input
        type="url"
        placeholder="Ссылка на картинку"
        className="popup__input popup__input_type_link popup__input_type_error popup__input_name_link-avatar"
        name="link"
        required
        ref={avatarInput}
        id="avatar-link"
      />
      <span className="popup__input-error avatar-link-error"></span>
    </PopupWithForm>
  );
}
