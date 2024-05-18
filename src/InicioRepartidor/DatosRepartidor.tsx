import React, { useState, useContext, useEffect } from 'react';
import { View, Image, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { defaultStyle } from '../Theme/Theme';
import RNPickerSelect from 'react-native-picker-select';
import { AppContext } from '../Contexto/AppContext';
import { Formik } from 'formik';
import { clientSchemaValidation, clientSchemaValidationEn } from '../modules/registroCliente';
import { Usuario } from '../Modelos/Usuario';
import SvgFlecha from '../Admin/SvgFlecha';
import { useNavigation } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DatosRepartidor = () => {
    const fondo: any = require("../../assets/Fondo-Tiptip-01.jpg");
    const logo: any = require("../../assets/Logo-Tiptip-02.png");
    const contexto = useContext(AppContext);
    const [ingles, setIngles] = useState(contexto.usuario.English);
    useEffect(() => {
        setIngles(contexto.usuario.English);
    }, [contexto.usuario.English])
    const [focus, setFocus] = useState("");
    const navigate = useNavigation();
    const isIOS = DeviceInfo.getSystemName() === 'iOS';
    const handleFocus = (nombreInput: string) => {
        setFocus(nombreInput);
    }
    const [ciudades, setCiudades] = useState([]);
    const [estados, setEstados] = useState([]);
    const [selectedEstado, setSelectedEstado] = useState('');

    const idiomaSpanol = {
        salir: 'Salir',
        saludo: 'Hola ' + contexto.usuario.Name,
        eliminarCuenta: 'Eliminar',
        subtitulo: 'Esta es tu información..',
        plnombre: 'Nombre',
        plapellido: 'Apellido',
        plcorreo: 'Correo electrónico',
        plcontrasenia: 'contraseña',
        plciudad: 'Ciudad',
        plestado: 'Estado',
        btneditar: 'Editar',
        plbanco: '' + contexto.usuario.Bank
    }

    const idiomaIngles = {
        salir: 'Exit',
        saludo: 'Hello ' + contexto.usuario.Name,
        eliminarCuenta: 'Delete',
        subtitulo: 'This is your information..',
        plnombre: 'Name',
        plapellido: 'Lastname',
        plcorreo: 'Email',
        plcontrasenia: 'Password',
        plciudad: 'City',
        plestado: 'State',
        btneditar: 'Edit',
    };

    const ActualizarUsuario = async (usuario: Usuario) => {
        fetch('https://bett-production.up.railway.app/api/delivery/update', {
           // fetch('http://192.168.1.72:8090/api/delivery/update', {

            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'token': usuario.Token
            },
            body: JSON.stringify(usuario)
        })
            .then(res => { return res.json() })
            .then(data => {
                contexto.setUsuario(usuario);
                //guardar en localStorage para permanencia de credencial
            })
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
        <View style={styles.container}>
            <View style={styles.backgroundImageContainer}>
                <Image source={fondo} alt="Fondo Tip tip" style={styles.backgroundImage} />

            </View>

            <Image source={logo} alt="Logo Tip tip" style={[styles.tipTip, (isIOS ? { marginTop: 43 } : {})]} />
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
                <TouchableOpacity onPress={() => { navigate.navigate("TerminosyCondiciones" as never) }}>
                    <Text style={styles.textoOpciones}>?</Text>
                </TouchableOpacity>
            </View>
            <Formik
                initialValues={{
                    nombre: contexto.usuario.Name,
                    apellido: contexto.usuario.LastName,
                    email: contexto.usuario.Email,
                    estado: contexto.usuario.State,
                    ciudad: contexto.usuario.City,
                    contrasenia: "",
                    service: contexto.usuario.Service,
                    occupation: contexto.usuario.Occupation,
                    banco: contexto.usuario.Bank,
                    nocuenta: contexto.usuario.AccNumber,
                    tipocuenta: contexto.usuario.Account
                }}
                validationSchema={ingles ? clientSchemaValidationEn : clientSchemaValidation}
                onSubmit={(values) => {
                    let actualizacion: Usuario = {
                        Id: contexto.usuario.Id,
                        City: values.ciudad,
                        Email: values.email,
                        Insignia: contexto.usuario.Insignia,
                        Is_Verified: true,
                        LastName: values.apellido,
                        Name: values.nombre,
                        Password: values.contrasenia,
                        Role_Id: contexto.usuario.Role_Id,
                        State: values.estado,
                        Token: contexto.usuario.Token,
                        User: contexto.usuario.User,
                        Service: contexto.usuario.Service,
                        Occupation: contexto.usuario.Occupation,
                        Admin_Id: contexto.usuario.Admin_Id,
                        Bank: values.banco,
                        AccNumber: values.nocuenta,
                        Account: values.tipocuenta
                    }
                    ActualizarUsuario(actualizacion);
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                    <LinearGradient
                        colors={['rgba(255,255,255,1)', 'rgba(222,222,222,1)', 'rgba(255,255,255,1)']}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 1.5 }}
                        style={styles.containerInfo}>
                        <Text style={styles.NombreCliente}>{contexto.usuario.Name} {contexto.usuario.LastName}</Text>
                        <Text style={styles.tuInfo}>{ingles ? idiomaIngles.subtitulo : idiomaSpanol.subtitulo}</Text>
                        <ScrollView style={styles.ScrollView}>
                            <TextInput
                                style={[styles.input, focus === 'input1' && styles.textInputFocused]}
                                placeholder={ingles ? idiomaIngles.plnombre : idiomaSpanol.plnombre}
                                placeholderTextColor="#303030"
                                onFocus={() => { handleFocus('input1') }}
                                onChangeText={handleChange('nombre')}
                                onBlur={handleBlur('nombre')}
                                value={values.nombre}
                            ></TextInput>
                            {errors.nombre && touched.nombre && <Text style={{ color: 'red' }}>{errors.nombre}</Text>}
                            <TextInput
                                style={[styles.input, focus === 'input2' && styles.textInputFocused]}
                                placeholder={ingles ? idiomaIngles.plapellido : idiomaSpanol.plapellido}
                                placeholderTextColor="#303030"
                                onFocus={() => { handleFocus('input2') }}
                                onBlur={handleBlur('apellido')}
                                onChangeText={handleChange('apellido')}
                                value={values.apellido}
                            ></TextInput>
                            {errors.apellido && touched.apellido && <Text style={{ color: 'red' }}>{errors.apellido}</Text>}

                            <TextInput
                                style={[styles.input, focus === 'input3' && styles.textInputFocused]}
                                placeholder={ingles ? idiomaIngles.plcorreo : idiomaSpanol.plcorreo}
                                placeholderTextColor="#303030"
                                onFocus={() => { handleFocus('input3') }}
                                onBlur={handleBlur('email')}
                                onChangeText={handleChange('email')}
                                value={values.email}
                            ></TextInput>
                            {errors.email && touched.email && <Text style={{ color: 'red' }}>{errors.email}</Text>}
                            <TextInput
                                style={[styles.input, focus === 'input4' && styles.textInputFocused]}
                                placeholder={ingles ? idiomaIngles.btneditar : idiomaSpanol.plbanco}
                                placeholderTextColor="#282828"
                                onFocus={() => { handleFocus('input4') }}
                                onChangeText={handleChange('banco')}
                                onBlur={handleBlur('banco')}
                                value={values.banco}
                            ></TextInput>
                            <TextInput
                                style={[styles.input, focus === 'input5' && styles.textInputFocused]}
                                placeholder='Tipo de cuenta'
                                placeholderTextColor="#282828"
                                onFocus={() => { handleFocus('input5') }}
                                onChangeText={handleChange('tipocuenta')}
                                onBlur={handleBlur('tipocuenta')}
                                value={values.tipocuenta}
                            ></TextInput>
                            <TextInput
                                style={[styles.input, focus === 'input6' && styles.textInputFocused]}
                                placeholder='No. de cuenta'
                                placeholderTextColor="#282828"
                                onFocus={() => { handleFocus('nocuenta') }}
                                onChangeText={handleChange('nocuenta')}
                                onBlur={handleBlur('nocuenta')}
                                value={values.nocuenta}
                                keyboardType="number-pad"
                            ></TextInput>
                            <View style={styles.inputSeleccion}>
                                <RNPickerSelect
                                    onValueChange={(value) => {
                                        setSelectedEstado(value);
                                        handleChange('estado')(value);
                                    }}
                                    items={estados}
                                    placeholder={{
                                        label: contexto.usuario.State,
                                        value: contexto.usuario.State,
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
                                            padding: 10,
                                            height: '100%',
                                        },
                                    }}
                                />
                            </View>
                            <View style={styles.inputSeleccion}>
                                <RNPickerSelect
                                    onValueChange={handleChange('ciudad')}
                                    items={ciudades}
                                    placeholder={{
                                        label: contexto.usuario.City,
                                        value: contexto.usuario.City,
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
                                            padding: 10,
                                            height: '100%',
                                        },
                                    }}
                                />
                            </View>

                            <TextInput
                                style={[styles.input, focus === 'input4' && styles.textInputFocused]}
                                onFocus={() => { handleFocus('input4') }}
                                placeholder={ingles ? idiomaIngles.plcontrasenia : idiomaSpanol.plcontrasenia}
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
                            onPress={() => { handleSubmit() }}
                            style={{ margin: 5, padding: 10, backgroundColor: 'rgb(46, 82, 212)', borderRadius: 8, width: '45%', marginTop: 12 }}>
                            <Text style={{ color: 'white', textAlign: 'center', fontSize: 22, fontFamily: defaultStyle.fontGeneral.fontFamily }}>{ingles ? idiomaIngles.btneditar : idiomaSpanol.btneditar}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { navigate.navigate("EliminarCliente" as never) }}
                            style={{ margin: 5, padding: 10, backgroundColor: 'rgb(212,46,46)', borderRadius: 8, width: '45%', marginTop: 12 }}
                        >
                            <Text style={{ color: 'white', textAlign: 'center', fontSize: 22, fontFamily: defaultStyle.fontGeneral.fontFamily }}>{ingles ? idiomaIngles.eliminarCuenta : idiomaSpanol.eliminarCuenta}</Text>
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
        borderWidth: 1
    },
    tipTip: {
        position: 'absolute',
        width: '100%',
        alignItems: 'center',
        top: '1%',
        height: '14%',
        resizeMode: 'contain'
    },
    saludo: {
        position: 'absolute',
        backgroundColor: 'rgba(255,255,255,.100)',
        borderRadius: 33,
        padding: 10,
        width: '90%',
        top: '7%',
    },
    textoSaludo: {
        color: '#fff',
        fontSize: 24,
        textAlign: 'center',
    },
    NombreCliente: {
        fontSize: 26,
        color: '#001d38',
        textAlign: 'left',
        width: '100%',
        fontFamily: defaultStyle.fontGeneral.fontFamilyBold,
        marginBottom: 9,
        marginTop: 30,
        paddingLeft: 20
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
    ScrollView: {
        width: '90%',
        height: '100%'
    },
    input: {
        fontSize: 15,
        borderRadius: 21,
        fontWeight: '400',
        color: '#212529',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#dee2e6',
        width: '90%',
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
        width: '90%',
        marginBottom: 12,
        overflow: 'hidden'
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
