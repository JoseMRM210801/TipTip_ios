import React, { useState, useContext, useEffect } from 'react';
import { View, Image, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { defaultStyle } from '../Theme/Theme';
import RNPickerSelect from 'react-native-picker-select';
import { AppContext } from '../Contexto/AppContext';
import { Formik, Field, Form } from 'formik';
import { clientSchemaValidation, clientSchemaValidationEn } from '../modules/registroCliente';
import { Usuario } from '../Modelos/Usuario';
import SvgFlecha from '../Admin/SvgFlecha';
import { useNavigation } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { IEstados } from '../Modelos/Estados';
import { CustomSelect } from '../modules/personalizedComponent.tsx'
import { ICiudades } from '../Modelos/Ciudades';


export const DatosRepartidor = () => {
    const fondo: any = require("../../assets/Fondo-Tiptip-01.jpg");
    const logo: any = require("../../assets/Logo-Tiptip-02.png");
    const ojo: any = require("../../assets/ojo.png");
    const contexto = useContext(AppContext);
    const [ingles, setIngles] = useState(contexto.usuario.English);
    const [showPassword, setShowPassword] = useState(false);
    const [repeatPassword, setRepeatPassword] = useState('');

    useEffect(() => {
        setIngles(contexto.usuario.English);
    }, [contexto.usuario.English])
    const [focus, setFocus] = useState("");
    const navigate = useNavigation();
    const isIOS = DeviceInfo.getSystemName() === 'iOS';
    const handleFocus = (nombreInput: string) => {
        setFocus(nombreInput);
    }
    const [ciudades, setCiudades] = useState<any[]>([]);
    const [estados, setEstados] = useState<any[]>([]);
    const [selectedEstado, setSelectedEstado] = useState('');
    const [selectedCiudad, setSelectedCiudad] = useState('');

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

            console.log(data)

            const estadosItems: Item[] = data.map((estado) => ({ // Utiliza IEstados aquí también
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
    
                const data: IEstados[] = await response.json();

                console.log(selectedCiudad)
    
                console.log(data)
    
                const ciudadesItems: ItemCiudades[] = data.map((ciudad) => ({ // Utiliza IEstados aquí también
                    Name: ciudad.Name,
                    Id: ciudad.Id ? ciudad.Id.toString() : ''
                }));
    
                setCiudades(ciudadesItems);
            } 
        }catch (error) {
                console.error('Error fetching estados:', error);
            }
    }

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
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting, setFieldValue }) => (
                    <LinearGradient
                        colors={['rgba(255,255,255,1)', 'rgba(222,222,222,1)', 'rgba(255,255,255,1)']}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 1.5 }}
                        style={styles.containerInfo}>
                        <Text style={styles.NombreCliente}>{contexto.usuario.Name} {contexto.usuario.LastName}</Text>
                        <Text style={styles.tuInfo}>{ingles ? idiomaIngles.subtitulo : idiomaSpanol.subtitulo}</Text>
                        <KeyboardAwareScrollView style={styles.ScrollView}>
                            <View>
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
                                />
                                 <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TextInput
                                        style={[styles.input, focus === 'input9' && styles.textInputFocused, { flex: 1 }]}
                                        onFocus={() => { handleFocus('input9') }}
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
                                    style={[styles.input, focus === 'input10' && styles.textInputFocused]}
                                    onFocus={() => { handleFocus('input10') }}
                                    placeholder={ingles ? 'Repeat Password' : 'Repetir Contraseña'}
                                    placeholderTextColor="#282828"
                                    onChangeText={(text) => setRepeatPassword(text)}
                                    onBlur={() => handleFocus('')}
                                    value={repeatPassword}
                                    keyboardType="default"
                                    secureTextEntry={!showPassword}
                                />
                            </View>
                        </KeyboardAwareScrollView>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
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
                        </View>
                    </LinearGradient>
                )}

        </Formik>

        </View >
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
    ojo: {
        height: 25,
        width: 25,
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
    form: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
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
