import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Edit({ route, navigation }) {
  // Mengambil ID dan detailData yang dikirim dari halaman detail.js
  const { id, detailData } = route.params || {};

  // State untuk data yang dapat diubah
  const [judul, setJudul] = useState(detailData?.judul || "");
  const [nominal, setNominal] = useState(
    detailData?.nominal ? String(detailData.nominal) : "",
  );
  const [loading, setLoading] = useState(false);

  // Data terkunci (read-only)
  const kategoriText = detailData?.id_kategori
    ? `${detailData.id_kategori} (${detailData.nama_kategori || detailData.kategori || "Umum"})`
    : detailData?.nama_kategori || detailData?.kategori || "Umum";

  const [catatan, setCatatan] = useState(detailData?.catatan || "");
  

  // Jika detailData tidak dikirim via params, fetch ulang dari server
  useEffect(() => {
    if (!detailData && id) {
      fetchDetail();
    }
  }, [id]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://192.168.18.72:3000/pengeluaran/${id}`,
      );
      const result = await response.json();

      if (response.ok) {
        setJudul(result.judul || "");
        setNominal(result.nominal ? String(result.nominal) : "");
      }
    } catch (error) {
      console.error("Gagal fetch data edit:", error);
    } finally {
      setLoading(false);
    }
  };

  // FUNGSI SUBMIT PUT KE BACKEND
 const handleUpdate = async () => {
   if (!judul.trim() || !nominal) {
     Alert.alert("Peringatan", "Judul dan Nominal wajib diisi!");
     return;
   }

   setLoading(true);
   try {
     const response = await fetch(
       `http://192.168.18.72:3000/pengeluaran/${id}`,
       {
         method: "PUT",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           judul: judul.trim(),
           nominal: Number(nominal),
           catatan: catatan, // <-- Tambahkan catatan di sini
         }),
       },
     );

     const result = await response.json();
if (response.ok) {
  // Navigasi langsung ke Home dengan parameter Notifikasi Ubah Data
  navigation.navigate("Home", {
    editedSuccess: true,
    oldTitle: detailData?.judul || "Pengeluaran",
    newTitle: judul.trim(),
  });
} else {
  Alert.alert("Gagal", result.pesan || "Gagal memperbarui data");
}
   } catch (error) {
     Alert.alert("Error", "Gagal terhubung ke server");
   } finally {
     setLoading(false);
   }
 };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#0d7a75" barStyle="light-content" />

      {/* HEADER TOP BAR */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ubah Pengeluaran</Text>
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>
        {/* INPUT 1: JUDUL PENGELUARAN (DAPAT DIUBAH) */}
        <Text style={styles.label}>Judul Pengeluaran (Dapat Diubah)</Text>
        <TextInput
          style={styles.inputActive}
          value={judul}
          onChangeText={setJudul}
          placeholder="Masukkan judul pengeluaran"
          placeholderTextColor="#a0a0a0"
        />

        {/* INPUT 2: NOMINAL RUPIAH (DAPAT DIUBAH) */}
        <Text style={styles.label}>Nominal Rupiah (Dapat Diubah)</Text>
        <TextInput
          style={styles.inputActive}
          value={nominal}
          onChangeText={setNominal}
          keyboardType="numeric"
          placeholder="Masukkan nominal angka"
          placeholderTextColor="#a0a0a0"
        />

        {/* INPUT 3: KATEGORI (TERKUNCI) */}
        <Text style={styles.label}>Kategori (Terkunci)</Text>
        <View style={styles.inputDisabled}>
          <Text style={styles.disabledText}>{kategoriText}</Text>
        </View>
        <Text style={styles.lockNoteText}>
          🔒 Kontrak PUT hanya memperbarui judul & nominal
        </Text>

        {/* INPUT 4: CATATAN (DAPAT DIUBAH) */}
        <Text style={styles.label}>Catatan (Dapat Diubah)</Text>
        <TextInput
          style={[styles.inputActive, styles.textArea]}
          value={catatan}
          onChangeText={setCatatan}
          placeholder="Masukkan catatan"
          placeholderTextColor="#a0a0a0"
          multiline={true}
          numberOfLines={3}
          textAlignVertical="top"
        />

        {/* TOMBOL SIMPAN PERUBAHAN */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.submitButtonText}>Simpan Perubahan</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    backgroundColor: "#0d7a75",
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  formContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1a202c",
    marginBottom: 8,
    marginTop: 12,
  },
  /* STYLE INPUT AKTIF (BISA DIEDIT) */
  inputActive: {
    borderWidth: 1,
    borderColor: "#c3cee0",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1a202c",
    backgroundColor: "#ffffff",
  },
  /* STYLE INPUT TERKUNCI / DISABLED */
  inputDisabled: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#f0f4f8", // Warna latar abu-abu muda lunak
    justifyContent: "center",
  },
  textAreaDisabled: {
    minHeight: 48,
  },
  disabledText: {
    fontSize: 14,
    color: "#a0aec0", // Warna teks abu-abu pudar
  },
  lockNoteText: {
    fontSize: 11,
    color: "#8a94a6",
    marginTop: 6,
    marginBottom: 4,
  },
  /* TOMBOL SIMPAN */
  submitButton: {
    backgroundColor: "#0d7a75",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 32,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
  },
});
