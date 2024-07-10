import React, { useState, useContext, useEffect } from 'react';
import { View, Image, StyleSheet, Text, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Formik } from 'formik';
import RNPickerSelect from 'react-native-picker-select';
import { ScrollView } from 'react-native-gesture-handler';
import SvgFlecha from '../Admin/SvgFlecha';
import { clientSchemaValidation, clientSchemaValidationEn } from '../modules/registroCliente';
import { defaultStyle } from '../Theme/Theme';
import { Usuario } from '../Modelos/Usuario';
import { AppContext } from '../Contexto/AppContext';
import { useNavigation } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import { IEstados } from '../Modelos/Estados';
import { CustomSelect } from '../modules/personalizedComponent';
import { ICiudades } from '../Modelos/Ciudades';

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
    const [showStates, setShowStates] = useState(true);

    useEffect(() => {
        setIngles(contexto.usuario.English);
    }, [contexto.usuario.English]);

    const handleFocus = (nombreInput: string) => {
        setFocus(nombreInput);
    };

    const [ciudades, setCiudades] = useState<any[]>([]);
    const [estados, setEstados] = useState<any[]>([]);
    const [selectedEstado, setSelectedEstado] = useState('');
    const [selectedCiudad, setSelectedCiudad] = useState('');

    const idiomaSpanol = {
        saludo: "Registrate aquí en segundos",
        peticion: 'Por favor llena tus datos personales solo esta vez.',
        btn: 'Iniciar',
        contrasenasNoIguales: 'Las contraseñas no son iguales'
    };

    const idiomaIngles = {
        saludo: "Register here in seconds",
        peticion: 'Please fill out the information only this time.',
        btn: 'Start',
        contrasenasNoIguales: 'Passwords do not match'
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
        fetch('https://bett-production.up.railway.app/api/client/signin', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newClient)
        })
            .then(res => res.json())
            .then(data => {
                contexto.setUsuario(data);
                navigate.navigate("Credenciales" as never);
            }).catch(error => console.error('Error:', error));
    };

    interface Item {
        Name: string;
        Id: string;
    }

    const getStates = async () => {
        try {
            const response = await fetch('https://bett-production.up.railway.app/api/states', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            const data: IEstados[] = await response.json();

            console.log(data);

            const estadosItems: Item[] = data.map((estado) => ({
                Name: estado.Name,
                Id: estado.Id ? estado.Id.toString() : ''
            }));

            setEstados(estadosItems);
        } catch (error) {
            console.error('Error fetching estados:', error);
        }
    };

    useEffect(() => {
        getStates();
    }, []);

    interface ItemCiudades {
        Name: string;
        Id: string;
    }

    const getCities = async () => {
        try {
            if (selectedEstado) {
                const response = await fetch(`https://bett-production.up.railway.app/api/city/${selectedEstado}`, {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                const data: ICiudades[] = await response.json();

                console.log(selectedCiudad);
                console.log(data);

                const ciudadesItems: ItemCiudades[] = data.map((ciudad) => ({
                    Name: ciudad.Name,
                    Id: ciudad.Id ? ciudad.Id.toString() : ''
                }));

                setCiudades(ciudadesItems);
            }
        } catch (error) {
            console.error('Error fetching ciudades:', error);
        }
    };

    useEffect(() => {
        getCities();
    }, [selectedEstado]);

    const Item = ({ Name }: IEstados) => (
        <View style={styles.item}>
            <Text style={styles.title}>{Name}</Text>
        </View>
    );

    const ItemCiudad = ({ Name }: ICiudades) => (
        <View style={styles.item}>
            <Text style={styles.title}>{Name}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.backgroundImageContainer}>
                <Image source={fondo} alt="Fondo Tip tip" style={styles.backgroundImage} />
            </View>

            <Image source={logo} alt="Logo Tip tip" style={styles.tipTip} />
            <View style={[styles.contenedorOpciones, (isIOS ? { marginTop: 43 } : {})]}>
                <TouchableOpacity
                    onPress={() => { navigate.goBack(); }}
                    style={[styles.textoOpcionesF, styles.flecha]}>
                    <SvgFlecha />
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
            <Formik
                initialValues={{
                    nombre: '',
                    apellido: '',
                    email: '',
                    estado: '',
                    ciudad: '',
                    contrasenia: '',
                }}
                validationSchema={ingles ? clientSchemaValidationEn : clientSchemaValidation}
                onSubmit={(values) => {
                    if (values.contrasenia !== repeatPassword) {
                        setShowModal(true);
                        return;
                    }
                    console.log("aqui entro");
                    console.log(values.apellido);
                    console.log(values.nombre);
                    console.log(values.contrasenia);
                    console.log(values.email);
                    console.log(values.ciudad);
                    console.log(values.estado);
                    InsertClient(values.nombre, values.apellido, values.email, values.estado, values.ciudad, values.contrasenia);
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting, setFieldValue }) => (

                    <LinearGradient
                        colors={['rgba(255,255,255,1)', 'rgba(222,222,222,1)', 'rgba(255,255,255,1)']}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 1.5 }}
                        style={styles.containerInfo}>
                        <Text style={styles.NombreCliente}>{ingles ? idiomaIngles.saludo : idiomaSpanol.saludo}</Text>
                        <Text style={styles.tuInfo}>{ingles ? idiomaIngles.peticion : idiomaSpanol.peticion}</Text>

                        <ScrollView style={styles.ScrollView}>
                            <KeyboardAvoidingView
                                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                style={styles.form}
                            >
                                <TextInput
                                    style={[styles.input, focus === 'input1' && styles.textInputFocused]}
                                    onFocus={() => { handleFocus('input1'); }}
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
                                    onFocus={() => { handleFocus('input2'); }}
                                    onChangeText={handleChange('apellido')}
                                    onBlur={handleBlur('apellido')}
                                    value={values.apellido}
                                />
                                {errors.apellido && touched.apellido && <Text style={{ color: 'red' }}>{errors.apellido}</Text>}
                                <TextInput
                                    style={[styles.input, focus === 'input3' && styles.textInputFocused]}
                                    placeholder={ingles ? 'Email' : 'Correo electrónico'}
                                    placeholderTextColor="#282828"
                                    onFocus={() => { handleFocus('input3'); }}
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                />
                                {errors.email && touched.email && <Text style={{ color: 'red' }}>{errors.email}</Text>}
                                <CustomSelect
                                    items={estados}
                                    onValueChange={(value) => {
                                        setSelectedEstado(value.Id);
                                        setFieldValue('estado', value.Name);
                                    }}
                                    placeholder={{
                                        label: ingles ? 'State' : 'Estado',
                                        value: '',
                                    }}
                                />
                                <CustomSelect

                                    items={ciudades}

                                    onValueChange={(value) => {
                                        setSelectedCiudad(value.Id);
                                        setFieldValue('ciudad', value.Name);
                                    }}
                                    placeholder={{
                                        label: ingles ? 'City' : 'Ciudad',
                                        value: '',
                                    }}
                                    isLoading={ciudades.length === 0}
                                />
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TextInput
                                        style={[styles.input, focus === 'input4' && styles.textInputFocused, { flex: 1 }]}
                                        onFocus={() => { handleFocus('input4'); }}
                                        placeholder={ingles ? 'Password' : 'Contraseña'}
                                        placeholderTextColor="#282828"
                                        onChangeText={handleChange('contrasenia')}
                                        onBlur={handleBlur('contrasenia')}
                                        value={values.contrasenia}
                                        keyboardType="default"
                                        secureTextEntry={!showPassword}
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ marginLeft: 10 }}>
                                        <Image source={showPassword ? ojoc : ojo} alt="ojo" style={styles.ojo} />
                                    </TouchableOpacity>
                                </View>
                                {errors.contrasenia && touched.contrasenia && <Text style={{ color: 'red' }}>{errors.contrasenia}</Text>}
                                <TextInput
                                    style={[styles.input, focus === 'input5' && styles.textInputFocused]}
                                    onFocus={() => { handleFocus('input5'); }}
                                    placeholder={ingles ? 'Repeat Password' : 'Repetir Contraseña'}
                                    placeholderTextColor="#282828"
                                    onChangeText={(text) => setRepeatPassword(text)}
                                    onBlur={() => handleFocus('')}
                                    value={repeatPassword}
                                    keyboardType="default"
                                    secureTextEntry={!showPassword}
                                />
                            </KeyboardAvoidingView>
                        </ScrollView>
                        <TouchableOpacity
                            style={{ margin: 5, padding: 10, backgroundColor: 'rgb(212,46,46)', borderRadius: 8, width: '45%', marginTop: 12 }}
                            onPress={() => {
                                handleSubmit();
                                console.log(values.apellido);
                                console.log(values.nombre);
                                console.log(values.contrasenia);
                                console.log(values.email);
                                console.log(values.ciudad);
                                console.log(values.estado);
                            }}
                            disabled={isSubmitting}
                        >
                            <Text style={{ color: 'white', textAlign: 'center', fontSize: 22, fontFamily: defaultStyle.fontGeneral.fontFamily }}>
                                {ingles ? idiomaIngles.btn : idiomaSpanol.btn}
                            </Text>
                        </TouchableOpacity>
                    </LinearGradient>

                )}
            </Formik>
            <Modal
                transparent={true}
                visible={showModal}
                animationType="slide"
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>{ingles ? idiomaIngles.contrasenasNoIguales : idiomaSpanol.contrasenasNoIguales}</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setShowModal(false)}
                        >
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
        alignContent: 'center',
        position: 'relative',
        alignItems: 'center'
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
        resizeMode: 'contain'
    },
    NombreCliente: {
        fontSize: 26,
        color: '#001d38',
        textAlign: 'center',
        width: '100%',
        fontFamily: defaultStyle.fontGeneral.fontFamilyBold,
        marginBottom: 0,
        marginTop: 10
    },
    tuInfo: {
        fontSize: 18,
        textAlign: 'left',
        width: '100%',
        color: '#001d38',
        paddingBottom: 9,
        paddingLeft: 30,
        marginBottom: 10
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
    ScrollView: {
        width: '90%',
        height: '100%'
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
        top: 10,
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
    form: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
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
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
});
