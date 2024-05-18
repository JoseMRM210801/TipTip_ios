import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react'
import { BackHandler, Modal, PermissionsAndroid, ScrollView } from 'react-native';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { defaultStyle } from '../Theme/Theme';
import { Usuario } from '../Modelos/Usuario';
import { AppContext } from '../Contexto/AppContext';
import { writeFile, readFile, DownloadDirectoryPath } from "react-native-fs";
import XLSX from "xlsx";
import DeviceInfo from 'react-native-device-info';
import { Loader } from '../Loader/Loader';
import { checkMultiple, PERMISSIONS, request, requestMultiple } from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-native-date-picker'
export const AccionesAdmin = () => {
    const fondo: any = require("../../assets/Fondo-Tiptip-01.jpg");
    const navigate = useNavigation();
    const contexto = useContext(AppContext);
    const [ingles, setIngles] = useState(contexto.usuario.English);
    useEffect(() => {
        setIngles(contexto.usuario.English);
    }, [contexto.usuario.English])
    const isIOS = DeviceInfo.getSystemName() === 'iOS';
    const [isLoaded, setIsLoaded] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [rutaArchivo, setRutaArchivo] = useState('');
    const [permisos, setPermisos] = useState(false);
    const [modalFecha, setModalFecha] = useState(false);
    const [modalRestaurar, setModalRestaurar] = useState(false);
    const [date, setDate] = useState(new Date())
    const [date2, setDate2] = useState(new Date())
    const [showDate1, setShowDate1] = useState(false)
    const [showDate2, setShowDate2] = useState(false)
    let enemail = {
        Email: contexto.usuario.Email
    }
    const infoCVSI = async () => {
        try {
            // const response = await fetch('https://bett-production.up.railway.app/api/csv/mail', {
            const response = await fetch('https://bett-production.up.railway.app/api/csv/mail', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'token': contexto.usuario.Token
                },
                body: JSON.stringify(enemail)
            });
            const responseJson = await response.json();
            setModalVisible(true);
            return responseJson;
        } catch (error) {
            console.log(error);
        }
    }

    const infoCVS = async () => {
        try {
            console.log(1)
            // const response = await fetch('https://bett-production.up.railway.app/api/csv', {
            const response = await fetch('https://bett-production.up.railway.app/api/csv', {

                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'token': contexto.usuario.Token
                }
            });
            const responseJson = await response.json();
            console.log(responseJson)
            return responseJson;
        } catch (error) {
            console.log(error);
        }
    }
    const exportCSV = async () => {
        try {
            console.log(10)
            const info: any = await infoCVS();
            // console.log(info);
            let wb = XLSX.utils.book_new();
            let ws = XLSX.utils.json_to_sheet(info);
            XLSX.utils.book_append_sheet(wb, ws, "Usuarios");

            // Obtener la fecha actual y formatearla
            const fechaActual = new Date();
            const formatoFecha = fechaActual.toISOString().slice(0, 10);

            // Agregar la fecha actual al nombre del archivo
            const nombreArchivo = `U_${formatoFecha}.csv`;

            const wbout = XLSX.write(wb, { type: "binary", bookType: "csv" });

            writeFile(
                DownloadDirectoryPath + `/${nombreArchivo}`,
                wbout,
                "ascii"
            ).then((res) => {
                console.log(res)
                setIsLoaded(false);
                setModalVisible(true);
                setRutaArchivo(DownloadDirectoryPath + `/${nombreArchivo}`);
            });
        } catch (error) {
            console.log('hubo un error en el cvs');
        }
    };

    const handleClick = async () => {
        infoCVSI();
    };
    const idiomaSpanol = {
        salir: 'Salir',
        saludo: 'Hola servidor',
        titulo: 'Administrador',
        subtitulo: 'Seleciona una opción',
        btnCliente: 'Cliente',
        textoInferiorCliente: 'Revisión de propinas.',
        btnProveedor: 'Proveedor',
        textoInferiorProveedor: 'Ver los datos de todas las transacciones.',
        btnEliminar: 'Elimnar usuarios',
        btnCSV: 'Genera el CSV',
        textoInferiorEliminar: 'Para eliminar usuarios debes estar seguros, puesto que esta acción no se puede revertir.'
    }
    const idiomaIngles = {
        salir: 'Exit',
        saludo: 'Hello server',
        titulo: 'Administrator',
        subtitulo: 'Select an option',
        btnCliente: 'Client',
        textoInferiorCliente: 'Tip review.',
        btnProveedor: 'Supplier',
        textoInferiorProveedor: 'View all transaction data.',
        btnEliminar: 'Delete users',
        btnCSV: 'Generates the csv to review the transactions',
        textoInferiorEliminar: 'To delete users you must be sure, as this action cannot be reversed.'
    };

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                // Tu lógica aquí
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            checkMultiple([PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]).then((statuses) => {
                if (statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] === 'granted') {
                    setPermisos(true);
                } else {
                    requestMultiple([PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE]).then((statuses) => {
                        if (statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] === 'granted') {
                            setPermisos(true);
                        }
                    })
                }
            });

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [permisos])
    );
    const salir = async () => {
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
    const cambiarEstatusPago = async () => {
        setShowDate1(false);
        setShowDate2(false);

        if (date !== null) {
            const fechaFormateada1 = date.toISOString().split('T')[0];
            const fechaFormateada2 = date2.toISOString().split('T')[0];

            try {
                const respuesta = await fetch('https://bett-production.up.railway.app/api/tip/restore', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'token': contexto.usuario.Token
                    },
                    body: JSON.stringify({
                        date1: fechaFormateada1,
                        date2: fechaFormateada2
                    })
                });

                if (respuesta.ok) {
                    const respuestaJson = await respuesta.json();
                    console.log(respuestaJson);
                    setModalRestaurar(true);
                } else {
                    console.log(`Error en la solicitud: ${respuesta.status}`);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        }
    };

    return (
        <View>
            <ImageBackground
                source={fondo}
                resizeMode='cover'
                style={styles.backgroundImageContainer}>
                <View style={[styles.contenedorOpciones, (isIOS ? { marginTop: 43 } : {})]}>
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
                    style={styles.containerInfo}>
                    <ScrollView style={{ width: '100%', height: '100%' }} contentContainerStyle={{ alignItems: 'center' }}>
                        <Text style={styles.textoPregunta}>{ingles ? idiomaIngles.titulo : idiomaSpanol.titulo}</Text>
                        <Text style={styles.textoNormal}>{ingles ? idiomaIngles.subtitulo : idiomaSpanol.subtitulo}</Text>
                        <TouchableOpacity
                            onPress={() => { navigate.navigate('RevisionPropinasAdmin' as never) }}
                            style={{ padding: 10, backgroundColor: 'rgb(212,46,46)', borderRadius: 8, width: '90%', marginTop: 12 }}>
                            <Text style={{ color: 'white', textAlign: 'center', fontSize: 22, fontFamily: defaultStyle.fontGeneral.fontFamily }}>
                                {ingles ? idiomaIngles.btnCliente : idiomaSpanol.btnCliente}
                            </Text>
                        </TouchableOpacity>
                        <Text style={styles.textoInferior}>{ingles ? idiomaIngles.textoInferiorCliente : idiomaSpanol.textoInferiorCliente}</Text>

                        <TouchableOpacity
                            onPress={() => { navigate.navigate('ResumenTransaccionesAdmin' as never) }}
                            style={{ padding: 10, backgroundColor: '#df662e', borderRadius: 8, width: '90%', marginTop: 12 }}>
                            <Text style={{ color: 'white', textAlign: 'center', fontSize: 22, fontFamily: defaultStyle.fontGeneral.fontFamily }}>
                                {ingles ? idiomaIngles.btnProveedor : idiomaSpanol.btnProveedor}
                            </Text>
                        </TouchableOpacity>
                        <Text style={styles.textoInferior}>{ingles ? idiomaIngles.textoInferiorProveedor : idiomaSpanol.textoInferiorProveedor}</Text>

                        <TouchableOpacity
                            disabled={isLoaded}
                            onPress={() => handleClick()}
                            style={{ padding: 10, backgroundColor: '#df662e', borderRadius: 8, width: '90%', marginTop: 12 }}>
                            {
                                isLoaded
                                    ?
                                    <Loader />
                                    :
                                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 22, fontFamily: defaultStyle.fontGeneral.fontFamily }}>
                                        {ingles ? idiomaIngles.btnCSV : idiomaSpanol.btnCSV}

                                    </Text>
                            }
                        </TouchableOpacity>
                        <Text style={styles.textoInferior}>{ingles ? idiomaIngles.textoInferiorProveedor : idiomaSpanol.textoInferiorProveedor}</Text>

                        <TouchableOpacity

                            style={{ padding: 10, backgroundColor: '#e8e8e8e', borderRadius: 8, width: '90%', marginTop: 12, borderWidth: 1, borderColor: '#212121' }}>
                            <Text style={{ color: '#303030', textAlign: 'center', fontSize: 22, fontFamily: defaultStyle.fontGeneral.fontFamily }}>
                                {ingles ? idiomaIngles.btnEliminar : idiomaSpanol.btnEliminar}
                            </Text>
                        </TouchableOpacity>
                        <Text style={styles.textoInferior}>{ingles ? idiomaIngles.textoInferiorEliminar : idiomaSpanol.textoInferiorEliminar}</Text>


                        <TouchableOpacity
                            onPress={() => { setModalFecha(!modalFecha) }}
                            style={{ padding: 10, backgroundColor: 'rgb(212,46,46)', borderRadius: 8, width: '90%', marginTop: 12 }}>
                            <Text style={{ color: 'white', textAlign: 'center', fontSize: 22, fontFamily: defaultStyle.fontGeneral.fontFamily }}>
                                RESTAURAR FECHAS DE CORTE
                            </Text>
                        </TouchableOpacity>

                    </ScrollView>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalFecha}
                        onRequestClose={() => {
                            setModalFecha(!modalFecha);
                        }}>

                        <View style={styles.modalContainer}>
                            <Text style={styles.modalText}>Restaura las fechas de pago</Text>
                            <TouchableOpacity
                                onPress={() => { setShowDate1(true) }}
                                style={{ padding: 10, backgroundColor: 'rgb(212,46,46)', borderRadius: 8, width: '90%', marginTop: 12 }}>
                                <Text style={{ color: 'white', textAlign: 'center', fontSize: 22, fontFamily: defaultStyle.fontGeneral.fontFamily }}>
                                    Fecha inicio
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => { setShowDate2(true) }}
                                style={{ padding: 10, backgroundColor: 'rgb(212,46,46)', borderRadius: 8, width: '90%', marginTop: 12 }}>
                                <Text style={{ color: 'white', textAlign: 'center', fontSize: 22, fontFamily: defaultStyle.fontGeneral.fontFamily }}>
                                    Fecha Fin
                                </Text>
                            </TouchableOpacity>
                            <DatePicker
                                modal
                                open={showDate1}
                                date={date}
                                onConfirm={(date) => {
                                    setShowDate1(false)
                                    setDate(date)
                                }}
                                onCancel={() => setShowDate1(false)}

                            />
                            <DatePicker
                                modal
                                open={showDate2}
                                date={date2}
                                onConfirm={(date) => {
                                    setShowDate2(false)
                                    setDate2(date)
                                }}
                                onCancel={() => setShowDate2(false)}

                            />

                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => {
                                    setModalFecha(!modalFecha);
                                    cambiarEstatusPago();
                                }}
                            >
                                <Text style={styles.modalButtonText}>Okay</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => {
                                    setModalFecha(!modalFecha);
                                }}
                            >
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>


                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}>

                        <View style={styles.modalContainer}>
                            <Text style={styles.modalText}>Se ha enviado el archivo a tu correo</Text>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                }}
                            >
                                <Text style={styles.modalButtonText}>Okay</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalRestaurar}
                        onRequestClose={() => {
                            setModalRestaurar(!modalRestaurar);
                        }}>

                        <View style={styles.modalContainer}>
                            <Text style={styles.modalText}>Restauración exitosa</Text>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => {
                                    setModalRestaurar(!modalRestaurar);
                                }}
                            >
                                <Text style={styles.modalButtonText}>Okay</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>

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
        top: '10%',
        alignItems: 'center',
        width: '90%',
        height: '90%',
        backgroundColor: '#fff',
        minHeight: 320,
        borderRadius: 25,
        borderColor: '#ebebeb',
        borderWidth: 1,
        justifyContent: 'center',
    },
    textoPregunta: {
        fontSize: 30,
        fontWeight: '800',
        color: '#001d38',
        textAlign: 'center',
        width: '100%',
        padding: 0,
        marginTop: 10
    },
    textoNormal: {
        fontSize: 20,
        color: '#001d38',
        width: '100%',
        textAlign: 'left',
        padding: 5
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
    textoInferior: {
        fontSize: 16,
        color: '#001d38',
        width: '100%',
        textAlign: 'left',
        padding: 5
    },
    modalContainer: {
        position: 'absolute',
        top: '40%',
        alignSelf: 'center',
        backgroundColor: '#fff',
        width: '80%',
        height: '40%',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 20,
        textAlign: 'center',
        color: '#000'
    },
    modalButton: {
        backgroundColor: '#212121',
        width: '50%',
        alignSelf: 'center',
        marginTop: 20,
        padding: 10,
        borderRadius: 20
    },
    modalButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18
    }
})