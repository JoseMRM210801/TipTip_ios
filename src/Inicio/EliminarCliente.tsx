import React, { useContext, useState, useEffect } from "react";
import { Image, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "../Contexto/AppContext";
import { Usuario } from "../Modelos/Usuario";
import DeviceInfo from "react-native-device-info";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { defaultStyle } from '../Theme/Theme';
import { Formik } from "formik";
import { clientSchemaValidation, clientSchemaValidationEn } from "../modules/registroCliente";

export const EliminarCliente = () => {
    const fondo: any = require("../../assets/Fondo-Tiptip-01.jpg");
    const navigate = useNavigation();
    const contexto = useContext(AppContext);
    const [ingles, setIngles] = useState(contexto.usuario.English);
    useEffect(() => {
        setIngles(contexto.usuario.English);
    }, [contexto.usuario.English])
    const isIOS = DeviceInfo.getSystemName() === 'iOS';
    const Salir = async () => {
        const limpiarUsuario: Usuario = {
            Id: "",
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
            User: ""
        }

        contexto.setUsuario(limpiarUsuario);
        //seria limpiar el local storage 
        try {
            await AsyncStorage.removeItem('email');
            await AsyncStorage.removeItem('password');
        } catch (error) {
            console.log(error);
        }
        navigate.navigate('Login' as never);

    }
    const idiomaSpanol = {
      
        salir: 'Salir',
        Despedida:"¿Estas seguro de querer eliminar tu cuenta, al hacerlo no podras recuperarla y tendras que llamar a los administradores para recuperarla?",
        Enbellezar:'Te hecharemos de menos',
        Eliminar:'Eliminar Cuenta'
        
    }
    const idiomaIngles = {
      
        salir: 'Out',
        Despedida: "Are you sure you want to delete your account? If you do so, you won't be able to recover it? and you will have to call the administrators to recover it,",
        Enbellezar:'We will miss you',
        Eliminar:'Eliminar Cuenta'
        
    };
    const EliminarUsuario = async () => {
        try {
            const response = await fetch(`https://bett-production.up.railway.app/api/client/delete/${contexto.usuario.Id}`, {
                method: 'DELETE',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'token': contexto.usuario.Token
                },
            });
    
            if (!response.ok) { // Verifica si el estado de la respuesta no es satisfactorio
                throw new Error(`Error del servidor: ${response.status}`);
            }
    
            const responseText = await response.text(); // Obtener la respuesta como texto
    
            try {
                const data = JSON.parse(responseText); // Intenta analizar el texto como JSON
                console.log('Datos JSON:', data);
            } catch (jsonError) {
                console.error('Error al analizar la respuesta como JSON:', jsonError);
                throw new Error('La respuesta no es JSON válido.');
            }
    
            return navigate.navigate('Login' as never);
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
        }
    };
    
    
    return (
        <View style={styles.container}>
            <View style={styles.backgroundImageContainer}>
                <Image source={fondo} alt="Fondo Tip tip" style={styles.backgroundImage} />
            </View>
            <View style={[styles.contenedorOpciones, (isIOS ? { marginTop: 43 } : {})]}>
                <TouchableOpacity
                    onPress={() => { Salir() }}
                >
                    <Text style={styles.textoOpciones}>{ingles ? idiomaIngles.salir : idiomaSpanol.salir}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    setIngles(!ingles)
                    contexto.setUsuario({ ...contexto.usuario, English: !ingles })
                }}>
                    <Text style={styles.textoOpciones}>{ingles ? 'Es' : 'En'}</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.textoOpciones}>?</Text>
                </TouchableOpacity>
            </View>

            <LinearGradient
                colors={['rgba(255,255,255,1)', 'rgba(222,222,222,1)', 'rgba(255,255,255,1)']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 1.5 }}
                style={styles.containerInfo}>
                    <Text>{ingles ? idiomaIngles.Despedida : idiomaSpanol.Despedida} </Text>
                    <Text>{ingles ? idiomaIngles.Enbellezar : idiomaSpanol.Enbellezar}</Text>
                    <Text>{ingles ? idiomaIngles.salir : idiomaSpanol.salir}</Text>
                    <TouchableOpacity
            onPress={() => { EliminarUsuario()  }} // Llama a EliminarUsuario con el usuario del contexto
            style={{ margin: 5, padding: 10, backgroundColor: 'rgb(212,46,46)', borderRadius: 8, width: '45%', marginTop: 12 }}>
            <Text style={{ color: 'white', textAlign: 'center', fontSize: 22, fontFamily: defaultStyle.fontGeneral.fontFamily }}>{ingles ? idiomaIngles.Eliminar : idiomaSpanol.Eliminar}</Text>
        </TouchableOpacity>
                </LinearGradient>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        position: 'relative',
        alignItems: 'center'
    },
    backgroundImageContainer: {
        height: '100%',
        width: '100%',
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    ScrollView: {
        width: '90%',
        height: '100%'
    },
    contenedorOpciones: {
        position: 'absolute',
        top: 0,
        flexDirection: 'row',
        gap: 20,
        justifyContent: 'flex-end',
        width: '100%',
        paddingRight: 20,
        paddingTop: 5
    },
    textoOpcionesF: {
        color: 'rgb(212,46,46)',
        fontSize: 18,
        paddingHorizontal: 8,
        backgroundColor: "#fff",
        marginTop: 4,
        borderRadius: 4
    },
    flecha: {
        position: 'absolute',
        left: 10,
        top:10,
        paddingTop: 5
    },
    textoOpciones: {
        color: 'rgb(212,46,46)',
        fontSize: 18,
        paddingHorizontal: 8,
        backgroundColor: "#fff",
        marginTop: 4,
        borderRadius: 4
    },
    containerInfo: {
        position: 'absolute',
        top: '10%',
        alignItems: 'center',
        width: '90%',
        height: '90%',
        backgroundColor: '#fff',
        minHeight: 320,
        borderRadius: 25,
        borderColor: '#ebebeb',
        borderWidth: 1
    },
    saludo: {
        position: 'absolute',
        backgroundColor: 'rgba(255,255,255,.100)',
        borderRadius: 33,
        padding: 10,
        width: '90%',
        top: '10%',
    },
    textoSaludo: {
        color: '#fff',
        fontSize: 24,
        textAlign: 'center',
    },
    textoCliente: {
        width: '100%',
        paddingLeft: 30,
        color: '#001d38',
        fontSize: 24,
        fontWeight: '800'
    },
    textoPregunta: {
        fontSize: 22,
        fontWeight: '800',
        color: '#001d38',
        textAlign: 'center',
        padding: 30
    },
    textoNormal: {
        fontSize: 18,
        color: '#001d38',
        width: '90%'
    },
    contendorIconos: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%'
    },
    vistaIcono: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 15,
            },
        }),
    }
});


