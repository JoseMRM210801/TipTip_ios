import React, { useState, useContext, useEffect } from 'react';
import { View, Image, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Formik } from 'formik';
import RNPickerSelect from 'react-native-picker-select';
import { ScrollView } from 'react-native-gesture-handler';
import SvgFlecha from '../Admin/SvgFlecha';
// Importa el esquema de validación de Yup
import { clientSchemaValidation, clientSchemaValidationEn } from '../modules/registroCliente.tsx';
import { defaultStyle } from '../Theme/Theme.tsx';
import { Usuario } from '../Modelos/Usuario';
import { AppContext } from '../Contexto/AppContext.tsx';
import { useNavigation } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';

export const RegistroCliente = () => {
    const fondo: any = require("../../assets/Fondo-Tiptip-01.jpg");
    const logo: any = require("../../assets/Logo-Tiptip-02.png");
    const [focus, setFocus] = useState("");
    const isIOS = DeviceInfo.getSystemName() === 'iOS';
    const contexto = useContext(AppContext);
    const navigate = useNavigation();
    const [ingles, setIngles] = useState(contexto.usuario.English);
    useEffect(() => {
        setIngles(contexto.usuario.English);
    }, [contexto.usuario.English])
    const handleFocus = (nombreInput: string) => {
        setFocus(nombreInput);
    }
    const [ciudades, setCiudades] = useState([]);
    const [estados, setEstados] = useState([]);
    const [selectedEstado, setSelectedEstado] = useState('');
    const idiomaSpanol = {
        saludo: "Registrate aquí en segundos",
        peticion: 'Por favor llena tus datos personales solo esta vez.',
        btn: 'Iniciar',

    }

    const idiomaIngles = {
        saludo: "Register here in seconds",
        peticion: 'Please fill in your personal information only this time.',
        btn: 'Start',
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
        }
        //fetch('http://192.168.1.72:8090/api/client/signin', {
            fetch('https://bett-production.up.railway.app/api/client/signin', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newClient)
        })
            .then(res => { return res.json() })
            .then(data => {
                contexto.setUsuario(data);
                navigate.navigate("Credenciales" as never)
                //guardar en localStorage para permanencia de credencial
            }).catch(error => console.error('Error:', error));

    }
    useEffect(() => {
        // Fetch para obtener la lista de estados
        fetch('https://parseapi.back4app.com/classes/Usabystate_States?keys=name,postalAbreviation', {
            headers: {
                'X-Parse-Application-Id': '5bV2naG0lkGPhWU3Dewaem9CgMsViox5S8t7gv2q',
                'X-Parse-REST-API-Key': '9G3Cn1iMtA284ZWRvUoBywDZBE99eGqOni4bi8vO',
            },
        })
            .then(response => { return response.json() })
            .then(data => {
                setEstados(data.results.map((estado: { name: any; postalAbreviation: any; }) => ({
                    label: estado.name,
                    value: estado.postalAbreviation,
                })));
            })
            .catch(error => console.error('Error fetching estados:', error));
    }, []);

    useEffect(() => {
        // Verificar que se haya seleccionado un estado antes de hacer el fetch
        if (selectedEstado) {
            // Fetch para obtener la lista de ciudades basada en el estado seleccionado
            fetch(`https://parseapi.back4app.com/classes/Usabystate_${selectedEstado}?keys=name`, {
                headers: {
                    'X-Parse-Application-Id': '5bV2naG0lkGPhWU3Dewaem9CgMsViox5S8t7gv2q',
                    'X-Parse-REST-API-Key': '9G3Cn1iMtA284ZWRvUoBywDZBE99eGqOni4bi8vO',
                },
            })
                .then(response => { return response.json() })
                .then(data => {
                    setCiudades(data.results.map((ciudad: { name: any; }) => ({
                        label: ciudad.name,
                        value: ciudad.name,  // Actualiza esto con el campo correcto que debería usarse como valor
                    })));
                })
                .catch(error => console.error('Error fetching ciudades:', error));
        }
    }, [selectedEstado]);

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
                    setIngles(!ingles)
                    contexto.setUsuario({ ...contexto.usuario, English: !ingles })
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
                    InsertClient(values.nombre, values.apellido, values.email, values.estado, values.ciudad, values.contrasenia)
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                    <LinearGradient
                        colors={['rgba(255,255,255,1)', 'rgba(222,222,222,1)', 'rgba(255,255,255,1)']}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 1.5 }}
                        style={styles.containerInfo}>
                        <Text style={styles.NombreCliente}>{ingles ? idiomaIngles.saludo : idiomaSpanol.saludo}</Text>
                        <Text style={styles.tuInfo}>{ingles ? idiomaIngles.peticion : idiomaSpanol.peticion}</Text>

                        <ScrollView style={styles.ScrollView}>
                            <TextInput
                                style={[styles.input, focus === 'input1' && styles.textInputFocused]}
                                onFocus={() => { handleFocus('input1') }}
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
                                onFocus={() => { handleFocus('input2') }}
                                onChangeText={handleChange('apellido')}
                                onBlur={handleBlur('apellido')}
                                value={values.apellido}
                            />
                            {errors.apellido && touched.apellido && <Text style={{ color: 'red' }}>{errors.apellido}</Text>}
                            <TextInput
                                style={[styles.input, focus === 'input3' && styles.textInputFocused]}
                                placeholder={ingles ? 'Email' : 'Correo electrónico'}
                                placeholderTextColor="#282828"
                                onFocus={() => { handleFocus('input3') }}
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                            />
                            {errors.email && touched.email && <Text style={{ color: 'red' }}>{errors.email}</Text>}
                            <View style={styles.inputSeleccion}>
                                <RNPickerSelect
                                    onValueChange={(value) => {
                                        setSelectedEstado(value);
                                        handleChange('estado')(value);
                                    }}
                                    items={estados}
                                    placeholder={{
                                        label: ingles ? 'State' : 'Estado',
                                        value: '',
                                    }}
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
                                            height: '100%',
                                            padding: 10

                                        },
                                    }}
                                />
                            </View>
                            <View style={styles.inputSeleccion}>
                                <RNPickerSelect
                                    onValueChange={handleChange('ciudad')}
                                    items={ciudades}
                                    placeholder={{
                                        label: ingles ? 'City' : 'Ciudad',
                                        value: '',
                                    }}
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
                                            height: '100%',
                                            padding: 10,
                                            backgroundColor: '#fff'
                                        },
                                    }}
                                />
                            </View>
                            <TextInput
                                style={[styles.input, focus === 'input4' && styles.textInputFocused]}
                                onFocus={() => { handleFocus('input4') }}
                                placeholder={ingles ? 'Password' : 'Contraseña'}
                                placeholderTextColor="#282828"
                                onChangeText={handleChange('contrasenia')}
                                onBlur={handleBlur('contrasenia')}
                                value={values.contrasenia}
                                keyboardType="default"
                                secureTextEntry
                            />
                            {errors.contrasenia && touched.contrasenia && <Text style={{ color: 'red' }}>{errors.contrasenia}</Text>}
                        </ScrollView>
                        <TouchableOpacity
                            style={{ margin: 5, padding: 10, backgroundColor: 'rgb(212,46,46)', borderRadius: 8, width: '45%', marginTop: 12 }}
                            onPress={() => { handleSubmit() }}
                            disabled={isSubmitting}
                        >
                            <Text style={{ color: 'white', textAlign: 'center', fontSize: 22, fontFamily: defaultStyle.fontGeneral.fontFamily }}>
                                {ingles ? idiomaIngles.btn : idiomaSpanol.btn}
                            </Text>
                        </TouchableOpacity>
                    </LinearGradient>
                )}
            </Formik>
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
