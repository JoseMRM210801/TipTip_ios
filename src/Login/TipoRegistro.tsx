import React, { useState, useContext, useEffect } from 'react'
import { View, Image, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native'
import { defaultStyle } from '../Theme/Theme';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import { AppContext } from '../Contexto/AppContext';
import SvgFlecha from '../Admin/SvgFlecha';

export const TipoRegistro = () => {
    const fondo: any = require("../../assets/Fondo-Tiptip-01.jpg");
    const logo: any = require("../../assets/Logo-Tiptip-02.png");
    const navigate = useNavigation();
    const idiomaSpanol = {
        inicio: 'Registrate aquí en segundos',
        subtituloInicio: "Selecciona tu perfil",
        btncliente: 'Cliente',
        subcliente: 'Selecciona cliente si deseas agradecer a tus sevidores con un aporte volutario.',
        btnprovedor: 'Proveedor de servicio',
        subproveedor: 'Selecciona proveedor de servicio si prestas algún servicio de ayuda a tu comunidad'
    }
    const idiomaIngles = {
        inicio: 'Register here in seconds',
        subtituloInicio: "Select your profile",
        btncliente: 'Client',
        subcliente: 'Select client if you want to thank your servers with a voluntary contribution.',
        btnprovedor: 'Service provider',
        subproveedor: 'Select service provider if you provide some service to help your community'
    };
    const isIOS = DeviceInfo.getSystemName() === 'iOS';
    const contexto = useContext(AppContext);
    const [ingles, setIngles] = useState(contexto.usuario.English);
    useEffect(() => {
        setIngles(contexto.usuario.English);
    }, [contexto.usuario.English])
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
            <View style={{ height: '100%', width: '100%' }}>
                <Image source={fondo} alt="Fondo Tip tip" style={styles.backgroundImage} />
            </View>
            <View style={[styles.contenedorOpciones, (isIOS ? { marginTop: 43 } : {})]}>
                <TouchableOpacity
                    onPress={() => { navigate.goBack(); }}
                    style={[styles.textoOpcionesF, styles.flecha]}>
                    <SvgFlecha />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    setIngles(!ingles)
                    contexto.setUsuario({ ...contexto.usuario, English: !ingles })
                }}>
                    <Text style={styles.textoOpciones}>{ingles ? 'Es' : 'En'}</Text>
                </TouchableOpacity>
            </View>
            <LinearGradient
                colors={['rgba(255,255,255,1)', 'rgba(222,222,222,1)', 'rgba(255,255,255,1)']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.containerInfo}>
                <View>
                    <Image source={logo} alt="Logo Tip tip" style={styles.tipTip} />
                </View>
                <ScrollView style={{width: '90%', height: '100%'}}>
                    <Text style={styles.textHeader}>{ingles ? idiomaIngles.inicio : idiomaSpanol.inicio}</Text>

                    <View style={{ flexDirection: 'column', justifyContent: 'center', width: '100%', alignItems: 'center' }}>
                        <Text style={styles.textSelecciona}>{ingles ? idiomaIngles.subtituloInicio : idiomaSpanol.subtituloInicio}</Text>
                        <TouchableOpacity
                            onPress={() => { navigate.navigate('RegistroCliente' as never) }}
                            style={{ margin: 5, padding: 10, backgroundColor: 'rgb(212,46,46)', borderRadius: 8, width: '90%' }}>
                            <Text style={{ color: 'white', textAlign: 'center', fontSize: 22, fontFamily: defaultStyle.fontGeneral.fontFamily }}>{ingles ? idiomaIngles.btncliente : idiomaSpanol.btncliente}</Text>
                        </TouchableOpacity>
                        <Text style={styles.textBottom}>{ingles ? idiomaIngles.subcliente : idiomaSpanol.subcliente}</Text>
                        <TouchableOpacity
                            onPress={() => { navigate.navigate('RegistroProveedor' as never) }}
                            style={{ margin: 5, padding: 10, backgroundColor: '#df662e', borderRadius: 8, width: '90%', marginTop: 40 }}>
                            <Text style={{ color: 'white', textAlign: 'center', fontSize: 22, fontFamily: defaultStyle.fontGeneral.fontFamily }}>{ingles ? idiomaIngles.btnprovedor : idiomaSpanol.btnprovedor}</Text>
                        </TouchableOpacity>
                        <Text style={styles.textBottom}>{ingles ? idiomaIngles.subproveedor : idiomaSpanol.subproveedor}</Text>
                    </View>
                </ScrollView>
            </LinearGradient>
        </View>
    )
}
const styles = StyleSheet.create({
    backgroundImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },
    containerInfo: {
        alignItems: 'center',
        width: '100%',
        height: '85%',
        position: 'absolute',
        backgroundColor: '#fff',
        top: '30%',
        borderRadius: 25,
    },
    tipTip: {
        position: 'absolute',
        left: '-40%',
        bottom: '0%',
    },
    textHeader: {
        color: '#000',
        fontSize: 28,
        marginBottom: 20,
        marginTop: 20,
        fontFamily: defaultStyle.fontGeneral.fontFamilyBold,
        textAlign: 'center'
    },
    textSelecciona: {
        fontSize: 18,
        textAlign: 'left',
        width: '100%',
        color: '#001d38',
        paddingLeft: 20,
        marginBottom: 15
    },
    textBottom: {
        width: '100%',
        textAlign: 'left',
        fontSize: 14,
        color: '#282828',
        paddingTop: 12,
        paddingLeft: 20,
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
