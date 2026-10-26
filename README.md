# Cyber Survivor 2D - Top-Down Shooter Game

Game aksi tembak-tembak 2D dengan sudut pandang kamera dari atas (*top-down*), grafis modern sci-fi neon berkecepatan tinggi, sistem senjata lengkap, serta dukungan penuh untuk perangkat **Mobile (Android & iOS)** dan **Desktop (PC & Laptop)**.

---

## 🎮 Fitur Utama

1. **Kamera Top-Down Mengikuti Karakter**: Kamera halus mengikuti pergerakan pemain di dalam arena dengan efek getaran layar (*screen shake*) saat menembak atau terkena ledakan.
2. **4 Pilihan Senjata Futuristik**:
   - 🔫 **Pistol (Handgun)**: Peluru presisi dengan amunisi tak terbatas (∞).
   - 💥 **Shotgun**: Menembakkan 6 peluru menyebar sekaligus, damage besar untuk jarak dekat.
   - ⚡ **Rapid SMG**: Laju tembakan sangat tinggi untuk menyapu kawanan musuh.
   - 🚀 **Plasma RPG**: Tembakan proyektil roket dengan ledakan area (AoE) berdaya hancur tinggi.
3. **5 Level Progresif**:
   - **Level 1 (Sector 1: First Breach)**: 12 Musuh pengintai dasar (*Stalkers & Scouts*).
   - **Level 2 (Sector 2: Fast Swarm)**: 20 Musuh berkecepatan tinggi yang menyerbu secara agresif.
   - **Level 3 (Sector 3: Heavy Armor)**: 26 Musuh, menghadirkan monster Tank berlapis baja ber-HP tebal.
   - **Level 4 (Sector 4: Crossfire)**: 32 Musuh, termasuk Spitter Drone yang dapat menembak proyektil energi dari kejauhan.
   - **Level 5 (Sector 5: Cyber Titan)**: 38 Musuh dengan **Final Boss Mega Titan** ber-HP raksasa (1600 HP) dengan serangan rentetan peluru lingkaran serta pasukan pengawal!
4. **Sistem Item Drop**: Musuh yang gugur berkesempatan menjatuhkan:
   - ➕ **Health Pack** (+35 HP)
   - ⚡ **Ammo Crate** (Isi ulang amunisi semua senjata)
   - 🛡️ **Shield Orb** (+50 Shield)
5. **Efek Suara Web Audio API Sintetis**: 100% suara audio disintesis langsung menggunakan Web Audio API tanpa perlu aset eksternal (langsung bunyi, tanpa loading, offline ready).
6. **Desain Kompatibel Mobile (Android & iOS)**:
   - Kontrol analog virtual ganda (Dual Virtual Joysticks):
     - **Analog Kiri**: Menggerakkan karakter 360°.
     - **Analog Kanan**: Membidik arah sekaligus menembak otomatis saat digeser.
   - Tombol ganti senjata cepat (🔄) di layar sentuh.
   - `touch-action: none` & viewport khusus untuk mencegah scroll, pinch zoom, atau refresh tak disengaja di mobile browser.

---

## 🕹️ Cara Kontrol

### 📱 Pada Perangkat Mobile (Android / iOS):
- **Analog Kiri (Bawah Kiri)**: Gerakkan karakter ke segala arah (360°).
- **Analog Kanan (Bawah Kanan)**: Arahkan bidikan dan tembak musuh.
- **Tombol 🔄 / Kotak Senjata di Bawah**: Ketuk untuk mengganti senjata.

### 💻 Pada Desktop (PC / Laptop):
- **W, A, S, D** atau **Tombol Panah**: Bergerak ke atas, kiri, bawah, kanan.
- **Kursor Mouse**: Mengarahkan bidikan senjata.
- **Klik Kiri**: Menembak.
- **Angka 1, 2, 3, 4** atau **Scroll Mouse** atau **Tombol Q / E**: Mengganti senjata.

---

## 🚀 Cara Menjalankan Game

Cukup buka file `index.html` langsung di browser mana saja:
- **Di PC / Laptop**: Klik ganda file [index.html](file:///e:/New%20folder/index.html) di Chrome, Edge, Safari, Firefox.
- **Di HP Android / iPhone**:
  - Anda bisa meng-hosting file ini di server lokal (seperti `python -m http.server` atau Live Server VSCode) lalu buka alamat IP lokal di browser HP Anda.
  - Atau gunakan hosting gratis seperti GitHub Pages, Netlify, atau Vercel.
