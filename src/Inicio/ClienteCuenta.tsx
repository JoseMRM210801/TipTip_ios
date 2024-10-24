import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react'
import { Dimensions, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import DeviceInfo from 'react-native-device-info';
import { AppContext } from '../Contexto/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ruta } from '../Ruta/Ruta';
import SvgFlecha from '../Admin/SvgFlecha';
export const ClienteCuenta = () => {
    const fondo: any = require("../../assets/Fondo-Tiptip-01.jpg");
    const navigate = useNavigation();
    const contexto = useContext(AppContext);
    const [ingles, setIngles] = useState(contexto.usuario.English);
    useEffect(() => {
        setIngles(contexto.usuario.English);
    }, [contexto.usuario.English])
    const isIOS = DeviceInfo.getSystemName() === 'iOS';
    const [data, setData] = useState();
    const [cellWidth, setCellWidth] = useState(0);
    const idiomaSpanol = {
        salir: 'Salir',
        saludo: "Hola Cliente",
        subtitulo: 'Movimientos',

        pregunta: '¿Te ha gustado el servicio prestado?',
        propuesta: '¿Quieres dar 1 dls?',
        pie: 'Escanea el QR del proveedor'
    }
    const idiomaIngles = {
        salir: 'Exit',
        saludo: "Hello client",
        subtitulo: 'Movements',
        pregunta: 'Did you like the provided service?',
        propuesta: 'Do you want to give $1?',
        pie: 'Scan the provider\'s QR code'
    };
    useEffect(() => {
        fetch(`${Ruta}/tip/client/${contexto.usuario.Id}`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'token': contexto.usuario.Token
          }
        })
        .then(res => res.json())
        .then(datos => {
          if (datos) {
            const headers = ingles ? ['#', 'Client', '$', 'Date'] : ['#', 'Cliente', '$', 'Fecha'];
            datos.unshift(headers); // Agrega el encabezado adecuado al principio de los datos
            setData(datos);
            setCellWidth(Dimensions.get('window').width / 4); // Ajusta el ancho de las celdas
          }
        });
      }, [ingles, contexto.usuario.Id, contexto.usuario.Token]); // Agrega 'ingles' al array de dependencias
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
        navigate.navigate('Login' as never);
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
                        onPress={() => { salir() }}>
                        <Text style={styles.textoOpciones}>{ingles ? idiomaIngles.salir : idiomaSpanol.salir}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        setIngles(!ingles)
                        contexto.setUsuario({ ...contexto.usuario, English: !ingles })
                    }
                    }>
                        <Text style={styles.textoOpciones}>{ingles ? 'Es' : 'En'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> {navigate.navigate("TerminosyCondiciones" as never)}}>
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

                    <Text style={styles.textoPregunta}>{ingles ? idiomaIngles.subtitulo : idiomaSpanol.subtitulo}</Text>

                    <ScrollView horizontal={true} style={{ width: '100%' }}>
                        <ScrollView style={{ width: '100%' }}>
                        <View>
                            {
                                data?.map((row: any[], index: number) => (
                                    <View key={index} style={[{ flexDirection: 'row' }, index % 2 == 0 ? styles.filaPar : styles.filaImpar]}>
                                        {row.map((cell: any, cellIndex: any) => (
                                            <Text key={cellIndex} style={[{ width: cellWidth, padding: 10, borderWidth: 1, borderColor: '#ddd', textAlign: 'center', color: '#282828' }]}>
                                                {cell}
                                            </Text>
                                        ))}
                                    </View>
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
    contenedorRenglon: {
        width: '85%',
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 8,
        alignSelf: 'center',
        flex: 1,
        justifyContent: 'space-around',
        flexDirection: 'row',
        alignItems: 'center'
    },
    paraContenedor: {
        flexDirection: 'column',
    },
    textoRenglon: {
        color: '#303030',
        fontSize: 20,

    },
    filaPar: {
        backgroundColor: '#e8e8e8'
    },
    filaImpar: {
        backgroundColor: '#fff'
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
