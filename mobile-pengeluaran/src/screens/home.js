import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Button,
  TouchableOpacity,
} from "react-native";

export default function Home({ navigation }) {
  const [dataPengeluaran, setDataPengeluaran] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi untuk mengambil data (GET) dari backend
  const fetchPengeluaran = async () => {
    setLoading(true);
    setError(null);
    try {
      // Ganti URL sesuai dengan alamat backend lo (10.0.2.2 untuk emulator Android)
      const response = await fetch("http://192.168.18.72:3000/pengeluaran");
      const result = await response.json();

      if (response.ok) {
        setDataPengeluaran(result);
      } else {
        setError("Gagal memuat data dari server.");
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPengeluaran();
  }, []);

  // Tampilan saat proses loading
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2cd134" />
        <Text>Memuat Data...</Text>
      </View>
    );
  }

  // Tampilan jika gagal / error
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
        <Button title="Coba Lagi" onPress={fetchPengeluaran} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daftar Pengeluaran</Text>

      {/* Tombol menuju halaman Tambah */}
      <Button
        title="Tambah Pengeluaran"
        onPress={() => navigation.navigate("Add")}
      />

      {/* Daftar list pengeluaran */}
      <FlatList
        data={dataPengeluaran}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("detail", { id: item.id })}
          >
            <Text style={styles.itemTitle}>{item.judul}</Text>
            <Text style={styles.itemAmount}>Rp {item.nominal}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    
  },
  card: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  itemTitle: { fontSize: 16, fontWeight: "600" },
  itemAmount: { fontSize: 14, color: "green", marginTop: 5 },
});
