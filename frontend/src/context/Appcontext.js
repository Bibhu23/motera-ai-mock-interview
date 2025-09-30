import { createContext, useState, useEffect } from "react";
import Gpi from "../Gpi";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [credit, setCredit] = useState(5);
  const [login, setLogin] = useState(() => {
    return localStorage.getItem("login") === "true";
  });

  useEffect(() => {
    localStorage.setItem("login", login ? "true" : "false");
  }, [login]);

  const logoutUser = () => {
    setUser(null);
    setLogin(false);
    localStorage.removeItem("token");
  };

  const getLocalcredits = async () => {
    try {
      const { data } = await Gpi.get("/user/api/v1/credit", {
        withCredentials: true,
      });
      if (data.sucess) {
        setCredit(data.creditBalance);
        setUser(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const value = {
    user,
    setUser,
    getLocalcredits,
    credit,
    setCredit,
    login,
    setLogin,
    logoutUser
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
export default AppContextProvider;
