import React, { useContext } from "react";
import { Card } from "./Card.jsx";
import { CurrentUserContext } from "../contexts/CurrentUserContext.jsx";

function Main({
  onEditAvatar,
  onEditProfile,
  onAddPlace,
  onCardClick,
  onCardLike,
  cards,
  onCardDelete,
}) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__container">
          <div className="profile__avatar-wrap">
            <button className="profile__avatar-button" onClick={onEditAvatar}>
              <img
                src={currentUser.avatar}
                className="profile__avatar"
                alt="аватар"
              />
            </button>
          </div>
          <div className="profile__info">
            <div className="profile__wrap">
              <h1 className="profile__name">{currentUser.name}</h1>
              <button
                type="button"
                className="profile__edit-button"
                title="Изменить профиль"
                aria-label="Изменить"
                onClick={onEditProfile}
              ></button>
            </div>
            <p className="profile__profession">{currentUser.about}</p>
          </div>
        </div>
        <button
          type="button"
          className="profile__add-button"
          title="Добавить фото"
          aria-label="Добавить"
          onClick={onAddPlace}
        ></button>
      </section>
      <section className="photos">
        <ul className="grid-photos">
          {cards.map((card) => (
            <Card
              key={card._id}
              name={card.name}
              alt={card.name}
              link={card.link}
              count={card.likes.length}
              card={card}
              onCardClick={onCardClick}
              onCardLike={() => onCardLike(card)}
              onCardDelete={onCardDelete}
            ></Card>
          ))}
        </ul>
      </section>
    </main>
  );
}
export { Main };
