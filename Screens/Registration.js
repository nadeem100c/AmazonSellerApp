// import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import { TextInput } from 'react-native-gesture-handler'
// import * as SplashScreen from 'expo-splash-screen'
// import { firebase } from '../config'



// const RegisterScreen = ({ navigation }) => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [confirmedPassword, setConfirmedPassword] = useState("");
//     const [firstName, setfirstName] = useState("");
//     const [lastName, setLastName] = useState("");


//     const registrationUser = async (email, password) => {
       
//         try {
//             await firebase.auth().createUserWithEmailAndPassword(email, password);

//             const verificationUrl = "https://fir-73cd7.firebaseapp.com";
//             await firebase.auth().currentUser.sendEmailVerification({
//                 handleCodeInApp: true,
//                 url: verificationUrl,
//             });

//             // Store user data in Firestore 
//             await firebase.firestore().collection("UserData")
//                 .doc(firebase.auth().currentUser.uid)
//                 .set({
//                     firstName,
//                     lastName,
//                     email,
//                     password
//                 });

//             alert("Verification email sent and user registered!");
//         } catch (error) {
//             alert(error.message);
//         }
//     };

//     return (

//         <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
//             <View>
//                 <View style={{ alignItems: "center" }}>
//                     <Text style={styles.title}>
//                         Register to Get Started!
//                     </Text>
//                 </View>

               
               
//                 <View style={styles.input}>
//                     <TextInput
//                         style={styles.textinput}
//                         placeholder="Email"
//                         onChangeText={(email) => setEmail(email)}
//                         autoCapitalize="none"
//                         autoCorrect={false}
//                         keyboardType="email-address"
//                     />
//                 </View>
//                 <View style={styles.input}>
//                     <TextInput
//                         style={styles.textinput}
//                         placeholder="Password"
//                         onChangeText={(password) => setPassword(password)}
//                         autoCapitalize="none"
//                         autoCorrect={false}
//                         secureTextEntry={true}
//                     />
//                 </View>
               

//                 <TouchableOpacity
//                     style={styles.loginbtn2}
//                     onPress={() => registrationUser(email, password, )}
//                 >
//                     <Text style={styles.loginbtn}>
//                         Register
//                     </Text>
//                 </TouchableOpacity>

               

               
//             </View>
//         </SafeAreaView>

//     )
// }

// export default RegisterScreen

// const styles = StyleSheet.create({
//     backbtn: {
//         height: 40,
//         width: 40,
//         marginTop: "5%",
//         marginLeft: '7%'
//     },
//     title: {
//         fontWeight: "600",
//         fontSize: 20,
//         lineHeight: 28,
//         marginTop: 87,
        

//     },
//     input: {
//         width: '85%',
//         height: 43,
//         marginTop: 8,
//         alignSelf: "center",
//         backgroundColor: "#E8ECF4",
//         borderRadius: 8,
//         justifyContent: "center",
//         paddingLeft: 17

//     },
//     passwordinput: {
//         width: '85%',
//         height: 43,
//         marginTop: 8,
//         alignSelf: "center",
//         backgroundColor: "#E8ECF4",
//         borderRadius: 8,
//         justifyContent: "center",
//         paddingLeft: 17
//     },
//     forgetpassword: {
//         alignItems: 'flex-end',
//         marginRight: "10%"
//     },
//     loginbtn: {
//         alignSelf: "center",
//         color: "white",
//         fontWeight: "600",
        
//     },
//     Line: {
//         flexDirection: "row",
//         marginTop: 24,
//         alignSelf: "center"
//     },
//     socialIcons: {
//         marginTop: 24,
//         flexDirection: "row",
//         alignSelf: "center",
//     },
//     facebookicon: {
//         height: 43,
//         width: 95,
//         margin: 6,
//         borderWidth: 1,
//         borderColor: "#4092FF",
//         borderRadius: 5

//     },
//     googleicon: {
//         height: 43,
//         width: 95,
//         margin: 6,
//         borderColor: "#FBBB00",
//         borderRadius: 5,
//         borderWidth: 1,

//     },
//     appleicon: {
//         height: 43,
//         width: 95,
//         margin: 6,
//         borderColor: "#000000",
//         borderRadius: 5,
//         borderWidth: 1,
//     },
//     registerbtn: {
//         flexDirection: "row",
//         alignSelf: "center",
//         marginTop: 24,
//     },
//     loginbtn2: {
//         marginTop: 32,
//         backgroundColor: "#7689D6",
//         height: 43,
//         width: "85%",
//         alignSelf: "center",
//         borderRadius: 8,
//         justifyContent: "center",
//         paddingLeft: 17
//     },
//     input1: {
//         width: '85%',
//         height: 43,
//         marginTop: 24,
//         alignSelf: "center",
//         backgroundColor: "#E8ECF4",
//         borderRadius: 8,
//         justifyContent: "center",
//         paddingLeft: 17,
//       },
//     line: {
//         borderBottomWidth: 2,
//         width: 90,
//         borderColor: "#E8ECF4"
//     }


// })