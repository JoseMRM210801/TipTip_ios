import React, { useContext, useState, useEffect } from "react";
import { Image, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { defaultStyle } from "../Theme/Theme";
import SvgCuenta from "../InicioRepartidor/SvgCuenta";
import SvgDatos from "../InicioRepartidor/SvgDatos";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "../Contexto/AppContext";
import { Usuario } from "../Modelos/Usuario";
import DeviceInfo from "react-native-device-info";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";

export const InicioCliente = () => {
    const fondo: any = require("../../assets/Fondo-Tiptip-01.jpg");
    const navigate = useNavigation();
    const contexto = useContext(AppContext);
    const [ingles, setIngles] = useState(contexto.usuario.English);

    useEffect(() => {
        console.log("contexto: "+contexto.usuario.English)
        console.log("variable: "+ingles)
        setIngles(ingles);
    }, [contexto.usuario.English])

    const isIOS = DeviceInfo.getSystemName() === 'iOS';
    const idiomaSpanol = {
        salir: 'Salir',
        saludo: 'Hola cliente',
        pregunta: '¿Te ha gustado el servicio prestado?',
        propuesta: 'Si lo deseas puedes dar una propina a tu proveedor y',
        agredecimiento: '¡agradecer su esfuerzo!',
        boton: 'Dar propina',
        iconoCuenta: 'Mi cuenta',
        iconoDatos: "Editar datos",
        botonDos: 'Dar propina'
    }
    const idiomaIngles = {
        salir: 'Exit',
        saludo: 'Hello client',
        pregunta: 'Did you like the provided service?',
        propuesta: 'If you wish, you can give a tip to your provider and',
        agredecimiento: 'thank them for their effort!',
        boton: 'Give tip',
        iconoCuenta: 'My account',
        iconoDatos: 'Edit data',
        botonDos: 'Give tip'
    };
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
                <TouchableOpacity onPress={()=> {navigate.navigate("TerminosyCondiciones" as never)}}>
                    <Text style={styles.textoOpciones}>?</Text>
                </TouchableOpacity>
            </View>


            <LinearGradient
                colors={['rgba(255,255,255,1)', 'rgba(222,222,222,1)', 'rgba(255,255,255,1)']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 1.5 }}
                style={styles.containerInfo}>

                <Text style={styles.textoCliente}>{contexto.usuario.Name}</Text>
                <Text style={styles.textoPregunta}>{ingles ? idiomaIngles.pregunta : idiomaSpanol.pregunta}</Text>
                <Text style={styles.textoNormal}>{ingles ? idiomaIngles.propuesta : idiomaSpanol.propuesta}</Text>
                <Text style={[styles.textoNormal, { fontWeight: '800', width: '100%', paddingLeft: 20, textAlign: 'left' }]}>{ingles ? idiomaIngles.agredecimiento : idiomaSpanol.agredecimiento}</Text>
                <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => { navigate.navigate('PantallaScanner' as never) }}
                        style={{ margin: 5, padding: 10, backgroundColor: 'rgb(212,46,46)', borderRadius: 8, width: '90%', marginTop: 25, marginBottom: 30 }}>
                        <Text style={{ color: 'white', textAlign: 'center', fontSize: 22, fontFamily: defaultStyle.fontGeneral.fontFamily }}>{ingles ? idiomaIngles.boton : idiomaSpanol.boton}</Text>
                    </TouchableOpacity>
                    <View style={styles.contendorIconos}>
                        <Pressable style={{ alignItems: 'center' }}
                            onPress={() => { navigate.navigate('CuentaCliente' as never); }}
                        >
                            <LinearGradient
                                colors={['rgba(255,255,255,1)', 'rgba(222,222,222,1)', 'rgba(255,255,255,1)']}
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 1.5 }}
                                style={styles.vistaIcono}>
                                <SvgCuenta fill={'#fff'} stroke={'#F52A2A'} />
                            </LinearGradient>
                            <Text style={{ color: '#606060', fontSize: 17, marginTop: 25 }}>{ingles ? idiomaIngles.iconoCuenta : idiomaSpanol.iconoCuenta}</Text>
                        </Pressable>
                        <View style={{ alignItems: 'center' }}>
                            <Pressable
                                onPress={() => { navigate.navigate('DatosCliente' as never) }}
                                style={{ alignItems: 'center' }}>
                                <LinearGradient
                                    colors={['rgba(255,255,255,1)', 'rgba(222,222,222,1)', 'rgba(255,255,255,1)']}
                                    start={{ x: 0, y: 0.5 }}
                                    end={{ x: 1, y: 1.5 }}
                                    style={styles.vistaIcono}>
                                    <SvgDatos fill={'#fff'} stroke={'#F52A2A'} />
                                </LinearGradient>
                                <Text style={{ color: '#606060', fontSize: 17, marginTop: 25 }}>{ingles ? idiomaIngles.iconoDatos : idiomaSpanol.iconoDatos}</Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>


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


