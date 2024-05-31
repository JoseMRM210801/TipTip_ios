import React, { useContext, useEffect, useState } from 'react'
import { Image, View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native'
import { defaultStyle } from '../Theme/Theme';
import { useNavigation } from '@react-navigation/native'
import { AppContext } from '../Contexto/AppContext';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Usuario } from '../Modelos/Usuario';
import { Loader } from '../Loader/Loader';

export const Login = () => {
    const fondo: any = require("../../assets/Fondo-Tiptip-01.jpg");
    const logo: any = require("../../assets/Logo-Tiptip-02.png");
    const contexto = useContext(AppContext);
    const [ingles, setIngles] = useState(contexto.usuario.English);
    useEffect(() => {
        setIngles(contexto.usuario.English);
    }, [contexto.usuario.English])
    const [loader, setLoader] = useState(false);
    const isIOS = DeviceInfo.getSystemName() === 'iOS';
    useEffect(() => {
        loadLogin();
    }, []);
    const idiomaSpanol = {
        textoPrincipal: '¡Propinas al instante!',
        botonIngresar: "Ingresa",
        botonRegistrate: "Registrate",
        pie: "Con TipTip puedes dar y recibir propinas de forma rapida y sencilla."
    }
    const idiomaIngles = {
        textoPrincipal: "Instant Tips!",
        botonIngresar: "Log In",
        botonRegistrate: "Sign Up",
        pie: "With TipTip you can give and receive tips quickly and easily."

    };
    const Login = async (correo: string, pass: string) => {
        let login: Usuario = {
            Id: "",
            City: "",
            Email: correo,
            Insignia: "",
            Is_Verified: false,
            LastName: "",
            Name: "",
            Password: pass,
            Role_Id: "",
            State: "",
            Token: "",
            User: ""
        }

        // fetch('http://192.168.0.7:8090/api/login', {
        fetch('https://bett-production.up.railway.app/api/login', {
            //fetch('http://10.0.2.2:8090/api/login', {
            //fetch('http://127.0.0.1:8090/api/login', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(login)
        })
            .then(res => {
                return res.json()
            })
            .then(data => {

                if (data.error != null) {
                }
                if (data.Role_Id != null) {
                    contexto.setUsuario(data);
                    if (data.Role_Id == "1") {
                        navigate.navigate("InicioCliente" as never);
                    } else if (data.Role_Id == "2") {
                        navigate.navigate("InicioRepartidor" as never);
                    } else if (data.Role_Id == "3") {
                        navigate.navigate("InicioAdministrador" as never);
                    }
                } else {
                    console.log("error");
                }
            }).catch((err) => { console.log(err) })
        setLoader(false);
    }

    const loadLogin = async () => {
        try {
            const storedEmail = await AsyncStorage.getItem('email');
            const storedPassword = await AsyncStorage.getItem('password');
            if (storedEmail && storedPassword) {
                setLoader(true);
                // setTimeout(() => {
                //     Login(storedEmail, storedPassword);
                // }, 3000);
                Login(storedEmail, storedPassword);
            }
        } catch (error) {

        }
    }
    const navigate = useNavigation();
    const simulacion = async () => {
        navigate.navigate('Credenciales' as never);
    }
    if (loader) {
        console.log("loader")
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Loader />
            </View>
        )
    }
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
            <ImageBackground
                source={fondo}
                resizeMode='cover'
                style={styles.backgroundImageContainer}>
                <View style={[styles.contenedorOpciones, (isIOS ? { marginTop: 40 } : {})]}>
                    <TouchableOpacity onPress={() => {
                        setIngles(!ingles)
                        contexto.setUsuario({ ...contexto.usuario, English: !ingles })
                    }}>
                        <Text style={styles.textoOpciones}>{ingles ? 'Es' : 'En'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> {navigate.navigate("TerminosyCondiciones" as never)}}>
                        <Text style={styles.textoOpciones}>?</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.containerInfo}>
                    <View>
                        <Image source={logo} alt="Logo Tip tip" style={styles.tipTip} />
                    </View>
                    <Text style={styles.textHeader}>{ingles ? idiomaIngles.textoPrincipal : idiomaSpanol.textoPrincipal}</Text>

                    <View style={{ flexDirection: 'column', justifyContent: 'center', width: '100%', alignItems: 'center', marginTop: -40 }}>
                        <TouchableOpacity
                            onPress={() => { simulacion() }}
                            style={{ margin: 5, padding: 10, backgroundColor: 'rgb(212,46,46)', borderRadius: 8, width: '45%' }}>
                            <Text style={{ color: 'white', textAlign: 'center', fontSize: 22, fontFamily: defaultStyle.fontGeneral.fontFamily }}>{ingles ? idiomaIngles.botonIngresar : idiomaSpanol.botonIngresar}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { navigate.navigate('TipoRegistro' as never) }}
                            style={{ margin: 5, padding: 10, backgroundColor: '#df662e', borderRadius: 8, width: '45%', marginTop: 12 }}>
                            <Text style={{ color: 'white', textAlign: 'center', fontSize: 22, fontFamily: defaultStyle.fontGeneral.fontFamily }}>{ingles ? idiomaIngles.botonRegistrate : idiomaSpanol.botonRegistrate}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={styles.textBottomp}>
                    {ingles ? idiomaIngles.pie : idiomaSpanol.pie}
                </Text>
            </ImageBackground>

        </View>
    );
}
const styles = StyleSheet.create({
    backgroundImage: {
        width: '100%',
        height: '100%'
    },
    backgroundImageContainer: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerInfo: {
        alignItems: 'center',
        width: '100%',
        position: 'absolute'
    },
    tipTip: {
        marginTop: 120
    },
    textHeader: {
        color: '#000',
        fontSize: 28,
        marginBottom: 40,
        marginTop: 15,
        fontFamily: defaultStyle.fontGeneral.fontFamilyBold
    },
    textBottom: {
        marginTop: 10,
        textAlign: 'center',
        position: 'absolute',
        bottom: 0,
        padding: 10,
        fontSize: 16,
        color: '#282828',
        fontFamily: defaultStyle.fontGeneral.fontFamily
    },    
    textBottomp: {
        marginTop: 10,
        textAlign: 'center',
        position: 'absolute',
        bottom: 0,
        padding: 10,
        fontSize: 13,
        color: '#282828',
        fontFamily: defaultStyle.fontGeneral.fontFamily
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
});
