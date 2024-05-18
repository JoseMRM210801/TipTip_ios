import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, View } from 'react-native';

export const Loader = () => {
    const Circle = ({ animation, color }: { animation: Animated.Value; color: string }) => {
        const style = {
            transform: [{ scale: animation }],
            opacity: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
            }),
            backgroundColor: color
        };

        return <Animated.View style={[styles.circle, style]} />;
    };
    const colors = ['red', 'green', 'blue', 'yellow'];
    const animations = [
        useRef(new Animated.Value(1)).current,
        useRef(new Animated.Value(0)).current,
        useRef(new Animated.Value(0)).current,
        useRef(new Animated.Value(0)).current,
    ];

    useEffect(() => {
        const startAnimation = (index: number) => {
            Animated.sequence([
                Animated.timing(animations[index], {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(animations[index], {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start(() => startAnimation((index + 1) % animations.length));
        };

        startAnimation(0);
    }, []);
    return (
        <View style={styles.container}>
            {animations.map((animation, index) => (
                <Circle key={index} animation={animation} color={colors[index]} />
            ))}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    circle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'blue',
        margin: 5,
    },

});