import React, { useState, useContext, useEffect } from 'react';
import { View, Image, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { defaultStyle } from '../Theme/Theme';
import { ruta_desarrollo, ruta_produccion }from '../desarrollo/ruta.tsx';
import { Formik, Field, Form } from 'formik';
import { deliverySchemaValidation, deliverySchemaValidationEn } from '../modules/registroProveedor';
import { IDelivery } from '../Modelos/Repartidor';
import { AppContext } from '../Contexto/AppContext';
import { useNavigation } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import SvgFlecha from '../Admin/SvgFlecha';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { IEstados } from '../Modelos/Estados';
import { CustomSelect } from '../modules/personalizedComponent.tsx'
import { ICiudades } from '../Modelos/Ciudades';

export const RegistroProveedor = () => {
    const fondo: any = require("../../assets/Fondo-Tiptip-01.jpg");
    const logo: any = require("../../assets/Logo-Tiptip-02.png");
    const ojo: any = require("../../assets/ojo.png");
    const ojoc: any = require("../../assets/ojoc.png");
    const [focus, setFocus] = useState("");
    const contexto = useContext(AppContext);
    const [ingles, setIngles] = useState(contexto.usuario.English);
    const [showPassword, setShowPassword] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [repeatPassword, setRepeatPassword] = useState('');

    useEffect(() => {
        setIngles(contexto.usuario.English);
    }, [contexto.usuario.English]);

    const isIOS = DeviceInfo.getSystemName() === 'iOS';
    const navigate = useNavigation();

    const handleFocus = (nombreInput: string) => {
        setFocus(nombreInput);
    }

    const idiomaSpanol = {
        saludo: "Registrate aquí en segundos",
        peticion: 'Estas a punto de registrarte como proveedor de servicios.',
        btn: 'Iniciar',
        servicio: '¿Qué servicio ofreces?',
        contrasenasNoIguales: 'Las contraseñas no son iguales'
    }

    const idiomaIngles = {
        saludo: "Register here in seconds",
        peticion: 'Please fill out the information only this time.',
        btn: 'Start',
        servicio: 'what service do you offer?',
        contrasenasNoIguales: 'Passwords do not match'
    };
    
    const placeholders = ingles
        ?
        { label: "Which service?", value: null }
        :
        { label: "¿Qué servicio ofreces?", value: null }
        ;

    const items=[
        { Name: 'Amazon', Id: '1' },
        { Name: 'Amazon Flex', Id: '2' },
        { Name: 'UPS', Id: '3' },
        { Name: 'DHL', Id: '4' },
        { Name: 'USPS', Id: '5' },
        { Name: 'Fedex', Id: '6' },
        { Name: 'Fedex Express', Id: '7' },
        { Name: 'Fedex Ground', Id: '8' },
        { Name: 'Fedex Home', Id: '9' },
        { Name: 'Fedex Overnight', Id: '10' },
        { Name: 'General Carrier', Id: '11' },
        { Name: 'Lasership', Id: '12' },
        { Name: 'On Track', Id: '13' },
        { Name: 'Other', Id: '14' },
    ]

    const [ciudades, setCiudades] = useState<any[]>([]);
    const [estados, setEstados] = useState<any[]>([]);
    const [selectedEstado, setSelectedEstado] = useState('');
    const [selectedCiudad, setSelectedCiudad] = useState('');
    const [selectedValue, setSelectedValue] = useState('');

    const insertarRepartidor = async (nuevoRepartidor: IDelivery) => {
        fetch('https://bett-production.up.railway.app/api/delivery/signin', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoRepartidor)
        })
            .then(res => res.json())
            .then(data => {
                navigate.navigate("Credenciales" as never);
                contexto.setUsuario(data);
            })
            .catch(error => console.error('Error:', error));
    }

    interface Item {
        Name: string;
        Id: string;
    }

    const getStates = async () => {
        try {
            const response = await fetch('http://192.168.1.47:8090/api/states', {
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
                const response = await fetch(`http://192.168.1.47:8090/api/city/${selectedEstado}`, {
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
                    banco: '',
                    tipocuenta: '',
                    nocuenta: '',
                    contrasenia: '',
                    servicio: '',
                    ocupacion: '',
                }}
                validationSchema={ingles ? deliverySchemaValidationEn : deliverySchemaValidation}
                onSubmit={(values) => {
                    if (values.contrasenia !== repeatPassword) {
                        setShowModal(true);
                        return;
                    }
                    let repartidor: IDelivery = {
                        Name: values.nombre,
                        LastName: values.apellido,
                        Email: values.email,
                        State: values.estado,
                        City: values.ciudad,
                        Password: values.contrasenia,
                        Is_Verified: false,
                        Insignia: 0,
                        Bank: values.banco,
                        Account: values.tipocuenta,
                        AccNumber: values.nocuenta,
                        User: "",
                        Service: values.servicio,
                        Occupation: values.ocupacion,
                    }
                    insertarRepartidor(repartidor);
                }}>
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting, setFieldValue }) => (
                    <LinearGradient
                        colors={['rgba(255,255,255,1)', 'rgba(222,222,222,1)', 'rgba(255,255,255,1)']}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 1.5 }}
                        style={styles.containerInfo}
                    >
                        <Text style={styles.NombreCliente}>{ingles ? idiomaIngles.saludo : idiomaSpanol.saludo}</Text>
                        <Text style={styles.tuInfo}>{ingles ? idiomaIngles.peticion : idiomaSpanol.peticion}</Text>
                        <KeyboardAwareScrollView style={styles.ScrollView}>
                            <View>
                                <TextInput
                                    style={[styles.input, focus === 'input1' && styles.textInputFocused]}
                                    placeholder={ingles ? 'Name' : 'Nombre'}
                                    placeholderTextColor="#282828"
                                    onFocus={() => { handleFocus('input1') }}
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
                                    keyboardType="email-address"
                                />
                                {errors.email && touched.email && <Text style={{ color: 'red' }}>{errors.email}</Text>}
                                <TextInput
                                    style={[styles.input, focus === 'input4' && styles.textInputFocused]}
                                    placeholder={ingles ? 'Bank' : 'Banco'}
                                    placeholderTextColor="#282828"
                                    onFocus={() => { handleFocus('input4') }}
                                    onChangeText={handleChange('banco')}
                                    onBlur={handleBlur('banco')}
                                    value={values.banco}
                                />
                                <TextInput
                                    style={[styles.input, focus === 'input5' && styles.textInputFocused]}
                                    placeholder={ingles ? 'Account type' : 'Tipo de cuenta'}
                                    placeholderTextColor="#282828"
                                    onFocus={() => { handleFocus('input5') }}
                                    onChangeText={handleChange('tipocuenta')}
                                    onBlur={handleBlur('tipocuenta')}
                                    value={values.tipocuenta}
                                />
                                <TextInput
                                    style={[styles.input, focus === 'input6' && styles.textInputFocused]}
                                    placeholder={ingles ? 'Account number' : 'Número de cuenta'}
                                    placeholderTextColor="#282828"
                                    onFocus={() => { handleFocus('nocuenta') }}
                                    onChangeText={handleChange('nocuenta')}
                                    onBlur={handleBlur('nocuenta')}
                                    value={values.nocuenta}
                                    keyboardType="number-pad"
                                />
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
                                <TextInput
                                    style={[styles.input, focus === 'input7' && styles.textInputFocused]}
                                    placeholder={ingles ? 'Occupation' : 'Ocupación'}
                                    onFocus={() => { handleFocus('input7') }}
                                    onChangeText={handleChange('ocupacion')}
                                    onBlur={handleBlur('ocupacion')}
                                    value={values.ocupacion}
                                    placeholderTextColor="#282828"
                                />
                                {errors.ocupacion && touched.ocupacion && values.ocupacion == '' && <Text style={{ color: 'red' }}>{errors.ocupacion}</Text>}
                                <CustomSelect

                                    items={items}

                                    onValueChange={(value) => {
                                        setSelectedValue(value.Id);
                                        setFieldValue('servicio', value.Id);
                                    }}
                                    placeholder={{
                                        label: ingles ? 'Service' : 'Servicio',
                                        value: '',
                                    }}
                                />
                                {errors.servicio && touched.servicio && <Text style={{ color: 'red' }}>{errors.servicio}</Text>}
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
                            </View>
                        </KeyboardAwareScrollView>
                        <TouchableOpacity
                            onPress={() => { handleSubmit(); }}
                            style={{ margin: 5, padding: 10, backgroundColor: 'rgb(212,46,46)', borderRadius: 8, width: '45%', marginTop: 12 }}>
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
        height: '78%',
        backgroundColor: '#fff',
        minHeight: 320,
        borderRadius: 25,
        borderColor: '#ebebeb',
        borderWidth: 1,
        overflow: 'hidden',
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
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
    textoOpciones: {
        color: 'rgb(212,46,46)',
        fontSize: 18,
        paddingHorizontal: 8,
        backgroundColor: "#fff",
        marginTop: 4,
        borderRadius: 4
    },
    textoServicio: {
        width: '100%',
        paddingLeft: 5,
        fontSize: 16,
        color: '#001d38'
    },
    flecha: {
        position: 'absolute',
        left: 10,
        top: 10,
        paddingTop: 5
    },
    form: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    tuInfo: {
        fontSize: 18,
        textAlign: 'center',
        width: '100%',
        color: '#001d38',
        paddingBottom: 9,
        paddingLeft: 30,
        marginBottom: 10
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