# YELLOW: THE ESCAPE
> Sebuah Game Browser 3D First-Person Survival Horror, Stealth, dan Escape Puzzle.

---

## 📖 Premis & Cerita

Kamu terbangun di sebuah rumah tua terbengkalai yang dingin dan gelap. Semua pintu keluar utama terkunci rapat dan disegel oleh 15 gembok besi. 
Di dalam rumah ini, berkeliaran **The Yellow Entity** — sosok humanoid tinggi kurus berwarna kuning pucat yang memburu siapapun yang memasuki wilayahnya.

Misi kamu:
1. Jelajahi lantai dasar, lantai atas, dan ruang bawah tanah.
2. Temukan dan kumpulkan **tepat 15 Kunci Kuningan** yang tersebar di perabot dan sudut tersembunyi.
3. Hindari The Yellow Entity dengan teknik stealth (berjalan pelan, jongkok, dan mematikan senter).
4. Kembali ke Ruang Depan dan buka Pintu Keluar Utama untuk melarikan diri hidup-hidup!

---

## 🎮 Kontrol Permainan (Desktop)

| Tombol / Aksi | Fungsi |
| :--- | :--- |
| **W, A, S, D** | Berjalan menjelajahi ruangan |
| **Mouse** | Mengarahkan pandangan & senter (Pointer Lock) |
| **Shift (Tahan)** | Berlari cepat *(menguras stamina & menimbulkan suara derit keras)* |
| **C / Ctrl** | Berjongkok *(gerakan lambat, 100% senyap tanpa suara langkah)* |
| **E** | Interaksi *(mengambil kunci / memeriksa pintu keluar)* |
| **F** | Menyalakan / mematikan senter |
| **Esc** | Membuka menu jeda (Pause) & melepaskan kursor mouse |

---

## 🧟 Mekanisme Musuh: The Yellow Entity

The Yellow Entity digerakkan oleh AI State Machine dengan 5 status perilaku:
1. **PATROL**: Berjalan mengitari rute patroli di seluruh lantai rumah.
2. **INVESTIGATE**: Menyelidiki sumber suara langkah keras (saat pemain berlari) atau pantulan cahaya senter.
3. **CHASE**: Saat melihat pemain, musik kejar-kejaran intens berbunyi dan monster mengejar dengan kecepatan tinggi.
4. **SEARCH**: Jika pemain berbelok atau bersembunyi di balik perabot, monster mencari di lokasi terakhir pemain terlihat.
5. **RETURN**: Kembali ke rute patroli jika pemain tidak ditemukan.

> **Tips:** Gunakan jalan melingkar (loop corridor) untuk mengelabui monster. Jika monster berada di dekatmu, segera berjongkok (C) agar langkah kakimu tidak terdengar!

---

## 🗝️ Lokasi 15 Kunci Kuningan

1. **Awakening Room**: Di atas meja laci di sebelah tempat tidur awal.
2. **Upper Hallway**: Di lorong atas di bawah lampu gantung.
3. **Master Bedroom Vanity**: Di atas meja rias antik dengan cermin retak.
4. **Master Closet**: Tersembunyi di dalam lemari pakaian kayu.
5. **Guest Bedroom**: Di bawah rangka tempat tidur twin.
6. **Abandoned Nursery**: Di dalam peti mainan kayu tua.
7. **Upstairs Bathroom**: Di tepi bak mandi porselen tua.
8. **Living Room Mantle**: Di atas perapian bata ruang keluarga.
9. **Living Room Bookshelf**: Di rak buku yang roboh.
10. **Dining Room Table**: Di tengah meja makan panjang.
11. **Kitchen Counter**: Di sebelah wastafel dapur berkarat.
12. **Kitchen Pantry**: Di rak bawah ruang penyimpanan makanan.
13. **Storage Crates**: Di atas tumpukan peti kayu gudang.
14. **Basement Workbench**: Di meja kerja besi ruang bawah tanah.
15. **Deep Boiler Room**: Di belakang tungku pemanas raksasa.

---

## 🛠️ Arsitektur Proyek & Teknologi

- **Vite + JavaScript**: Fondasi modul ES6 modern.
- **Three.js**: Rendering grafis 3D WebGL dengan sistem pencahayaan dinamis, bayangan, dan kabut atmosferik.
- **Web Audio API**: Seluruh efek suara (langkah kaki, desah monster, detak jantung, kejar-kejaran, jumpscare, denting kunci, gembok pintu) dibuat secara prosedural tanpa ketergantungan file eksternal.
- **Procedural Canvas Textures**: Tekstur kayu lapuk, wallpaper Victorian yang mengelupas, beton retak, logam berkarat, dan kulit kuning monster dibuat otomatis di memori browser.
- **NavGraph & A\* Pathfinding**: Sistem navigasi waypoint agar monster tidak menembus dinding.
- **Collision Detection**: Sistem wall-sliding physics AABB Box3 agar gerakan pemain halus.

---

## 🚀 Cara Menjalankan Game

### Opsi 1: Menjalankan file start.bat
Cukup klik ganda (double-click) file **`start.bat`** di direktori proyek. Browser akan terbuka otomatis ke `http://localhost:5173`.

### Opsi 2: Menggunakan Command Line
```bash
# Menjalankan development server
npm run dev
# atau jika menggunakan pnpm
pnpm dev
```
Buka browser di URL yang tertera (biasanya `http://localhost:5173` atau `http://127.0.0.1:5173`).
