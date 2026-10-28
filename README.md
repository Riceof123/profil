# 🎮 Cyber Strike 2D - Top-Down Tactical Shooter HTML5

Game aksi tembak-menembak 2D bertema masa depan (Cyberpunk Sci-Fi) dengan sudut pandang kamera dari atas (*top-down*). Dibangun murni menggunakan **HTML5 Canvas, CSS3, dan Modern JavaScript**, tanpa *library* eksternal sehingga sangat ringan, cepat, dan **dioptimalkan secara mendalam untuk kenyamanan di Perangkat Mobile (Android & iOS) serta Performa 60+ FPS**.

---

## 🌟 Fitur Baru & Peningkatan Terkini

### 1. ⚡ Sistem 3 Skill Tempur Unik
Pemain kini dibekali 3 keahlian khusus (*Special Abilities*) untuk membalikkan keadaan saat terdesak:
1. **💚 Skill 1: Regenerasi Cepat (Rapid Regeneration)**
   - **Efek**: Memulihkan darah (HP) pemain secara cepat dan terus-menerus selama **30 detik** penuh.
   - **Cooldown**: **60 detik**.
   - **Hotkeys**: Tombol `F` (PC) atau *Tap* tombol `💚 REGEN` di layar HP.
2. **🤖 Skill 2: Memanggil Teman (Summon Companion Drones)**
   - **Efek**: Memanggil 2 unit Droid Sekutu tempur canggih yang melayang di samping pemain dan secara otomatis menembakkan peluru plasma berkecepatan tinggi ke musuh terdekat selama **20 detik**. Setelah 20 detik habis, droid sekutu akan menghilang.
   - **Cooldown**: **30 detik**.
   - **Hotkeys**: Tombol `G` (PC) atau *Tap* tombol `🤖 TEMAN` di layar HP.
3. **☢️ Skill 3: Pemusnah Massal (Insta-Kill Nuke - Orbital Strike)**
   - **Efek**: Menembakkan serangan orbital berkekuatan dahsyat yang **seketika memusnahkan SELURUH musuh yang ada di arena pertempuran**!
   - **Aturan Khusus**: **HANYA DAPAT DIGUNAKAN 1 KALI SAJA (Single-Use Only)** selama satu perjalanan game! Skill ini terkunci dan tidak bisa digunakan kembali kecuali pemain berhasil menamatkan game sampai level terakhir atau memulai ulang game dari awal.
   - **Hotkeys**: Tombol `V` (PC) atau *Tap* tombol `☢️ NUKE` di layar HP.

---

### 2. 🌪️ Senjata Baru: Pusaran Angin Kuat (Vortex / Cyclone Cannon)
* **Kapan Terbuka?**: Terbuka otomatis saat pemain **berhasil menyelesaikan Level 3** (dapat langsung digunakan di Level 4 dan Level 5).
* **Mekanik & Efek**:
  * Menembakkan bola badai siklon raksasa yang berputar cepat selama 3.5 detik.
  * **Efek Sedot Gravitasi (Vortex Suction)**: Menyedot seluruh musuh dalam radius 130px ke titik pusat pusaran, membuat musuh tidak bisa berkutik.
  * Memberikan sayatan kerusakan (*continuous slash damage*) beruntun ke setiap musuh yang terjebak di dalam pusaran angin.

---

### 3. 🎯 5 Tingkat Kesulitan (Difficulty Selection)
Pemain dapat memilih tingkat kesulitan sebelum memulai misi di layar awal:
* **🌱 Mudah (Easy)**: Musuh santai (0.85x speed), damage rendah (0.65x), medkit melimpah (35% drop rate).
* **⚔️ Normal**: Tantangan standar yang seimbang dan menantang (1.0x stats, 22% drop rate).
* **🔥 Sulit (Hard)**: Musuh lebih tebal (1.35x HP), damage 1.3x, lebih agresif (16% drop rate, 1.5x bonus skor).
* **⚡ Extreme**: Kecepatan tinggi, musuh tebal (1.75x), tembakan deras (12% drop rate, 2.2x bonus skor).
* **💀 Neraka (Hell / Nightmare)**: Mode mimpi buruk tanpa ampun! HP musuh **2.3x**, damage **2.0x**, medkit sangat minim (**8% drop rate**, 3.5x bonus skor).

---

### 4. 📱 Optimalisasi Khusus Mode Portrait & Ergonomi Mobile (Android & iOS)
* **Tata Letak Khusus Mode Portrait (Pegang HP Tegak)**:
  * **Weapon Bar Pindah ke Atas**: Bilah senjata secara cerdas dipindahkan ke bagian atas (tepat di bawah bar HP/HUD) saat HP dalam posisi Portrait. Hal ini membebaskan **100% area bawah layar** khusus untuk sentuhan kedua jempol tanpa ada tombol senjata yang tertekan secara tidak sengaja.
  * **Skill Bar Terpusat Ergonomis**: Ketiga tombol skill (`💚 REGEN`, `🤖 TEMAN`, `☢️ NUKE`) tersusun horisontal di tengah bawah (`bottom: 155px`), sangat mudah dijangkau oleh jempol kiri maupun kanan.
  * **Tombol Cepat Tindakan (⚡ Dash & 🎯 Fire)**: Terletak tepat di atas joystick kanan (`bottom: 100px`) sehingga jempol kanan dapat beralih antara membidik atau dash instan.
* **Kamera Zoom Dinamis Otomatis (Expanded Portrait FOV)**:
  * Layar HP vertikal biasanya sangat sempit (~360px - 400px). Sistem kamera otomatis melakukan *adaptive zoom-out* memperluas sudut pandang horizontal hingga setara 500px, sehingga musuh dan tembakan laser musuh tidak mendadak mengenai pemain tanpa peringatan.
* **Dynamic Floating Joysticks (Joystick Mengambang Dinamis)**:
  * Titik tumpu joystick otomatis muncul tepat di bawah posisi sentuhan jempol pemain di separuh kiri (gerak) dan separuh kanan (bidik & tembak).
* **Smart Aim Assist (Bantuan Bidik Magnetis 40%)**:
  * Fitur magnetis pintar yang mengarahkan tembakan ke musuh terdekat dalam kerucut 31° dan jangkauan 450px, baik saat memakai joystick bidik maupun saat menekan tombol tembak langsung.
* **Optimalisasi Performa Ekstrem (Stable 60+ FPS)**:
  * **Device Pixel Ratio (DPR) Lock**: Mengunci DPR ke 1x pada layar sentuh/mobile untuk mencegah GPU me-render piksel berlebih (3x di layar OLED/Retina), menjaga HP tetap dingin dan framerate stabil 60-120 FPS.
  * **Zero GC Particle Pool**: 140 partikel menggunakan sistem daur ulang (*object pooling*), tidak menghasilkan sampah memori sehingga bebas patah-patah (*zero garbage collection stutter*).
  * **Shadow Blur Bypass**: Melewatkan efek blur bayangan canvas berat saat mendeteksi layar sentuh atau mode performa.
  * **Frustum Culling**: Seluruh musuh, rintangan, proyektil, dan partikel di luar jangkauan kamera tidak di-render ke canvas.
* **Haptic Vibration Feedback**:
  * Respon getaran sentuh nyata (`navigator.vibrate`) saat terkena luka, ledakan nuke, dash, dan aktivasi skill.
* **Proteksi Safe-Area iPhone & Layar Poni**:
  * Menggunakan `env(safe-area-inset)` dan `100dvh` agar tidak tertutup poni kamera (notch/dynamic island) atau bilah gestur bawaan iOS/Android.

---

### 5. 🔫 Total Arsenal 6 Jenis Senjata
1. 🔫 **Pistol Laser (Slot 1)**: Senjata standar cepat dan stabil (Level 1).
2. 💥 **Shotgun Sebar (Slot 2)**: 5 butir peluru menyebar, mematikan di jarak dekat (Level 1).
3. ⚡ **Senapan Mesin / SMG (Slot 3)**: Laju tembak ultra cepat untuk menyapu kawanan (Terbuka di Level 2).
4. 💣 **Peluncur Plasma (Slot 4)**: Menembakkan energi dengan efek ledakan area / AoE (Terbuka di Level 3).
5. 🌪️ **Pusaran Angin Kuat (Slot 5)**: Menyedot musuh dan menyayat secara beruntun (**Terbuka setelah menyelesaikan Level 3**).
6. 🔮 **Railgun Laser Tembus (Slot 6)**: Sinar laser kecepatan cahaya yang menembus barisan musuh (Terbuka di Level 5).

---

## 🕹️ Panduan Kontrol

| Aksi | PC / Laptop (Desktop) | HP / Tablet (Android & iOS) |
| :--- | :--- | :--- |
| **Bergerak** | `W, A, S, D` atau `Tombol Panah` | **Dynamic Joystick Kiri** (Sentuh area kiri) |
| **Membidik & Tembak** | Mouse & **Klik Kiri** | **Dynamic Joystick Kanan** (Bidik + Tembak Otomatis) |
| **Dash (Menghindar Kebal)** | **Spasi (`Spacebar`)** | Tombol **⚡ DASH** di layar |
| **Ganti Senjata** | Angka `1` s/d `6` atau Scroll Mouse / `Q, E` | *Tap* langsung pada **Slot Senjata** (di atas pada Mode Portrait, di bawah pada Landscape) |
| **Skill 1: Regenerasi (30s)** | Tombol **`F`** | *Tap* tombol **💚 REGEN** di layar |
| **Skill 2: Panggil Teman (20s)**| Tombol **`G`** | *Tap* tombol **🤖 TEMAN** di layar |
| **Skill 3: Nuke Sekali Pakai** | Tombol **`V`** | *Tap* tombol **☢️ NUKE** di layar |
| **Jeda & Pengaturan** | Tombol `⏸️` di pojok kanan atas | Tombol `⏸️` di pojok kanan atas |

---

## 🚀 Cara Menjalankan Game

1. **Di Komputer**: Buka file [**`index.html`**](file:///e:/Project%20Game%202D%20Sederhana/index.html) menggunakan browser apa pun (Google Chrome, Microsoft Edge, Firefox, Safari).
2. **Di HP (Android & iOS)**:
   - Salin file proyek ke perangkat atau jalankan web server lokal (seperti `npx serve .` atau ekstensi *Live Server* di VS Code), lalu buka alamat IP komputer melalui browser HP yang terhubung ke jaringan Wi-Fi yang sama.
