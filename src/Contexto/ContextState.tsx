import { SetStateAction, Dispatch } from "react"
import { Usuario } from "../Modelos/Usuario";




export type AppContextState = {
    usuario: Usuario;
    setUsuario: Dispatch<React.SetStateAction<Usuario>>;

};