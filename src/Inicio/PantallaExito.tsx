import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState, useEffect } from 'react'
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { defaultStyle } from '../Theme/Theme';
import SvgFlecha from '../Admin/SvgFlecha';
import { AppContext } from '../Contexto/AppContext';
export const PantallaExito = () => {
    const fondo: any = require("../../assets/Fondo-Tiptip-01.jpg");
    const contexto = useContext(AppContext);
    const navigate = useNavigation();
    const logo: any = require("../../assets/Logo-Tiptip-02.png");
    const [ingles, setIngles] = useState(contexto.usuario.English);
    useEffect(() => {
        setIngles(contexto.usuario.English);
    }, [contexto.usuario.English])
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
    const ruta = async () => {
        console.log(contexto.usuario.Role_Id)
        if (contexto.usuario.Role_Id == "1") {
            navigate.navigate('InicioCliente' as never);
        } else if (contexto.usuario.Role_Id == "2") {
            navigate.navigate('InicioRepartidor' as never);
        } else {
            navigate.navigate('InicioAdministrador' as never);
        }
    }
    return (
        <View>
            <ImageBackground
                source={fondo}
                resizeMode='cover'
                style={styles.backgroundImageContainer}>
                <TouchableOpacity
                    onPress={() => { navigate.goBack(); }}
                    style={[styles.textoOpcionesF, styles.flecha]}>
                    <SvgFlecha />
                </TouchableOpacity>
                <LinearGradient
                    colors={['rgba(255,255,255,1)', 'rgba(222,222,222,1)', 'rgba(255,255,255,1)']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 1.5 }}
                    style={styles.containerInfo}>
                    <View>
                        <Image source={logo} alt="Logo Tip tip" style={styles.tipTip} />
                    </View>
                    <Text style={styles.textoPregunta}>¡ENVIO EXITOSO!</Text>
                    <TouchableOpacity
                        onPress={() => { ruta() }}
                        style={{ margin: 5, padding: 10, backgroundColor: 'rgb(212,46,46)', borderRadius: 8, width: '80%', marginTop: 60 }}>
                        <Text style={{ color: 'white', textAlign: 'center', fontSize: 22, fontFamily: defaultStyle.fontGeneral.fontFamily }}>VOLVER</Text>
                    </TouchableOpacity>
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
    containerInfo: {
        alignItems: 'center',
        width: '90%',
        height: '55%',
        position: 'absolute',
        backgroundColor: '#fff',
        top: '40%',
        borderRadius: 25,
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
    tipTip: {
        position: 'absolute',
        left: '-40%',
        bottom: 0,
    },

})