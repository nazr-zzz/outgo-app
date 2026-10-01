import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Add({ navigation }) {
  const [judul, setJudul] = useState("");
  const [nominal, setNominal] = useState("");
  const [idKategori, setIdKategori] = useState("");
  const [catatan, setCatatan] = useState("");
  const [loading, setLoading] = useState(false);

  // State Kategori
  const [daftarKategori, setDaftarKategori] = useState([]);
  const [loadingKategori, setLoadingKategori] = useState(true);

  // State Modal Kategori
  const [modalVisible, setModalVisible] = useState(false);
  const [tempSelectedId, setTempSelectedId] = useState(null);

  // --- STATE VALIDASI ERROR ---
  const [errors, setErrors] = useState({});
  const [formGeneralError, setFormGeneralError] = useState(false);

  useEffect(() => {
    fetchKategori();
  }, []);

  const fetchKategori = async () => {
    try {
      const response = await fetch("http://192.168.18.72:3000/kategori");
      const result = await response.json();

      if (response.ok) {
        setDaftarKategori(result);
        if (result.length > 0) {
          setIdKategori(result[0].id.toString());
          setTempSelectedId(result[0].id.toString());
        }
      }
    } catch (err) {
      console.error("Gagal fetch kategori:", err);
    } finally {
      setLoadingKategori(false);
    }
  };

  // Helper Ikon Kategori
  const getCategoryIcon = (nama, dbIcon) => {
    if (dbIcon) return dbIcon;
    const nameLower = nama?.toLowerCase() || "";
    if (nameLower.includes("kesehatan") || nameLower.includes("rawat"))
      return "heart-dislike-outline";
    if (nameLower.includes("hiburan")) return "happy-outline";
    if (nameLower.includes("sedekah")) return "hand-left-outline";
    if (nameLower.includes("makan")) return "restaurant-outline";
    if (nameLower.includes("trans")) return "car-outline";
    if (nameLower.includes("tabung")) return "wallet-outline";
    return "pricetag-outline";
  };

  const selectedCategoryObj = daftarKategori.find(
    (item) => item.id.toString() === idKategori.toString(),
  );

  // --- FUNGSI VALIDASI FORM ---
  const validateForm = () => {
    let newErrors = {};

    // 1. Validasi Judul
    if (!judul.trim()) {
      newErrors.judul = "Judul wajib diisi (maks. 100 karakter)";
    } else if (judul.length > 100) {
      newErrors.judul = "Judul maksimal 100 karakter";
    }

    // 2. Validasi Nominal (Harus angka bulat positif > 0)
    const numNominal = Number(nominal);
    if (
      !nominal ||
      isNaN(numNominal) ||
      numNominal <= 0 ||
      !Number.isInteger(numNominal)
    ) {
      newErrors.nominal = "Nominal harus berupa angka bulat positif";
    }

    // 3. Validasi Kategori
    if (!idKategori) {
      newErrors.kategori = "Kategori wajib dipilih";
    }

    setErrors(newErrors);

    const hasError = Object.keys(newErrors).length > 0;
    setFormGeneralError(hasError);

    return !hasError; // Return true jika valid
  };

  const handleSubmit = async () => {
    // Jalankan validasi terlebih dahulu
    if (!validateForm()) {
      return; // Stop jika form tidak valid
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const response = await fetch("http://192.168.18.72:3000/pengeluaran", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          judul: judul,
          nominal: Number(nominal),
          id_kategori: Number(idKategori),
          catatan: catatan,
        }),
      });

      const result = await response.json();

      // Di dalam fungsi simpan / submit pada add.js
      if (response.ok) {
        // Navigasi ke Home sambil membawa parameter nama pengeluaran yang baru dibuat
        navigation.navigate("Home", {
          addedSuccess: true,
          addedTitle: judul.trim(),
        });
      } else {
        Alert.alert("Gagal", result.pesan || "Gagal menyimpan pengeluaran");
      }
    } catch (err) {
      Alert.alert("Error", "Gagal terhubung ke server.");
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
        <Text style={styles.headerTitle}>Tambah Pengeluaran</Text>
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>
        {/* BANNER ERROR ATAS */}
        {formGeneralError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>
              ⚠️ Form tidak valid! Periksa pesan error di bawah.
            </Text>
          </View>
        )}

        {/* INPUT JUDUL */}
        <Text style={styles.label}>Judul*</Text>
        <TextInput
          style={[styles.input, errors.judul && styles.inputError]}
          placeholder="Contoh: Makan siang"
          placeholderTextColor="#a0a0a0"
          maxLength={100}
          value={judul}
          onChangeText={(text) => {
            setJudul(text);
            if (errors.judul) setErrors((prev) => ({ ...prev, judul: null }));
          }}
        />
        <Text
          style={[styles.helperText, errors.judul && styles.helperTextError]}
        >
          {errors.judul ? errors.judul : "Maksimum 100 karakter"}
        </Text>

        {/* INPUT NOMINAL */}
        <Text style={styles.label}>Nominal Rupiah*</Text>
        <TextInput
          style={[styles.input, errors.nominal && styles.inputError]}
          placeholder="20000"
          placeholderTextColor="#a0a0a0"
          keyboardType="numeric"
          value={nominal}
          onChangeText={(text) => {
            setNominal(text);
            if (errors.nominal)
              setErrors((prev) => ({ ...prev, nominal: null }));
          }}
        />
        <Text
          style={[styles.helperText, errors.nominal && styles.helperTextError]}
        >
          {errors.nominal
            ? errors.nominal
            : "Angka bulat positif tanpa Rp / titik"}
        </Text>

        {/* SELECTOR KATEGORI */}
        <Text style={styles.label}>Kategori</Text>
        <TouchableOpacity
          style={[
            styles.selectCategoryButton,
            errors.kategori && styles.inputError,
          ]}
          onPress={() => {
            setTempSelectedId(idKategori);
            setModalVisible(true);
          }}
        >
          <Text style={styles.selectCategoryText}>
            {selectedCategoryObj ? selectedCategoryObj.nama : "Pilih Kategori"}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#333" />
        </TouchableOpacity>
        {errors.kategori && (
          <Text style={styles.helperTextError}>{errors.kategori}</Text>
        )}

        {/* INPUT CATATAN */}
        <Text style={styles.label}>Catatan</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
          maxLength={1000}
          value={catatan}
          onChangeText={setCatatan}
        />
        <Text style={styles.helperText}>Maksimum 1000 karakter</Text>

        <Text style={styles.noteText}>*Tanggal otomatis dari server</Text>

        {/* TOMBOL SIMPAN */}
        {/* TOMBOL SIMPAN */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? "Menyimpan..." : "Simpan"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL BOTTOM SHEET PILIH KATEGORI */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Pilih Kategori</Text>

            <ScrollView style={{ maxHeight: 350, width: "100%" }}>
              {loadingKategori ? (
                <ActivityIndicator color="#0d7a75" style={{ padding: 20 }} />
              ) : (
                daftarKategori.map((item) => {
                  const isSelected =
                    tempSelectedId?.toString() === item.id.toString();
                  const iconName = getCategoryIcon(item.nama, item.icon);

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.categoryCard,
                        isSelected && styles.categoryCardSelected,
                      ]}
                      onPress={() => setTempSelectedId(item.id.toString())}
                    >
                      <Ionicons
                        name={iconName}
                        size={22}
                        color={isSelected ? "#0d7a75" : "#333333"}
                        style={{ marginRight: 12 }}
                      />
                      <Text
                        style={[
                          styles.categoryCardText,
                          isSelected && styles.categoryCardTextSelected,
                        ]}
                      >
                        {item.nama}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                setIdKategori(tempSelectedId);
                if (errors.kategori)
                  setErrors((prev) => ({ ...prev, kategori: null }));
                setModalVisible(false);
              }}
            >
              <Text style={styles.confirmButtonText}>Pilih Kategori Ini</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* MODAL OVERLAY LOADING SAAT SIMPAN DATA */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={loading}
        onRequestClose={() => {}}
      >
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.loadingText}>Menyimpan...</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  header: {
    backgroundColor: "#0d7a75",
    height: 90,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  backButton: { marginRight: 15, paddingTop: 30 },
  headerTitle: { color: "#ffffff", fontSize: 18, fontWeight: "bold", paddingTop: 30 },
  formContainer: { padding: 20, paddingBottom: 40 },

  /* BANNER ERROR DESAIN GAMBAR */
  errorBanner: {
    backgroundColor: "#FDE8E8",
    borderColor: "#E53E3E",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  errorBannerText: {
    color: "#9B1C1C",
    fontSize: 13,
    fontWeight: "bold",
  },

  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#888888",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#000000",
  },
  /* STYLE INPUT SAAT ERROR */
  inputError: {
    borderColor: "#E53E3E",
    borderWidth: 1.5,
  },

  helperText: {
    fontSize: 11,
    color: "#6c757d",
    marginTop: 4,
    marginBottom: 16,
  },
  /* STYLE TEKS HELPER SAAT ERROR */
  helperTextError: {
    fontSize: 11,
    color: "#E53E3E",
    fontWeight: "500",
    marginTop: 4,
    marginBottom: 16,
  },

  selectCategoryButton: {
    borderWidth: 1,
    borderColor: "#888888",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  selectCategoryText: { fontSize: 14, color: "#000000" },

  textArea: { height: 110, paddingTop: 10 },
  noteText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000000",
    marginTop: 5,
    marginBottom: 30,
  },
  submitButton: {
    backgroundColor: "#367b48",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },

  /* MODAL STYLES */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 25,
    alignItems: "center",
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#cccccc",
    borderRadius: 2,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
    alignSelf: "flex-start",
    marginBottom: 15,
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
    width: "100%",
  },
  categoryCardSelected: {
    backgroundColor: "#e0f7f4",
    borderColor: "#0d7a75",
    borderWidth: 1.5,
  },
  categoryCardText: { fontSize: 14, color: "#333333", fontWeight: "500" },
  categoryCardTextSelected: { color: "#0d7a75", fontWeight: "bold" },
  confirmButton: {
    backgroundColor: "#367b48",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
  confirmButtonText: { color: "#ffffff", fontSize: 15, fontWeight: "bold" },
  /* STYLE OVERLAY LOADING POPUP (DESAIN GAMBAR) */
  loadingOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.15)", // Latar belakang redup/transparan
    justifyContent: "center",
    alignItems: "center",
  },
  loadingBox: {
    width: 130,
    height: 110,
    backgroundColor: "#3a4252", // Warna kotak abu-abu gelap
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  loadingText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 10,
  },
  /* STYLE TOMBOL SAAT LOADING / DISABLED */
  submitButtonDisabled: {
    backgroundColor: "#9ba5b3", // Warna abu-abu tombol saat disabled
  },
});
