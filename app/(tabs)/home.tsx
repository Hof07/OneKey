import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Dimensions,
  StatusBar,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import * as Clipboard from "expo-clipboard";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Earth } from "lucide-react-native";
import { useFocusEffect } from "expo-router";

const { width } = Dimensions.get("window");

const APP_MAP: any = {
  facebook: { icon: "logo-facebook", color: "#1877F2" },
  instagram: { icon: "logo-instagram", color: "#E1306C" },
  twitter: { icon: "logo-twitter", color: "#000000" },
  whatsapp: { icon: "logo-whatsapp", color: "#25D366" },
  discord: { icon: "logo-discord", color: "#5865F2" },
  linkedin: { icon: "logo-linkedin", color: "#0A66C2" },
  reddit: { icon: "logo-reddit", color: "#FF4500" },
  snapchat: { icon: "logo-snapchat", color: "#FFFC00" },
  tiktok: { icon: "logo-tiktok", color: "#000000" },
  telegram: { icon: "paper-plane", color: "#0088CC" },
  netflix: { icon: "netflix", color: "#E50914" },
  spotify: { icon: "spotify", color: "#1DB954" },
  youtube: { icon: "logo-youtube", color: "#FF0000" },
  google: { icon: "logo-google", color: "#DB4437" },
  apple: { icon: "logo-apple", color: "#000000" },
  paypal: { icon: "logo-paypal", color: "#003087" },
  github: { icon: "logo-github", color: "#181717" },
  microsoft: { icon: "logo-windows", color: "#00A4EF" },
  bank: { icon: "bank", color: "#059669" },
  other: { icon: "globe-outline", color: "#6B7280" },
};

export default function HomeScreen() {
  const [userName, setUserName] = useState<string>("");
  const [recentPasswords, setRecentPasswords] = useState<any[]>([]);

  useEffect(() => {
    const getUserData = async () => {
      const storedName = await SecureStore.getItemAsync("username");
      if (storedName) setUserName(storedName);
    };
    getUserData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRecentPasswords();
    }, [])
  );

  const loadRecentPasswords = async () => {
    try {
      const masterKeysStr = await SecureStore.getItemAsync(
        "master_password_index"
      );
      if (!masterKeysStr) return;

      const keys: string[] = JSON.parse(masterKeysStr);
      const loadedData = await Promise.all(
        keys.map(async (key: string) => {
          const res = await SecureStore.getItemAsync(key);
          return res ? JSON.parse(res) : null;
        })
      );

      const validData = loadedData
        .filter((item) => item !== null)
        .sort((a, b) => Number(b.id) - Number(a.id))
        .slice(0, 8); // Showing up to 8 items in the vertical list

      setRecentPasswords(validData);
    } catch (e) {
      console.error(e);
    }
  };

  const copyPass = async (pass: string) => {
    if (pass) await Clipboard.setStringAsync(pass);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.greetingText}>
              Hello{userName ? `, ${userName}` : ""}
            </Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBox}>
              <Ionicons
                name="search-outline"
                size={20}
                color="#9E9E9E"
                style={styles.searchIcon}
              />
              <TextInput
                placeholder="Search password..."
                placeholderTextColor="#9E9E9E"
                style={styles.searchInput}
              />
            </View>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="options-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Categories */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Manage Password</Text>
            <Ionicons name="arrow-forward" size={22} color="black" />
          </View>

          <View style={styles.categoryContainer}>
            <TouchableOpacity
              style={[styles.card, { backgroundColor: "#2563EB" }]}
            >
              <View style={styles.iconCircle}>
                <Earth size={22} color="black" />
              </View>
              <Text style={styles.cardLabel}>Webs</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.card, { backgroundColor: "#FBBF24" }]}
            >
              <View style={styles.iconCircle}>
                <Ionicons
                  name="phone-portrait-outline"
                  size={22}
                  color="black"
                />
              </View>
              <Text style={styles.cardLabel}>Apps</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.card, { backgroundColor: "#99C1B9" }]}
            >
              <View style={styles.iconCircle}>
                <Ionicons name="card-outline" size={22} color="black" />
              </View>
              <Text style={styles.cardLabel}>Cards</Text>
            </TouchableOpacity>
          </View>

          {/* RECENTLY ADDED - VERTICAL LIST */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recently Added</Text>
          </View>

          <View style={styles.verticalListContainer}>
            {recentPasswords.length === 0 ? (
              <Text style={styles.emptyText}>No passwords added yet.</Text>
            ) : (
              recentPasswords.map((item) => {
                const appStyle = APP_MAP[item.app] || APP_MAP["other"];
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.listRow}
                    onPress={() => copyPass(item.password)}
                    activeOpacity={0.6}
                  >
                    <View
                      style={[
                        styles.iconBox,
                        { backgroundColor: appStyle.color + "15" },
                      ]}
                    >
                      {appStyle.icon.startsWith("logo-") ? (
                        <Ionicons
                          name={appStyle.icon}
                          size={24}
                          color={appStyle.color}
                        />
                      ) : (
                        <MaterialCommunityIcons
                          name={appStyle.icon}
                          size={24}
                          color={appStyle.color}
                        />
                      )}
                    </View>

                    <View style={styles.textContainer}>
                      <Text style={styles.itemTitle}>
                        {item.app.charAt(0).toUpperCase() + item.app.slice(1)}
                      </Text>
                      <Text style={styles.itemSubtitle}>{item.username}</Text>
                    </View>

                    <Ionicons name="copy-outline" size={22} color="#9E9E9E" />
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 120 },
  header: { marginTop: 32, marginBottom: 45 },
  greetingText: { fontSize: 28, fontWeight: "800", color: "#000" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  searchBox: {
    flex: 1,
    height: 55,
    backgroundColor: "#F3F4F6",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: "#000" },
  filterButton: {
    width: 55,
    height: 55,
    backgroundColor: "#2563EB",
    borderRadius: 15,
    marginLeft: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 20, fontWeight: "700" },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 35,
  },
  card: {
    width: (width - 64) / 3,
    height: 125,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  cardLabel: { color: "#000", fontWeight: "700", fontSize: 14 },

  // Vertical List Styles
  verticalListContainer: {
    marginTop: 5,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 22,
    marginBottom: 12,
    // Matching the look of your image
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  itemSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  emptyText: {
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 20,
  },
});
