import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { Camera, CameraType } from 'react-native-camera-kit';

export const LectorQR = () => {
  const navigate = useNavigation();

  const ResultQR = (value:string) => {
    //se le envia por parametro el valor del QR
    navigate.navigate('BotonPropina', { value: value });
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

}