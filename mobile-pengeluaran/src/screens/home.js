import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Diimpor dari safe-area-context
import { Ionicons } from "@expo/vector-icons";

export default function Home({ route, navigation }) {
  // 1. Menerima prop route
  const [dataPengeluaran, setDataPengeluaran] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //state notifikasi hapus, tambah, edit
  const [showDeleteBanner, setShowDeleteBanner] = useState(false);
  const [showAddBanner, setShowAddBanner] = useState(false);
  const [addedItemTitle, setAddedItemTitle] = useState("");

  // State Notifikasi Ubah Data
  const [showEditBanner, setShowEditBanner] = useState(false);
  const [editOldTitle, setEditOldTitle] = useState("");
  const [editNewTitle, setEditNewTitle] = useState("");


  //notif hapus data
  useFocusEffect(
    useCallback(() => {
      fetchPengeluaran();

      // 1. Cek Notifikasi Berhasil Hapus
      if (route.params?.deletedSuccess) {
        setShowDeleteBanner(true);
        const timer = setTimeout(() => {
          setShowDeleteBanner(false);
          navigation.setParams({ deletedSuccess: undefined });
        }, 4000);
        return () => clearTimeout(timer);
      }

      // 2. Cek Notifikasi Berhasil Tambah Data Baru
      if (route.params?.addedSuccess) {
        setShowAddBanner(true);
        setAddedItemTitle(route.params?.addedTitle || "Pengeluaran");

        const timer = setTimeout(() => {
          setShowAddBanner(false);
          navigation.setParams({
            addedSuccess: undefined,
            addedTitle: undefined,
          });
        }, 4000);
        return () => clearTimeout(timer);
      }
    }, [
      route.params?.deletedSuccess,
      route.params?.addedSuccess,
      route.params?.addedTitle,
    ]),
  );

 //ubah data
  useFocusEffect(
    useCallback(() => {
      fetchPengeluaran();

      // 1. Cek Notifikasi Berhasil Hapus
      if (route.params?.deletedSuccess) {
        setShowDeleteBanner(true);
        const timer = setTimeout(() => {
          setShowDeleteBanner(false);
          navigation.setParams({ deletedSuccess: undefined });
        }, 4000);
        return () => clearTimeout(timer);
      }

      // 2. Cek Notifikasi Berhasil Tambah Data Baru
      if (route.params?.addedSuccess) {
        setShowAddBanner(true);
        setAddedItemTitle(route.params?.addedTitle || "Pengeluaran");
        const timer = setTimeout(() => {
          setShowAddBanner(false);
          navigation.setParams({
            addedSuccess: undefined,
            addedTitle: undefined,
          });
        }, 4000);
        return () => clearTimeout(timer);
      }

      // 3. Cek Notifikasi Berhasil Ubah Data
      if (route.params?.editedSuccess) {
        setShowEditBanner(true);
        setEditOldTitle(route.params?.oldTitle || "");
        setEditNewTitle(route.params?.newTitle || "");

        const timer = setTimeout(() => {
          setShowEditBanner(false);
          navigation.setParams({
            editedSuccess: undefined,
            oldTitle: undefined,
            newTitle: undefined,
          });
        }, 4000);
        return () => clearTimeout(timer);
      }
    }, [
      route.params?.deletedSuccess,
      route.params?.addedSuccess,
      route.params?.addedTitle,
      route.params?.editedSuccess,
      route.params?.oldTitle,
      route.params?.newTitle,
    ]),
  );


  // 2. Fungsi Ambil Data dari Backend
  const fetchPengeluaran = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://192.168.18.72:3000/pengeluaran");
      const result = await response.json();

      if (response.ok) {
        // Urutkan dari data terbaru berdasarkan ID
        const sortedData = result.sort((a, b) => b.id - a.id);
        setDataPengeluaran(sortedData);
      } else {
        setError("Gagal memuat data dari server.");
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Gabungkan logika Fetch Data & Notifikasi Hapus dalam 1 useFocusEffect
  useFocusEffect(
    useCallback(() => {
      fetchPengeluaran();

      if (route.params?.deletedSuccess) {
        setShowDeleteBanner(true);

        // Otomatis hilangkan banner setelah 4 detik
        const timer = setTimeout(() => {
          setShowDeleteBanner(false);
          navigation.setParams({ deletedSuccess: undefined });
        }, 4000);

        return () => clearTimeout(timer);
      }
    }, [route.params?.deletedSuccess]),
  );

  // Helper Format Angka ke Rupiah (cth: 12000 -> Rp 12.000)
  const formatRupiah = (number) => {
    return "Rp " + Number(number).toLocaleString("id-ID");
  };

  // Helper menentukan nama ikon Ionicons sesuai nama kategori
  const getCategoryIcon = (nama) => {
    const nameLower = nama?.toLowerCase() || "";
    if (nameLower.includes("kesehatan") || nameLower.includes("rawat"))
      return "heart-dislike-outline";
    if (nameLower.includes("hiburan")) return "happy-outline";
    if (nameLower.includes("sedekah")) return "hand-left-outline";
    if (nameLower.includes("makan")) return "restaurant-outline";
    if (nameLower.includes("trans")) return "car-outline";
    if (nameLower.includes("tabung")) return "wallet-outline";
    if (nameLower.includes("didik") || nameLower.includes("sekolah"))
      return "book-outline";
    return "pricetag-outline";
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#0d7a75" barStyle="light-content" />

      {/* HEADER ATAS (TEAL) */}
      <View style={styles.header}>
        <Text style={styles.logoText}>Outgo</Text>
      </View>

      {/* SUB-HEADER (JUDUL + TOMBOL REFRESH) */}
      <View style={styles.subHeader}>
        <Text style={styles.sectionTitle}>Daftar Pengeluaran</Text>
        <TouchableOpacity
          onPress={fetchPengeluaran}
          style={styles.refreshButton}
        >
          <Ionicons name="reload-outline" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      {/* BANNER NOTIFIKASI BERHASIL DIHAPUS */}
      {showDeleteBanner && (
        <View style={styles.deleteBanner}>
          <Text style={styles.deleteBannerText}>
            Data pengeluaran berhasil dihapus.
          </Text>
        </View>
      )}

      {/* --- BANNER NOTIFIKASI BERHASIL TAMBAH DATA (HIJAU) --- */}
      {showAddBanner && (
        <View style={styles.addBanner}>
          <Text style={styles.addBannerText}>
            ✓ Berhasil menambahkan "{addedItemTitle}"!
          </Text>
        </View>
      )}

      {/* --- BANNER NOTIFIKASI BERHASIL UBAH DATA --- */}
{showEditBanner && (
  <View style={styles.editBanner}>
    <Text style={styles.editBannerText}>
      ✓ Judul "{editOldTitle}" diubah ke "{editNewTitle}"
    </Text>
  </View>
)}

      {/* CONTENT LIST */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0d7a75" />
          <Text style={{ marginTop: 10, color: "#666" }}>Memuat Data...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchPengeluaran}>
            <Text style={{ color: "#fff" }}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={dataPengeluaran}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* Baris 1: Judul & Nominal */}
              <View style={styles.cardRow1}>
                <Text style={styles.itemTitle}>{item.judul}</Text>
                <Text style={styles.itemAmount}>
                  {formatRupiah(item.nominal)}
                </Text>
              </View>

              {/* Baris 2: Badge Kategori & Tanggal */}
              <View style={styles.cardRow2}>
                <View style={styles.categoryBadge}>
                  <Ionicons
                    name={getCategoryIcon(item.nama_kategori || item.kategori)}
                    size={14}
                    color="#333333"
                    style={{ marginRight: 5 }}
                  />
                  <Text style={styles.categoryText}>
                    {item.nama_kategori || item.kategori || "Umum"}
                  </Text>
                </View>
                <Text style={styles.dateText}>
                  {item.created_at || item.tanggal
                    ? new Date(
                        item.created_at || item.tanggal,
                      ).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      })
                    : new Date().toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      })}
                </Text>
              </View>

              {/* Baris 3: Tombol Lihat Detail */}
              <TouchableOpacity
                style={styles.detailButton}
                onPress={() => navigation.navigate("detail", { id: item.id })}
              >
                <Text style={styles.detailButtonText}>Lihat detail</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* BOTTOM NAVIGATION BAR */}
      <View style={styles.bottomBarContainer}>
        <View style={styles.bottomBar}>
          {/* Tombol Home */}
          <TouchableOpacity style={styles.navCircle}>
            <Ionicons name="home" size={24} color="#f5af19" />
          </TouchableOpacity>

          {/* Tombol Plus (+) Melayang */}
          <TouchableOpacity
            style={styles.fabButton}
            onPress={() => navigation.navigate("Add")}
          >
            <Ionicons name="add" size={36} color="#ffffff" />
          </TouchableOpacity>

          {/* Tombol Profile */}
          <TouchableOpacity style={styles.navCircleSolid}>
            <Ionicons name="person" size={22} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  retryBtn: {
    backgroundColor: "#0d7a75",
    padding: 10,
    borderRadius: 8,
  },

  /* Header Atas */
  header: {
    backgroundColor: "#0d7a75",
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 30,
    fontWeight: "900",
    color: "#f5af19",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },

  /* Sub Header */
  subHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
  refreshButton: {
    backgroundColor: "#e8e8e8",
    padding: 6,
    borderRadius: 20,
  },

  /* STYLES BANNER NOTIFIKASI BERHASIL DIHAPUS */
  deleteBanner: {
    backgroundColor: "#fce8e6",
    borderWidth: 1,
    borderColor: "#f8b4b4",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 20, // Memberi batas sejajar dengan tepi daftar
    marginBottom: 16,
  },
  deleteBannerText: {
    color: "#a92525",
    fontSize: 13,
    fontWeight: "bold",
  },

  /* List & Card */
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 90,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#4a4a4a",
    padding: 15,
    marginBottom: 15,
  },
  cardRow1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
  itemAmount: {
    fontSize: 18,
    fontWeight: "800",
    color: "#000000",
  },
  cardRow2: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: "#dcdcdc",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  categoryText: {
    fontSize: 12,
    color: "#333333",
    fontWeight: "600",
  },
  dateText: {
    fontSize: 12,
    color: "#666666",
  },
  detailButton: {
    backgroundColor: "#dcdcdc",
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  detailButtonText: {
    fontSize: 13,
    color: "#333333",
    fontWeight: "600",
  },

  /* Bottom Navigation Bar */
  bottomBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomBar: {
    backgroundColor: "#0d7a75",
    height: 110,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navCircle: {
    width: 60,
    height: 60,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#f5af19",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    top: -20,
  },
  navCircleSolid: {
    width: 60,
    height: 60,
    borderRadius: 100,
    backgroundColor: "#f5af19",
    justifyContent: "center",
    alignItems: "center",
    top: -20,
  },
  fabButton: {
    width: 80,
    height: 80,
    borderRadius: 100,
    backgroundColor: "#f5af19",
    justifyContent: "center",
    alignItems: "center",
    top: -40,
    borderWidth: 3,
    borderColor: "#ffffff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  /* STYLES BANNER NOTIFIKASI HIJAU (BERHASIL TAMBAH DATA) */
  addBanner: {
    backgroundColor: "#d4edda", // Warna latar hijau muda soft
    borderWidth: 1,
    borderColor: "#c3e6cb", // Border hijau
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  addBannerText: {
    color: "#155724", // Warna teks hijau tua
    fontSize: 13,
    fontWeight: "bold",
  },
  /* STYLES BANNER NOTIFIKASI UBAH DATA (HIJAU SOFT / TOSKA) */
  editBanner: {
    backgroundColor: "#d1f2eb", // Latar hijau soft / toska muda
    borderWidth: 1,
    borderColor: "#10b981", // Border hijau terang
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  editBannerText: {
    color: "#065f46", // Teks hijau tua
    fontSize: 13,
    fontWeight: "bold",
  },
});
