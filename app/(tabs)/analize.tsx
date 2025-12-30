import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  Dimensions, 
  ActivityIndicator 
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import { PieChart, BarChart } from "react-native-chart-kit";
import { useFocusEffect } from "expo-router";

const screenWidth = Dimensions.get("window").width;

export default function AnalyticsScreen() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    total: 0,
    webs: 0,
    apps: 0,
    cards: 0,
    strong: 0,
    weak: 0,
  });

  const calculateStats = async () => {
    setLoading(true);
    try {
      const keysStr = await SecureStore.getItemAsync("master_password_index");
      if (!keysStr) {
        setLoading(false);
        return;
      }

      const keys = JSON.parse(keysStr);
      const allData = await Promise.all(
        keys.map(async (key: string) => {
          const res = await SecureStore.getItemAsync(key);
          return res ? JSON.parse(res) : null;
        })
      );

      const validData = allData.filter((i) => i !== null);
      
      const webs = validData.filter((i) => i.category === "Webs").length;
      const apps = validData.filter((i) => i.category === "Apps").length;
      const cards = validData.filter((i) => i.category === "Cards").length;
      const strong = validData.filter((i) => i.password?.length >= 12).length;

      setData({
        total: validData.length,
        webs,
        apps,
        cards,
        strong,
        weak: validData.length - strong,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      calculateStats();
    }, [])
  );

  const pieData = [
    { name: "Webs", population: data.webs, color: "#2563EB", legendFontColor: "#7F7F7F", legendFontSize: 12 },
    { name: "Apps", population: data.apps, color: "#FBBF24", legendFontColor: "#7F7F7F", legendFontSize: 12 },
    { name: "Cards", population: data.cards, color: "#10B981", legendFontColor: "#7F7F7F", legendFontSize: 12 },
  ];

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Security Insights</Text>

        {/* Overview Cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryBox, { backgroundColor: '#EEF2FF' }]}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={[styles.summaryValue, { color: '#2563EB' }]}>{data.total}</Text>
          </View>
          <View style={[styles.summaryBox, { backgroundColor: '#ECFDF5' }]}>
            <Text style={styles.summaryLabel}>Strong</Text>
            <Text style={[styles.summaryValue, { color: '#10B981' }]}>{data.strong}</Text>
          </View>
        </View>

        {/* Pie Chart Section */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Data Distribution</Text>
          <PieChart
            data={pieData}
            width={screenWidth - 40}
            height={200}
            chartConfig={chartConfig}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            center={[10, 0]}
            absolute
          />
        </View>

        {/* Bar Chart Section */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Security Health</Text>
          <BarChart
            data={{
              labels: ["Strong", "Weak"],
              datasets: [{ data: [data.strong, data.weak] }]
            }}
            width={screenWidth - 60}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            style={styles.barChartStyle}
          />
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const chartConfig = {
  backgroundGradientFrom: "#FFF",
  backgroundGradientTo: "#FFF",
  color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.7,
  useShadowColorFromDataset: false,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20 },
  heading: { fontSize: 28, fontWeight: "800", color: "#111827", marginBottom: 25, marginTop: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  summaryBox: { width: '47%', padding: 20, borderRadius: 24, alignItems: 'center' },
  summaryLabel: { fontSize: 14, color: "#6B7280", fontWeight: "600" },
  summaryValue: { fontSize: 32, fontWeight: "800", marginTop: 5 },
  chartCard: { 
    backgroundColor: "#FFF", 
    borderRadius: 24, 
    padding: 20, 
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    alignItems: 'center'
  },
  chartTitle: { fontSize: 18, fontWeight: "700", color: "#1F2937", alignSelf: 'flex-start', marginBottom: 15 },
  barChartStyle: { marginVertical: 8, borderRadius: 16 },
});