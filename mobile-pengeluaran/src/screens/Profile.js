import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Profile({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* --- HEADER TEAL / TOSKA --- */}
      <View style={styles.header}>
        {/* Logo Outgo */}
        <Text style={styles.logoText}>Outgo</Text>

        {/* Avatar Lingkaran Putih */}
        <View style={styles.avatarCircle}>
          <Ionicons name="person" size={54} color="#0d7a75" />
        </View>

        {/* Nama Pengguna & Status */}
        <Text style={styles.userName}>Nabilah Azaria K.A</Text>
        <Text style={styles.userRole}>Mahasiswa</Text>
      </View>

      {/* --- CARD PUTIH KONTEN INFORMASI --- */}
      <View style={styles.contentCard}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Section 1: Data Diri */}
          <Text style={styles.sectionTitle}>Data Diri</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Nama Lengkap</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Universitas</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Email</Text>
          </View>

          {/* Section 2: Ringkasan Akun */}
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
            Ringkasan Akun
          </Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Mata Uang Utama</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Status Bulan Ini</Text>
          </View>
        </ScrollView>
      </View>

      {/* --- BOTTOM NAVIGATION BAR --- */}
      <View style={styles.bottomBar}>
        {/* Tombol Home */}
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="home" size={22} color="#f1b212" />
        </TouchableOpacity>

        {/* Tombol Tambah (+) */}
        <TouchableOpacity
          style={styles.fabButton}
          onPress={() => navigation.navigate("Add")}
        >
          <Ionicons name="add" size={36} color="#ffffff" />
        </TouchableOpacity>

        {/* Tombol Profil (Aktif - Lingkaran Hitam dengan Ikon Kuning) */}
        <TouchableOpacity style={styles.profileButtonActive}>
          <Ionicons name="person" size={20} color="#f1b212" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d7a75", // Warna dasar hijau toska Outgo
  },

  /* HEADER STYLES */
  header: {
    backgroundColor: "#0d7a75",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 25,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "900",
    color: "#f1b212", // Warna kuning Outgo
    textShadowColor: "#ffffff",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    marginBottom: 15,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: "#e2e8f0",
  },

  /* CONTENT CARD STYLES */
  contentCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 28,
    paddingTop: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 14,
  },
  infoItem: {
    marginBottom: 14,
  },
  infoLabel: {
    fontSize: 13,
    color: "#4a5568",
  },

  /* BOTTOM BAR STYLES */
  bottomBar: {
    height: 70,
    backgroundColor: "#0d7a75",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  homeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  fabButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#f1b212", // Warna kuning tombol tambah
    justifyContent: "center",
    alignItems: "center",
    marginTop: -25, // Menonjol ke atas
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  profileButtonActive: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#18181b", // Lingkaran hitam penanda status AKTIF
    justifyContent: "center",
    alignItems: "center",
  },
});