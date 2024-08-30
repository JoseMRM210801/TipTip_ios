import React, { useContext, useEffect, useState } from "react";
import { BackHandler, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { defaultStyle } from "../Theme/Theme";
import SvgCuenta from "./SvgCuenta";
import SvgDatos from "./SvgDatos";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import SvgQr from "./SvgQr";
import SvgUsuario from "./SvgUser";
import SvgDinero from "./SvgDinero";
import DeviceInfo from "react-native-device-info";
import { AppContext } from "../Contexto/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";
import { Ruta } from "../Ruta/Ruta";

export const InicioRepartidor = () => {

    const isIOS = DeviceInfo.getSystemName() === 'iOS';
    const fondo: any = require("../../assets/Fondo-Tiptip-01.jpg");
    const navigate = useNavigation();
    const contexto = useContext(AppContext);
    const [ingles, setIngles] = useState(contexto.usuario.English);
    const [notificaciones, setNotificaciones] = useState(false);
    const [initialTips, setInitialTips] = useState<number | null>(null);
    const [currentTips, setCurrentTips] = useState(0);

    useEffect(() => {
        setIngles(ingles);
    }, [contexto.usuario.English]);

    const fetchTips = async () => {
        try {
            const response = await fetch(`${Ruta}/tip/delivery/${contexto.usuario.Id}`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'token': contexto.usuario.Token
                },
            });
            const data = await response.json();
            const tipsCount = data.length; // Suponiendo que el API devuelve un array con las propinas
            return tipsCount;
        } catch (error) {
            console.error(error);
            return 0;
        }
    };

    const resetNotifications = () => {
        setInitialTips(currentTips); // Reinicia el contador de propinas
        setNotificaciones(false); // Restablece el estado de notificaciones
    };

    useFocusEffect(
        React.useCallback(() => {
            const handleFocus = async () => {
                const tips = await fetchTips();
                setCurrentTips(tips);

                if (initialTips === null) {
                    setInitialTips(tips); // Guarda el número inicial de propinas
                } else if (tips !== initialTips) {
                    setNotificaciones(true); // Cambia el color del botón si hay un cambio en las propinas
                }
            };

            handleFocus();

            return () => {
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
            };
        }, [initialTips])
    );

    const onBackPress = () => {
        return true;
    };

    const salir = async () => {
        const limpiarUsuario = {
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
        };
        contexto.setUsuario(limpiarUsuario);
        try {
            await AsyncStorage.removeItem('email');
            await AsyncStorage.removeItem('password');
        } catch (error) {
            console.log(error);
        }
        navigate.navigate('Login' as never);
    };

    const idiomaSpanol = {
        salir: 'Salir',
        saludo: 'Hola servidor',
        propuesta: 'Puedes generar tu código QR y empezar a recibir propinas por tu esfuerzo.',
        boton: 'Genera QR',
        iconoCuenta: 'Mi cuenta',
        iconoDatos: "Editar datos",
        botonDos: 'Dar propina',
        botonTres: "Probar QR"
    };

    const idiomaIngles = {
        salir: 'Exit',
        saludo: 'Hello server',
        propuesta: 'You can generate your QR code and start receiving tips for your effort.',
        boton: 'Generate QR',
        iconoCuenta: 'My account',
        iconoDatos: 'Edit data',
        botonDos: 'Give tip',
        botonTres: 'Try QR',
    };

    return (
        <View style={styles.container}>
            <View style={styles.backgroundImageContainer}>
                <Image source={fondo} alt="Fondo Tip tip" style={styles.backgroundImage} />
            </View>
            <View style={[styles.contenedorOpciones, (isIOS ? { marginTop: 43 } : {})]}>
                <TouchableOpacity onPress={() => { salir() }}>
                    <Text style={styles.textoOpciones}>{ingles ? idiomaIngles.salir : idiomaSpanol.salir}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    setIngles(!ingles);
                    contexto.setUsuario({ ...contexto.usuario, English: !ingles })
                }}>
                    <Text style={styles.textoOpciones}>{ingles ? 'Es' : 'En'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> {navigate.navigate("TerminosyCondiciones" as never)}}>
                    <Text style={styles.textoOpciones}>?</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.saludo}>
                <Pressable 
                    style={(isIOS ? styles.iconoDineroIos : styles.iconoDinero)} 
                    onPress={() => { 
                        resetNotifications();
                        navigate.navigate('CuentaRepartidor' as never) 
                    }}
                >
                    <View style={{ position: 'relative', height: '100%', width: '100%', overflow: "hidden" }}>
                        <SvgDinero fill={"#fff"} stroke={"#fff"} />
                        <View style={notificaciones ? styles.circulo : styles.circuloApagado}></View>
                    </View>
                </Pressable>

                <Pressable 
                    style={(isIOS ? styles.iconoRojoIos : styles.iconoRojo)} 
                    onPress={() => { 
                        navigate.navigate('TerminosyCondiciones' as never) 
                    }}
                >
                    <View style={{ position: 'relative', height: '100%', width: '100%' }}>
                        <SvgUsuario fill={"#fff"} stroke={"#fff"} />
                        {/* No se usa la lógica de notificaciones en este botón */}
                    </View>
                </Pressable>
            </View>
            <LinearGradient
                colors={['rgba(255,255,255,1)', 'rgba(222,222,222,1)', 'rgba(255,255,255,1)']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 1.5 }}
                style={styles.containerInfo}>

                <ScrollView style={styles.ScrollView} contentContainerStyle={{ alignItems: 'center' }}>
                    <Text style={styles.textoCliente}>{contexto.usuario.Name} {contexto.usuario.LastName}</Text>
                    <Text style={styles.textoNormal}>{ingles ? idiomaIngles.propuesta : idiomaSpanol.propuesta}</Text>
                    <SvgQr />
                    <TouchableOpacity
                        onPress={() => { navigate.navigate('PantallaQr' as never) }}
                        style={{ margin: 5, padding: 10, backgroundColor: 'rgb(212,46,46)', borderRadius: 8, width: '90%', marginTop: 25, marginBottom: 30 }}>
                        <Text style={{ color: 'white', textAlign: 'center', fontSize: 22, fontFamily: defaultStyle.fontGeneral.fontFamily }}>{ingles ? idiomaIngles.boton : idiomaSpanol.boton}</Text>
                    </TouchableOpacity>
                    <View style={styles.contendorIconos}>
                        <Pressable style={{ alignItems: 'center' }}
                            onPress={() => { navigate.navigate('CuentaRepartidor' as never) }}
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
                                onPress={() => { navigate.navigate('DatosRepartidor' as never) }}
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
                    <TouchableOpacity
                        onPress={() => { navigate.navigate('LectorQR' as never) }}
                        style={{ margin: 5, padding: 10, backgroundColor: '#df662e', borderRadius: 8, width: '90%', marginTop: 25, marginBottom: 20 }}>
                        <Text style={{ color: 'white', textAlign: 'center', fontSize: 22, fontFamily: defaultStyle.fontGeneral.fontFamily }}>{ingles ? idiomaIngles.botonDos : idiomaSpanol.botonDos}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { navigate.navigate('LectorQRPrueba' as never) }}
                        style={{ margin: 5, padding: 10, backgroundColor: '#df662e', borderRadius: 8, width: '90%', marginBottom: 30 }}>
                        <Text style={{ color: 'white', textAlign: 'center', fontSize: 22, fontFamily: defaultStyle.fontGeneral.fontFamily }}>{ingles ? idiomaIngles.botonTres : idiomaSpanol.botonTres}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        position: 'relative',
        alignItems: 'center'
    },
    ScrollView: {
        width: '90%',
        height: '100%',
        position: 'relative'
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
        top: '15%',
        alignItems: 'center',
        width: '90%',
        height: '80%',
        backgroundColor: '#fff',
        minHeight: 320,
        borderRadius: 25,
        borderColor: '#ebebeb',
        borderWidth: 1
    },
    saludo: {
        position: 'absolute',
        padding: 10,
        width: '90%',
        top: '8%',
    },
    textoSaludo: {
        color: '#fff',
        fontSize: 24,
        textAlign: 'center',
    },
    textoCliente: {
        width: '100%',
        paddingLeft: 10,
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
        width: '90%',
        padding: 10
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
    },
    iconoRojo: {
        position: 'absolute',
        height: 40,
        width: 40,
        right: 0,
        top: 5,
        borderRadius: 100,
        zIndex: 10
    },
    iconoRojoIos: {
        position: 'absolute',
        height: 40,
        width: 40,
        right: 0,
        top: 5,
        borderRadius: 100,
        zIndex: 100
    },
    iconoDinero: {
        position: 'absolute',
        height: 40,
        width: 40,
        right: 70,
        top: 5,
        borderRadius: 100,
        zIndex: 100
    },
    iconoDineroIos: {
        position: 'absolute',
        height: 40,
        width: 40,
        right: 70,
        top: 5,
        borderRadius: 100
    },
    circulo: {
        position: 'absolute',
        height: 8,  // Asegura que las dimensiones sean iguales
        width: 8,   // Asegura que las dimensiones sean iguales
        backgroundColor: "red",
        borderRadius: 4, // La mitad de la altura y el ancho
        top: 0,
        right: 0,
        overflow: 'hidden',
    },
    circuloApagado: {
        position: 'absolute',
        height: 8,  // Asegura que las dimensiones sean iguales
        width: 8,   // Asegura que las dimensiones sean iguales
        borderRadius: 4, // La mitad de la altura y el ancho
        top: 0,
        right: 0,
        backgroundColor: 'transparent', // O el color de fondo que prefieras para cuando no haya notificación
    },
    notificaciones: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        height: 50,
    },
});

