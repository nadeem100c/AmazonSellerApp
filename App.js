import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Splash from "./Screens/Splash";
import SaleScreen from "./Screens/SaleScreen";
import AddSaleDetails from "./Screens/AddSaleDetails";
import LoginScreen from "./Screens/LoginScreen";
// import RegisterScreen from "./Screens/Registration";

const Stack = createStackNavigator();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
    }, 2000);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {showSplash ? (
          <Stack.Screen
            name="Splash"
            component={Splash}
            options={{ headerShown: false }}
          />
        ) : (
          <>
          
          <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
         
        
             
            <Stack.Screen
              name="SaleScreen"
              component={SaleScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AddSaleDetails"
              component={AddSaleDetails}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}


{/* <Stack.Screen
name="RegisterScreen"
component={RegisterScreen}
options={{ headerShown: false }}
/> */}