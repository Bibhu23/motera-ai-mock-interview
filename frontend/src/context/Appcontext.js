import { createContext, useState, useEffect } from "react";
import Gpi from "../Gpi";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [credit, setCredit] = useState(0);
  const [login, setLogin] = useState(() => localStorage.getItem("login") === "true");

  useEffect(() => {
    localStorage.setItem("login", login ? "true" : "false");
  }, [login]);

  useEffect(() => {
    if (login) {
      getLocalcredits();
    } else {
      setCredit(0);
      setUser(null);
    }
  }, [login]);

  const getLocalcredits = async () => {
    try {
      const { data } = await Gpi.get("/user/api/v1/credit", { withCredentials: true });
      if (data.success) {
        setCredit(data.creditBalance);
        setUser(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch credits");
    }
  };

  // ✅ renamed to consumeCredit for consistency
  const consumeCredit = async () => {
    try {
      const { data } = await Gpi.post("/user/api/v1/use-credit", {}, { withCredentials: true });
      if (data.success) {
        setCredit(data.creditBalance);
        toast.success(`Credit used! Remaining: ${data.creditBalance}`);
        return { success: true, creditBalance: data.creditBalance };
      } else {
        toast.error(data.message);
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error(err);
      toast.error("Error using credit");
      return { success: false, message: "Error using credit" };
    }
  };

  const logoutUser = () => {
    setUser(null);
    setLogin(false);
    setCredit(0);
    localStorage.removeItem("token");
  };

  const value = {
    user,
    setUser,
    getLocalcredits,
    credit,
    setCredit,
    login,
    setLogin,
    logoutUser,
    consumeCredit, // ✅ exposed correctly
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;
