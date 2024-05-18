import { object, string } from "yup";

export let deliverySchemaValidation = object({
    nombre: string().required("El nombre es requerido"),
    apellido: string().required("El apellido es requerido"),
    email: string().email("El email no es valido").required("El email es requerido"),
    contrasenia: string().required("La contraseña es requerida").min(8, "La contraseña debe tener al menos 8 caracteres"),
    servicio: string().required("El servicio es requerido"),
    ocupacion: string().required("La ocupacion es requerida"),

})

export let deliverySchemaValidationEn = object({
    nombre: string().required("The name is required"),
    apellido: string().required("The last name is required"),
    email: string().email("The email is not valid").required("The email is required"),
    contrasenia: string().required("The password is required").min(8, "The password must have at least 8 characters"),
    servicio: string().required("The service is required"),
    ocupacion: string().required("The occupation is required"),

})