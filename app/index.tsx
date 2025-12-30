import { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { COLORS } from "@/utils/colors";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      try {
        const onboardingDone = await SecureStore.getItemAsync("onboarding_done");
        const loginDone = await SecureStore.getItemAsync("login_done");

        // 1️⃣ Onboarding should run ONLY ONCE
        if (onboardingDone !== "true") {
          router.replace("/onboarding");
          return;
        }

        // 2️⃣ Login should run ONLY ONCE
        if (loginDone !== "true") {
          router.replace("/login");
          return;
        }

        // 3️⃣ PIN should run EVERY TIME
        router.replace("/pin");

      } catch (error) {
        // Safe fallback
        router.replace("/onboarding");
      }
    };

    init();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
});
