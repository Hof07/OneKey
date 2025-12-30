import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";
import { Ionicons } from "@expo/vector-icons";

const PIN_LENGTH = 4;

export default function Pin() {
  const router = useRouter();

  const [pin, setPin] = useState("");
  const [storedPin, setStoredPin] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false); // New state
  const [confirmPin, setConfirmPin] = useState(""); // For confirming new pin
  const [step, setStep] = useState(1); // 1: Create, 2: Confirm
  const [error, setError] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [skipBiometric, setSkipBiometric] = useState(false);

  // 🔐 1. LOAD STORED PIN & INITIALIZE BIOMETRICS
  useEffect(() => {
    const initialize = async () => {
      const savedPin = await SecureStore.getItemAsync("user_pin");
      setStoredPin(savedPin);

      if (!savedPin) {
        // No PIN found, force creation mode
        setIsRegistering(true);
        setShowPin(true);
      } else {
        // PIN exists, try biometrics
        authenticate();
      }
    };

    const authenticate = async () => {
      if (skipBiometric) {
        setShowPin(true);
        return;
      }

      const fingerprint = await SecureStore.getItemAsync("fingerprint_enabled");
      const faceId = await SecureStore.getItemAsync("faceid_enabled");
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      if ((fingerprint === "true" || faceId === "true") && hasHardware && enrolled) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: "Unlock SecureVault",
          fallbackLabel: "Use PIN",
        });

        if (result.success) {
          router.replace("/home");
          return;
        }
      }
      setShowPin(true);
    };

    initialize();
  }, [skipBiometric]);

  // 🔢 HANDLE PIN PRESS
  const handlePress = async (num: string) => {
    if (pin.length < PIN_LENGTH) {
      const newPin = pin + num;
      setPin(newPin);

      if (newPin.length === PIN_LENGTH) {
        if (isRegistering) {
          // CREATION MODE
          if (step === 1) {
            setConfirmPin(newPin);
            setPin("");
            setStep(2);
          } else {
            // CONFIRMATION STEP
            if (newPin === confirmPin) {
              await SecureStore.setItemAsync("user_pin", newPin);
              router.replace("/home");
            } else {
              setError("PINs do not match");
              resetPin();
              setStep(1); // Go back to first step
            }
          }
        } else {
          // AUTHENTICATION MODE
          if (newPin === storedPin) {
            router.replace("/home");
          } else {
            setError("Incorrect PIN");
            resetPin();
          }
        }
      }
    }
  };

  const resetPin = () => {
    setTimeout(() => {
      setPin("");
      setError("");
    }, 800);
  };

  // Helper for screen title
  const getTitle = () => {
    if (isRegistering) {
      return step === 1 ? "Create PIN" : "Confirm PIN";
    }
    return "Enter PIN";
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 0.3, justifyContent: "center" }} />

      {!showPin && (
        <TouchableOpacity onPress={() => setSkipBiometric(true)} style={{ marginTop: 120 }}>
          <Text style={styles.usePin}>Use PIN</Text>
        </TouchableOpacity>
      )}

      {showPin && (
        <>
          <Text style={styles.title}>{getTitle()}</Text>

          <View style={styles.pinRow}>
            {[0, 1, 2, 3].map((i) => (
              <View
                key={i}
                style={[styles.dot, pin.length > i && styles.activeDot]}
              />
            ))}
          </View>

          <View style={{ height: 30 }}>
            {error !== "" && <Text style={styles.error}>{error}</Text>}
          </View>

          <View style={styles.keypad}>
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"].map((item, i) =>
              item === "" ? (
                <View key={i} style={styles.keyPlaceholder} />
              ) : (
                <TouchableOpacity
                  key={i}
                  style={styles.key}
                  onPress={() => (item === "del" ? setPin(pin.slice(0, -1)) : handlePress(item))}
                >
                  {item === "del" ? (
                    <Ionicons name="backspace-outline" size={26} color="black" />
                  ) : (
                    <Text style={styles.keyText}>{item}</Text>
                  )}
                </TouchableOpacity>
              )
            )}
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
  },
  usePin: {
    fontSize: 16,
    color: "#2563EB",
    fontWeight: "600",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 60,
    marginBottom: 40,
    color: "#111827",
  },
  pinRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    marginHorizontal: 12,
  },
  activeDot: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  error: {
    color: "#EF4444",
    fontFamily: "Outfit_500Medium",
    fontSize: 14,
  },
  keypad: {
    width: "85%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  key: {
    width: "28%",
    height: 75,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    marginVertical: 10,
  },
  keyPlaceholder: {
    width: "28%",
  },
  keyText: {
    fontSize: 26,
    fontWeight: "600",
    color: "#111827",
  },
});