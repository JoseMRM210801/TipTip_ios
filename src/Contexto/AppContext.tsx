import { useState, createContext } from "react";
import { AppContextState } from "./ContextState"
import { Usuario } from "../Modelos/Usuario";
type Props = {
    children: React.ReactNode
}
export const AppContext = createContext({} as AppContextState);


const AppProvider: React.FC<Props> = ({ children }) => {
    const [usuario, setUsuario] = useState<Usuario>({
        Id: "",
        Admin_Id: "",
        City: "",
        Email: "",
        Insignia: "",
        Is_Verified: false,
        LastName: "",
        Name: "",
        Password: "",
        Role_Id: "",
        State: "",
        Token: "",
        User: "",
        Occupation: "",
        Service: "",
        Bank: "",
        AccNumber: "",
        Account: "",
        English: false,
        Notification: false

    });
    return (
        <AppContext.Provider
            value={{
                usuario: usuario,
                setUsuario: setUsuario
            }}
        >
            {children}
        </AppContext.Provider>
    );
}
export default AppProvider;