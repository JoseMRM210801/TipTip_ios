import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { useContext, useState, useEffect } from 'react'
import { Image, ImageBackground, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { resetPasswordSchemaValidation, resetPasswordSchemaValidationEn } from '../modules/loginCredenciales';
import { defaultStyle } from '../Theme/Theme';
import { AppContext } from '../Contexto/AppContext';
import RNPickerSelect from 'react-native-picker-select';
import DeviceInfo from 'react-native-device-info';
import SvgFlecha from '../Admin/SvgFlecha';
import { Loader } from '../Loader/Loader';
import { CustomSelect } from '../modules/personalizedComponent.tsx'


export const ResetPassword = () => {
    const fondo: any = require("../../assets/Fondo-Tiptip-01.jpg");
    const logo: any = require("../../assets/Logo-Tiptip-02.png");
    const ojo: any = require("../../assets/ojo.png");
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
    const [selectedValue, setSelectedValue] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [repeatPassword, setRepeatPassword] = useState('');
    
    useEffect(() => {
        setIngles(contexto.usuario.English);
    }, [contexto.usuario.English])


    const handleFocus = (nombreInput: string) => {
        setFocus(nombreInput);
    }

    const resetearContrasenia = async (email: string, userType: string, password: string) => {
        setIsLoad(true);
        console.log("entro")
        var usuario = {};
        if (userType === '1') {
            //creamos un objeto con los datos del usuario
            usuario = {
                email: email,
                password: password,
                userType: 'client'
            }
            console.log(usuario)
        } else {
            //creamos un objeto con los datos del repartidor
            usuario = {
                email: email,
                password: password,
                userType: 'delivery'
            }
        }
        const response = await fetch('https://bett-production.up.railway.app/api/reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuario)
        });
        const data = await response.json();
        if (data) {
            setModalVisible2(true);
        } else {
            setError(true);
        }
        setIsLoad(false);
    }

    const idiomaSpanol = {
        email: 'Correo',
        contrasenia: "Contraseña nueva",
        error: 'Algo salio mal, revisa tus datos o intenta mas tarde',
        btn: 'Reestablecer contraseña',
        modal2: 'Por favor revisa tu correo, revisa tu bandeja de entrada o spam, ahi confirmaras tu contraseña nueva, procura de que se igual a la que ingresaste en el registro',
        cuenta: '¿Cuenta de usuario o repartidor?',
        usuario: 'Usuario',
        deliver: 'Repartidor',
        placeholder: 'Selecciona una cuenta'
    }

    const idiomaIngles = {
        email: 'Email',
        contrasenia: "New Password",
        error: 'Something went wrong, check your data or try again later',
        btn: 'Reset password',
        modal2: 'Please check your email, check your inbox or spam, there you will confirm your new password, make sure it is the same as the one you entered in the registration',
        cuenta: 'User or delivery account?',
        usuario: 'User',
        deliver: 'Delivery',
        placeholder: 'Select an account'
    };

    const items = ingles
        ? [
            { Name: "User", Id: '1' },
            { Name: "Delivery", Id: '2' }
        ]
        : [
            { Name: "Usuario", Id: '1' },
            { Name: "Entrega", Id: '2' }
        ];

    const placeholders = ingles
        ?
        { label: "Select an option", value: null }
        :
        { label: "Seleciona una opcion", value: null }
        ;

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
                            contrasenia: '',
                            servicio: ''
                        }}
                        validationSchema={ingles ? resetPasswordSchemaValidationEn : resetPasswordSchemaValidation}
                        onSubmit={(values) => {
                            console.log(values)
                            resetearContrasenia(values.email, values.servicio, values.contrasenia);
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting, setFieldValue }) => (
                            <ScrollView style={styles.ScrollView}>
                            <KeyboardAvoidingView
                                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                style={styles.form}
                            >
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
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TextInput
                                        style={[styles.input, focus === 'input8' && styles.textInputFocused, { flex: 1 }]}
                                        onFocus={() => { handleFocus('input8') }}
                                        placeholder={ingles ? 'Password' : 'Contraseña'}
                                        placeholderTextColor="#282828"
                                        onChangeText={handleChange('contrasenia')}
                                        onBlur={handleBlur('contrasenia')}
                                        value={values.contrasenia}
                                        keyboardType="default"
                                        secureTextEntry={!showPassword}
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ marginLeft: 10 }}>
                                        <Image source={ojo} alt="ojo" style={styles.ojo} />
                                    </TouchableOpacity>
                                </View>
                                {errors.contrasenia && touched.contrasenia && <Text style={{ color: 'red' }}>{errors.contrasenia}</Text>}
                                <TextInput
                                    style={[styles.input, focus === 'input9' && styles.textInputFocused]}
                                    onFocus={() => { handleFocus('input9') }}
                                    placeholder={ingles ? 'Repeat Password' : 'Repetir Contraseña'}
                                    placeholderTextColor="#282828"
                                    onChangeText={(text) => setRepeatPassword(text)}
                                    onBlur={() => handleFocus('')}
                                    value={repeatPassword}
                                    keyboardType="default"
                                    secureTextEntry={!showPassword}
                                />
                                <Text style={styles.textoCuenta}> {ingles ? idiomaIngles.cuenta : idiomaSpanol.cuenta}</Text>
                                {/*<View style={styles.inputSeleccion}>
                                    <RNPickerSelect
                                        onValueChange={handleChange('servicio')}
                                        items={items}
                                        placeholder={
                                            placeholders
                                        }
                                        style={{
                                            inputAndroid: {
                                                height: '100%',
                                                fontSize: 20,
                                                color: '#303030',
                                                backgroundColor: '#fff'
                                            },
                                            inputIOS: {
                                                fontSize: 16,
                                                color: '#303030',
                                                backgroundColor: '#fff',
                                                padding: 10,
                                                height: '100%',
                                            },
                                        }}
                                    />
                                </View>*/}
                                <CustomSelect

                                    items={items}

                                    onValueChange={(value) => {
                                        setSelectedValue(value.Id);
                                        setFieldValue('servicio', value.Id);
                                    }}
                                    placeholder={{
                                        label: ingles ? 'User type' : 'tipo de usuario',
                                        value: '',
                                    }}
                                />
                                {
                                    error && <Text style={{ color: 'red' }}>{ingles ? idiomaIngles.error : idiomaSpanol.error}</Text>
                                }
                                <TouchableOpacity
                                    style={{ padding: 10, backgroundColor: 'rgb(212,46,46)', borderRadius: 8, width: '90%', marginTop: 12, alignSelf: 'center' }}
                                    onPress={() => { handleSubmit() }}
                                    disabled={isLoad}                            >
                                    {
                                        isLoad ?
                                            <Loader />
                                            :
                                            <Text style={{ color: 'white', textAlign: 'center', fontSize: 22, fontFamily: defaultStyle.fontGeneral.fontFamily }}>{ingles ? idiomaIngles.btn : idiomaSpanol.btn}</Text>
                                    }
                                </TouchableOpacity>
                            </KeyboardAvoidingView>
                        </ScrollView>

                        )}
                    </Formik>


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
                                    navigate.goBack();

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
    ojo: {
        height: 25,
        width: 25,
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
    form: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    modalContainer: {
        position: 'absolute',
        top: '40%',
        alignSelf: 'center',
        backgroundColor: '#fff',
        width: '80%',
        height: '30%',
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
    inputSeleccion: {
        height: 45,
        fontSize: 15,
        borderRadius: 21,
        fontWeight: '400',
        color: '#212529',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#dee2e6',
        width: '100%',
        marginBottom: 12,
        overflow: 'hidden'
    },
    textoCuenta: {
        width: '100%',
        paddingLeft: 5,
        fontSize: 16,
        color: '#001d38'
    }
});
