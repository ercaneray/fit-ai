import React from "react";
import { StyleSheet, Text, View } from "react-native";
import LottieView from "lottie-react-native";

function Loading() {


    return (

        <View style={styles.container}>
            <LottieView
                style={{
                    width: 200,
                    height: 200,
                }}
                source={require("../assets/animations/loading.json")}
                autoPlay loop

            />

        </View>

    );
}

export default Loading;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor:'#121212',
    }
})