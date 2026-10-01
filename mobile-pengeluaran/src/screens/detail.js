import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
  ScrollView,
  Modal, 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; 
import { Ionicons } from "@expo/vector-icons";

export default function Detail({ route, navigation }) {
  const { id } = route.params || {};

  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);

  // State untuk mengontrol pop-up modal hapus
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  

  // Fetch data setiap kali halaman Detail mendapatkan fokus
  useFocusEffect(
    useCallback(() => {
      if (id) {
        fetchDetail();
      }
    }, [id]),
  );

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://192.168.18.72:3000/pengeluaran/${id}`,
      );
      const result = await response.json();

      if (response.ok) {
        setDetailData(result);
      } else {
        Alert.alert("Error", result.pesan || "Gagal mengambil detail data");
      }
    } catch (error) {
      console.error("Gagal fetch detail:", error);
      Alert.alert("Error", "Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (val) => {
    if (!val) return "Rp 0";
    return `Rp ${Number(val).toLocaleString("id-ID")}`;
  };

  const formatTanggal = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Fungsi eksekusi hapus ke backend
  // Fungsi eksekusi hapus ke backend pada detail.js
  const confirmDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(
        `http://192.168.18.72:3000/pengeluaran/${id}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        setDeleteModalVisible(false);
        // Navigasi ke layar Home sambil membawa parameter deletedSuccess
        navigation.navigate("Home", { deletedSuccess: true });
      } else {
        Alert.alert("Gagal", "Gagal menghapus data dari server");
      }
    } catch (err) {
      Alert.alert("Error", "Gagal terhubung ke server");
    } finally {
      setDeleting(false);
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
        <Text style={styles.headerTitle}>Detail Pengeluaran</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0d7a75" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            {/* Judul Pengeluaran */}
            <Text style={styles.fieldLabelSmall}>Judul Pengeluaran</Text>
            <Text style={styles.titleText}>{detailData?.judul || "-"}</Text>

            <View style={{ height: 14 }} />

            {/* Nominal */}
            <Text style={styles.fieldLabelSmall}>Nominal</Text>
            <Text style={styles.amountText}>
              {formatRupiah(detailData?.nominal)}
            </Text>

            <View style={styles.divider} />

            {/* Tanggal */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tanggal:</Text>
              <Text style={styles.infoValue}>
                {formatTanggal(detailData?.created_at || detailData?.tanggal)}
              </Text>
            </View>

            {/* Kategori Dinamis dari Database */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Kategori:</Text>
              <Text style={styles.infoValue}>
                {detailData?.nama_kategori || detailData?.kategori || "Umum"}
              </Text>
            </View>

            {/* Catatan Dinamis dari Database */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Catatan:</Text>
              <Text
                style={[
                  styles.infoValue,
                  !detailData?.catatan && styles.emptyNoteText,
                ]}
              >
                {detailData?.catatan && detailData.catatan.trim() !== ""
                  ? detailData.catatan
                  : "Belum ada catatan"}
              </Text>
            </View>
          </View>

          {/* TOMBOL UBAH */}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate("edit", { id, detailData })}
          >
            <Text style={styles.buttonText}>Ubah Pengeluaran</Text>
          </TouchableOpacity>

          {/* TOMBOL HAPUS PENGELUARAN */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => setDeleteModalVisible(true)}
          >
            <Text style={styles.buttonText}>Hapus Pengeluaran</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* POP UP MODAL KONFIRMASI HAPUS */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {/* Judul Modal */}
            <Text style={styles.modalTitle}>Hapus Pengeluaran?</Text>

            {/* Deskripsi */}
            <Text style={styles.modalSubText}>
              Apakah Anda yakin ingin menghapus
            </Text>
            <Text style={styles.modalItemText}>
              "{detailData?.judul || "Pengeluaran"}" (
              {formatRupiah(detailData?.nominal)})?
            </Text>

            {/* Baris Tombol Aksi */}
            <View style={styles.modalButtonRow}>
              {/* Tombol Batal */}
              <TouchableOpacity
                style={styles.cancelModalButton}
                onPress={() => setDeleteModalVisible(false)}
                disabled={deleting}
              >
                <Text style={styles.cancelModalButtonText}>Batal</Text>
              </TouchableOpacity>

              {/* Tombol Ya, Hapus */}
              <TouchableOpacity
                style={styles.confirmDeleteModalButton}
                onPress={confirmDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text style={styles.confirmDeleteModalButtonText}>
                    Ya, Hapus
                  </Text>
                )}
              </TouchableOpacity>
            </View>
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
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  backButton: { marginRight: 15 },
  headerTitle: { color: "#ffffff", fontSize: 18, fontWeight: "bold" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { padding: 20 },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#dbe2ea",
    padding: 20,
    marginBottom: 20,
  },
  fieldLabelSmall: { fontSize: 12, color: "#8a94a6", marginBottom: 3 },
  titleText: { fontSize: 18, fontWeight: "bold", color: "#1a202c" },
  amountText: { fontSize: 22, fontWeight: "bold", color: "#0d7a75" },
  divider: { height: 1, backgroundColor: "#f0f2f5", marginVertical: 16 },
  infoRow: { flexDirection: "row", marginBottom: 12, alignItems: "flex-start" },
  infoLabel: { width: 80, fontSize: 13, color: "#8a94a6" },
  infoValue: { flex: 1, fontSize: 13, fontWeight: "bold", color: "#1a202c" },
  emptyNoteText: {
    fontWeight: "normal",
    fontStyle: "italic",
    color: "#718096",
  },
  editButton: {
    backgroundColor: "#0d7a75",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  deleteButton: {
    backgroundColor: "#c62828",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#ffffff", fontSize: 15, fontWeight: "bold" },
  /* STYLES MODAL KONFIRMASI HAPUS */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  modalBox: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a202c",
    marginBottom: 8,
  },
  modalSubText: {
    fontSize: 13,
    color: "#718096",
    textAlign: "center",
  },
  modalItemText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1a202c",
    textAlign: "center",
    marginTop: 2,
    marginBottom: 20,
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 12,
  },
  cancelModalButton: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelModalButtonText: {
    color: "#2d3748",
    fontSize: 14,
    fontWeight: "bold",
  },
  confirmDeleteModalButton: {
    flex: 1,
    backgroundColor: "#c62828",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmDeleteModalButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
