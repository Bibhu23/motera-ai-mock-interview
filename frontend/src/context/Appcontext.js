import { createContext } from "react";
import Gpi from "../Gpi";
import { useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [user, setUser] = useState(null);
    const [credit, setCredit] = useState(5);

    const getLocalcredits = async () => {
        try {
            const { data } = await Gpi.get("/user/api/v1/credit", {
                withCredentials: true, // 👈 ensures cookies are sent
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
    const value = { user, setUser, getLocalcredits, credit, setCredit };
    return (
        <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
    );
};
export default AppContextProvider;
