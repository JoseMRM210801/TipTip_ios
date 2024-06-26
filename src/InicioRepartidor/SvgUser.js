import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';

const SvgUsuario = (props) => {
	const svgXml = `
        <?xml version="1.0" encoding="utf-8"?>
		<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
		viewBox="0 0 57.7 57.7" style="enable-background:new 0 0 57.7 57.7;" xml:space="preserve">
   <style type="text/css">
	   .st0{fill:url(#SVGID_1_);}
	   .st1{fill:url(#SVGID_00000064350397259109826840000002769814542746925715_);}
	   .st2{fill:url(#XMLID_00000132065142930617040960000003506779022538860427_);}
   </style>
   <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="39.8859" y1="8.9376" x2="51.4312" y2="8.9376">
	   <stop  offset="0" style="stop-color:#F52A2A"/>
	   <stop  offset="0.7671" style="stop-color:#FD5555"/>
   </linearGradient>
   <path class="st0" d="M51.4,8.9c0,3.2-2.6,5.8-5.8,5.8c-3.2,0-5.8-2.6-5.8-5.8s2.6-5.8,5.8-5.8C48.8,3.2,51.4,5.7,51.4,8.9z"/>
   <g>
	   
		   <linearGradient id="SVGID_00000047739940070928575800000002446932915332929969_" gradientUnits="userSpaceOnUse" x1="1.3588" y1="28.8409" x2="56.3233" y2="28.8409">
		   <stop  offset="0" style="stop-color:#DEDEDE"/>
		   <stop  offset="1" style="stop-color:#FFFFFF"/>
	   </linearGradient>
	   <path style="fill:url(#SVGID_00000047739940070928575800000002446932915332929969_);" d="M50.5,12c-1,1.6-2.8,2.7-4.9,2.7
		   c-3.2,0-5.8-2.6-5.8-5.8c0-1.7,0.8-3.3,1.9-4.3c-3.9-2.1-8.3-3.3-13-3.3C13.7,1.4,1.4,13.7,1.4,28.8c0,15.2,12.3,27.5,27.5,27.5
		   C44,56.3,56.3,44,56.3,28.8C56.3,22.5,54.2,16.6,50.5,12z"/>
	   
		   <linearGradient id="XMLID_00000075121897606943289940000000183003260304214957_" gradientUnits="userSpaceOnUse" x1="17.8085" y1="28.8409" x2="39.8736" y2="28.8409">
		   <stop  offset="0" style="stop-color:#F52A2A"/>
		   <stop  offset="0.7671" style="stop-color:#FD5555"/>
	   </linearGradient>
	   
		   <path id="XMLID_00000127019070778291537730000008548665491793871502_" style="fill:url(#XMLID_00000075121897606943289940000000183003260304214957_);" d="
		   M38.3,30.2c-1.3-1.2-3.3-1.6-5.9-1.5c1.7-1.2,2.8-3.1,2.8-5.3c0-3.5-2.9-6.4-6.4-6.4c-3.5,0-6.4,2.9-6.4,6.4c0,2.1,1,4,2.6,5.1
		   c-1.9-0.2-5.8,0-7,4.1c0,0,0,0.1,0,0.1v7.3c0,0.3,0.2,0.5,0.5,0.5h21.1c0.3,0,0.5-0.2,0.5-0.5v-6.9c0,0,0,0,0,0
		   C39.9,33.1,39.8,31.5,38.3,30.2z M23.2,23.5c0-3,2.5-5.5,5.5-5.5c3,0,5.5,2.5,5.5,5.5c0,3-2.5,5.5-5.5,5.5h-0.1
		   C25.7,29,23.2,26.5,23.2,23.5z M28.6,30.9h0.5l0.7,1.4l-1,1.9l-0.7-1.4L28.6,30.9z M28.1,29.9c0-0.2,0.1-0.3,0.3-0.3h0.9
		   c0.2,0,0.3,0.1,0.3,0.3c0,0.2-0.1,0.3-0.3,0.3h-0.9C28.2,30.3,28.1,30.1,28.1,29.9z M29.8,30.8c0.3-0.2,0.5-0.5,0.5-0.9
		   c0-0.1,0-0.2,0-0.2c0.4-0.1,0.8-0.2,1.1-0.4l-1.2,2.3L29.8,30.8z M28,30.8l-0.3,1.1l-1.3-2.5c0.3,0.1,0.7,0.2,1,0.3
		   c0,0.1,0,0.1,0,0.2C27.4,30.3,27.6,30.7,28,30.8z M38.9,39.7H18.8v-6.7c1.2-4.1,5.6-3.5,6.6-3.3l3,5.9c0.1,0.2,0.3,0.3,0.4,0.3h0
		   c0.2,0,0.3-0.1,0.4-0.3l3-5.8c2.4-0.2,4.2,0.2,5.4,1.2c1.1,1,1.3,2.1,1.3,2.3V39.7z"/>
   </g>
   </svg>
   
    `;

	return (
		<View style={styles.container}>
			<SvgXml xml={svgXml} height={40} width={40} fill={props.fill} stroke={props.stroke} strokeWidth={0.5} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default SvgUsuario;
