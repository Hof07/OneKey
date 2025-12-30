import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import * as Haptics from "expo-haptics"; // Optional: For tactile feedback
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DynamicIcon = ({
  name,
  color,
  size,
}: {
  name: string;
  color: string;
  size: number;
}) => {
  if (
    name.startsWith("logo-") ||
    name.endsWith("-outline") ||
    name === "paper-plane"
  ) {
    return <Ionicons name={name as any} size={size} color={color} />;
  }
  return (
    <MaterialCommunityIcons name={name as any} size={size} color={color} />
  );
};

const AddPassword = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const apps = [
    {
      id: "facebook",
      label: "Facebook",
      icon: "logo-facebook",
      color: "#1877F2",
    },
    {
      id: "instagram",
      label: "Instagram",
      icon: "logo-instagram",
      color: "#E1306C",
    },
    {
      id: "twitter",
      label: "Twitter (X)",
      icon: "logo-twitter",
      color: "#000000",
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: "logo-whatsapp",
      color: "#25D366",
    },
    { id: "discord", label: "Discord", icon: "logo-discord", color: "#5865F2" },
    {
      id: "linkedin",
      label: "LinkedIn",
      icon: "logo-linkedin",
      color: "#0A66C2",
    },
    { id: "reddit", label: "Reddit", icon: "logo-reddit", color: "#FF4500" },
    {
      id: "snapchat",
      label: "Snapchat",
      icon: "logo-snapchat",
      color: "#FFFC00",
    },
    { id: "tiktok", label: "TikTok", icon: "logo-tiktok", color: "#000000" },
    {
      id: "telegram",
      label: "Telegram",
      icon: "paper-plane",
      color: "#0088CC",
    },
    { id: "netflix", label: "Netflix", icon: "netflix", color: "#E50914" },
    { id: "spotify", label: "Spotify", icon: "spotify", color: "#1DB954" },
    { id: "youtube", label: "YouTube", icon: "logo-youtube", color: "#FF0000" },
    { id: "google", label: "Google", icon: "logo-google", color: "#DB4437" },
    { id: "apple", label: "Apple ID", icon: "logo-apple", color: "#000000" },
    { id: "paypal", label: "PayPal", icon: "logo-paypal", color: "#003087" },
    { id: "github", label: "GitHub", icon: "logo-github", color: "#181717" },
    {
      id: "microsoft",
      label: "Microsoft",
      icon: "logo-windows",
      color: "#00A4EF",
    },
    { id: "bank", label: "Banking", icon: "bank", color: "#059669" },
    {
      id: "other",
      label: "Other Website",
      icon: "globe-outline",
      color: "#6B7280",
    },
  ];

  const filteredApps = apps.filter((app) =>
    app.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(!open);
    if (!open) setSearchQuery("");
  };

  const handleSelect = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedApp(id);
    setOpen(false);
  };

  const savePassword = async () => {
    if (!selectedApp || !username || !password) {
      Alert.alert("Missing Info", "Please fill all fields before saving.");
      return;
    }

    try {
      const id = Date.now().toString();
      const storageKey = `pwd_${id}`;

      const dataToSave = {
        id,
        app: selectedApp,
        username,
        password,
        createdAt: new Date().toISOString(),
      };

      await SecureStore.setItemAsync(storageKey, JSON.stringify(dataToSave));

      const indexRaw = await SecureStore.getItemAsync("master_password_index");
      const index: string[] = indexRaw ? JSON.parse(indexRaw) : [];

      if (!index.includes(storageKey)) {
        index.push(storageKey);
        await SecureStore.setItemAsync(
          "master_password_index",
          JSON.stringify(index)
        );
      }

      // 1. CLEAR ALL FIELDS
      setSelectedApp("");
      setUsername("");
      setPassword("");
      setSearchQuery("");
      setOpen(false);

      // 2. OPTIONAL: Trigger haptic feedback so user knows it saved
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (err) {
      Alert.alert("Error", "Could not save password");
    }
  };

  const selectedAppData = apps.find((a) => a.id === selectedApp);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        stickyHeaderIndices={[0]}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={28} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>New Password</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* ICON PREVIEW */}
        <View style={styles.iconPreviewContainer}>
          <View
            style={[
              styles.largeIconCircle,
              { backgroundColor: selectedAppData?.color || "#F3F4F6" },
            ]}
          >
            <DynamicIcon
              name={selectedAppData?.icon || "shield-checkmark-outline"}
              size={50}
              color={selectedApp ? "white" : "#9CA3AF"}
            />
          </View>
          <Text style={styles.appHintText}>
            {selectedApp
              ? `Adding ${selectedAppData?.label}`
              : "Select a platform"}
          </Text>
        </View>

        {/* Platform Dropdown */}
        <View style={styles.dropdownWrapper}>
          <TouchableOpacity
            style={[styles.dropdownHeader, open && styles.dropdownHeaderActive]}
            onPress={toggleDropdown}
          >
            <View style={styles.row}>
              {selectedAppData && (
                <View style={{ marginRight: 10 }}>
                  <DynamicIcon
                    name={selectedAppData.icon}
                    size={22}
                    color={selectedAppData.color}
                  />
                </View>
              )}
              <Text
                style={[
                  styles.dropdownText,
                  !selectedApp && { color: "#9CA3AF" },
                ]}
              >
                {selectedAppData ? selectedAppData.label : "Choose Platform"}
              </Text>
            </View>
            <Ionicons
              name={open ? "chevron-up" : "chevron-down"}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>

          {open && (
            <View style={styles.dropdownMenu}>
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={18} color="#9CA3AF" />
                <TextInput
                  placeholder="Search platform..."
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                />
              </View>
              <ScrollView
                style={styles.innerScroll}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
              >
                {filteredApps.map((app) => (
                  <TouchableOpacity
                    key={app.id}
                    style={styles.dropdownItem}
                    onPress={() => handleSelect(app.id)}
                  >
                    <DynamicIcon name={app.icon} color={app.color} size={24} />
                    <Text style={styles.itemText}>{app.label}</Text>
                    {selectedApp === app.id && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#2563EB"
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Form Inputs */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Username or Email</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#9CA3AF"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="e.g. user@gmail.com"
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Secure Password</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#9CA3AF"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="••••••••"
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={savePassword}
          activeOpacity={0.8}
        >
          <Text style={styles.saveText}>Save Password</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  scrollContainer: { padding: 24, paddingBottom: 60 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "#FFF",
    paddingVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconPreviewContainer: { alignItems: "center", marginBottom: 30 },
  largeIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  appHintText: { fontSize: 16, fontWeight: "600", color: "#4B5563" },
  row: { flexDirection: "row", alignItems: "center" },
  dropdownWrapper: { zIndex: 1000 },
  dropdownHeader: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  dropdownHeaderActive: {
    borderColor: "#2563EB",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  dropdownText: { fontSize: 16, fontWeight: "500" },
  dropdownMenu: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderTopWidth: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: "hidden",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    margin: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  searchInput: { flex: 1, paddingVertical: 10, marginLeft: 8, fontSize: 14 },
  innerScroll: { maxHeight: 250 },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  itemText: { flex: 1, marginLeft: 12, fontSize: 16, color: "#374151" },
  inputGroup: { marginTop: 20 },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, paddingVertical: 16, fontSize: 16, color: "#111827" },
  saveBtn: {
    backgroundColor: "#2563EB",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 40,
    elevation: 5,
    shadowColor: "#2563EB",
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  saveText: { color: "#fff", fontSize: 18, fontWeight: "700" },
});

export default AddPassword;
