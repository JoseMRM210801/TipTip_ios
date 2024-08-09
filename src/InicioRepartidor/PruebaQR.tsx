import React, { useContext, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import LinearGradient from "react-native-linear-gradient";
import SvgFlecha from '../Admin/SvgFlecha';
import { AppContext } from '../Contexto/AppContext';

export const PruebaQR = () => {
    const fondo = require("../../assets/Fondo-Tiptip-01.jpg");
    const [isPressed, setIsPressed] = useState(true);
    const [contador, setContador] = useState(1);
    const contexto = useContext(AppContext);
    const [ingles, setIngles] = useState(contexto.usuario.English);
    const [codigo, setCodigo] = useState("");
    const [idDelivery, setIdDelivery] = useState(0);
    const [mensaje, setMensaje] = useState("");
    const [codigoCorrecto, setCodigoCorrecto] = useState(false); // Nuevo estado para controlar el color
    const route = useRoute();
    const { value } = route.params;
    const navigate = useNavigation();

    useEffect(() => {
        setIngles(contexto.usuario.English);
    }, [contexto.usuario.English]);

    useEffect(() => {
        fetch(`https://bett-production.up.railway.app/api/delivery/user/${value}`, {
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

                // Validar si el código del usuario es correcto
                if (json.User === contexto.usuario.User) {
                    setCodigoCorrecto(true); // Si el código es correcto
                    setMensaje(ingles ? `User is correct: ${json.User}` : `El usuario es correcto: ${json.User}`);
                } else {
                    setCodigoCorrecto(false); // Si el código es incorrecto
                    setMensaje(ingles ? "Error, This is not your QR code" : "Error, Este no es tu código QR");
                }
            })
            .catch((error) => {
                console.error('Error fetching delivery data:', error);
            });
    }, [value, ingles]);

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
            setIsPressed(true);
        }, 100);
    };

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
                        onPress={() => { navigate.navigate('InicioRepartidor' as never) }}
                    >
                        <Text style={styles.textoOpciones}>{ingles ? "Exit" : "Salir"}</Text>
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
                    style={styles.contenedorBoton}>
                    <ScrollView style={{ width: '90%' }}>
                        <Text style={[styles.textoPregunta, { color: codigoCorrecto ? 'black' : 'red' }]}>
                            {mensaje}
                        </Text>
                        <Image style={styles.Logo}
                            source={require("../../assets/Logo-Tiptip-02.png")} />
                        <TouchableOpacity
                            style={styles.buttonEspecial}
                            onPress={handlePress}
                        >
                        </TouchableOpacity>
                    </ScrollView>
                </LinearGradient>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    centrado: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    Logo: {
        width: 150,
        height: 100,
        alignContent: "center",
        justifyContent: 'center',
        marginLeft: 75
    },
    backgroundImageContainer: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonEspecial: {
        width: '100%',
        height: 200,
        borderWidth: 0,
        marginTop: 10,
        alignItems: 'center'
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
        textAlign: 'center',
        padding: 30,
        width: '100%'
    },
    textoNormal: {
        fontSize: 20,
        color: '#001d38',
        textAlign: 'center',
        fontWeight: '600',
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
    textoOpciones: {
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
        top: 10,
        paddingTop: 5
    },
});
