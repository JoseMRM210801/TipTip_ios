import React, { useState, useContext, useEffect } from 'react';
import { View, Image, StyleSheet, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Formik } from 'formik';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SvgFlecha from '../Admin/SvgFlecha';
import { clientSchemaValidation, clientSchemaValidationEn } from '../modules/registroCliente';
import { defaultStyle } from '../Theme/Theme';
import { Usuario } from '../Modelos/Usuario';
import { AppContext } from '../Contexto/AppContext';
import { useNavigation } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import { CustomSelect } from '../modules/personalizedComponent';
import { Ruta } from '../Ruta/Ruta';

export const RegistroCliente = () => {
    const fondo: any = require("../../assets/Fondo-Tiptip-01.jpg");
    const logo: any = require("../../assets/Logo-Tiptip-02.png");
    const ojo: any = require("../../assets/ojo.png");
    const ojoc: any = require("../../assets/ojoc.png");
    const [focus, setFocus] = useState("");
    const isIOS = DeviceInfo.getSystemName() === 'iOS';
    const contexto = useContext(AppContext);
    const navigate = useNavigation();
    const [ingles, setIngles] = useState(contexto.usuario.English);
    const [showPassword, setShowPassword] = useState(false);
    const [repeatPassword, setRepeatPassword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false); // Nuevo estado para el modal de éxito
    const [ciudades, setCiudades] = useState<any[]>([]);
    const [estados, setEstados] = useState<any[]>([]);
    const [selectedEstado, setSelectedEstado] = useState('');
    const [selectedCiudad, setSelectedCiudad] = useState('');

    useEffect(() => {
        setIngles(contexto.usuario.English);
    }, [contexto.usuario.English]);

    const handleFocus = (nombreInput: string) => {
        setFocus(nombreInput);
    };

    const idiomaSpanol = {
        saludo: "Registrate aquí en segundos",
        peticion: 'Por favor llena tus datos personales solo esta vez.',
        btn: 'Iniciar',
        contrasenasNoIguales: 'Las contraseñas no son iguales',
        mensajeExito: 'Verifica el mensaje en el correo' // Mensaje de éxito en español
    };

    const idiomaIngles = {
        saludo: "Register here in seconds",
        peticion: 'Please fill out the information only this time.',
        btn: 'Start',
        contrasenasNoIguales: 'Passwords do not match',
        mensajeExito: 'Check the message in your email' // Mensaje de éxito en inglés
    };

    const InsertClient = async (nombre: string, apellido: string, email: string, estado: string, ciudad: string, contrasenia: string) => {
        let newClient: Usuario = {
            Id: "",
            City: ciudad,
            Email: email,
            Insignia: "",
            Is_Verified: false,
            LastName: apellido,
            Name: nombre,
            Password: contrasenia,
            Role_Id: "",
            State: estado,
            Token: "",
            User: ""
        };
        try {
            const response = await fetch(`${Ruta}/client/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newClient)
            });
            const data = await response.json();
            contexto.setUsuario(data);
            setShowSuccessModal(true); // Mostrar el modal de éxito
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        const getStates = async () => {
            try {
                const response = await fetch(`${Ruta}/states`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                const data = await response.json();
                const estadosItems = data.map((estado) => ({
                    Name: estado.Name,
                    Id: estado.Id ? estado.Id.toString() : ''
                }));
                setEstados(estadosItems);
            } catch (error) {
                console.error('Error fetching estados:', error);
            }
        };
        getStates();
    }, []);

    useEffect(() => {
        const getCities = async () => {
            try {
                if (selectedEstado) {
                    const response = await fetch(`${Ruta}/city/${selectedEstado}`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' }
                    });
                    const data = await response.json();
                    const ciudadesItems = data.map((ciudad) => ({
                        Name: ciudad.Name,
                        Id: ciudad.Id ? ciudad.Id.toString() : ''
                    }));
                    setCiudades(ciudadesItems);
                }
            } catch (error) {
                console.error('Error fetching ciudades:', error);
            }
        };
        getCities();
    }, [selectedEstado]);

    return (
        <View style={styles.container}>
            <View style={styles.backgroundImageContainer}>
                <Image source={fondo} alt="Fondo Tip tip" style={styles.backgroundImage} />
            </View>
            <Image source={logo} alt="Logo Tip tip" style={styles.tipTip} />
            <View style={[styles.contenedorOpciones, isIOS ? { marginTop: 43 } : {}]}>
                <TouchableOpacity onPress={() => navigate.goBack()} style={[styles.textoOpcionesF, styles.flecha]}>
                    <SvgFlecha />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setIngles(!ingles); contexto.setUsuario({ ...contexto.usuario, English: !ingles }); }}>
                    <Text style={styles.textoOpciones}>{ingles ? 'Es' : 'En'}</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.textoOpciones}>?</Text>
                </TouchableOpacity>
            </View>
            <Formik
                initialValues={{
                    nombre: '',
                    apellido: '',
                    email: '',
                    estado: '',
                    ciudad: '',
                    contrasenia: ''
                }}
                validationSchema={ingles ? clientSchemaValidationEn : clientSchemaValidation}
                onSubmit={(values, { setSubmitting }) => {
                    if (values.contrasenia !== repeatPassword) {
                        setShowModal(true);
                        setSubmitting(false); // Reset isSubmitting on error
                        return;
                    }
                    InsertClient(values.nombre, values.apellido, values.email, values.estado, values.ciudad, values.contrasenia)
                        .finally(() => setSubmitting(false)); // Reset isSubmitting after API call
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                    <LinearGradient
                        colors={['rgba(255,255,255,1)', 'rgba(222,222,222,1)', 'rgba(255,255,255,1)']}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 1.5 }}
                        style={styles.containerInfo}
                    >
                        <Text style={styles.NombreCliente}>{ingles ? idiomaIngles.saludo : idiomaSpanol.saludo}</Text>
                        <Text style={styles.tuInfo}>{ingles ? idiomaIngles.peticion : idiomaSpanol.peticion}</Text>
                        <KeyboardAwareScrollView style={styles.ScrollView}>
                            <TextInput
                                style={[styles.input, focus === 'input1' && styles.textInputFocused]}
                                onFocus={() => handleFocus('input1')}
                                placeholder={ingles ? 'Name' : 'Nombre'}
                                placeholderTextColor="#282828"
                                onChangeText={handleChange('nombre')}
                                onBlur={handleBlur('nombre')}
                                value={values.nombre}
                            />
                            {errors.nombre && touched.nombre && <Text style={{ color: 'red' }}>{errors.nombre}</Text>}
                            <TextInput
                                style={[styles.input, focus === 'input2' && styles.textInputFocused]}
                                placeholder={ingles ? 'Last name' : 'Apellido'}
                                placeholderTextColor="#282828"
                                onFocus={() => handleFocus('input2')}
                                onChangeText={handleChange('apellido')}
                                onBlur={handleBlur('apellido')}
                                value={values.apellido}
                            />
                            {errors.apellido && touched.apellido && <Text style={{ color: 'red' }}>{errors.apellido}</Text>}
                            <TextInput
                                style={[styles.input, focus === 'input3' && styles.textInputFocused]}
                                placeholder={ingles ? 'Email' : 'Correo electrónico'}
                                placeholderTextColor="#282828"
                                onFocus={() => handleFocus('input3')}
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                            />
                            {errors.email && touched.email && <Text style={{ color: 'red' }}>{errors.email}</Text>}
                            <CustomSelect
                                items={estados}
                                onValueChange={(value) => {
                                    setSelectedEstado(value.Id);
                                    handleChange('estado')(value.Name);
                                }}
                                placeholder={{ label: ingles ? 'State' : 'Estado', value: '' }}
                            />
                            <CustomSelect
                                items={ciudades}
                                onValueChange={(value) => {
                                    setSelectedCiudad(value.Id);
                                    handleChange('ciudad')(value.Name);
                                }}
                                placeholder={{ label: ingles ? 'City' : 'Ciudad', value: '' }}
                                isLoading={ciudades.length === 0}
                            />
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TextInput
                                    style={[styles.input, focus === 'input4' && styles.textInputFocused, { flex: 1 }]}
                                    onFocus={() => handleFocus('input4')}
                                    placeholder={ingles ? 'Password' : 'Contraseña'}
                                    placeholderTextColor="#282828"
                                    onChangeText={handleChange('contrasenia')}
                                    onBlur={handleBlur('contrasenia')}
                                    value={values.contrasenia}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ marginLeft: 10 }}>
                                    <Image source={showPassword ? ojoc : ojo} alt="ojo" style={styles.ojo} />
                                </TouchableOpacity>
                            </View>
                            {errors.contrasenia && touched.contrasenia && <Text style={{ color: 'red' }}>{errors.contrasenia}</Text>}
                            <TextInput
                                style={[styles.input, focus === 'input5' && styles.textInputFocused]}
                                onFocus={() => handleFocus('input5')}
                                placeholder={ingles ? 'Repeat Password' : 'Repetir Contraseña'}
                                placeholderTextColor="#282828"
                                onChangeText={setRepeatPassword}
                                value={repeatPassword}
                                secureTextEntry={!showPassword}
                            />
                        </KeyboardAwareScrollView>
                        <TouchableOpacity
                            style={{ margin: 5, padding: 10, backgroundColor: 'rgb(212,46,46)', borderRadius: 8, width: '45%', marginTop: 12 }}
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                        >
                            <Text style={{ color: 'white', textAlign: 'center', fontSize: 22, fontFamily: defaultStyle.fontGeneral.fontFamily }}>
                                {ingles ? idiomaIngles.btn : idiomaSpanol.btn}
                            </Text>
                        </TouchableOpacity>
                    </LinearGradient>
                )}
            </Formik>
            <Modal transparent={true} visible={showModal} animationType="slide" onRequestClose={() => setShowModal(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>{ingles ? idiomaIngles.contrasenasNoIguales : idiomaSpanol.contrasenasNoIguales}</Text>
                        <TouchableOpacity style={styles.modalButton} onPress={() => setShowModal(false)}>
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Nuevo modal de éxito */}
            <Modal transparent={true} visible={showSuccessModal} animationType="slide" onRequestClose={() => setShowSuccessModal(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>{ingles ? idiomaIngles.mensajeExito : idiomaSpanol.mensajeExito}</Text>
                        <TouchableOpacity style={styles.modalButton} onPress={() => {
                            setShowSuccessModal(false);
                            navigate.navigate('Login'); // Redirige a la pantalla de Login
                        }}>
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ojo: {
        height: 25,
        width: 25,
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
        borderWidth: 1,
        overflow: 'hidden',
    },
    tipTip: {
        position: 'absolute',
        width: '100%',
        alignItems: 'center',
        top: '1%',
        height: '14%',
        resizeMode: 'contain',
    },
    NombreCliente: {
        fontSize: 26,
        color: '#001d38',
        textAlign: 'center',
        width: '100%',
        fontFamily: defaultStyle.fontGeneral.fontFamilyBold,
        marginBottom: 0,
        marginTop: 10,
    },
    tuInfo: {
        fontSize: 18,
        textAlign: 'left',
        width: '100%',
        color: '#001d38',
        paddingBottom: 9,
        paddingLeft: 30,
        marginBottom: 10,
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
        padding: 10,
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
    textoOpcionesF: {
        color: 'rgb(212,46,46)',
        fontSize: 18,
        paddingHorizontal: 8,
        backgroundColor: '#fff',
        marginTop: 4,
        borderRadius: 4,
    },
    flecha: {
        position: 'absolute',
        left: 10,
        top: 10,
        paddingTop: 5,
    },
    textoOpciones: {
        color: 'rgb(212,46,46)',
        fontSize: 18,
        paddingHorizontal: 8,
        backgroundColor: '#fff',
        marginTop: 4,
        borderRadius: 4,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 15,
    },
    modalButton: {
        padding: 10,
        backgroundColor: 'rgb(212,46,46)',
        borderRadius: 8,
        width: '50%',
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
    },
});
