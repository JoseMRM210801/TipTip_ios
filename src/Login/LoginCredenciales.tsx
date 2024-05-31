import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { useContext, useState, useEffect } from 'react'
import { Image, ImageBackground, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { loginSchemaValidation, loginSchemaValidationEn } from '../modules/loginCredenciales';
import { defaultStyle } from '../Theme/Theme';
import { AppContext } from '../Contexto/AppContext';
import { Usuario } from '../Modelos/Usuario';
import DeviceInfo from 'react-native-device-info';
import SvgFlecha from '../Admin/SvgFlecha';
import { Loader } from '../Loader/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LoginCredenciales = () => {
    const fondo: any = require("../../assets/Fondo-Tiptip-01.jpg");
    const logo: any = require("../../assets/Logo-Tiptip-02.png");
    const navigate = useNavigation();
    const [focus, setFocus] = useState("");
    const isIOS = DeviceInfo.getSystemName() === 'iOS';
    const contexto = useContext(AppContext);
    const [isLoad, setIsLoad] = useState(false);
    const refEmail = React.useRef(null);
    const refContrasenia = React.useRef(null);
    const [error, setError] = useState(false);
    const [ingles, setIngles] = useState(contexto.usuario.English);
    const [modalVisible2, setModalVisible2] = useState(false);
    useEffect(() => {
        setIngles(contexto.usuario.English);
    }, [contexto.usuario.English])
    const [modalVisible, setModalVisible] = useState(false);

    const guardarLogin = async (email: string, password: string) => {
        try {
            await AsyncStorage.setItem('email', email);
            await AsyncStorage.setItem('password', password);

        } catch (error) {
            console.log(error);
        }

    }
    const handleFocus = (nombreInput: string) => {
        setFocus(nombreInput);
    }
    const Login = async (correo: string, pass: string) => {
        setIsLoad(true);
        let login: Usuario = {
            Id: "",
            City: "",
            Email: correo,
            Insignia: "",
            Is_Verified: false,
            LastName: "",
            Name: "",
            Password: pass,
            Role_Id: "",
            State: "",
            Token: "",
            User: "",
            Bank: "",
            Account: "",
            AccNumber: "",
        }

        //fetch('http://192.168.1.72:8090/api/login', {
        fetch('https://bett-production.up.railway.app/api/login', {
            // fetch('http://10.0.2.2:8090/api/login', {
            //fetch('http://127.0.0.1:8090/api/login', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(login)
        })
            .then(res => {
                return res.json()
            })
            .then(data => {
                console.log(data)
                if (data == null) {
                    setError(true);
                    setIsLoad(false);
                    // Cambiar el borde a uno rojo
                    (refEmail?.current as any)?.setNativeProps({ style: { borderColor: 'red' } });
                    (refContrasenia?.current as any)?.setNativeProps({ style: { borderColor: 'red' } });
                    return;
                }
                if (data.error == 'El correo electrónico no ha sido verificado en Firebase.') {
                    setModalVisible2(true);
                    setIsLoad(false);
                    return;
                }
                if (data.Role_Id != null) {
                    setIsLoad(true);
                    console.log(data)
                    contexto.setUsuario(data);
                    guardarLogin(correo, pass);
                    if (data.Role_Id == "1") {
                        navigate.navigate("InicioCliente" as never);
                    } else if (data.Role_Id == "2") {
                        navigate.navigate("InicioRepartidor" as never);
                    } else if (data.Role_Id == "3") {
                        navigate.navigate("InicioAdministrador" as never);
                    }
                }
                else {

                    setError(true);
                    setIsLoad(false);
                    // Cambiar el borde a uno rojo
                    (refEmail?.current as any)?.setNativeProps({ style: { borderColor: 'red' } });
                    (refContrasenia?.current as any)?.setNativeProps({ style: { borderColor: 'red' } });
                }
            }).catch((err) => {
                console.log(err)
                setIsLoad(false);
                setModalVisible2(true);
            })
    }

    const idiomaSpanol = {
        email: 'Correo',
        contrasenia: "Contraseña",
        error: 'Correo o contraseña incorrectos',
        btn: 'Inicio de sesión',
        modal: 'La contraseña o el correo no coinciden',
        modal2: 'Por favor autentica tu correo, revisa tu bandeja de entrada o spam',
        olvidoContrasena: '¿Olvidaste tu contraseña?'
    }

    const idiomaIngles = {
        email: 'Email',
        contrasenia: "Password",
        error: 'Email or password incorrect',
        btn: 'Login',
        modal: 'The password or email are incorrect',
        modal2: 'Please authenticate your email, check your inbox or spam',
        olvidoContrasena: 'Forgot your password?'
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={fondo}
                resizeMode='cover'
                style={styles.backgroundImageContainer}>
                <View>
                    <Image source={logo} alt="Logo Tip tip" style={{ alignSelf: 'center', marginTop: 40 }} />
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
                    end={{ x: 1, y: 1.5 }}
                    style={styles.containerInfo}>
                    <Formik
                        initialValues={{
                            email: '',
                            contrasenia: ''
                        }}
                        validationSchema={ingles ? loginSchemaValidationEn : loginSchemaValidation}
                        onSubmit={(values) => {
                            Login(values.email, values.contrasenia);
                            guardarLogin(values.email, values.contrasenia);
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                            <ScrollView style={styles.ScrollView}>
                                <TextInput
                                    style={[styles.input, focus === 'input1' && styles.textInputFocused]}
                                    onFocus={() => { handleFocus('input1') }}
                                    placeholder={ingles ? idiomaIngles.email : idiomaSpanol.email}
                                    placeholderTextColor="#282828"
                                    onChangeText={handleChange('email')
                                    }
                                    onBlur={handleBlur('nombre')}
                                    value={values.email}
                                    keyboardType="email-address"
                                    ref={refEmail}
                                />
                                {errors.email && touched.email && <Text style={{ color: 'red' }}>{errors.email}</Text>}
                                <TextInput
                                    style={[styles.input, focus === 'input2' && styles.textInputFocused]}
                                    onFocus={() => { handleFocus('input2') }}
                                    placeholder={ingles ? idiomaIngles.contrasenia : idiomaSpanol.contrasenia}
                                    placeholderTextColor="#282828"
                                    onChangeText={handleChange('contrasenia')}
                                    onBlur={handleBlur('contrasenia')}
                                    value={values.contrasenia}
                                    keyboardType="default"
                                    secureTextEntry
                                    ref={refContrasenia}
                                />
                                {errors.contrasenia && touched.contrasenia && <Text style={{ color: 'red' }}>{errors.contrasenia}</Text>}
                                {
                                    error && <Text style={{ color: 'red' }}>{ingles ? idiomaIngles.error : idiomaSpanol.error}</Text>
                                }
                                <TouchableOpacity
                                    style={{ padding: 10, backgroundColor: 'rgb(212,46,46)', borderRadius: 8, width: '90%', marginTop: 12, alignSelf: 'center' }}
                                    onPress={() => { handleSubmit() }}
                                    disabled={isLoad}
                                >
                                    {
                                        isLoad ?
                                            <Loader />
                                            :
                                            <Text style={{ color: 'white', textAlign: 'center', fontSize: 22, fontFamily: defaultStyle.fontGeneral.fontFamily }}>{ingles ? idiomaIngles.btn : idiomaSpanol.btn}</Text>
                                    }
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { navigate.navigate('ResetPassword' as never); }} style={{ alignSelf: 'center', marginTop: 20 }}>
                                    <Text style={{ color: '#000000', fontSize: 18 }}>{ingles ? idiomaIngles.olvidoContrasena : idiomaSpanol.olvidoContrasena}</Text>
                                </TouchableOpacity>
                            </ScrollView>

                        )}
                    </Formik>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}>

                        <View style={styles.modalContainer}>
                            <Text style={styles.modalText}>{ingles ? idiomaIngles.modal : idiomaSpanol.modal}</Text>
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
                        visible={modalVisible2}
                        onRequestClose={() => {
                            setModalVisible2(!modalVisible2);
                        }}>

                        <View style={styles.modalContainer}>
                            <Text style={styles.modalText}>{ingles ? idiomaIngles.modal2 : idiomaSpanol.modal2}</Text>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => {
                                    setModalVisible2(!modalVisible2);
                                }}
                            >
                                <Text style={styles.modalButtonText}>Okay</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </LinearGradient>
            </ImageBackground>

        </View >
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        position: 'relative',
        alignItems: 'center'
    },
    contenedorOpciones: {
        position: 'absolute',
        top: 0,
        flexDirection: 'row',
        gap: 20,
        justifyContent: 'flex-end',
        width: '100%',
        paddingRight: 20
    },
    textoOpciones: {
        color: 'rgb(212,46,46)',
        fontSize: 18,
        paddingHorizontal: 8,
        backgroundColor: "#fff",
        marginTop: 4,
        borderRadius: 4
    },
    textoOpcionesF: {
        color: 'rgb(212,46,46)',
        fontSize: 18,
        paddingHorizontal: 8,
        backgroundColor: "#fff",
        marginTop: 4,
        borderRadius: 4
    },
    backgroundImageContainer: {
        height: '100%',
        width: '100%',
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    flecha: {
        position: 'absolute',
        left: 10
    },
    containerInfo: {
        position: 'absolute',
        top: '30%',
        width: '90%',
        height: '40%',
        backgroundColor: '#fff',
        minHeight: 320,
        borderRadius: 25,
        borderColor: '#ebebeb',
        borderWidth: 1,
        alignSelf: 'center'
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
    textoCliente: {
        width: '100%',
        paddingLeft: 30,
        color: '#001d38',
        fontSize: 24,
        fontWeight: '800'
    },
    textoPregunta: {
        fontSize: 22,
        fontWeight: '800',
        color: '#001d38',
        textAlign: 'center',
        padding: 30
    },
    textoNormal: {
        fontSize: 18,
        color: '#001d38',
        width: '90%'
    },
    contendorIconos: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%'
    },
    input: {
        fontSize: 15,
        borderRadius: 21,
        fontWeight: '400',
        color: '#212529',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#dee2e6',
        width: '100%',
        marginBottom: 12,
        padding: 10
    },
    textInputFocused: {
        borderColor: '#C8E2FD',
        borderWidth: 4,
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    ScrollView: {
        width: '90%',
        height: '100%',
        alignSelf: 'center',
        padding: 15,
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
    },
    olvidoContrasena: {
        textAlign: 'center',
        marginTop: 15,
        color: 'white'
    }
});
