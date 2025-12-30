import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import { ScanFace } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function Account() {
  const router = useRouter();
  const [name, setName] = useState("User");
  const [email, setEmail] = useState("user@email.com");
  const [fingerprint, setFingerprint] = useState(false);
  const [faceId, setFaceId] = useState(false);

  // States for Password Change
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const storedName = await SecureStore.getItemAsync("username");
      const storedEmail = await SecureStore.getItemAsync("email");
      const fp = await SecureStore.getItemAsync("fingerprint_enabled");
      const face = await SecureStore.getItemAsync("faceid_enabled");

      if (storedName) setName(storedName);
      if (storedEmail) setEmail(storedEmail);
      setFingerprint(fp === "true");
      setFaceId(face === "true");
    };
    loadData();
  }, []);

  const toggleFingerprint = async (value: boolean) => {
    setFingerprint(value);
    await SecureStore.setItemAsync("fingerprint_enabled", String(value));
    if (value) {
      setFaceId(false);
      await SecureStore.setItemAsync("faceid_enabled", "false");
    }
  };

  const toggleFaceId = async (value: boolean) => {
    setFaceId(value);
    await SecureStore.setItemAsync("faceid_enabled", String(value));
    if (value) {
      setFingerprint(false);
      await SecureStore.setItemAsync("fingerprint_enabled", "false");
    }
  };

  // 🛡️ Change Password Logic
  const handleChangePassword = async () => {
    if (newPin.length !== 4) {
      Alert.alert("Error", "PIN must be 4 digits");
      return;
    }
    if (newPin !== confirmPin) {
      Alert.alert("Error", "PINs do not match");
      return;
    }

    try {
      await SecureStore.setItemAsync("user_pin", newPin);
      Alert.alert("Success", "PIN updated successfully");
      setIsModalVisible(false);
      setNewPin("");
      setConfirmPin("");
    } catch (error) {
      Alert.alert("Error", "Could not update PIN");
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await SecureStore.deleteItemAsync("email");
          await SecureStore.deleteItemAsync("username");
          await SecureStore.deleteItemAsync("user_pin");
          await SecureStore.setItemAsync("login_done", "false");
          await SecureStore.deleteItemAsync("fingerprint_enabled");
          await SecureStore.deleteItemAsync("faceid_enabled");
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Account</Text>

      <View style={styles.row}>
        <Ionicons name="person-outline" size={22} color="#000" />
        <Text style={styles.label}>Username</Text>
        <Text style={styles.value}>{name}</Text>
      </View>

      <View style={styles.row}>
        <Ionicons name="mail-outline" size={22} color="#000" />
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{email}</Text>
      </View>

      {/* 🔐 Clickable Password Row */}
      <TouchableOpacity
        style={styles.row}
        onPress={() => setIsModalVisible(true)}
      >
        <Ionicons name="lock-closed-outline" size={22} color="#000" />
        <Text style={styles.label}>Change PIN</Text>
        <Ionicons name="chevron-forward" size={22} color="#9CA3AF" />
      </TouchableOpacity>

      <View style={styles.row}>
        <Ionicons name="finger-print-outline" size={22} color="#000" />
        <Text style={styles.label}>Fingerprint Login</Text>
        <Switch value={fingerprint} onValueChange={toggleFingerprint} />
      </View>

      <View style={styles.row}>
        <ScanFace size={22} color="#000" strokeWidth={2} />
        <Text style={styles.label}>Face ID</Text>
        <Switch value={faceId} onValueChange={toggleFaceId} />
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#EF4444" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* 📝 Change Password Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update PIN</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter New 4-Digit PIN"
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
              value={newPin}
              onChangeText={setNewPin}
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm New PIN"
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
              value={confirmPin}
              onChangeText={setConfirmPin}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.btn, styles.cancelBtn]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.saveBtn]}
                onPress={handleChangePassword}
              >
                <Text style={styles.saveBtnText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF", padding: 20 },
  heading: {
    marginTop: 32,
    fontSize: 26,
    fontWeight: "700",
    color: "#000",
    marginBottom: 30,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  label: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  value: { fontSize: 15, color: "#6B7280" },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "auto",
    marginBottom: 120,
    padding: 16,
    backgroundColor: "#FEE2E2",
    borderRadius: 16,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#FFF",
    padding: 25,
    borderRadius: 24,
    alignItems: "center",
  },
  modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 20 },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  btn: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelBtn: { marginRight: 10, backgroundColor: "#F3F4F6" },
  saveBtn: { backgroundColor: "#2563EB" },
  cancelBtnText: { color: "#4B5563", fontWeight: "600" },
  saveBtnText: { color: "#FFF", fontWeight: "600" },
});
