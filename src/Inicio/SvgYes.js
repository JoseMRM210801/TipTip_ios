import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';

const SvgYes = (props) => {
    const svgXml = `
        <?xml version="1.0" encoding="utf-8"?>
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 120 120" style="enable-background:new 0 0 120 120;" xml:space="preserve">
            <rect width="100%" height="100%" fill="#F52A2A"/>
            <text x="50%" y="50%" font-family="Arial" font-size="36" fill="white" text-anchor="middle" dominant-baseline="central" dy=".3em">
            ¡Yes!
            </text>
        </svg>
    `;

    return (
        <View style={styles.container}>
            <SvgXml xml={svgXml} height={80} width={80} fill={props.fill} stroke={props.stroke} strokeWidth={0.5} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F52A2A', // Ajusta este valor según el color deseado para el fondo
    },
});

export default SvgYes;
