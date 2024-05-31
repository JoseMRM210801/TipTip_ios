import React, { useContext, useState, useEffect } from "react";
import { Image, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "../Contexto/AppContext";
import { Usuario } from "../Modelos/Usuario";
import DeviceInfo from "react-native-device-info";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";
import SvgFlecha from '../Admin/SvgFlecha';

export const TerminosyCondiciones = () => {
    const fondo: any = require("../../assets/Fondo-Tiptip-01.jpg");
    const navigate = useNavigation();
    const contexto = useContext(AppContext);
    const [ingles, setIngles] = useState(contexto.usuario.English);
    useEffect(() => {
        setIngles(contexto.usuario.English);
    }, [contexto.usuario.English])
    const isIOS = DeviceInfo.getSystemName() === 'iOS';
    const idiomaSpanol = {
        Titulo: 'POLÍTICAS DE PRIVACIDAD Y CONDICIONES DE USO',
        saludo: 'Gracias por utilizar Tip Tip, una aplicación móvil diseñada para enviar propinas de clientes a prestadores de servicios a través de PayPal.Valoramos su confianza y nos comprometemos a proteger su privacidad y sus datos personales. Esta Política de Privacidad describe cómo recopilamos, utilizamos y compartimos su información cuando utiliza nuestra aplicación ',
        InformacionTitulo: 'Información que recopilamos',
        Informacion1: '1. Información de la cuenta de PayPal: Necesitaremos acceder a cierta información de su cuenta de PayPal para procesar las transacciones de propinas.',
        Informacion2: '2. Información de la transacción: Podemos recopilar detalles sobre las transacciones de propinas que realice a través de la aplicación, incluidos el monto de la propina, el destinatario y la fecha y hora de la transacción.',
        Informacion3:'3. Información de registro: Podemos recopilar información sobre su dispositivo móvil, incluida la dirección IP, el tipo de dispositivo, la versión del sistema operativo y la identificación del dispositivo único',
        Informacion4:'4. Información de ubicación: Podemos recopilar información sobre su ubicación cuando utilice nuestra aplicación, mediante tecnologías como GPS y Wi-Fi.',
        Informacion5:'5. Información proporcionada por usted: Podemos recopilar información que usted nos proporcione voluntariamente, como comentarios, sugerencias o consultas que envíe a través de la aplicación.',
        UsoinformacionTitulo: 'Cómo utilizamos su información',
        Usoinformacion: 'Utilizamos la información recopilada para:',
        Usoinformacion1: '1. Procesar transacciones de propinas a través de PayPal.',
        Usoinformacion2: '2. Personalizar su experiencia y mejorar nuestra aplicación.',
        Usoinformacion3: '3. Comunicarnos con usted, responder a sus consultas y proporcionarle asistencia.',
        Usoinformacion4: 'Cumplir con las leyes y regulaciones aplicables en el país y/o estados.',
        Compartirinformacion: 'Compartir su información',
        Compartirinformacion2: 'No vendemos, alquilamos ni compartimos su información personal con terceros, excepto en las siguientes circunstancias:',
        Compartirinformacion3: '1. Con su consentimiento explícito',
        Compartirinformacion4: '2. Con proveedores de servicios de confianza que necesiten acceder a su información para prestar servicios en nuestro nombre, como procesadores de pagos y servicios de análisis.',
        Compartirinformacion5:'3. Cuando estemos legalmente obligados a hacerlo, para cumplir con una orden judicial, ley o regulación.',
        TituloSeguridad:'Seguridad de la información',
        SeguridadInformacion:'Nos comprometemos a proteger la seguridad de su información. Implementamos medidas de seguridad técnicas, administrativas y físicas para proteger su información contra accesos no autorizados, divulgación o destrucción.',
        DerechosPTitulo:'Sus derechos de privacidad',
        Derechos1:'Usted tiene ciertos derechos en relación con su información personal, incluido el derecho a acceder, corregir, eliminar, restringir o solicitar la portabilidad de su información. Si desea ejercer alguno de estos derechos, contáctenos a través de la información de contacto proporcionada al final de esta Política de Privacidad.',
        CambiosEnLaPoliticaTitulo:'Nos reservamos el derecho de actualizar esta Política de Privacidad en cualquier momento. Le notificaremos sobre cualquier cambio significativo en esta Política de Privacidad, ya sea mediante una notificación en la aplicación o por otros medios.',
        ContactoTitulo:'Contacto',
        Contacto1:'Si tiene alguna pregunta o inquietud sobre nuestra Política de Privacidad, comuníquese con nosotros a tiptipcontact@plazasleongroupllc.com o a través de +1 (484) 369-1165.',
        Contacto2:'Al utilizar nuestra aplicación, usted acepta los términos y condiciones descritos en esta Política de Privacidad.',
        CondicionesdeUso:'Además de nuestra Política de Privacidad, al utilizar Tip Tip, usted acepta cumplir con las siguientes condiciones:',
        CondicionDeUso1:'1. Usted es responsable de mantener la confidencialidad de su cuenta de usuario y de todas las actividades que ocurran bajo su cuenta.',
        CondicionDeUso2:'2. Usted acepta utilizar Tip Tip únicamente con fines legales y de acuerdo con todas las leyes y regulaciones aplicables.',
        CondicionDeUso3:'3. Usted acepta no utilizar Tip Tip para realizar transacciones fraudulentas o ilegales.',
        CondicionDeUso4:'4. Usted acepta no intentar eludir las medidas de seguridad implementadas en nuestra aplicación ni interferir con su funcionamiento normal',
        CondicionDeUso5:'5. Usted acepta no utilizar Tip Tip para enviar contenido o mensajes que sean difamatorios, obscenos, ofensivos, discriminatorios o que violen los derechos de terceros.',
        CondicionDeUso6:'6. Nos reservamos el derecho de suspender o cancelar su acceso a Tip Tip en cualquier momento y por cualquier motivo, incluida la violación de estas Condiciones de Uso.',
        CondicionDeUso7:'Al utilizar nuestra aplicación, usted acepta cumplir con estas Condiciones de Uso.',
        Comisionytarifas:"Comisión y Tarifas",
        ComisionP:"La comisión por el uso de la app solo se cobra a los deliveries o prestadores del servicio que efectivamente reciban propinas. No tiene ningún costo el instalar la app como tampoco el registrarse.",
        ComisionP2:"La comisión de la app Tiptip comienza a cobrarse después que el delivery o prestador del servicio alcance los primeros $20 dólares de la semana (de acuerdo al corte, es decir la semana o conteo inicia los martes), comisión que será de $1 dólar por cada $20 dólares o fracción de este monto. Se tiene un día de inicio y un día de corte del conteo. El día de inicio es el martes a las 00:00 horas y el día del corte es el día lunes de la siguiente semana a las 23:59:59.",
        ComisionP3:"El día que se realiza el giro o transferencia a los deliveries o prestadores del servicio es el día viernes de cada semana a la cuenta registrada en la app, es responsabilidad exclusiva del delivery o prestador del servicio registrar correctamente los datos de la cuenta y el banco. Todos los depósitos se harán exclusivamente en la cuenta bancaria, no se expedirá cheque ni se dará dinero en efectivo.",
        ComisionP4:"La plataforma de pago paypal es el canal que usa la app TipTip para que los clientes realicen la transacción de la propina. Por cuestiones de política de los sistemas operativos se debe usar un canal reconocido. Paypal cobra una comisión por transacción del 2.9% y una tarifa fija por transacción de $0.30 dólares. Esos cobros dependen exclusivamente de la plataforma PayPal y ellos los pueden cambiar sin previo aviso, sin que la app Tiptip tenga injerencia o responsabilidad alguna en ello.",
        PagoTitulo:"Pago",
        Pago:"El pago corresponde al valor total individual que cada delivery o prestador del servicio registro en el sistema realizado por parte de los compradores, el cual se consigna los días viernes de cada semana, previos los descuentos y comisiones indicadas en el acápite de comisiones y tarifas.",
        Pago2:"Se lleva un registro exacto individual en el sistema el cual indica a cual QR pertenece la propina que se hizo y el delivery o prestador del servicio al que pertenece ese QR.",
        Pago3:"La app enviara una notificación al beneficiario de la propina de manera inmediata la cual será pagada, previos los descuentos y comisiones indicados el día viernes de cada semana.",
        Agradecimiento:'Gracias por utilizar Tip Tip y por confiar en nosotros para sus transacciones de propinas.',
        salir: 'Salir',
        
    }
    const idiomaIngles = {
        Title: 'PRIVACY POLICY AND TERMS OF USE',
        greeting: 'Thank you for using Tip Tip, a mobile application designed to send tips from customers to service providers through PayPal. We value your trust and are committed to protecting your privacy and personal data. This Privacy Policy describes how we collect, use, and share your information when you use our application.',
        InformationTitle: 'Information we collect',
        Information1: '1. PayPal account information: We will need to access certain information from your PayPal account to process tip transactions.',
        Information2: '2. Transaction information: We may collect details about the tip transactions you make through the application, including the tip amount, recipient, and date and time of the transaction.',
        Information3: 'Registration information: We may collect information about your mobile device, including IP address, device type, operating system version, and unique device identification.',
        Information4: 'Location information: We may collect information about your location when you use our application, using technologies such as GPS and Wi-Fi.',
        Information5: 'Information provided by you: We may collect information that you voluntarily provide to us, such as comments, suggestions, or inquiries you submit through the application.',
        UseInformationTitle: 'How we use your information',
        UseInformation: 'We use the collected information to:',
        UseInformation1: '1. Process tip transactions through PayPal.',
        UseInformation2: '2. Personalize your experience and improve our application.',
        UseInformation3: '3. Communicate with you, respond to your inquiries, and provide assistance.',
        UseInformation4: 'Comply with applicable laws and regulations in the country and/or states.',
        ShareInformation: 'Sharing your information',
        ShareInformation2: 'We do not sell, rent, or share your personal information with third parties, except in the following circumstances:',
        ShareInformation3: '1. With your explicit consent',
        ShareInformation4: '2. With trusted service providers who need to access your information to provide services on our behalf, such as payment processors and analytics services.',
        ShareInformation5: '3. When we are legally obligated to do so, to comply with a court order, law, or regulation.',
        SecurityTitle: 'Information security',
        SecurityInformation: 'We are committed to protecting the security of your information. We implement technical, administrative, and physical security measures to protect your information against unauthorized access, disclosure, or destruction.',
        PrivacyRightsTitle: 'Your privacy rights',
        PrivacyRights1: 'You have certain rights regarding your personal information, including the right to access, correct, delete, restrict, or request the portability of your information. If you wish to exercise any of these rights, please contact us through the contact information provided at the end of this Privacy Policy.',
        PolicyChangesTitle: 'We reserve the right to update this Privacy Policy at any time. We will notify you of any significant changes to this Privacy Policy, either through a notification in the application or by other means.',
        ContactTitle: 'Contact',
        Contact1: 'If you have any questions or concerns about our Privacy Policy, please contact us at tiptipcontact@plazasleongroupllc.com or through +1 (484) 369-1165.',
        Contact2: 'By using our application, you agree to the terms and conditions described in this Privacy Policy.',
        TermsOfUse: 'In addition to our Privacy Policy, by using Tip Tip, you agree to comply with the following terms:',
        TermsOfUse1: '1. You are responsible for maintaining the confidentiality of your user account and all activities that occur under your account.',
        TermsOfUse2: '2. You agree to use Tip Tip solely for legal purposes and in accordance with all applicable laws and regulations.',
        TermsOfUse3: '3. You agree not to use Tip Tip for fraudulent or illegal transactions.',
        TermsOfUse4: '4. You agree not to attempt to circumvent the security measures implemented in our application or interfere with its normal operation.',
        TermsOfUse5: '5. You agree not to use Tip Tip to send content or messages that are defamatory, obscene, offensive, discriminatory, or that violate the rights of third parties.',
        TermsOfUse6: '6. We reserve the right to suspend or terminate your access to Tip Tip at any time and for any reason, including violation of these Terms of Use.',
        TermsOfUse7: 'By using our application, you agree to comply with these Terms of Use.',
        Acknowledgement: 'Thank you for using Tip Tip and for trusting us with your tip transactions.',
        salir: 'Salir',
    };
    const Salir = async () => {
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


    return (
        <View style={styles.container}>
            <View style={styles.backgroundImageContainer}>
                <Image source={fondo} alt="Fondo Tip tip" style={styles.backgroundImage} />
            </View>
            <View style={[styles.contenedorOpciones, (isIOS ? { marginTop: 43 } : {})]}>
            <TouchableOpacity
                    onPress={() => { navigate.goBack(); }}
                    style={[styles.textoOpcionesF, styles.flecha]}>
                    <SvgFlecha />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => { Salir() }}
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
                <Text style={[styles.textoNormal, { fontWeight: '800', width: '100%', paddingLeft: 20, textAlign: 'left' }]}>{ingles ? idiomaIngles.Acknowledgement : idiomaSpanol.Agradecimiento}</Text>
                <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center' }}>
                <Text style={[styles.textoNormal, { fontWeight: '800', width: '100%', paddingLeft: 20, textAlign: 'left' }]}>{ingles ? idiomaIngles.Title : idiomaSpanol.Titulo}</Text>
                <Text style={styles.textoNormal}>{ingles ? idiomaIngles.greeting : idiomaSpanol.saludo}</Text>
                <Text style={[styles.textoNormal, { fontWeight: '800', width: '100%', paddingLeft: 20, textAlign: 'left' }]}>{ingles ? idiomaIngles.InformationTitle : idiomaSpanol.InformacionTitulo}</Text>
                <Text style={styles.textoNormal}>{ingles ? idiomaIngles.Information1 : idiomaSpanol.Informacion1}</Text>
                <Text style={styles.textoNormal}>{ingles ? idiomaIngles.Information2 : idiomaSpanol.Informacion2}</Text>
                <Text style={styles.textoNormal}>{ingles ? idiomaIngles.Information3 : idiomaSpanol.Informacion3}</Text>
                <Text style={styles.textoNormal}>{ingles ? idiomaIngles.Information4 : idiomaSpanol.Informacion4}</Text>
                <Text style={styles.textoNormal}>{ingles ? idiomaIngles.Information5 : idiomaSpanol.Informacion5}</Text>
                <Text style={[styles.textoNormal, { fontWeight: '800', width: '100%', paddingLeft: 20, textAlign: 'left' }]}>{ingles ? idiomaIngles.UseInformationTitle : idiomaSpanol.UsoinformacionTitulo}</Text>
                <Text style={styles.textoNormal}>{ingles ? idiomaIngles.UseInformation : idiomaSpanol.Usoinformacion}</Text>
                <Text style={styles.textoNormal}>{ingles ? idiomaIngles.UseInformation1 : idiomaSpanol.Usoinformacion1}</Text>
                <Text style={styles.textoNormal}>{ingles ? idiomaIngles.UseInformation2 : idiomaSpanol.Usoinformacion2}</Text>
                <Text style={styles.textoNormal}>{ingles ? idiomaIngles.UseInformation3 : idiomaSpanol.Usoinformacion3}</Text>
                <Text style={styles.textoNormal}>{ingles ? idiomaIngles.UseInformation4 : idiomaSpanol.Usoinformacion4}</Text>
                <Text style={[styles.textoNormal, { fontWeight: '800', width: '100%', paddingLeft: 20, textAlign: 'left' }]}>{ingles ? idiomaIngles.ShareInformation : idiomaSpanol.Compartirinformacion}</Text>
                <Text style={styles.textoNormal}>{ingles ? idiomaIngles.ShareInformation2 : idiomaSpanol.Compartirinformacion2}</Text>
                <Text style={styles.textoNormal}>{ingles ? idiomaIngles.ShareInformation3 : idiomaSpanol.Compartirinformacion3}</Text>
                <Text style={styles.textoNormal}>{ingles ? idiomaIngles.ShareInformation4 : idiomaSpanol.Compartirinformacion4}</Text>
                <Text style={styles.textoNormal}>{ingles ? idiomaIngles.ShareInformation5 : idiomaSpanol.Compartirinformacion5}</Text>
                <Text style={[styles.textoNormal, { fontWeight: '800', width: '100%', paddingLeft: 20, textAlign: 'left' }]}>{ingles ? idiomaIngles.SecurityTitle : idiomaSpanol.TituloSeguridad}</Text>
                <Text style={styles.textoNormal}>{ingles ? idiomaIngles.SecurityInformation : idiomaSpanol.SeguridadInformacion}</Text>
                <Text style={[styles.textoNormal, { fontWeight: '800', width: '100%', paddingLeft: 20, textAlign: 'left' }]}>{ingles ? idiomaIngles.PrivacyRightsTitle : idiomaSpanol.DerechosPTitulo}</Text>
                <Text style={styles.textoNormal}>{ingles ? idiomaIngles.PrivacyRights1 : idiomaSpanol.Derechos1}</Text>
                <Text style={[styles.textoNormal, { fontWeight: '800', width: '100%', paddingLeft: 20, textAlign: 'left' }]}>{ingles ? idiomaIngles.PolicyChangesTitle : idiomaSpanol.CambiosEnLaPoliticaTitulo}</Text>
                <Text style={[styles.textoNormal, { fontWeight: '800', width: '100%', paddingLeft: 20, textAlign: 'left' }]}>{ingles ? idiomaIngles.ContactTitle : idiomaSpanol.ContactoTitulo}</Text>
                <Text style={styles.textoNormal}>{ingles ? idiomaIngles.Contact1 : idiomaSpanol.Contacto1}</Text>
                <Text style={styles.textoNormal}>{ingles ? idiomaIngles.Contact2 : idiomaSpanol.Contacto2}</Text>
                <Text style={[styles.textoNormal, { fontWeight: '800', width: '100%', paddingLeft: 20, textAlign: 'left' }]}>{ingles ? idiomaIngles.TermsOfUse : idiomaSpanol.CondicionesdeUso}</Text>
                <Text style={styles.textoNormal}>{ingles ? idiomaIngles.TermsOfUse1 : idiomaSpanol.CondicionDeUso1}</Text>
                <Text style={styles.textoNormal}>{ingles ? idiomaIngles.TermsOfUse2 : idiomaSpanol.CondicionDeUso2}</Text>
                <Text style={styles.textoNormal}>{ingles ? idiomaIngles.TermsOfUse3 : idiomaSpanol.CondicionDeUso3}</Text>
                <Text style={styles.textoNormal}>{ingles ? idiomaIngles.TermsOfUse4 : idiomaSpanol.CondicionDeUso4}</Text>
                <Text style={styles.textoNormal}>{ingles ? idiomaIngles.TermsOfUse5 : idiomaSpanol.CondicionDeUso5}</Text>
                <Text style={styles.textoNormal}>{ingles ? idiomaIngles.TermsOfUse6 : idiomaSpanol.CondicionDeUso6}</Text>
                <Text style={styles.textoNormal}>{ingles ? idiomaIngles.TermsOfUse7 : idiomaSpanol.CondicionDeUso7}</Text>
                <Text style={styles.textoNormal}>{ingles ? idiomaIngles.Acknowledgement : idiomaSpanol.Agradecimiento}</Text>
                </ScrollView>
            </LinearGradient>
        </View>
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
    backgroundImageContainer: {
        height: '100%',
        width: '100%',
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    ScrollView: {
        width: '90%',
        height: '100%'
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
    vistaIcono: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 15,
            },
        }),
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


