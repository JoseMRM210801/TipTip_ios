import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';

const SvgFlecha = (props) => {
    const svgXml = `
        <?xml version="1.0" encoding="utf-8"?>
		<svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path fill="rgb(212,46,46)" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M328 112L184 256l144 144"/></svg>
    `;

    return (
        <View style={styles.container}>
            <SvgXml xml={svgXml} height={20} width={20} strokeWidth={0.5} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default SvgFlecha;
