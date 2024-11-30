import React, { useContext, useEffect, useState } from 'react'
import { Dimensions, ImageBackground, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { AppContext } from '../Contexto/AppContext';
import { defaultStyle } from '../Theme/Theme';
import SvgFlecha from './SvgFlecha';
import { useNavigation } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import { Ruta } from '../Ruta/Ruta';
export const ResumenTransacciones = () => {
    const fondo: any = require("../../assets/Fondo-Tiptip-01.jpg");
    const contexto = useContext(AppContext);
    const [ingles, setIngles] = useState(contexto.usuario.English);
    useEffect(() => {
        setIngles(contexto.usuario.English);
    }, [contexto.usuario.English])
    const [data, setData] = useState<string[][]>();
    const [cellWidth, setCellWidth] = useState(0);
    const navigation = useNavigation();
    const isIOS = DeviceInfo.getSystemName() === 'iOS';
    const idiomaSpanol = {
        salir: 'Salir',
        saludo: "Hola administrador",
        pregunta: 'Revision de propinas',
        pago: 'Pagar'
    }
    const idiomaIngles = {
        salir: 'Exit',
        saludo: "Hello admistrator",
        pregunta: 'Tip review',
        pie: 'Pay'
    };
    useEffect(() => {
        //simular la obtencion de datos
        // fetch('https://bett-production.up.railway.app/api/csv/array', {
            fetch(`${Ruta}/csv/array`, {

            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'token': contexto.usuario.Token
            }
        }).then(res => { return res.json() })
            .then(datos => {
                if (datos) {

                    //agregamos el encabezado 
                    datos.unshift(['#','Provedor','Dinero sin comision','Comision TipTip','PayPal','Dinero Despues de paypal','Dinero a depositar','Banco','Tipo Cuenta','Numero Cuenta']);
                    //tenemos la informacion completa a mostrar
                    setData(datos);
                    //tenemos una division adecuada de las columnas
                    setCellWidth(Dimensions.get('window').width / 4)
                }
            })

    }, [])
    return (
        <View>

            <ImageBackground
                source={fondo}
                resizeMode='cover'
                style={styles.backgroundImageContainer}>
                <View style={[styles.contenedorOpciones, (isIOS ? { marginTop: 43 } : {})]}>
                    <TouchableOpacity
                        onPress={() => { navigation.goBack(); }}
                        style={[styles.textoOpciones, styles.flecha]}>
                        <SvgFlecha />
                    </TouchableOpacity>
                    <TouchableOpacity>
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
                <View style={styles.saludo}>
                    <Text style={styles.textoSaludo}>{ingles ? idiomaIngles.saludo : idiomaSpanol.saludo}</Text>
                </View>
                <LinearGradient
                    colors={['rgba(255,255,255,1)', 'rgba(222,222,222,1)', 'rgba(255,255,255,1)']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 1.5 }}
                    style={styles.containerInfo}>
                    <Text style={styles.textoPregunta}>{ingles ? idiomaIngles.pregunta : idiomaSpanol.pregunta}</Text>
                    <ScrollView horizontal={true} style={{ width: '100%' }}>
                        <ScrollView style={{ width: '100%' }}>
                        <View>
                            {
                                data?.map((row, index) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            if (index > 0) {
                                                navigation.navigate('DeatllesPropinaRepartidor', { id: row[0].toString() })
                                            }
                                        }}
                                        key={index} style={[{ flexDirection: 'row' }, index % 2 == 0 ? styles.filaPar : styles.filaImpar]}>
                                        {row.map((cell, cellIndex) => (
                                            <Text key={cellIndex} style={[{ width: cellWidth, padding: 10, borderWidth: 1, borderColor: '#ddd', textAlign: 'center', color: '#303030' }]}>
                                                {cell}
                                            </Text>
                                        ))}
                                    </TouchableOpacity>
                                ))}
                        </View>
                        </ScrollView>
                    </ScrollView>
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
    textoPregunta: {
        fontSize: 30,
        fontWeight: '800',
        color: '#001d38',
        textAlign: 'left',
        width: '100%',
        padding: 10
    },
    textoNormal: {
        fontSize: 20,
        color: '#001d38',
        width: '100%',
        textAlign: 'left',
        padding: 10
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
    filaPar: {
        backgroundColor: '#e8e8e8'
    },
    filaImpar: {
        backgroundColor: '#fff'
    }
})