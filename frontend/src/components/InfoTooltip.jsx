import usePopupClose from "../hooks/usePopupClose";
import onSuccessIcon from "../images/succes.svg";
import onErrorIcon from "../images/error.svg";

export default function InfoTooltip({ tooltipIcon, title, isOpen, onClose }) {
  usePopupClose(isOpen, onClose);
  return (
    <div className={`popup popup_type_tooltip ${isOpen ? "popup_opened" : ""}`}>
      <div className="popup__container-tooltip">
        <div className="popup__icon">
          {tooltipIcon === "success" && (
            <img src={onSuccessIcon} alt="успешно" />
          )}
          {tooltipIcon === "error" && <img src={onErrorIcon} alt="ошибка" />}
        </div>
        <p className="popup__title-tooltip">{title}</p>

        <button
          type="button"
          className="popup__button-close"
          onClick={onClose}
        />
      </div>
    </div>
  );
}
