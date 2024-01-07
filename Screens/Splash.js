import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

const Splash = () => {
    useEffect(() => {
        setTimeout(() => {
            
        }, 2000);
    }, []);

    return (
        <View style={styles.container}>
            <Animatable.View
                animation="zoomIn"
                duration={1500}
                style={styles.imageContainer}
            >
                <Image
                    source={require('../asset/logo.png')}
                    style={styles.image}
                />
            </Animatable.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    imageContainer: {
        width: 200,
        height: 200,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
});

export default Splash;
