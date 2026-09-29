import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  ScrollView,
} from "react-native";

export default function Add({ navigation }) {
  const [judul, setJudul] = useState("");
  const [nominal, setNominal] = useState("");
  const [idKategori, setIdKategori] = useState("1"); // Default kategori ID 1 (misal: Makanan)
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!judul || !nominal) {
      Alert.alert("Peringatan", "Judul dan nominal wajib diisi!");
      return;
    }

    setLoading(true);
    try {
      // Sesuaikan IP address jika menggunakan HP fisik, gunakan 10.0.2.2 untuk emulator
      const response = await fetch("http://192.168.18.72:3000/pengeluaran", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          judul: judul,
          nominal: Number(nominal),
          id_kategori: Number(idKategori),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Sukses", "Data pengeluaran berhasil ditambahkan!", [
          { text: "OK", onPress: () => navigation.goBack() }, // Kembali ke halaman Home
        ]);
      } else {
        Alert.alert("Gagal", result.pesan || "Terjadi kesalahan pada server.");
      }
    } catch (err) {
      Alert.alert("Error", "Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Judul Pengeluaran:</Text>
      <TextInput
        style={styles.input}
        placeholder="Contoh: Makan Siang"
        value={judul}
        onChangeText={setJudul}
      />

      <Text style={styles.label}>Nominal (Rp):</Text>
      <TextInput
        style={styles.input}
        placeholder="Contoh: 20000"
        keyboardType="numeric"
        value={nominal}
        onChangeText={setNominal}
      />

      <Text style={styles.label}>
        ID Kategori (1: Makanan, 2: Transport, dll):
      </Text>
      <TextInput
        style={styles.input}
        placeholder="1"
        keyboardType="numeric"
        value={idKategori}
        onChangeText={setIdKategori}
      />

      <Button
        title={loading ? "Menyimpan..." : "Simpan Pengeluaran"}
        onPress={handleSubmit}
        disabled={loading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#fff" },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 5, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#fcfcfc",
  },
});
