import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { firebase } from "../config";
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate("SaleScreen");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const loginUser = async (email, password) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      await AsyncStorage.setItem("isLoggedIn", "true"); // Set login status
      navigation.navigate("SaleScreen");
    } catch (error) {
      console.warn("Login Error:", error.code, error.message);
      console.log(AsyncStorage);
      console.log(
        require("@react-native-async-storage/async-storage/package.json")
          .version
      );

      alert(error.message);
    }
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
        if (isLoggedIn === "true") {  
          navigation.navigate("SaleScreen");
        } else {
          navigation.navigate("LoginScreen");
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar barStyle="default" />

      <View
        style={{
          alignItems: "center",
          marginTop: 40,
        }}
      >
        <Image source={require("../asset/logo.png")} style={styles.logo} />
      </View>
      <View style={{ marginLeft: 20 }}>
        <Text
          style={{
            color: "white",
            fontWeight: "600",
            fontSize: 24,
          }}
        >
          Log in
        </Text>
      </View>

      <ScrollView>
        <View style={{ alignItems: "center" }}>
          <View style={{ width: "95%", marginTop: 10, marginLeft: 20 }}>
            <Text style={[styles.inputheading, {}]}>Email or Username</Text>

            <View style={[styles.inputfld]}>
              <TextInput
                style={styles.textinput}
                placeholder="Email"
                onChangeText={(email) => setEmail(email)}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={{ width: "95%", marginLeft: 20 }}>
            <Text style={[styles.inputheading, {}]}> Password</Text>

            <View style={[styles.inputfld]}>
              <TextInput
                style={styles.textinput}
                placeholder="Password"
                onChangeText={(password) => setPassword(password)}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Image
                  source={
                    showPassword
                      ? require("../asset/hide.png")
                      : require("../asset/show.png")
                  }
                  style={styles.passwordIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ width: "90%", marginTop: 50, alignSelf: "center" }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#FE9701",
              height: 50,
              borderRadius: 6,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => loginUser(email, password)}
          >
            <Text style={{ fontWeight: "700" }}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
const styles = StyleSheet.create({
  logo: {
    height: 90,
    width: 140,
    resizeMode: "contain",
  },
  inputView: {
    width: "90%",
    marginTop: 10,
  },
  inputs: {
    borderWidth: 1,
    borderColor: "white",
    height: 42,
    borderRadius: 8,
    paddingLeft: 20,
    color: "white",
    marginTop: 10,
  },
  inputheading: {
    color: "white",
    fontSize: 16,
  },
  selectedList: {
    width: "90%",
    borderWidth: 1,
    borderColor: "white",
    marginTop: 20,
    borderRadius: 6,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,

    borderColor: "white",
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },

  placeholderStyle: {
    fontSize: 16,
    color: "#b6bab7",
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  inputfld: {
    height: 45,
    width: "90%",
    borderRadius: 8,
    marginVertical: 10,
    paddingLeft: 30,
    borderWidth: 1,
    borderColor: "black",
    justifyContent: "center",
  },
  iconContainer: {
    position: "absolute",
    right: 10,
    padding: 10,
  },
  passwordIcon: {
    height: 20,
    width: 20,
    resizeMode: "contain",
    tintColor: "#FE9701",
  },
  termstxt: {
    color: "white",
  },
  socialIcon: {
    height: 30,
    width: 30,
  },
  socialIconTxt: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
    paddingLeft: "20%",
  },
  SocialBox: {
    width: "90%",
    borderWidth: 1,
    borderColor: "white",
    flexDirection: "row",
    height: 55,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 20,
    paddingLeft: 20,
  },
});
