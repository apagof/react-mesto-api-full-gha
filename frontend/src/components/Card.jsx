import React, { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card({
  link,
  alt,
  name,
  count,
  card,
  onCardClick,
  onCardLike,
  onCardDelete,
}) {
  const currentUser = useContext(CurrentUserContext);
  const isOwn = card.owner._id === currentUser._id;
  const isLiked = card.likes.some((i) => i._id === currentUser._id);

  const cardLikeButtonClassName = `grid-item__like ${
    isLiked && "grid-item__like_active"
  }`;

  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  return (
    <li className="grid-item">
      <img
        src={link}
        alt={alt}
        className="grid-item__image"
        onClick={handleClick}
      />
      <div className="grid-item__wrap">
        <h3 className="grid-item__name">{name}</h3>
        <div className="grid-item__like-container">
          <button
            type="button"
            className={cardLikeButtonClassName}
            onClick={handleLikeClick}
            aria-label="Понравилось"
          ></button>
          <p className="grid-item__like-counter">{count}</p>
        </div>
      </div>
      {isOwn && (
        <button className="grid-item__delete-btn" onClick={handleDeleteClick} />
      )}
    </li>
  );
}
export { Card };
