import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dropdown } from "react-native-element-dropdown";
import { BarChart } from "react-native-gifted-charts";
import { useFonts } from "expo-font";
import { firebase } from "../config";
import * as Progress from "react-native-progress";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saleDetailsRef } from "../config";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";

import {
  AntDesign,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";

export default function SaleScreen({ navigation }) {
  const [product, setProduct] = useState();
  const [Focus, setFocus] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [todaySale, setTodaySale] = useState("");
  const [unitsToday, setUnitsToday] = useState("");
  const [currentBalance, setCurrentBalance] = useState("");
  const [nextPaymentDate, setNextPaymentDate] = useState("");
  const [customerFeedback, setcustomerFeedback] = useState("");
  const [sellerFeedback, setSellerFeedback] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(null);

  const [progressBarComplete, setProgressBarComplete] = useState(false);
  const [currentUnits, setCurrentUnits] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("2");
  const [totalSales, setTotalSales] = useState(0);

  const [CulcolateProductValue, setCulcolateProductValue] = useState("1");
  const [duration, setDuration] = useState("2");
  const [unitsSold, setUnitsSold] = useState(0);
  const [percentageChange, setPercentageChange] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [stackData, setStackData] = useState([]);
  const [xAxisLabels, setXAxisLabels] = useState([]);

  const [lastMonthPercentageChange, setLastMonthPercentageChange] =
    useState(null);
  const [lastYearPercentageChange, setLastYearPercentageChange] =
    useState(null);

  useEffect(() => {
    fetchLatestSaleDetails();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (CulcolateProductValue === "2" && durationLabels[duration]) {
      setCurrentUnits(unitsToday);
      setSelectedDuration(durationLabels[duration]);
    } else {
      setCurrentUnits("");
    }
  }, [CulcolateProductValue, duration, unitsToday]);

  useEffect(() => {
    fetchSalesData(selectedDuration);
  }, [selectedDuration]);

  useEffect(() => {
    if (product === "2") {
      setCurrentUnits(unitsToday);
    } else {
      setCurrentUnits("");
    }
  }, [product, unitsToday]);

  useEffect(() => {
    if (CulcolateProductValue === "2") {
      setCurrentUnits(unitsToday);
    } else {
      setCurrentUnits("");
    }
  }, [CulcolateProductValue, unitsToday]);

  const durationLabels = {
    1: "Last 7 Days",
    2: "Last 30 Days",
    3: "Last 12 Months",
    4: "This week",
    5: "This month",
    6: "This year",
    7: "yesterDay",
  };
  const ChooseTimeValue = [
    { label: "Last 7 days", value: "1" },
    { label: "Last 30 days", value: "2" },
    { label: "Last 12 months", value: "3" },
    { label: "This week", value: "4" },
    { label: "This month", value: "5" },
    { label: "This year", value: "6" },
    { label: "yesterDay", value: "7" },
  ];

  {
    ChooseTimeValue.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ));
  }
  // const dynamicSpacing = stackData && stackData.length >= 8 ? 50 : 23;
  const fetchLatestSaleDetails = () => {
    setIsLoading(true);
    const saleDetailsRef = firebase.firestore().collection("SaleDetails");

    saleDetailsRef
      .orderBy("createdAt", "desc")
      .limit(1)
      .onSnapshot((querySnapshot) => {
        if (!querySnapshot.empty) {
          const latestSale = querySnapshot.docs[0].data();
          setTodaySale(latestSale.todaySale);
          setUnitsToday(latestSale.todayUnits);
          setCurrentBalance(latestSale.currentBalance);
          setNextPaymentDate(latestSale.nextPaymentDate);
          setcustomerFeedback(latestSale.customerFeedback);
          setSellerFeedback(latestSale.sellerFeedback);

          if (latestSale.createdAt) {
            const createdAtTimestamp = latestSale.createdAt;
            setUpdatedAt(new Date());
          } else {
            console.log(
              "No 'createdAt' field in latestSale or it's null/undefined."
            );
            setUpdatedAt(new Date());
          }
        } else {
          console.log("No sales data available.");
          setUpdatedAt(new Date());
        }
        setIsLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    const calculateLastMonthPercentageChange = async () => {
      try {
        const currentMonthSales = await fetchSalesForCurrentMonth();
        const previousMonthSales = await fetchSalesForPreviousMonth();
        const change = currentMonthSales - previousMonthSales;
        let percentageChange = (change / previousMonthSales) * 100;
        if (!isNaN(percentageChange)) {
          if (percentageChange > 0) {
            setLastMonthPercentageChange(`${percentageChange.toFixed(2)}% ↑`);
          } else if (percentageChange < 0) {
            setLastMonthPercentageChange(
              `-${Math.abs(percentageChange).toFixed(2)}% ↓`
            );
          } else {
            setLastMonthPercentageChange("No change");
          }
        } else {
          setLastMonthPercentageChange("--");
        }
      } catch (error) {
        console.error(
          "Error calculating last month's percentage change:",
          error
        );
        setLastMonthPercentageChange("Error");
      }
    };
    const saleDetailsRef = firebase.firestore().collection("SaleDetails");
    const unsubscribe = saleDetailsRef.onSnapshot(() => {
      calculateLastMonthPercentageChange();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const calculateLastYearPercentageChange = async () => {
      try {
        const previousYearData = await fetchPreviousYearData();
        const totalSalesLastYear = previousYearData.reduce(
          (total, sale) => total + parseFloat(sale.todaySale),
          0
        );
        const change = totalSales - totalSalesLastYear;
        let percentage = 0;
        if (totalSalesLastYear > 0) {
          percentage = (change / totalSalesLastYear) * 100;
        }
        if (!isNaN(percentage)) {
          const formattedPercentage = Math.abs(percentage).toFixed(2);
          if (percentage > 0) {
            setLastYearPercentageChange(`${formattedPercentage}% ↑`);
          } else if (percentage < 0) {
            setLastYearPercentageChange(`${formattedPercentage}% ↓`);
          } else {
            setLastYearPercentageChange("--");
          }
        } else {
          setLastYearPercentageChange("No data available");
        }
      } catch (error) {
        console.error("Error processing previous year's data:", error);
        setLastYearPercentageChange("Error");
      }
    };

    calculateLastYearPercentageChange();
  }, []);

  const calculatePercentageChange = async (currentSales, previousSales) => {
    try {
      const change = currentSales - previousSales;
      let percentageChange = (change / previousSales) * 100;

      if (!isNaN(percentageChange)) {
        if (percentageChange > 0) {
          setPercentageChange(`${percentageChange.toFixed(2)}% \u2191`);
        } else if (percentageChange < 0) {
          setPercentageChange(
            `${Math.abs(percentageChange).toFixed(2)}% \u2193`
          );
        } else {
          setPercentageChange("No change");
        }
      } else {
        setPercentageChange("--");
      }
    } catch (error) {
      console.error("Error calculating percentage change:", error);
      setPercentageChange("Error");
    }
  };

  const fetchSalesForCurrentMonth = async () => {
    try {
      const currentDate = new Date();
      const startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );

      const saleDetailsRef = firebase.firestore().collection("SaleDetails");
      const snapshot = await saleDetailsRef
        .where("createdAt", ">=", startDate)
        .where("createdAt", "<=", endDate)
        .get();

      const currentMonthData = snapshot.docs.map((doc) => ({
        todaySale: parseFloat(doc.data().todaySale),
      }));

      return currentMonthData.reduce(
        (total, sale) => total + sale.todaySale,
        0
      );
    } catch (error) {
      console.error("Error fetching current month's sales data:", error);
      return 0;
    }
  };

  const fetchSalesForPreviousMonth = async () => {
    try {
      const currentDate = new Date();
      const startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1
      );
      const endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        0
      );

      const saleDetailsRef = firebase.firestore().collection("SaleDetails");
      const snapshot = await saleDetailsRef
        .where("createdAt", ">=", startDate)
        .where("createdAt", "<=", endDate)
        .get();

      const previousMonthData = snapshot.docs.map((doc) => ({
        todaySale: parseFloat(doc.data().todaySale),
      }));

      return previousMonthData.reduce(
        (total, sale) => total + sale.todaySale,
        0
      );
    } catch (error) {
      console.error("Error pre month:", error);
      return 0;
    }
  };

  const fetchPreviousYearData = async () => {
    try {
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);

      const saleDetailsRef = firebase.firestore().collection("SaleDetails");
      const snapshot = await saleDetailsRef
        .where("createdAt", ">=", startDate)
        .orderBy("createdAt", "asc")
        .get();

      const previousYearData = snapshot.docs.map((doc) => ({
        todaySale: doc.data().todaySale,
        createdAt: doc.data().createdAt.toDate(),
      }));

      return previousYearData;
    } catch (error) {
      console.error("Error fetching previous year's data:", error);
      return [];
    }
  };

  const generateXAxisLabels = (duration) => {
    const labels = [];
    const today = new Date();

    switch (duration) {
      case "1":
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const shortMonth = date.toLocaleString("default", { month: "short" });
          const day = date.getDate();
          labels.push(`${shortMonth} ${day}`);
        }
        break;
      case "2":
        const interval = 5;
        const distinctDates = [];

        for (let i = 30; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          distinctDates.push(date);
        }
        const sortedDates = distinctDates.sort((a, b) => b - a);

        for (let i = 0; i < sortedDates.length; i += interval) {
          const date = sortedDates[i];
          const shortMonth = date.toLocaleString("default", { month: "short" });
          const day = date.getDate();
          labels.unshift(`${shortMonth} ${day}`);
        }
        break;

      case "3":
        for (let i = 0; i < 12; i += 2) {
          const date = new Date(today);
          date.setMonth(today.getMonth() - i);
          const month = date.toLocaleString("default", { month: "short" });
          labels.push(month);
        }
        break;

      case "4":
        const weekStart = new Date(today);
        const daysToMonday = today.getDay() ? today.getDay() - 1 : 6;
        weekStart.setDate(today.getDate() - daysToMonday);

        const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        for (let i = 0; i < 7; i++) {
          const dayIndex = weekStart.getDay();
          const shortDay = daysOfWeek[dayIndex];
          labels.push(shortDay);
          weekStart.setDate(weekStart.getDate() + 1);
        }
        break;

      case "5":
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        while (monthStart <= today) {
          const shortMonth = monthStart.toLocaleString("default", {
            month: "short",
          });
          const day = monthStart.getDate();
          labels.push(`${shortMonth} ${day}`);
          monthStart.setDate(monthStart.getDate() + 5);
        }
        break;

      case "6":
        for (let i = 0; i <= today.getMonth(); i++) {
          const date = new Date(today.getFullYear(), i, 1);
          const month = date.toLocaleString("default", { month: "short" });
          labels.push(month);
        }
        break;
      case "7":
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const yestMonth = yesterday.toLocaleString("default", {
          month: "short",
        });
        const yestDay = yesterday.getDate();
        labels.push(`${yestMonth} ${yestDay}`);
        break;
      default:
        break;
    }

    return labels;
  };

  const fetchSalesData = async (duration) => {
    setLoading(true);
    const startDate = new Date();
    let queryStartDate = new Date();

    // const labels = duration === "4" ? generateXAxisLabels("4") : generateXAxisLabels("1");
    let labels = [];
    switch (duration) {
      case "1":
        labels = generateXAxisLabels("1");
        queryStartDate.setDate(startDate.getDate() - 7);
        break;

      case "2": 
        labels = generateXAxisLabels("2");
        queryStartDate.setDate(startDate.getDate() - 30);
        break;

      case "3":
        queryStartDate.setMonth(startDate.getMonth() - 12);
        labels = generateXAxisLabels("3");
        break;
      case "4":
        const currentDay = startDate.getDay();
        queryStartDate.setDate(startDate.getDate() - currentDay);
        labels = generateXAxisLabels("4");
        break;
      case "5":
        queryStartDate.setDate(1);
        labels = generateXAxisLabels("5");
        break;
      case "6":
        queryStartDate.setMonth(0);
        queryStartDate.setDate(1);
        labels = generateXAxisLabels("6");
        break;
      case "7":
        queryStartDate.setDate(startDate.getDate() - 1);
        labels = generateXAxisLabels("7");
        break;
      default:
        queryStartDate = null;
        break;
    }

    if (queryStartDate) {
      const saleDetailsRef = firebase.firestore().collection("SaleDetails");

      try {
        const currentMonthSales = await fetchSalesForCurrentMonth();
        const previousMonthSales = await fetchSalesForPreviousMonth();

        const querySnapshot = await saleDetailsRef
          .where("createdAt", ">=", queryStartDate)
          .orderBy("createdAt", "desc")
          .get();

        const salesData = querySnapshot.docs.map((doc) => ({
          todaySale: doc.data().todaySale,
          createdAt: doc.data().createdAt
            ? doc.data().createdAt.toDate()
            : null,
          label: doc.data().label,
          todayUnits: doc.data().todayUnits,
        }));

        let formattedSalesData = [];
        let totalSales = 0;
        let totalUnits = 0;

        salesData.forEach((saleData, index) => {
          const label = labels[index] || "";
          const formattedSale = {
            value: parseFloat(saleData.todaySale),
            color: "#FE9701",
            label: label,
            labelTextStyle: {
              color: "gray",
              fontSize: 10,
              fontFamily: "Inter-Regular",
              width: 40,
              marginHorizontal: 20,
            },
          };
          formattedSalesData.push(formattedSale);
          if (!isNaN(parseFloat(saleData.todaySale))) {
            totalSales += parseFloat(saleData.todaySale);
          }

          if (!isNaN(parseInt(saleData.todayUnits))) {
            totalUnits += parseInt(saleData.todayUnits);
          }
        });

        const xAxisLabels =
          duration === "4" ? labels : generateXAxisLabels(duration);
        console.log("X Axis Labels:", xAxisLabels);

        setStackData(formattedSalesData);
        setTotalSales(totalSales);
        setUnitsSold(totalUnits);
        setSelectedDuration(duration);
        setLoading(false);
        calculatePercentageChange(currentMonthSales, previousMonthSales);
        setXAxisLabels(labels);

        setLoading(false);
        return xAxisLabels;
      } catch (error) {
        console.error("Error fetching and calculating sales data:", error);
      }
    }

    return null;
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchLatestSaleDetails();
    setRefreshing(false);
  }, [fetchLatestSaleDetails]);

  const [loaded] = useFonts({
    "Inter-Black": require("../asset/Inter-Black.ttf"),
    "Inter-Regular": require("../asset/Inter-Regular.ttf"),
    "Inter-ExtraBold": require("../asset/Inter-ExtraBold.ttf"),
    "Inter-Light": require("../asset/Inter-Light.ttf"),
    "Inter-Bold": require("../asset/Inter-Bold.ttf"),
    "Inter-SemiBold": require("../asset/Inter-SemiBold.ttf"),
    "Inter-Medium": require("../asset/Inter-Medium.ttf"),
  });

  if (!loaded) {
    return null;
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const getStyles = (lightStyle, darkStyle) => {
    return isDarkMode ? darkStyle : lightStyle;
  };

  const ProductsVlaue = [
    { label: "Products Sales", value: "1" },
    { label: "Units Sold", value: "2" },
  ];

  const formatNumberToK = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };
  const formatSalesValue = (value) => {
    const parsedValue = parseFloat(value);
    return formatNumberToK(parsedValue);
  };

  return (
    <SafeAreaView
      style={[styles.container, getStyles({}, { backgroundColor: "#2D3035" })]}
    >
      <View>
        <View
          style={[
            styles.header,
            { borderBottomWidth: 0.5, borderColor: "#B7BABF" },
            getStyles({}, { backgroundColor: "#2D3035" }),
          ]}
        >
          <View style={{ flexDirection: "row" }}>
            <Image
              source={require("../asset/drawer.png")}
              style={[
                {
                  height: 10,
                  width: 18,
                  resizeMode: "contain",
                  alignSelf: "center",
                },
                {},
              ]}
            />
            <Image
              source={require("../asset/flag.png")}
              style={[styles.headerIcon, { marginLeft: 11 }]}
            />
          </View>

          {isDarkMode ? (
            <Image
              source={require("../asset/darkmodeLogo.png")}
              style={styles.logo}
            />
          ) : (
            <Image source={require("../asset/logo.png")} style={styles.logo} />
          )}

          <MaterialCommunityIcons
            name="image-filter-center-focus-weak"
            size={21}
            color="#898989"
          />
        </View>

        {isLoading && !progressBarComplete && (
          <Progress.Bar
            indeterminate
            width={400}
            height={4}
            flexShrink={0}
            color="#FF9700"
          />
        )}

        <View style={{}}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.saleIndicatorBoxes}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="red"
              />
            }
          >
            <View
              style={[
                styles.salebox,
                getStyles(
                  {},
                  { backgroundColor: "#2D3035", borderColor: "#B0B5BB" }
                ),
              ]}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("AddSaleDetails")}
              >
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <Text
                    style={[
                      styles.saleCurency,
                      getStyles({}, { color: "white" }),
                    ]}
                  >
                    {`${formatSalesValue(todaySale)}`}
                  </Text>
                  <Text
                    style={[styles.USDtxt, getStyles({}, { color: "#ECEFF4" })]}
                  >
                    USD
                  </Text>
                </View>
                <Text
                  style={[
                    styles.saleheading,
                    getStyles({}, { color: "#396EAE" }),
                  ]}
                >
                  Sales today so far
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.salebox,
                getStyles({}, { backgroundColor: "#2D3035" }),
              ]}
            >
              <TouchableOpacity>
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <Text
                    style={[
                      styles.saleCurency,
                      getStyles({}, { color: "white" }),
                    ]}
                  >
                    {`${formatSalesValue(unitsToday)}`}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.saleheading,
                    getStyles({}, { color: "#396EAE" }),
                  ]}
                >
                  Unit today so far
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.salebox,
                getStyles({}, { backgroundColor: "#2D3035" }),
              ]}
            >
              <TouchableOpacity>
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <Text
                    style={[
                      styles.saleCurency,
                      getStyles({}, { color: "white" }),
                    ]}
                  >
                    {`${formatSalesValue(currentBalance)}`}
                  </Text>
                  <Text
                    style={[styles.USDtxt, getStyles({}, { color: "#ECEFF4" })]}
                  >
                    USD
                  </Text>
                </View>
                <Text
                  style={[
                    styles.saleheading,
                    getStyles({}, { color: "#396EAE" }),
                  ]}
                >
                  Current Balance
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.salebox,
                getStyles({}, { backgroundColor: "#2D3035" }),
              ]}
            >
              <TouchableOpacity>
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <Text
                    style={[styles.date, getStyles({}, { color: "white" })]}
                  >
                    {nextPaymentDate}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.saleheading,
                    getStyles({ marginTop: 5 }, { color: "#396EAE" }),
                  ]}
                >
                  Next payment
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.salebox,
                getStyles({}, { backgroundColor: "#2D3035" }),
              ]}
            >
              <TouchableOpacity>
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <Text
                    style={[styles.date, getStyles({}, { color: "white" })]}
                  >
                    {customerFeedback}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.feedbacktxt,
                    getStyles({}, { color: "#396EAE" }),
                  ]}
                >
                  Customer feedback
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.salebox,
                getStyles({}, { backgroundColor: "#2D3035" }),
              ]}
            >
              <TouchableOpacity>
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <Text
                    style={[styles.date, getStyles({}, { color: "white" })]}
                  >
                    {sellerFeedback}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.feedbacktxt,
                    getStyles({}, { color: "#396EAE" }),
                  ]}
                >
                  Seller feedback
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        <StatusBar style={isDarkMode ? "light" : "dark"} />
        <View
          style={{
            backgroundColor: "white",
            marginTop: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {loading && (
            <View style={{ position: "absolute", zIndex: 1 }}>
              <ActivityIndicator size="large" color="#FE9701" />
            </View>
          )}

          <View style={{ zIndex: 0, width: "100%" }}>
            <View>
              <View
                style={[
                  {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 5,

                    paddingHorizontal: 10,
                  },
                  getStyles(
                    { backgroundColor: "white" },
                    { backgroundColor: "#1F2229" }
                  ),
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={styles.dropdowns}>
                    <Dropdown
                      style={[
                        styles.dropdown,
                        Focus && { borderColor: "blue" },
                      ]}
                      placeholderStyle={[
                        styles.placeholderStyle,
                        getStyles({}, { color: "white" }),
                      ]}
                      selectedTextStyle={[
                        styles.selectedTextStyle,
                        getStyles({}, { color: "white" }),
                      ]}
                      iconStyle={styles.iconStyle}
                      data={ProductsVlaue}
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={"Product sales"}
                      onFocus={() => setFocus(true)}
                      onBlur={() => setFocus(false)}
                      value={CulcolateProductValue}
                      onChange={(item) => {
                        setFocus(false);
                        setCulcolateProductValue(item.value);
                      }}
                    />
                  </View>

                  <View style={styles.dropdowns}>
                    <Dropdown
                      style={[
                        styles.dropdown,
                        isFocus && { borderColor: "blue" },
                      ]}
                      placeholderStyle={[
                        styles.placeholderStyle,
                        getStyles({}, { color: "white" }),
                      ]}
                      selectedTextStyle={[
                        styles.selectedTextStyle,
                        { fontSize: 17 },
                        getStyles({}, { color: "white" }),
                      ]}
                      dropdownStyle={{ backgroundColor: "red" }}
                      iconStyle={styles.iconStyle}
                      data={ChooseTimeValue}
                      maxHeight={350}
                      labelField="label"
                      valueField="value"
                      placeholder={"Last 30 Days"}
                      value={selectedDuration}
                      onFocus={() => setIsFocus(true)}
                      onBlur={() => setIsFocus(false)}
                      onChange={(item) => {
                        setSelectedDuration(item.value);
                        setIsFocus(false);
                      }}
                    />
                  </View>
                </View>
              </View>
              <View
                style={[
                  styles.PreviuseValue,
                  getStyles(
                    { backgroundColor: "white" },
                    { backgroundColor: "#1F2229" }
                  ),
                ]}
              >
                <View>
                  {CulcolateProductValue === "1" && (
                    <View>
                      <View style={{ flexDirection: "row" }}>
                        <Text
                          style={[
                            styles.saleDuration,
                            getStyles(
                              {
                                fontSize: 17,
                                fontFamily: "Inter-Medium",
                                fontWeight: "700",
                                lineHeight: 24,
                                color: isDarkMode ? "white" : "black",
                              },
                              { color: "white" }
                            ),
                          ]}
                        >
                          {`${formatSalesValue(totalSales)}`}
                        </Text>
                        <Text
                          style={[
                            styles.valueAlongUSD,
                            getStyles(
                              { fontSize: 10, color: "#909090" },
                              { color: "white" }
                            ),
                          ]}
                        >
                          USD
                        </Text>
                      </View>
                      <Text
                        style={[
                          getStyles(
                            { fontSize: 13, color: "#909090", bottom: 4 },
                            { color: "white" }
                          ),
                        ]}
                      >
                        {durationLabels[selectedDuration]}{" "}
                      </Text>
                    </View>
                  )}

                  {CulcolateProductValue === "2" && (
                    <View>
                      <View style={{ flexDirection: "row" }}>
                        <Text
                          style={[
                            {
                              fontSize: 17,
                              fontFamily: "Inter-Medium",
                              fontWeight: "700",
                              lineHeight: 24,
                              color: isDarkMode ? "white" : "black",
                            },
                            getStyles({}, { color: "white" }),
                          ]}
                        >
                          {`${formatSalesValue(unitsSold)}`}
                        </Text>
                        <Text
                          style={[
                            styles.valueAlongUSD,
                            getStyles(
                              { fontSize: 10, color: "#909090" },
                              { color: "white" }
                            ),
                          ]}
                        >
                          Units
                        </Text>
                      </View>
                      {CulcolateProductValue === "2" && (
                        <Text
                          style={[
                            getStyles(
                              { fontSize: 13, color: "#909090", bottom: 4 },
                              { color: "white" }
                            ),
                          ]}
                        >
                          {durationLabels[selectedDuration]}
                        </Text>
                      )}
                    </View>
                  )}
                </View>

                <View style={{}}>
                  <Text
                    style={[
                      getStyles(
                        {
                          fontSize: 17,
                          fontFamily: "Inter-Medium",
                          fontWeight: "700",
                          lineHeight: 24,
                        },
                        {
                          fontSize: 17,
                          fontFamily: "Inter-Medium",
                          fontWeight: "700",
                          lineHeight: 24,
                          color: isDarkMode ? "green" : "black",
                        }
                      ),
                    ]}
                  >
                    {lastMonthPercentageChange !== null
                      ? lastMonthPercentageChange
                      : "N/A"}
                  </Text>
                  <Text
                    style={[
                      getStyles(
                        { fontSize: 13, color: "#909090", bottom: 4 },
                        { color: "white" }
                      ),
                    ]}
                  >
                    Previous 30 says
                  </Text>
                </View>

                <View style={{}}>
                  <Text
                    style={[
                      getStyles(
                        {
                          fontSize: 17,
                          fontFamily: "Inter-Medium",
                          fontWeight: "700",
                          lineHeight: 24,
                        },
                        {
                          fontSize: 17,
                          fontFamily: "Inter-Medium",
                          fontWeight: "700",
                          lineHeight: 24,
                          color: isDarkMode ? "green" : "black",
                        }
                      ),
                    ]}
                  >
                    {lastYearPercentageChange !== null
                      ? lastYearPercentageChange
                      : "N/A"}
                  </Text>
                  <Text
                    style={[
                      getStyles(
                        { fontSize: 13, color: "#909090", bottom: 4 },
                        { color: "white" }
                      ),
                    ]}
                  >
                    {" "}
                    last year
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={[
                { width: "100%", position: "relative", marginTop: 30 },
                getStyles(
                  { backgroundColor: "white" },
                  { backgroundColor: "#1F2229" }
                ),
              ]}
            >
              {console.log(xAxisLabels)}

              <BarChart
                label
                yAxisTextStyle={{ color: "#898989" }}
                data={stackData ? stackData : []}
                startFillColor={"#898989"}
                endFillColor={"#898989"}
                // spacing={dynamicSpacing}
                spacing={selectedDuration === "2" ? 2 : undefined}
                rulesColor="#D1D1D1"
                yAxisColor="#f0eee9"
                xAxisColor="#f0eee9"
                barWidth={stackData && stackData.length >= 8 ? 9 : 25}
                formatYLabel={formatNumberToK}
                rulesType="solid"
                frontColor="#FE9701"
                noOfSections={6}
                scrollref
                initialSpacing={15}
                style={{ opacity: loading ? 0 : 1 }}
                xAxisLabels={xAxisLabels}
                xAxisLabelTextStyle={{ paddingHorizontal: 20 }}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {xAxisLabels.map((label, index) => (
                  <Text
                    key={index}
                    style={{
                      fontSize: 10,
                      
                      marginHorizontal: 10,
                    }}
                  >
                    {label}
                  </Text>
                ))}
              </View>
            </View>

            <View
              style={[
                getStyles(
                  { backgroundColor: "white" },
                  { backgroundColor: "#1F2229" }
                ),
              ]}
            >
              <View style={{ marginTop: 5, alignSelf: "center", bottom: 5 }}>
                <Text
                  style={[
                    styles.updateddate,
                    getStyles({}, { color: "#A5A5AF" }),
                  ]}
                >
                  {updatedAt
                    ? `Updated ${updatedAt.toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}`
                    : "No updates yet"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <ScrollView
          style={{ marginTop: 8, height: 300, backgroundColor: "white" }}
        >
          <TouchableOpacity
            style={styles.staticBtn}
            onPress={() => navigation.navigate("AddSaleDetails")}
          >
            <Image
              source={require("../asset/addproduct.png")}
              style={{
                height: 17,
                width: 17,
                tintColor: isDarkMode ? "#B5B8BD" : undefined,
              }}
            />
            <Text
              style={[styles.headingtxt, getStyles({}, { color: "#B5B8BD" })]}
            >
              Add a Product
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="green"
              style={styles.forwardIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.staticBtn}>
            <Image
              source={require("../asset/quickstart.png")}
              style={{
                height: 17,
                width: 17,
                resizeMode: "contain",
                tintColor: isDarkMode ? "#B5B8BD" : undefined,
              }}
            />
            <Text
              style={[styles.headingtxt, getStyles({}, { color: "#B5B8BD" })]}
            >
              Quick Start Guide
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="green"
              style={styles.forwardIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.staticBtn}>
            <Ionicons
              name="eye"
              size={20}
              color={getStyles("grey", "#B5B8BD")}
            />
            <Text
              style={[styles.headingtxt, getStyles({}, { color: "#B5B8BD" })]}
            >
              View Selling Application
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="green"
              style={styles.forwardIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.staticBtn}>
            <Image
              source={require("../asset/manageorder.png")}
              style={{
                height: 17,
                width: 17,
                resizeMode: "contain",
                tintColor: isDarkMode ? "#B5B8BD" : undefined,
              }}
            />
            <Text
              style={[styles.headingtxt, getStyles({}, { color: "#B5B8BD" })]}
            >
              Manage Orders
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="green"
              style={styles.forwardIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.staticBtn}>
            <Image
              source={require("../asset/managereturn.png")}
              style={{
                height: 17,
                width: 17,
                resizeMode: "contain",
                tintColor: isDarkMode ? "#B5B8BD" : undefined,
              }}
            />
            <Text
              style={[styles.headingtxt, getStyles({}, { color: "#B5B8BD" })]}
            >
              Manage Returns
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="green"
              style={styles.forwardIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.staticBtn}>
            <MaterialCommunityIcons
              name="security"
              size={17}
              color={getStyles("grey", "#B5B8BD")}
            />
            <Text
              style={[styles.headingtxt, getStyles({}, { color: "#B5B8BD" })]}
            >
              Manage SAFE T Claims
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="green"
              style={styles.forwardIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.staticBtn}>
            <MaterialCommunityIcons
              name="message-outline"
              size={17}
              color={getStyles("grey", "#B5B8BD")}
            />
            <Text
              style={[styles.headingtxt, getStyles({}, { color: "#B5B8BD" })]}
            >
              Manage Case logs
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="green"
              style={styles.forwardIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.staticBtn}>
            <AntDesign
              name="exclamationcircleo"
              size={17}
              color={getStyles("grey", "#B5B8BD")}
            />
            <Text
              style={[styles.headingtxt, getStyles({}, { color: "#B5B8BD" })]}
            >
              Fix Incomplete Listings
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color="green"
              style={styles.forwardIcon}
            />
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 10,
            }}
          >
            <TouchableOpacity onPress={toggleDarkMode}>
              <Text
                style={getStyles(
                  {
                    color: "black",
                    fontSize: 15,
                    bottom: 10,
                    fontWeight: "500",
                  },
                  { color: "white" }
                )}
              >
                {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
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
  },
  header: {
    height: 60,
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
  },
  headerIcon: {
    height: 20,
    width: 33,
    flexShrink: 0,
  },
  date: {
    fontFamily: "Inter-Regular",
    fontSize: 15,
  },
  logo: {
    height: 27,
    width: 122,
    resizeMode: "contain",
    marginRight: 20,
    display: "flex",
  },
  salebox: {
    height: 60,
    width: 154,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 3,
    elevation: 1,
    borderWidth: 1.2,
    borderColor: "#DBDBDB",
    display: "flex",
  },
  saleIndicatorBoxes: {
    marginTop: 5,
    marginLeft: 5,
    flexDirection: "row",
  },
  saleCurency: {
    fontSize: 23,
    fontFamily: "Inter-Regular",
    fontWeight: "400",
  },
  saleDuration: {
    fontSize: 19,
    fontFamily: "Inter-Medium",
    fontWeight: "400",
  },
  USDtxt: {
    color: "#6F7072",
    fontFamily: "Inter-Regular",
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 24,
    letterSpacing: -0.35,
    paddingTop: 7,
    paddingLeft: 5,
  },
  saleheading: {
    color: "#8B8B8B",
    fontSize: 15,
    fontFamily: "Inter-Regular",
    fontWeight: "400",
    bottom: 5,
  },
  feedbacktxt: {
    color: "#8B8B8B",
    fontSize: 13,
    fontFamily: "Inter-Regular",
  },
  headingtxt: {
    marginLeft: 10,
    fontSize: 17,
    color: "#1B1C1E",
    fontFamily: "Inter-Regular",
  },
  forwardIcon: {
    position: "absolute",
    right: 10,
    color: "#AAAAAA",
  },
  staticBtn: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    paddingLeft: 10,
    height: 50,
    alignItems: "center",
    borderColor: "#CFD0D2",
  },
  placeholderStyle: {
    fontSize: 18,
    fontWeight: "400",
    fontFamily: "Inter-Medium",
    lineHeight: 24,
    fontWeight: "400",
  },
  dropdowns: {
    width: 150,
  },
  updateddate: {
    color: "#68696B",
    fontSize: 13,
  },
  loadingContainer: {
    flex: 1,
  },
  PreviuseValue: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingRight: "10%",
    backgroundColor: "white",
  },
  valueAlongUSD: {
    marginLeft: 3,
    fontSize: 10,
    fontFamily: "Inter-Medium",
    marginTop: 8,
  },
});
