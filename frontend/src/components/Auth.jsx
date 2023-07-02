import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Auth({ title, buttonTitle, onHandleSubmit }) {
  const [formValue, setFormValue] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormValue({ ...formValue, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onHandleSubmit(formValue, setFormValue);
  };

  return (
    <div className="authorization">
      <div className="authorization__container">
        <h2 className="authorization__title">{title}</h2>
        <form
          className="authorization-form authorization-form_login"
          name="register"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            name="email"
            minLength={6}
            placeholder="Email"
            onChange={handleChange}
            value={formValue.email} 
            required
            className="authorization-form__input authorization-form__input_email"
            id="login-email-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            onChange={handleChange}
            value={formValue.password} 
            required
            className="authorization-form__input authorization-form__input_password"
            id="login-password-input"
          />
          <button type="submit" className="authorization-form__btn-submit">
            {buttonTitle}
          </button>
        </form>
        {title === "Регистрация" && (
          <Link to="/sign-in" className="authorization__sign-in-link">
            Уже зарегистрированы? Войти
          </Link>
        )}
      </div>
    </div>
  );
}
