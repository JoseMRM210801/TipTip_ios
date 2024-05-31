import React, { useContext, useEffect, useState } from 'react';


import { useNavigation } from '@react-navigation/native';
import { Camera, CameraType } from 'react-native-camera-kit';
import { checkMultiple, PERMISSIONS, requestMultiple } from 'react-native-permissions';
import { View } from 'react-native';
import { Text } from 'react-native-svg';
import DeviceInfo from 'react-native-device-info';
import { AppContext } from '../Contexto/AppContext';



export const LectorQRPrueba = () => {
  const contexto = useContext(AppContext);
  const navigate = useNavigation();
  const [permissions, setPermissions] = useState(false);
  const ResultQR = (value: string) => {
    try {
      console.log(value);
      fetch(`https://bett-production.up.railway.app/api/delivery/user/${value}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'token': contexto.usuario.Token
        },

      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          if (data != null) {
            navigate.navigate('PruebaQR', { value: value });
          }
        })
    } catch (error) {
      console.log(error);
    }

  }

  const isIOS = DeviceInfo.getSystemName() === 'iOS';
  if (!isIOS) {
    useEffect(() => {
      checkMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.ANDROID.CAMERA]).then((statuses) => {
        console.log(statuses[PERMISSIONS.ANDROID.CAMERA])
        if (statuses[PERMISSIONS.IOS.CAMERA] === 'granted' || statuses[PERMISSIONS.ANDROID.CAMERA] === 'granted') {
          setPermissions(true);
        } else {
          requestMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.ANDROID.CAMERA]).then((statuses) => {
            if (statuses[PERMISSIONS.IOS.CAMERA] === 'granted' || statuses[PERMISSIONS.ANDROID.CAMERA] === 'granted') {
              setPermissions(true);
            }
          })
        }
      });
    }, [permissions])
    if (permissions === false) {
      return (
        <View>
          <Text>Permiso de camara denegado</Text>
        </View>
      )
    }
    return (
      <Camera
        // Barcode props
        CameraType={CameraType.Back}
        scanBarcode={true}
        onReadCode={(event: any) => ResultQR(event.nativeEvent.codeStringValue)} // optional
        showFrame={true} // (default false) optional, show frame with transparent layer (qr code or barcode will be read on this area ONLY), start animation for scanner, that stops when a code has been found. Frame always at center of the screen
        laserColor='red' // (default red) optional, color of laser in scanner frame
        frameColor='white' // (default white) optional, color of border of scanner frame
        style={{ flex: 1 }}
      />
    )

  } else {
    return (
      <Camera
        // Barcode props
        CameraType={CameraType.Back}
        scanBarcode={true}
        onReadCode={(event: any) => ResultQR(event.nativeEvent.codeStringValue)} // optional
       
        showFrame={true} // (default false) optional, show frame with transparent layer (qr code or barcode will be read on this area ONLY), start animation for scanner, that stops when a code has been found. Frame always at center of the screen
        laserColor='red' // (default red) optional, color of laser in scanner frame
        frameColor='white' // (default white) optional, color of border of scanner frame
        style={{ flex: 1 }}
      />
      
    )
  }


}