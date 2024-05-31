import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState, useRef, useEffect } from 'react'
import { Modal, ImageBackground, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import QRCode from 'react-qr-code';
import { AppContext } from '../Contexto/AppContext';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import ViewShot, { captureRef } from 'react-native-view-shot';
import DeviceInfo from 'react-native-device-info';
import SvgFlecha from '../Admin/SvgFlecha';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logoImage from '../../assets/Logo-Tiptip-02.png';



export const PantallaQr = () => {
    const fondo = require("../../assets/Fondo-Tiptip-01.jpg");
    const contexto = useContext(AppContext);
    const [ingles, setIngles] = useState(contexto.usuario.English);
    useEffect(() => {
        setIngles(contexto.usuario.English);
    }, [contexto.usuario.English])
    const qrRef = useRef();
    const isIOS = DeviceInfo.getSystemName() === 'iOS';
    const navigate = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [rutaPDF, setRutaPDF] = useState('');
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
    let enemail = {
        id: contexto.usuario.Id,
        mail: contexto.usuario.Email,
        path: contexto.usuario.User
    }
    const PDF = async () => {
        try {
            const response = await fetch('https://bett-production.up.railway.app/api/qr/mail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'token': contexto.usuario.Token
                },
                body: JSON.stringify(enemail)
            });
            const responseJson = await response.json();
            return responseJson;
        } catch (error) {
            console.log(error);
        }
    }

    const captureScreenAndConvertToPDF = async () => {
        if (isIOS) {
            try {
                await PDF(); // Asumiendo que esta función maneja iOS
            } catch (error) {
                console.log(error);
            }
        } else {
            try {
                const uri = await captureRef(qrRef, { format: 'png', quality: 0.8 });
                const currentDate = new Date();
                const formattedDate = currentDate.toISOString().replace(/:/g, '-').replace(/\..+/, '');
                let options = {
                    html: `<img src="${uri}" style="width: 350px; height: 350px; margin: auto; display: block; margin-top: 150px"/><img src="${Image.resolveAssetSource(logoImage).uri}" style="width: 100px; height: 100px; display: block; margin: auto; object-fit: containr;"/>`,
                    fileName: `QRCode_${formattedDate}`,
                    directory: 'Documents',
                };
                const file = await RNHTMLtoPDF.convert(options);
                setRutaPDF(`Documents/Documents/QRCode_${formattedDate}.pdf`);
                setModalVisible(true);
    
            } catch (error) {
                console.log(error);
            }
        }
    };
    

    const idiomaSpanol = {
        salir: 'Salir',
        saludo: 'Hola ' + contexto.usuario.Name,
        propuesta: 'Puedes generar tu código QR y empezar a recibir propinas por tu esfuerzo.',
        boton: 'Genera QR',
        iconoCuenta: 'Mi cuenta',
        iconoDatos: "Editar datos",
        botonDos: 'Dar propina',
        ruta: 'Ruta de tu PDF:',
        info:"Favor de tomar captura de pantalla"

    }

    const idiomaIngles = {
        salir: 'Exit',
        saludo: 'Hello ' + contexto.usuario.Name,
        propuesta: 'You can generate your QR code and start receiving tips for your effort.',
        boton: 'Generate QR',
        iconoCuenta: 'My account',
        iconoDatos: 'Edit data',
        botonDos: 'Give tip',
        ruta: 'Location of the PDF:',
        info:"Please take a screenshot"
    };

    return (
        <View style={styles.container}>
            <ImageBackground source={fondo} resizeMode='cover' style={styles.backgroundImageContainer}>
                <View style={[styles.contenedorOpciones, (isIOS ? { marginTop: 43 } : {})]}>
                    <TouchableOpacity
                        onPress={() => { navigate.goBack(); }}
                        style={[styles.textoOpcionesF, styles.flecha]}>
                        <SvgFlecha />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { salir() }}>
                        <Text style={styles.textoOpciones}>{ingles ? idiomaIngles.salir : idiomaSpanol.salir}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        setIngles(!ingles)
                        contexto.setUsuario({ ...contexto.usuario, English: !ingles })
                    }}>
                        <Text style={styles.textoOpciones}>{ingles ? 'Es' : 'En'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity >
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
                    <ViewShot>
                        <QRCode ref={qrRef}
                            size={256}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            value={contexto.usuario.User.toString()}
                            marginTop={20}
                        />
                     
                     </ViewShot>
                     <Image style={styles.Logo}
                        source={require("../../assets/Logo-Tiptip-02.png")}/>
                         <Text style={styles.texto}>{contexto.usuario.User.toString()}</Text>
                    {
                        !isIOS &&
                        <TouchableOpacity style={styles.downloadButton} onPress={captureScreenAndConvertToPDF}>
                            <Text style={styles.downloadButtonText}>{ingles ? idiomaIngles.boton : idiomaSpanol.boton}</Text>
                        </TouchableOpacity>

                    }
                     {
                        isIOS &&
                        <Text style={styles.logo}>{ingles ? idiomaIngles.info : idiomaSpanol.info}</Text>
                    }


                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}>

                        <View style={styles.modalContainer}>
                            <Text style={styles.modalText}>{ingles ? idiomaIngles.ruta : idiomaSpanol.ruta}{rutaPDF}</Text>
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
                </LinearGradient>
            </ImageBackground>

        </View>

    );
}

const styles = StyleSheet.create({
    downloadButton: {
        marginTop: 110,
        backgroundColor: 'rgb(212,46,46)',
        padding: 10,
        borderRadius: 5,
    },
    texto:{
        color:"#000000",
        fontSize:18
    },
    Logo:{
        width:100,
        height:50,
        alignContent:"center",
        justifyContent: 'center',
        position: 'relative',
        flexDirection:"column"
    },
    downloadButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        position: 'relative',
        alignItems: 'center'
    },
    backgroundImageContainer: {
        height: '100%',
        width: '100%',
        alignItems: 'center'
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
        top: '22%',
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
    textoOpcionesF: {
        color: 'rgb(212,46,46)',
        fontSize: 18,
        paddingHorizontal: 8,
        backgroundColor: "#fff",
        marginTop: 4,
        borderRadius: 4
    },
    modalContainer: {
        position: 'absolute',
        top: '40%',
        alignSelf: 'center',
        backgroundColor: '#fff',
        width: '80%',
        height: '20%',
        borderRadius: 20,
        padding: 20
    },
    modalText: {
        fontSize: 20,
        textAlign: 'center',
        color: '#000'
    },
    modalButton: {
        backgroundColor: '#000',
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
});
