import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";

const { width, height } = Dimensions.get("window");

type FocusableFields = "email" | "user" | null;

export default function LoginScreen() {
   const router = useRouter();
   const [focusedField, setFocusedField] = useState<FocusableFields>(null);
   const [email, setEmail] = useState("");
   const [username, setUsername] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          setFocusedField(null);
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* 1. Header & Illustration Section */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => router.push("/onboarding")}
                style={styles.backButton}
              >
                <Ionicons name="chevron-back" size={28} color="black" />
              </TouchableOpacity>
            </View>

            <View style={styles.imageContainer}>
              <Image
                source={require("../assets/illustrations/splash-2.png")}
                style={styles.image}
                resizeMode="contain"
              />
            </View>

            {/* 2. Main Form Content Section */}
            <View style={styles.formSection}>
              <Text style={styles.title}>Save Your Details</Text>

              <View style={styles.inputWrapper}>
                <TextInput
                  style={[
                    styles.input,
                    focusedField === "email" && styles.inputFocused,
                  ]}
                  placeholder="Your Mail id"
                  placeholderTextColor="#9E9E9E"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                />

                <TextInput
                  style={[
                    styles.input,
                    focusedField === "user" && styles.inputFocused,
                  ]}
                  placeholder="Your User name"
                  placeholderTextColor="#9E9E9E"
                  autoCapitalize="words"
                  value={username}
                  onChangeText={setUsername}
                  onFocus={() => setFocusedField("user")}
                  onBlur={() => setFocusedField(null)}
                />
              </View>

              {/* Action Button */}
              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={async () => {
                    if (!email || !username) {
                      Alert.alert("Error", "Please enter email and username");
                      return;
                    }

                    await SecureStore.setItemAsync("email", email);
                    await SecureStore.setItemAsync("username", username);
                    await SecureStore.setItemAsync("login_done", "true");

                    router.replace("/pin"); // PIN opens every time later
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 25,
  },
  header: {
    height: 50,
    justifyContent: "center",
    marginTop: Platform.OS === "android" ? 10 : 0,
  },
  backButton: {
    top: 19,
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  imageContainer: {
    top: 26,
    flex: 1,
    height: height * 0.35, // Dynamic height based on screen size
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: width * 1.0,
    height: width * 1.0,
  },
  formSection: {
    flex: 1,
    justifyContent: "flex-end", // Pushes content towards bottom
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#000",
    textAlign: "center",
    marginBottom: 40, // Space between title and inputs
  },
  inputWrapper: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#F8F9FA",
    height: 65,
    borderRadius: 20,
    paddingHorizontal: 25,
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: "#F0F0F0",
  },
  inputFocused: {
    borderColor: "#2563EB",
    backgroundColor: "#FFFFFF",
    // Lift effect for active input
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  footer: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#2563EB",
    width: "100%",
    maxWidth: 350,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
