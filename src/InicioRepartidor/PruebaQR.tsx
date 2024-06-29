import React, { useContext, useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TextInput, View, ScrollView, ImageBackground, TouchableOpacity, Modal } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native';
import WebView from 'react-native-webview';
import queryString from 'query-string';
import LinearGradient from "react-native-linear-gradient";
import { defaultStyle } from '../Theme/Theme';
import SvgFlecha from '../Admin/SvgFlecha';
import { AppContext } from '../Contexto/AppContext';

import { Loader } from '../Loader/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const PruebaQR = () => {
    const fondo = require("../../assets/Fondo-Tiptip-01.jpg");
    const boton1 = require("../../assets/Boton-especial-01.png");
    const boton3 = require("../../assets/Boton-especial-03.png");
    const [rating, setRating] = useState(0);
    const [isPressed, setIsPressed] = useState(true);
    const [contador, setContador] = useState(1);
    const contexto = useContext(AppContext);
    const [ingles, setIngles] = useState(contexto.usuario.English);
    useEffect(() => {
        setIngles(contexto.usuario.English);
    }, [contexto.usuario.English])
    const [codigo, setCodigo] = useState("");
    const [idDelivery, setIdDelivery] = useState(0);
    const route = useRoute();
    const { value } = route.params;
    const [paypalUrl, setPaypalUrl] = useState(null)
    const [accessToken, setAccessToken] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    
    const onUrlChange = (webviewState) => {
        //console.log("webviewStatewebviewState", webviewState)
        if (webviewState.url.includes('https://example.com/cancel')) {
            clearPaypalState()
            return;
        }
        if (webviewState.url.includes('https://example.com/return')) {

            const urlValues = queryString.parseUrl(webviewState.url)
            const { token } = urlValues.query
            if (token) {
                paymentSucess(token)
            }

        }
    }

    const paymentSucess = async (id) => {
        try {
            const res = await paypalApi.capturePayment(id, accessToken || "", contexto.usuario.Token)
            if (res != 'error') {
                //fetch('http://192.168.0.7:8090/api/tip/add', {
                fetch(`https://bett-production.up.railway.app/api/tip/add`, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': contexto.usuario.Token
                    },
                    body: JSON.stringify({
                        client_Id: contexto.usuario.Id,
                        delivery_Id: idDelivery,
                        Donated: res,
                    })
                })
                    .then((response) => response.json())
                    .then((json) => {

                        fetch(`https://bett-production.up.railway.app/api/delivery/notifications/`, {

                            method: 'PUT',
                            mode: 'cors',
                            headers: {
                                'Content-Type': 'application/json',
                                'token': contexto.usuario.Token
                            },
                            body: JSON.stringify({
                                "id": idDelivery,
                                "state": 1
                            })
                        }).then(res => { return res.json() })
                            .then(datos => {
                                contexto.setUsuario({ ...contexto.usuario, Notification: !contexto.usuario.Notification });
                            })
                        navigate.navigate('PantallaExito');
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
            clearPaypalState()

        } catch (error) {
            console.log("error raised in payment capture", error)
        }
    }


    const clearPaypalState = () => {
        setPaypalUrl(null)
        setAccessToken(null)
        setIsLoaded(false)
    }

    const idiomaIngles = {
        salir: 'Exit',
        pregunta: 'This is your code',
        propuesta: `${codigo}`,
    };
    const idiomaSpanol = {
        salir: 'Salir',
        pregunta: 'Este es tu codigo',
        propuesta: `${codigo}`,
    }
    let valorInput = "";
    const navigate = useNavigation();
    const handlePress = () => {
        setIsPressed(false);
        setContador(contador + 1);
        let Sound = require('react-native-sound');
        const sound = new Sound('coin.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.error('Error al cargar el sonido', error);
                return;
            }

            // Reproducir el sonido si se cargó correctamente
            sound.play(() => {
                sound.release();
            });
        });
        setTimeout(() => {
            setIsPressed(true)
        }, 100)
    };
    const handleRating = (value) => {
        setRating(value);
    };

    useEffect(() => {
        // fetch(`http://192.168.0.7:8090/api/delivery/${value}`,
        fetch(`https://bett-production.up.railway.app/api/delivery/user/${value}`,
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'token': contexto.usuario.Token
                }
            })
            .then((response) => response.json())
            .then((json) => {
                setIdDelivery(json.Id);
                setCodigo(json.User);
            })
            .catch((error) => {
                console.error('pipipi');
            });
    }, [])

    return (
        <View style={styles.centrado}>
            <ImageBackground
                source={fondo}
                resizeMode='cover'
                style={styles.backgroundImageContainer}>

                <View style={styles.contenedorOpciones}>
                    <TouchableOpacity
                        onPress={() => { navigate.navigate('InicioRepartidor' as never) }}
                        style={[styles.textoOpciones, styles.flecha]}>
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
                    <TouchableOpacity>
                        <Text style={styles.textoOpciones}>?</Text>
                    </TouchableOpacity>
                </View>

                <LinearGradient
                    colors={['rgba(255,255,255,1)', 'rgba(222,222,222,1)', 'rgba(255,255,255,1)']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 1.5 }}
                    style={styles.contenedorBoton}>
                    <ScrollView style={{ width: '90%' }}>
                        <Text style={styles.textoPregunta}>{ingles ? idiomaIngles.pregunta : idiomaSpanol.pregunta}</Text>
                        <Image style={styles.Logo}
                        source={require("../../assets/Logo-Tiptip-02.png")}/> 
                        <Text style={styles.textoNormal}>{ingles ? idiomaIngles.propuesta : idiomaSpanol.propuesta}</Text>
                        <TouchableOpacity
                            style={styles.buttonEspecial}
                            onPress={handlePress}
                        >
                        </TouchableOpacity>                  
                    </ScrollView>
                </LinearGradient>
            </ImageBackground>

            <Modal
                visible={!!paypalUrl}
                style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}
            >
                <TouchableOpacity
                    onPress={clearPaypalState}
                    style={{ margin: 24 }}
                >
                    <Text>Closed</Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <WebView
                        source={{ uri: paypalUrl ?? "" }}
                        onNavigationStateChange={onUrlChange}
                    />
                </View>
            </Modal>

        </View>
    )
}
const styles = StyleSheet.create({
    centrado: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    Logo:{
        width:150,
        height:100,
        alignContent:"center",
        justifyContent: 'center',
        marginLeft:75
    },
    backgroundImageContainer: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
    },
    buttonEspecial: {
        width: '100%',
        height: 200,
        borderWidth: 0,
        marginTop: 10,
        alignItems: 'center'
    },
    botonesInput: {
        width: 80,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6
    },
    buttonText: {
        color: '#282828',
        fontSize: 30,
        padding: 10
    },
    botonMas: {
        backgroundColor: 'rgb(212,46,46)'
    },
    inputNumero: {
        borderWidth: 2,
        borderColor: '#282828',
        color: '#000',
        borderRadius: 25,
        width: '100%',
        textAlign: 'center',
        fontSize: 28,
        fontWeight: '800'
    },
    contenedorBotones: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        height: '10%'
    },
    contenedorEstrellas: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        marginTop: 15
    },
    contenedorBoton: {
        marginTop: 20,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        height: '90%',
        width: '90%',
    },
    textoPregunta: {
        fontSize: 30,
        fontWeight: '800',
        color: '#001d38',
        textAlign: 'center',
        padding: 30,
        width: '100%'
    },
    textoNormal: {
        fontSize: 20,
        color: '#001d38',
        textAlign:'center',
        fontWeight: '600',

    },
    estrellaLlena: {
        color: '#ff9933',
        fontSize: 40
    },
    estrellaVacia: {
        color: '#ff9933',
        fontSize: 40
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