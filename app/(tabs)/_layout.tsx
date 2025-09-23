import { Tabs, useLocalSearchParams } from "expo-router";
import React, { useContext } from "react";

import { Colors } from "@/constants/Colors";

import { useThemeColor } from "@/hooks/useThemeColor";
import { FontAwesome } from "@expo/vector-icons";
import { AuthContext } from "@/store/auth-context";
import LogoutButton from "../(pages)/logout";

export default function TabLayout() {
  const { category } = useLocalSearchParams();
  const colorIcon = useThemeColor(
    { light: Colors.light.tint, dark: Colors.dark.tint },
    "tint"
  );
  function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>["name"];
    color: string;
  }) {
    return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
  }
  const auth = useContext(AuthContext);
  return (
    <Tabs
      backBehavior="history"
      screenOptions={{ headerShown: false, tabBarActiveTintColor: colorIcon }}
    >
      {auth.role === "Admin" && (
        <Tabs.Screen
          name="(dashboard)/admin/dashboardAdminScreen"
          options={{
            headerShown: true,
            title: "Dashboard",
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
            headerRight: () => <LogoutButton />,
          }}
        />
      )}
      {(auth.role === "Manufacturer" || auth.role === "Trader") && (
        <Tabs.Screen
          name="(dashboard)/admin/dashboardAdminScreen"
          options={{
            href: null,
          }}
        />
      )}
      {auth.role === "Manufacturer" && (
        <Tabs.Screen
          name="(dashboard)/manufacturer/dashboardManufacturerScreen"
          options={{
            headerShown: true,
            title: "Dashboard",
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
            headerRight: () => <LogoutButton />,
          }}
        />
      )}
      {(auth.role === "Admin" || auth.role === "Trader") && (
        <Tabs.Screen
          name="(dashboard)/manufacturer/dashboardManufacturerScreen"
          options={{
            href: null,
          }}
        />
      )}
      {auth.role === "Trader" && (
        <Tabs.Screen
          name="(dashboard)/trader/dashboardTraderScreen"
          options={{
            headerShown: true,
            title: "Dashboard",
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
            headerRight: () => <LogoutButton />,
          }}
        />
      )}
      {(auth.role === "Manufacturer" || auth.role === "Admin") && (
        <Tabs.Screen
          name="(dashboard)/trader/dashboardTraderScreen"
          options={{
            href: null,
          }}
        />
      )}
      {(auth.role === "Manufacturer" || auth.role === "Trader") &&
        category == "api" && (
          <Tabs.Screen
            name="(products)/api/list/ProductsList"
            options={{
              headerShown: true,
              title: "Products",
              tabBarIcon: ({ color }) => (
                <TabBarIcon name="product-hunt" color={color} />
              ),
              headerRight: () => <LogoutButton />,
            }}
          />
        )}
      {(auth.role === "Admin" ||
        (auth.role === "Trader" && category == "pigments") ||
        (auth.role === "Manufacturer" && category == "pigments")) && (
        <Tabs.Screen
          name="(products)/api/list/ProductsList"
          options={{
            title: "test",
            href: null,
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="product-hunt" color={color} />
            ),
          }}
        />
      )}
      {(auth.role === "Manufacturer" || auth.role === "Trader") &&
        category == "pigments" && (
          <Tabs.Screen
            name="(products)/pigments/list/ProductsList"
            options={{
              headerShown: true,
              title: "Products",
              tabBarIcon: ({ color }) => (
                <TabBarIcon name="product-hunt" color={color} />
              ),
              headerRight: () => <LogoutButton />,
            }}
          />
        )}
      {(auth.role === "Admin" ||
        (auth.role === "Trader" && category == "api") ||
        (auth.role === "Manufacturer" && category == "api")) && (
        <Tabs.Screen
          name="(products)/pigments/list/ProductsList"
          options={{
            href: null,
          }}
        />
      )}
      {auth.role === "Manufacturer" && (
        <Tabs.Screen
          name="(traders)/list/TradersList"
          options={{
            headerShown: true,
            title: "Traders",
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="user-plus" color={color} />
            ),
            headerRight: () => <LogoutButton />,
            href: {
              pathname: "/(tabs)/(traders)/list/TradersList",
              params: { category: category },
            },
          }}
        />
      )}
      {(auth.role === "Admin" || auth.role === "Trader") && (
        <Tabs.Screen
          name="(traders)/list/TradersList"
          options={{
            href: null,
          }}
        />
      )}
      <Tabs.Screen
        name="(traders)/item/Trader"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="(products)/api/item/Product"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="(products)/pigments/item/Product"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
