import React from "react";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { Tabs, useRouter, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ChartNoAxesCombinedIcon, Home, KeyRound, LockKeyhole, UserRound } from "lucide-react-native";

const PRIMARY_COLOR = "#2563EB";

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();

  // Helper to check if the current tab is active
  const isActive = (path: string) => pathname === path;

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" }, // Hiding default bar to use our custom one
        }}
      >
        <Tabs.Screen name="home" />
        <Tabs.Screen name="vault" />
        <Tabs.Screen name="generator" />
        <Tabs.Screen name="account" />
      </Tabs>

      {/* --- Instagram Style Custom Bottom Nav --- */}
      <View style={styles.navWrapper}>
        <View style={styles.navbar}>
          {/* Home Tab */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/home")}
          >
            <Home
              size={28}
              color={isActive("/home") ? PRIMARY_COLOR : "black"}
              strokeWidth={isActive("/home") ? 2.5 : 2}
            />
          </TouchableOpacity>

          {/* Vault Tab */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/vault")}
          >
            <LockKeyhole
              size={26}
              color={isActive("/vault") ? PRIMARY_COLOR : "black"}
              strokeWidth={2}
              fill="none"
            />
          </TouchableOpacity>

          {/* Gap for the Floating Plus Button */}
          <View style={styles.navGap} />

          {/* Generator Tab */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/analize")}
          >
            <ChartNoAxesCombinedIcon
              size={28}
              color={isActive("/analize") ? PRIMARY_COLOR : "black"}
              strokeWidth={2}
              fill="none"
            />
          </TouchableOpacity>

          {/* Account Tab */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/account")}
          >
            <UserRound
              size={28}
              color={isActive("/account") ? PRIMARY_COLOR : "black"}
              strokeWidth={2}
              fill="none"
            />
          </TouchableOpacity>
        </View>

        {/* Floating Center Plus Button */}
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.9}
          onPress={() => router.push("/add")}
        >
          <Ionicons name="add" size={36} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navWrapper: {
    position: "absolute",
    bottom: 26,
    left: 0,
    right: 0,
    width: "100%",
    alignItems: "center",
  },
  navbar: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    width: "100%",
    height: Platform.OS === "ios" ? 85 : 65,
    borderTopWidth: 0.5,
    borderTopColor: "#E5E7EB", // Subtle Instagram-style top border
    paddingBottom: Platform.OS === "ios" ? 20 : 0,
    justifyContent: "space-around",
    alignItems: "center",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navGap: {
    width: 75, // Empty space reserved for the FAB
  },
  fab: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 35 : 20,
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 5,
    borderColor: "#FFFFFF", // White cutout ring
    elevation: 10,
    shadowColor: PRIMARY_COLOR,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
  },
});
