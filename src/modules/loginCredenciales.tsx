import { object, string } from "yup";

export let loginSchemaValidation = object({
    email: string().email("El email no es valido").required("El email es requerido"),
    contrasenia: string().required("El contraseña es requerido").min(8, "La contraseña debe tener minimo 8 caracteres"),
})
export let loginSchemaValidationEn = object({
    email: string().email("The email is not valid").required("The email is required"),
    contrasenia: string().required("The password is required").min(8, "The password must have at least 8 characters"),
})

export let resetPasswordSchemaValidation = object({
    email: string().email("El email no es valido").required("El email es requerido"),
    contrasenia: string().required("El contraseña es requerido").min(8, "La contraseña debe tener minimo 8 caracteres"),
    servicio: string().required("El servicio es requerido"),
})

export let resetPasswordSchemaValidationEn = object({
    email: string().email("The email is not valid").required("The email is required"),
    contrasenia: string().required("The password is required").min(8, "The password must have at least 8 characters"),
    servicio: string().required("The service is required"),
})