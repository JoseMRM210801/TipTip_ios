import React, { useContext, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View, ScrollView, ImageBackground, TouchableOpacity, Modal } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import WebView from 'react-native-webview';
import queryString from 'query-string';
import LinearGradient from "react-native-linear-gradient";
import { defaultStyle } from '../Theme/Theme';
import SvgFlecha from '../Admin/SvgFlecha';
import { AppContext } from '../Contexto/AppContext';
import paypalApi from './paypalApi';
import { Loader } from '../Loader/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ruta } from '../Ruta/Ruta';

export const BotonPropina = () => {
    const fondo = require("../../assets/Fondo-Tiptip-01.jpg");
    const boton1 = require("../../assets/Boton-especial-01.png");
    const boton3 = require("../../assets/Boton-especial-03.png");
    const [rating, setRating] = useState(0);
    const [isPressed, setIsPressed] = useState(true);
    const [contador, setContador] = useState(1);
    const contexto = useContext(AppContext);
    const navigate = useNavigation();
    const [ingles, setIngles] = useState(contexto.usuario.English);
    useEffect(() => {
        setIngles(contexto.usuario.English);
    }, [contexto.usuario.English]);
    const [codigo, setCodigo] = useState("");
    const [idDelivery, setIdDelivery] = useState(0);
    const route = useRoute();
    const { value } = route.params;
    const [paypalUrl, setPaypalUrl] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const onPressPaypal = async () => {
        const token = await paypalApi.generateToken(contexto.usuario.Token);
        const res = await paypalApi.createOrder(token, contador);
        console.log("res", res);
        console.log("token", token);
        setAccessToken(token);
        if (res.links) {
            const findUrl = res.links.find((data) => data?.rel == "approve");
            setPaypalUrl(findUrl.href);
        }
    };


    const onUrlChange = (webviewState) => {
        if (webviewState.url.includes('https://example.com/cancel')) {
            clearPaypalState();
            return;
        }
        if (webviewState.url.includes('https://example.com/return')) {
            const urlValues = queryString.parseUrl(webviewState.url);
            const { token } = urlValues.query;
            if (token) {
                paymentSucess(token);
            }
        }
    };
    console.log("Servicio", contexto.usuario.Id);

    const calcularComision = (contador,res) => {
        

        const comision = contador-res;
   
        return { comision };
    };
    console.log("Provedor",contexto.usuario.User)
    console.log("es cliente",contexto.usuario.Id)
    // const paymentSucess = async (id) => {
    //     try {
    //         const res = await paypalApi.capturePayment(id, accessToken || "", contexto.usuario.Token);
    //         if (res !== 'error') {
    //             // Calcular la comisión y el valor neto después de la comisión
    //             const {  comision } = calcularComision(contador, res);
                
    //             fetch(`${Ruta}/tip/add`, {
    //                 method: 'POST',
    //                 mode: 'cors',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'token': contexto.usuario.Token,
    //                 },
    //                 body: JSON.stringify({
    //                     client_Id: contexto.usuario.Id,
    //                     delivery_Id: idDelivery,
    //                     Donated: res, // Valor neto después de la comisión
    //                     paypal: comision,        // Valor total donado
    //                     comision: comision, // Comisión de PayPal
    //                 }),
    //             })
    //             .then((response) => response.json())
    //             navigate.navigate('PantallaExito');
    //         }
    //         clearPaypalState();
    //     } catch (error) {
    //         console.log(id);
    //         console.log("error raised in payment capture", error);
          
    //     }
    // };
    const paymentSucess = async (id) => {
        try {
            const res = await paypalApi.capturePayment(id, accessToken || "", contexto.usuario.Token);
            if (res !== 'error') {
                // Calcular la comisión y el valor neto después de la comisión
                const {  comision } = calcularComision(contador, res);
                const provedorId = contexto.usuario.Occupation ? 11: contexto.usuario.Id;
                fetch(`${Ruta}/tip/add`, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': contexto.usuario.Token,
                    },
                    body: JSON.stringify({
                        client_Id: provedorId,
                        delivery_Id: idDelivery,
                        Donated: res, // Valor neto después de la comisión
                        paypal: comision,        // Valor total donado
                        comision: comision, // Comisión de PayPal
                        userprovider:contexto.usuario.User
                    }),
                })
                .then((response) => response.json())
                navigate.navigate('PantallaExito');
            }
            clearPaypalState();
        } catch (error) {
            console.log(id);
            console.log("error raised in payment capture", error);
          
        }
    };
    const clearPaypalState = () => {
        setPaypalUrl(null);
        setAccessToken(null);
        setIsLoaded(false);
    };

    const handlePress = () => {
        setIsPressed(false);
        setContador(contador + 1);
        let Sound = require('react-native-sound');
        const sound = new Sound('coin.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.error('Error al cargar el sonido', error);
                return; 
            }
            sound.play(() => {
                sound.release();
            });
        });
        setTimeout(() => {
            setIsPressed(true);
        }, 50);
    };

    const handlePressB = () => {
        setContador(contador + 1);
        let Sound = require('react-native-sound');
        const sound = new Sound('coin.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.error('Error al cargar el sonido', error);
                return;
            }
            sound.play(() => {
                sound.release();
            });
        });
    };

    const handleRating = (value) => {
        setRating(value);
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
            User: "",
        };
        contexto.setUsuario(limpiarUsuario);
        try {
            await AsyncStorage.removeItem('email');
            await AsyncStorage.removeItem('password');
        } catch (error) {
            console.log(error);
        }
        navigate.navigate('Login');
    };

    useEffect(() => {
        fetch(`${Ruta}/delivery/user/${value}`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'token': contexto.usuario.Token,
                },
            })
            .then((response) => response.json())
            .then((json) => {
                setIdDelivery(json.Id);
                setCodigo(json.User);
            })
            .catch((error) => {
                console.error('pipipi');
            });
    }, []);

    return (
        <View style={styles.centrado}>
            <ImageBackground
                source={fondo}
                resizeMode="cover"
                style={styles.backgroundImageContainer}
            >
                <View style={styles.contenedorOpciones}>
                    <TouchableOpacity
                        onPress={() => { navigate.navigate("InicioCliente"); }}
                        style={[styles.textoOpciones, styles.flecha]}
                    >
                        <SvgFlecha />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { salir(); }}>
                        <Text style={styles.textoOpciones}>{ingles ? 'Exit' : 'Salir'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        setIngles(!ingles);
                        contexto.setUsuario({ ...contexto.usuario, English: !ingles });
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
                    style={styles.contenedorBoton}
                >
                    <ScrollView style={{ width: '90%' }}>
                        <Text style={styles.textoPregunta}>{ingles ? 'Did you like the provided service?' : '¿Cuánto quieres dar de propina?'}</Text>
                        <Text style={styles.textoNormal}>{ingles ? `Your ${codigo} supplier receives` : `Tu proveedor ${codigo} recibe`}</Text>
                        <TouchableOpacity
                            style={styles.buttonEspecial}
                            onPress={handlePress}
                        >
                            <Image
                                source={isPressed ? boton1 : boton3}
                                style={{ height: 200, width: 250, resizeMode: 'contain' }}
                            />
                        </TouchableOpacity>

                        <View style={styles.contenedorEstrellas}>
                            {
                                ['☆', '☆', '☆', '☆', '☆'].map((star, idx) => (
                                    <TouchableOpacity
                                        key={idx}
                                        onPress={() => handleRating(idx)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={rating >= idx ? styles.estrellaLlena : styles.estrellaVacia}>
                                            {rating >= idx ? '★' : star}
                                        </Text>
                                    </TouchableOpacity>
                                ))
                            }
                        </View>

                        <View style={styles.contenedorBotones}>
                            <TouchableOpacity onPress={() => {
                                if (contador > 0) {
                                    setContador(contador - 1);
                                }
                            }}>
                                <LinearGradient
                                    colors={['rgba(255,255,255,1)', 'rgba(222,222,222,1)', 'rgba(255,255,255,1)']}
                                    start={{ x: 0, y: 0.5 }}
                                    end={{ x: 1, y: 1.5 }}
                                    style={[styles.botonesInput]}
                                >
                                    <Text style={styles.buttonText}>-</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <View style={{ width: '28%', alignItems: 'center' }}>
                                <TextInput
                                    placeholder={contador.toString()}
                                    placeholderTextColor="#282828"
                                    style={styles.inputNumero}
                                    keyboardType="numeric"
                                    onChangeText={(value) => setContador(parseInt(value, 10) || contador)}
                                />
                                <Text style={{ fontSize: 18, marginTop: 15, color: '#282828' }}>dls</Text>
                            </View>
                            <TouchableOpacity onPress={handlePressB} style={[styles.botonesInput, styles.botonMas]}>
                                <Text style={[styles.buttonText, { color: '#fff' }]}>+</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            isdisabled={isLoaded}
                            onPress={onPressPaypal}
                            style={{ margin: 5, padding: 10, backgroundColor: 'rgb(212,46,46)', borderRadius: 8, width: '100%', marginTop: 60 }}
                        >
                            {
                                isLoaded
                                    ? <Loader />
                                    : <Text style={{ color: 'white', textAlign: 'center', fontSize: 22, fontFamily: defaultStyle.fontGeneral.fontFamily }}>{ingles ? 'Send Tip!' : '¡Enviar Propina!'}</Text>
                            }
                        </TouchableOpacity>
                        <TouchableOpacity   
                            onPress={() => { navigate.navigate('InicioCliente'); }}
                        >
                            <Text style={styles.textoCancelar}>{ingles ? 'Cancel' : 'Cancelar'}</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </LinearGradient>
            </ImageBackground>

            <Modal visible={!!paypalUrl} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <View style={{ paddingTop: 50, flex: 1 }}>
                    <TouchableOpacity onPress={clearPaypalState} style={{ margin: 24 }}>
                        <Text>Closed</Text>
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        <WebView source={{ uri: paypalUrl ?? "" }} onNavigationStateChange={onUrlChange} />
                    </View>
                    <TouchableOpacity onPress={clearPaypalState} style={styles.cerrarBotonContainer}>
                        <Text style={styles.cerrarBotonTexto}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    centrado: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textoCancelar: {
        color: 'red', 
        textAlign: 'center', 
        fontSize: 15, 
        fontFamily: defaultStyle.fontGeneral.fontFamily,
        textDecorationLine: 'underline', // Subrayado
    },
    
    backgroundImageContainer: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonEspecial: {
        width: '100%',
        height: 200,
        borderWidth: 0,
        marginTop: 10,
        alignItems: 'center',
    },
    botonesInput: {
        width: 80,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
    },
    buttonText: {
        color: '#282828',
        fontSize: 30,
        padding: 10,
    },
    botonMas: {
        backgroundColor: 'rgb(212,46,46)',
    },
    inputNumero: {
        borderWidth: 2,
        borderColor: '#282828',
        color: '#000',
        borderRadius: 25,
        width: '100%',
        textAlign: 'center',
        fontSize: 28,
        fontWeight: '800',
    },
    contenedorBotones: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        height: '8%',
    },
    contenedorEstrellas: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        marginTop: 15,
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
        width: '100%',
    },
    textoNormal: {
        fontSize: 20,
        color: '#001d38',
    },
    estrellaLlena: {
        color: '#ff9933',
        fontSize: 40,
    },
    estrellaVacia: {
        color: '#ff9933',
        fontSize: 40,
    },
    contenedorOpciones: {
        position: 'absolute',
        top: 0,
        flexDirection: 'row',
        gap: 20,
        justifyContent: 'flex-end',
        width: '100%',
        paddingRight: 20,
        paddingTop: 5,
    },
    textoOpciones: {
        color: 'rgb(212,46,46)',
        fontSize: 18,
        paddingHorizontal: 8,
        backgroundColor: "#fff",
        marginTop: 4,
        borderRadius: 4,
    },
    flecha: {
        position: 'absolute',
        left: 10,
        top: 10,
        paddingTop: 5,
    },
    cerrarBotonContainer: {
        padding: 10,
        backgroundColor: 'rgb(212,46,46)',
        borderRadius: 8,
        margin: 20,
        alignItems: 'center',
    },
    cerrarBotonTexto: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
