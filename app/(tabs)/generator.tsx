import { View, Text } from "react-native";

export default function Generator() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFF",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Regular */}
      <Text
        style={{
          // fontFamily: "Outfit_400Regular",
          fontSize: 22,
          color: "#000",
          marginBottom: 10,
        }}
      >
        Outfit Regular – Password Generator Ansh
      </Text>

      {/* Medium */}
      <Text
        style={{
          // fontFamily: "Outfit_500Medium",
          fontSize: 22,
          color: "#000",
          marginBottom: 10,
        }}
      >
        Outfit Medium – Password Generator
      </Text>

      {/* Bold */}
      <Text
        style={{
          // fontFamily: "Outfit_700Bold",
          fontSize: 22,
          color: "#000",
        }}
      >
        Outfit Bold – Password Generator
      </Text>
    </View>
  );
}
