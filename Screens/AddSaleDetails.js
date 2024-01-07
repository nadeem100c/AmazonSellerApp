import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import * as Progress from "react-native-progress";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { firebase } from "../config";

export default function AddSaleDetails({ navigation }) {
  const [sale, setSale] = useState("");
  const [units, setUnits] = useState("");
  const [balance, setBalance] = useState("");
  const [nextPayment, setNextPayment] = useState("");
  const [customerFeedback, setCustomerFeedback] = useState("");
  const [sellerFeedback, setSellerFeedback] = useState("");
  const [isLoading, setLoading] = useState(false);

  const saveSaleDetails = () => {
    setLoading(true);

    const parsedSale = parseFloat(sale);
    const parsedUnits = parseFloat(units);
    const parsedBalance = parseFloat(balance);

    const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    firebase
      .firestore()
      .collection("SaleDetails")
      .add({
        todaySale: parsedSale,
        todayUnits: parsedUnits,
        currentBalance: parsedBalance,
        nextPaymentDate: nextPayment,
        customerFeedback: customerFeedback,
        sellerFeedback: sellerFeedback,
        createdAt: timestamp,
      })
      .then(() => {
        console.log("Sale details saved successfully!");
        navigation.navigate("SaleScreen");
      })
      .catch((error) => {
        console.error("Error saving sale details: ", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <Progress.Bar indeterminate width={330} color="#FF9700" />
        </View>
      )}
      <View
        style={[styles.container, { display: isLoading ? "none" : "flex" }]}
      >
        <View
            style={styles.header}
          >
            <View style={{ flexDirection: "row" }}>
              <Image
                source={require("../asset/drawer.png")}
                style={[
                  {
                    height: 16,
                    width: 20,
                    resizeMode: "contain",
                    alignSelf: "center",
                  },
                  { marginLeft: 15 },
                ]}
              />
              <Image
                source={require("../asset/flag.png")}
                style={[styles.headerIcon, { marginLeft: 15 }]}
              />
            </View>

           
              <Image
                source={require("../asset/logo.png")}
                style={styles.logo}
              />

            <MaterialCommunityIcons
              name="image-filter-center-focus-weak"
              size={30}
              color="#898989"
            />
          </View>
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Text
            style={{
              fontWeight: "600",
              fontSize: 20,
              fontFamily: "Inter-Medium",
            }}
          >
            Add Sale Details
          </Text>
        </View>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <View style={styles.inputView}>
              <Text style={styles.inputheading}>Enter Today Sale</Text>
              <TextInput
                placeholder="Sales today so far"
                style={styles.inputs}
                value={sale}
                onChangeText={(text) => setSale(text)}
              />
            </View>

            <View style={styles.inputView}>
              <Text style={styles.inputheading}>Enter Today Units </Text>
              <TextInput
                placeholder="Unit today so far"
                placeholderTextColor={"#9da39e"}
                style={styles.inputs}
                value={units}
                onChangeText={(text) => setUnits(text)}
              />
            </View>
            <View style={styles.inputView}>
              <Text style={styles.inputheading}>Enter Current Balance</Text>
              <TextInput
                placeholder="Current Balance"
                placeholderTextColor={"#9da39e"}
                style={styles.inputs}
                value={balance}
                onChangeText={(text) => setBalance(text)}
              />
            </View>
            <View style={styles.inputView}>
              <Text style={styles.inputheading}>Next payment Date</Text>
              <TextInput
                placeholder="Next payment"
                placeholderTextColor={"#9da39e"}
                style={styles.inputs}
                value={nextPayment}
                onChangeText={(text) => setNextPayment(text)}
              />
            </View>
            <View style={styles.inputView}>
              <Text style={styles.inputheading}>Customer feedback</Text>
              <TextInput
                placeholder="Customer feedback"
                placeholderTextColor={"#9da39e"}
                style={styles.inputs}
                value={customerFeedback}
                onChangeText={(text) => setCustomerFeedback(text)}
              />
            </View>
            <View style={styles.inputView}>
              <Text style={styles.inputheading}>Seller feedback</Text>
              <TextInput
                placeholder="Seller feedback"
                placeholderTextColor={"#9da39e"}
                style={styles.inputs}
                value={sellerFeedback}
                onChangeText={(text) => setSellerFeedback(text)}
              />
            </View>
          </View>

          <View
            style={{
              alignItems: "center",
              height: 50,
              width: "90%",
              justifyContent: "center",
              backgroundColor: "#FF9700",
              borderRadius: 6,
              alignSelf: "center",
              marginTop: 20,
            }}
          >
            <TouchableOpacity onPress={saveSaleDetails}>
              <Text
                style={{
                  textAlign: "center",
                  color: "white",
                  fontWeight: "600",
                  fontSize: 15,
                  fontFamily: "Inter-Medium",
                }}
              >
                Save Changes
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F3F5",
  },
  header: {
    height: 60,
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 1,
    backgroundColor: "white",
  },
  headerIcon: {
    height: 30,
    width: 30,
  },
  logo: {
    height: 50,
    width: 100,
    resizeMode: "contain",
  },
  salebox: {
    height: 70,
    width: 150,
    borderRadius: 8,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  saleIndicatorBoxes: {
    marginTop: 10,
    marginLeft: 20,
    flexDirection: "row",
  },
  saleCurency: {
    fontSize: 20,
  },
  USDtxt: {
    color: "#6F7072",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "400",
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  saleheading: {
    color: "#396EAE",
    fontWeight: "500",
  },
  headingtxt: {
    marginLeft: 10,
    fontSize: 15,
    color: "#888888",
  },
  forwardIcon: {
    position: "absolute",
    right: 10,
  },
  staticBtn: {
    flexDirection: "row",
    borderWidth: 1,
    paddingLeft: 10,
    height: 50,
    alignItems: "center",
    borderColor: "#CFD0D2",
  },
  inputView: {
    width: "90%",
    marginTop: 10,
  },
  inputs: {
    borderWidth: 1,
    height: 50,
    borderRadius: 6,
    paddingLeft: 20,
    marginTop: 10,
    borderColor: "grey",
    fontFamily: "Inter-Medium",
  },
  inputheading: {
    fontWeight: "500",
    fontSize: 14,
    fontFamily: "Inter-Medium",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius:1
  },
});
