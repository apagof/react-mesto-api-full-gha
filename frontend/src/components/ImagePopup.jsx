import usePopupClose from "../hooks/usePopupClose";

export default function ImagePopup({ isOpen, card, onClose }) {
  usePopupClose(isOpen, onClose);

  return (
    <div
      className={`popup popup_type_image-big ${isOpen ? "popup_opened" : ""}`}
    >
      <div className="popup__image-container">
        <img className="popup__card-image" src={card.link} alt={card.name} />
        <p className="popup__image-caption">{card.name}</p>
        <button
          className="popup__button-close"
          type="button"
          title="Закрыть окно"
          aria-label="Закрыть"
          onClick={onClose}
        ></button>
      </div>
    </div>
  );
}
