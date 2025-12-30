import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function Onboarding() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Illustration */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/illustrations/splash-1.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Text Content */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Don't Remember{"\n"}Passwords</Text>

        <Text style={styles.subtitle}>
          Stop remembering passwords—store all your passwords securely in OneKey and use them easily.
        </Text>
      </View>

      {/* Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/login")}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB", // Changed to white
    alignItems: "center",
    justifyContent: "space-around", // Better spacing for the image-focused design
    paddingVertical: 40,
    paddingHorizontal: 40,
  },
  imageContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  image: {
    width: width * 1.0,
    height: width * 1.0,
  },
  textContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    color: "#000000", // Dark text
    fontWeight: "800", // Extra bold
    textAlign: "center",
    lineHeight: 40,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: "#9E9E9E", // Gray text
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "600",
    paddingHorizontal: 10,
  },
  footer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2563EB",
    width: 343,
    height: 63,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
});
