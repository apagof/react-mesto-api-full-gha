import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Header from "./Header";
import { Main } from "./Main.jsx";
import { Footer } from "./Footer.jsx";
import ImagePopup from "./ImagePopup.jsx";
import { api } from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ProtectedRoute from "./ProtectedRoute";
import Auth from "./Auth";
import InfoTooltip from "./InfoTooltip";
import * as apiAuth from "../utils/apiAuth.js";

function App() {
  const [isEditPopupProfileOpen, setEditPopupProfileOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isImagePopupOpen, setImagePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState([]);
  const [cards, setCards] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
  const [tooltipTitle, setTooltipTitle] = useState("");
  const [tooltipIcon, setTooltipIcon] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const onHandleRegisterSubmit = (formValue) => {
    const { email, password } = formValue;
    apiAuth
      .register(email, password)
      .then((res) => {
        navigate("/sign-in", { replace: true });
        onSucessedRegister();
      })
      .catch((err) => {
        onError();
        console.log(err);
      });
  };

  const onHandleLoginSubmit = (formValue, setFormValue) => {
    if (!formValue.email || !formValue.password) {
      return;
    }
    apiAuth
      .authorize(formValue.email, formValue.password)
      .then((data) => {
        if (data.token) {
          setFormValue({ email: "", password: "" });
          onHandleLogin(formValue.email);
          navigate("/", { replace: true });
        }
      })
      .catch((err) => {
        onError();
        console.log(err);
      });
  };

  const onHandleLogin = (email) => {
    setIsLoggedIn(true);
    setEmail(email);
  };

  function onSignOut() {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    setEmail("");
    navigate("/sign-in", { replace: true });
  }

  function onSucessedRegister() {
    setTooltipIcon("success");
    setTooltipTitle("Вы успешно зарегистрировались!");
    setIsInfoTooltipPopupOpen(true);
  }

  function onError() {
    setTooltipIcon("error");
    setTooltipTitle("Что-то пошло не так! Попробуйте ещё раз.");
    setIsInfoTooltipPopupOpen(true);
  }

  const getUserInfoApi = () => {
    api
      .getUserInfo()
      .then((data) => {
        setCurrentUser(data);
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      });
  };

  const getCardsApi = () => {
    api
      .getCards()
      .then((data) => {
        setCards(data);
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      });
  };

  useEffect(() => {
    tokenCheck();
  }, []);

  const tokenCheck = () => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      apiAuth
        .getContent(jwt)
        .then((res) => {
          if (res) {
            setIsLoggedIn(true);
            const userData = {
              username: res.data._id,
              email: res.data.email,
            };
            setUserData(userData);
            setEmail(userData.email);
            navigate("/", { replace: true });
          }
        })
        .catch((err) => {
          console.log(`Ошибка: ${err}`);
        });
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      getUserInfoApi();
      getCardsApi();
    }
  }, [isLoggedIn]);

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    isLiked
      ? api
          .unlikeCard(card._id, !isLiked)
          .then((newCard) => {
            setCards((state) =>
              state.map((c) => (c._id === card._id ? newCard : c))
            );
          })
          .catch((err) => {
            console.log(`Ошибка: ${err}`);
          })
      : api
          .likeCard(card._id, !isLiked)
          .then((newCard) => {
            setCards((state) =>
              state.map((c) => (c._id === card._id ? newCard : c))
            );
          })
          .catch((err) => {
            console.log(`Ошибка: ${err}`);
          });
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() =>
        setCards((state) => state.filter((item) => item._id !== card._id))
      )
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      });
  }

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setEditPopupProfileOpen(true);
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setImagePopupOpen(true);
  }

  function closeAllPopups() {
    setEditAvatarPopupOpen(false);
    setEditPopupProfileOpen(false);
    setAddPlacePopupOpen(false);
    setImagePopupOpen(false);
    setIsInfoTooltipPopupOpen(false);
  }

  function handleUpdateUser({ name, about }) {
    setIsLoading(true);
    api
      .editUserInfo(name, about)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
        console.log(data);
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleUpdateAvatar({ avatar }) {
    setIsLoading(true);
    api
      .editAvatar(avatar)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleAddCardSubmit(card) {
    setIsLoading(true);
    api
      .addCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header isLoggedIn={isLoggedIn} email={email} onSignOut={onSignOut} />
        <Routes>
          <Route
            path="/sign-up"
            element={
              <Auth
                title={"Регистрация"}
                buttonTitle={"Зарегистрироваться"}
                onHandleSubmit={onHandleRegisterSubmit}
              />
            }
          />
          <Route
            path="/sign-in"
            element={
              <Auth
                title={"Вход"}
                buttonTitle={"Войти"}
                onHandleSubmit={onHandleLoginSubmit}
              />
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                element={Main}
                onEditAvatar={handleEditAvatarClick}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
                cards={cards}
              />
            }
          />
          <Route path="*" element={<Navigate to="/sign-up" />} />
        </Routes>
        <Footer />

        <EditProfilePopup
          isOpen={isEditPopupProfileOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isLoading={isLoading}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          isLoading={isLoading}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddCard={handleAddCardSubmit}
          isLoading={isLoading}
        />
        <ImagePopup
          card={selectedCard}
          isOpen={isImagePopupOpen}
          onClose={closeAllPopups}
        />
        <InfoTooltip
          title={tooltipTitle}
          tooltipIcon={tooltipIcon}
          isOpen={isInfoTooltipPopupOpen}
          onClose={closeAllPopups}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
