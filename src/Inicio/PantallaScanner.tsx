import { useNavigation } from '@react-navigation/native';
import React, { useState, useContext, useEffect } from 'react'
import { Text, Pressable, ImageBackground, StyleSheet, View, Platform, TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import SvgSi from './SvgSi';
import SvgYes from './SvgYes';
import SvgFlecha from '../Admin/SvgFlecha';
import SvgQr from './SvgQr';
import DeviceInfo from 'react-native-device-info';
import { AppContext } from '../Contexto/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const PantallaScanner = () => {
    const fondo: any = require("../../assets/Fondo-Tiptip-01.jpg");
    const navigate = useNavigation();
    const contexto = useContext(AppContext);
    const [ingles, setIngles] = useState(contexto.usuario.English);
    useEffect(() => {
        setIngles(contexto.usuario.English);
    }, [contexto.usuario.English])
    const isIOS = DeviceInfo.getSystemName() === 'iOS';

    const idiomaSpanol = {
        salir: 'Salir',
        pregunta: '¿Te ha gustado el servicio prestado?',
        propuesta: '¿Quieres dar 1 dls?',
        pie: 'Escanea el QR del proveedor'
    }
    const idiomaIngles = {
        salir: 'Exit',
        pregunta: 'Did you like the provided service?',
        propuesta: 'Do you want to give $1?',
        pie: 'Scan the provider\'s QR code'
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
        }
        contexto.setUsuario(limpiarUsuario);
        //seria limpiar el local storage 
        try {
            await AsyncStorage.removeItem('email');
            await AsyncStorage.removeItem('password');
        } catch (error) {
            console.log(error);
        }
        navigate.navigate('Login');
    }

    return (
        <View>

            <ImageBackground
                source={fondo}
                resizeMode='cover'
                style={styles.backgroundImageContainer}>
                <View style={[styles.contenedorOpciones, (isIOS ? { marginTop: 43 } : {})]}>
                    <TouchableOpacity
                        onPress={() => { navigate.goBack(); }}
                        style={[styles.textoOpcionesF, styles.flecha]}>
                        <SvgFlecha />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { salir() }}
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

                    <Text style={styles.textoPregunta}>{ingles ? idiomaIngles.pregunta : idiomaSpanol.pregunta}</Text>
                    <Text style={styles.textoNormal}>{ingles ? idiomaIngles.propuesta : idiomaSpanol.propuesta}</Text>
                    <View style={{ marginTop: 15 }}>
                        <SvgQr />
                    </View>
                    <View style={styles.contenedorSi}>
                        <Pressable
                            style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => { navigate.navigate('LectorQR') }}
                        >
                              {ingles ? (
                                      <SvgYes fill={'rgb(212,46,46)'} />
                                ) : (
                                      <SvgSi fill={'rgb(212,46,46)'} />
                                )}                            
                        </Pressable>
                    </View>
                    <Text style={{ marginTop: 25, color: '#282828' }}>{ingles ? idiomaIngles.pie : idiomaSpanol.pie}</Text>
                </LinearGradient>
 

            </ImageBackground>

        </View>
    )
} 
const styles = StyleSheet.create({
    centrado: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    backgroundImageContainer: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerInfo: {
        position: 'absolute',
        top: '20%',
        alignItems: 'center',
        width: '90%',
        height: '70%',
        backgroundColor: '#fff',
        minHeight: 320,
        borderRadius: 25,
        borderColor: '#ebebeb',
        borderWidth: 1
    },
    textoPregunta: {
        fontSize: 30,
        fontWeight: '800',
        color: '#001d38',
        textAlign: 'center',
        padding: 30
    },
    textoNormal: {
        fontSize: 20,
        color: '#001d38'
    },
    contenedorSi: {
        height: 100,
        width: 100,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
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
})