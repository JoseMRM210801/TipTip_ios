import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, ImageBackground, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AppContext } from "../Contexto/AppContext";
import { Usuario } from '../Modelos/Usuario';
import { useNavigation } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import SvgFlecha from '../Admin/SvgFlecha';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ruta } from '../Ruta/Ruta';

export const CuentaRepartidor = () => {
  const fondo: any = require("../../assets/Fondo-Tiptip-01.jpg");
  const contexto = useContext(AppContext);
  const [ingles, setIngles] = useState(contexto.usuario.English);
  const [totalPropinas, setTotalPropinas] = useState<number>(0);
  const [comisionTipTip, setComisionTipTip] = useState<number>(0);
  const [comisionReal, setComisionReal] = useState<number>(0); // Estado para la comisión real
  const [data, setData] = useState<any[]>([]); // Estado para la tabla de datos
  const [cellWidth, setCellWidth] = useState(0);
  const [modalVisible, setModalVisible] = useState(false); // Estado para mostrar/ocultar el modal
  const [modalInfoVisible, setModalInfoVisible] = useState(false); // Estado para el nuevo modal de información de la tabla

  // Lógica para obtener datos de la API
  useEffect(() => {
    setIngles(contexto.usuario.English);

    // Llamada a la API para obtener el total de propinas
    fetch(`${Ruta}/tip/total/${contexto.usuario.User}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': contexto.usuario.Token
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.Donado) {
          const donado = parseFloat(data.Donado);
          setTotalPropinas(donado);
          // Calculamos la comisión de TipTip
          const comision = calcularComisionTipTip(donado);
          setComisionTipTip(comision);
          // Calculamos la comisión real (total de propinas - comisión de TipTip)
          const comisionRealCalculada = donado - comision;
          setComisionReal(comisionRealCalculada);
        }
      })
      .catch(error => {
        console.error("Error al obtener el total de propinas:", error);
      });

    // Obtener datos de la tabla
    fetch(`${Ruta}/tip/delivery/${contexto.usuario.Id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': contexto.usuario.Token
      }
    })
      .then(res => res.json())
      .then(datos => {
        if (datos) {
          const headers = ingles ? ['#', 'Client', '$', 'Paypal Commission', 'Date'] : ['#', 'Cliente', '$', 'Comision Paypal', 'Fecha'];
          datos.unshift(headers); // Agrega el encabezado adecuado al principio de los datos
          setData(datos);
          setCellWidth(Dimensions.get('window').width / 4); // Ajusta el ancho de las celdas
        }
      })
      .catch(error => {
        console.error("Error al obtener los datos de la tabla:", error);
      });
  }, [ingles, contexto.usuario.English, contexto.usuario.Id, contexto.usuario.Token]);

  // Función para calcular la comisión de TipTip
  const calcularComisionTipTip = (total: number) => {
    let comision = 0;

    // Aplicamos $1 por cada $20 y $0.10 por cada dólar adicional
    if (total > 20) {
        const cantidadSobre20 = total - 20; // Parte que excede los primeros $20
        const comisionBase = Math.floor(total / 20); // Se resta $1 por cada $20 completos
        const comisionAdicional = cantidadSobre20 * 0.10; // Se resta $0.10 por cada dólar adicional sobre los $20
        comision = comisionBase + comisionAdicional;
    }

    return comision;
  };

  const idiomaSpanol = {
    salir: 'Salir',
    comisionExplicacion: 'Se aplica una comisión de $1 por cada $20. Además, se aplica una comisión de 0.10 por cada dólar adicional sobre los primeros $20.',
    cerrar: 'Cerrar',
    explicacion: '¿Qué significa esto?',
    infoTabla: 'La tabla contiene los siguientes datos:\n\n# - Número de entrada\nCliente - Nombre del cliente\n$ - Cantidad de propina\nComisión Paypal - Comisión aplicada por Paypal\nFecha - Fecha de la transacción'
  };
  const idiomaIngles = {
    salir: 'Exit',
    comisionExplicacion: 'A commission of $1 is applied for every $20. Additionally, a 0.10 commission is applied for every dollar beyond the first $20.',
    cerrar: 'Close',
    explicacion: 'What does this mean?',
    infoTabla: 'The table contains the following data:\n\n# - Entry number\nClient - Name of the client\n$ - Amount of tips\nPaypal Commission - Commission applied by Paypal\nDate - Date of the transaction'
  };

  const isIOS = DeviceInfo.getSystemName() === 'iOS';
  const navigate = useNavigation();

  const salir = async () => {
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
    };
    contexto.setUsuario(limpiarUsuario);
    try {
      await AsyncStorage.removeItem('email');
      await AsyncStorage.removeItem('password');
    } catch (error) {
      console.log(error);
    }
    navigate.navigate('Login' as never);
  };

  return (
    <View>
      <ImageBackground
        source={fondo}
        resizeMode='cover'
        style={styles.backgroundImageContainer}>
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
            setIngles(!ingles);
            contexto.setUsuario({ ...contexto.usuario, English: !ingles });
          }}>
            <Text style={styles.textoOpciones}>{ingles ? 'Es' : 'En'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalInfoVisible(true)}>
            <Text style={styles.textoOpciones}>?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.saludo}>
          <Text style={styles.textoSaludo}>{ingles ? 'Hello delivery' : 'Hola Repartidor'}</Text>
        </View>

        <LinearGradient
          colors={['rgba(255,255,255,1)', 'rgba(222,222,222,1)', 'rgba(255,255,255,1)']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 1.5 }}
          style={styles.containerInfo}>

          {/* Botón para abrir el modal que muestra la explicación de los valores de la tabla */}
          <View style={styles.botonInfoContainer}>
            <TouchableOpacity onPress={() => setModalInfoVisible(true)} style={styles.botonInterrogacion}>
              <Text style={{ fontSize: 18, color: '#000' }}>{ingles ? idiomaIngles.explicacion : idiomaSpanol.explicacion}</Text>
            </TouchableOpacity>
          </View>

          {/* Visualización del total de propinas, comisión de TipTip y comisión real */}
          <View style={styles.totalComisionContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.totalText}>Comisión de TipTip: ${comisionTipTip.toFixed(2)}</Text>
              <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.botonInterrogacion}>
                <Text style={{ fontSize: 18, color: '#000' }}>?</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.totalText}>Total Propinas: ${comisionReal.toFixed(2)}</Text>
          </View>

          {/* Modal que explica el cálculo de la comisión */}
          <Modal
            transparent={true}
            visible={modalVisible}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>
                  {ingles ? idiomaIngles.comisionExplicacion : idiomaSpanol.comisionExplicacion}
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cerrarBoton}>
                  <Text style={styles.cerrarBotonText}>{ingles ? idiomaIngles.cerrar : idiomaSpanol.cerrar}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Modal que explica los valores de la tabla */}
          <Modal
            transparent={true}
            visible={modalInfoVisible}
            animationType="slide"
            onRequestClose={() => setModalInfoVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>
                  {ingles ? idiomaIngles.infoTabla : idiomaSpanol.infoTabla}
                </Text>
                <TouchableOpacity onPress={() => setModalInfoVisible(false)} style={styles.cerrarBoton}>
                  <Text style={styles.cerrarBotonText}>{ingles ? idiomaIngles.cerrar : idiomaSpanol.cerrar}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <ScrollView horizontal={true} style={{ width: '100%' }}>
            <ScrollView>
              <View>
                {/* Renderizado de la tabla de datos */}
                <View>
                  {
                    data?.map((row: any[], index: number) => (
                      <View key={index} style={[{ flexDirection: 'row' }, index % 2 === 0 ? styles.filaPar : styles.filaImpar]}>
                        {row.map((cell: any, cellIndex: any) => (
                          <Text key={cellIndex} style={[{ width: cellWidth, padding: 10, borderWidth: 1, borderColor: '#ddd', textAlign: 'center', color: '#282828' }]}>
                            {cell}
                          </Text>
                        ))}
                      </View>
                    ))
                  }
                </View>
              </View>
            </ScrollView>
          </ScrollView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImageContainer: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
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
  flecha: {
    position: 'absolute',
    left: 10,
    top: 10,
    paddingTop: 5
  },
  saludo: {
    position: 'absolute',
    padding: 10,
    width: '90%',
    top: '10%',
  },
  textoSaludo: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
  },
  totalComisionContainer: {
    marginVertical: 20,
    alignItems: 'center'
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#001d38'
  },
  botonInterrogacion: {
    marginLeft: 8,
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  botonInfoContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    maxWidth: '80%',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#000'
  },
  cerrarBoton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  cerrarBotonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  filaPar: {
    backgroundColor: '#e8e8e8'
  },
  filaImpar: {
    backgroundColor: '#fff'
  }
});
