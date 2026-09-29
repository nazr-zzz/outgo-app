//untuk mengakses backend
// fetch : memanggil url yg ada di backend, dan mengembalikan data dalam bentuk json
//ditampung di varibel respon
//JSON.parse : mengubah text menjadi array
//useRef untuk variabel biasa, karena tidak berpengaruh pada tampilan, simpan data
//useState akan merender ulang tampilan jika nilainya berubah
//useEffect untuk memanggil fungsi saat komponen dirender, cek apakah loading atau tidak, melihat apakah ada data baru atau tidak, dll
//tidak melakukan render ulang (useEffect). ex : tombol back, tombol refresh, dll.
//melihat apakaha lagi loading atau tidak (asyncronous) untuk menampilkan loading saat menunggu data dari backend