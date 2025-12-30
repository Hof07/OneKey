import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import * as Clipboard from "expo-clipboard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

interface PasswordEntry {
  id: string;
  app: string;
  username: string;
  password?: string;
}

const APP_MAP: any = {
  facebook: { label: "Facebook", icon: "facebook", color: "#1877F2" },
  instagram: { label: "Instagram", icon: "instagram", color: "#E1306C" },
  twitter: { label: "Twitter (X)", icon: "twitter", color: "#000000" },
  whatsapp: { label: "WhatsApp", icon: "whatsapp", color: "#25D366" },
  discord: { label: "Discord", icon: "discord", color: "#5865F2" },
  linkedin: { label: "LinkedIn", icon: "linkedin", color: "#0A66C2" },
  reddit: { label: "Reddit", icon: "reddit", color: "#FF4500" },
  snapchat: { label: "Snapchat", icon: "snapchat", color: "#FFFC00" },
  tiktok: { label: "TikTok", icon: "tiktok", color: "#000000" },
  telegram: { label: "Telegram", icon: "send", color: "#0088CC" },
  netflix: { label: "Netflix", icon: "netflix", color: "#E50914" },
  spotify: { label: "Spotify", icon: "spotify", color: "#1DB954" },
  youtube: { label: "YouTube", icon: "youtube", color: "#FF0000" },
  google: { label: "Google", icon: "google", color: "#DB4437" },
  apple: { label: "Apple ID", icon: "apple", color: "#000000" },
  paypal: { label: "PayPal", icon: "paypal", color: "#003087" },
  github: { label: "GitHub", icon: "github", color: "#181717" },
  microsoft: { label: "Microsoft", icon: "microsoft-windows", color: "#00A4EF" },
  bank: { label: "Banking", icon: "bank", color: "#059669" },
  other: { label: "Other", icon: "earth", color: "#6B7280" },
};

export default function Vault() {
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadPasswords();
    }, [])
  );

  const loadPasswords = async () => {
    try {
      setLoading(true);
      const masterKeysStr = await SecureStore.getItemAsync("master_password_index");
      if (!masterKeysStr) {
        setPasswords([]);
        return;
      }
      const keys: string[] = JSON.parse(masterKeysStr);
      const loadedData = await Promise.all(
        keys.map(async (key: string) => {
          const res = await SecureStore.getItemAsync(key);
          return res ? JSON.parse(res) : null;
        })
      );
      setPasswords(loadedData.filter((item): item is PasswordEntry => item !== null));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const copyPass = async (pass: string | undefined) => {
    if (pass) {
      await Clipboard.setStringAsync(pass);
      Alert.alert("Copied", "Password ready to paste!");
    }
  };

  const deleteEntry = (id: string) => {
    Alert.alert("Delete Password", "Are you sure you want to remove this entry?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive", 
        onPress: async () => {
          // 1. Remove item from SecureStore
          await SecureStore.deleteItemAsync(id);
          // 2. Update the master index
          const masterKeysStr = await SecureStore.getItemAsync("master_password_index");
          if (masterKeysStr) {
            const keys: string[] = JSON.parse(masterKeysStr);
            const newKeys = keys.filter(k => k !== id);
            await SecureStore.setItemAsync("master_password_index", JSON.stringify(newKeys));
          }
          loadPasswords(); // Refresh UI
        } 
      },
    ]);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Your Vault</Text>
        <MaterialCommunityIcons name="shield-check" size={28} color="#10B981" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadPasswords} />}
      >
        {passwords.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="safe-square-outline" size={80} color="#D1D5DB" />
            <Text style={styles.emptyText}>Your vault is empty</Text>
          </View>
        ) : (
          passwords.map((item) => {
            const app = APP_MAP[item.app] || APP_MAP["other"];
            
            // Premium 3-stop gradient
            const gradientColors = [
              app.color + "1A", // 10% opacity
              app.color + "08", // 3% opacity
              "#FFFFFF",        // White
            ] as const;

            return (
              <TouchableOpacity 
                key={item.id} 
                activeOpacity={0.8} 
                onPress={() => copyPass(item.password)}
                onLongPress={() => deleteEntry(item.id)}
                style={styles.cardShadow}
              >
                <LinearGradient
                  colors={gradientColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.card}
                >
                  <View style={styles.leftRow}>
                    <View style={[styles.iconBox, { backgroundColor: app.color }]}>
                      <MaterialCommunityIcons name={app.icon} color="white" size={24} />
                    </View>
                    <View style={{ marginLeft: 16 }}>
                      <Text style={styles.appText}>{app.label}</Text>
                      <View style={styles.userContainer}>
                        <MaterialCommunityIcons name="account-outline" size={12} color="#9CA3AF" />
                        <Text style={styles.userText}>{item.username}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.copyBadge}>
                    <MaterialCommunityIcons name="content-copy" size={16} color={app.color} />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#FFF", 
    paddingHorizontal: 20, 
    paddingTop: 60 
  },
  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "#F3F4F6" 
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  headerTitle: { 
    fontSize: 34, 
    fontWeight: "800", 
    color: "#111827", 
    letterSpacing: -1 
  },
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.7)",
  },
  leftRow: { flexDirection: "row", alignItems: "center" },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  appText: { 
    fontSize: 17, 
    fontWeight: "700", 
    color: "#1F2937",
    letterSpacing: -0.4
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  userText: { 
    fontSize: 13, 
    color: "#6B7280", 
    marginLeft: 4,
    fontWeight: "500" 
  },
  copyBadge: {
    width: 36,
    height: 36,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  emptyContainer: { 
    alignItems: "center", 
    marginTop: 120 
  },
  emptyText: { 
    marginTop: 15, 
    fontSize: 16, 
    color: "#9CA3AF", 
    fontWeight: "600" 
  },
});