/**
 * THE COMPANY ARCHIVES // JURNAL AGUNG SEJARAH SEMESTA
 * Master Lore Database & Institutional Dossier
 * Disusun dari Naskah Asli & Rekonstruksi Arsip Kosmik
 */

// =========================================================================
// JURNAL 01: JURNAL AGUNG SEJARAH SEMESTA (DARI LOST ERA HINGGA THE COMPANY)
// DILINDUNGI & TIDAK DIUBAH SAMA SEKALI SESUAI INSTRUKSI PENGGUNA
// =========================================================================

const LORE_DATA = {
  meta: {
    title: "Jurnal Agung Sejarah Semesta",
    subtitle: "Dari Lost Era hingga Berdirinya The Company",
    classification: "DOCUMENT REF: COMPANY-HIST-001 // LEVEL 0 CLEARANCE",
    version: "Arsip Rekonstruksi Transenden v4.2",
    universeSpan: "100+ Triliun Tahun",
    overview: "Dokumentasi komprehensif perjalanan eksistensial semesta: berawal dari hipotesis purba Lost Era, era kejayaan dan perpecahan Republic Hilim, petaka perang 55 tahun di Planet Xpax-12, hingga unifikasi kosmik di bawah panji Conglomerate Company oleh tiga entitas abadi Most High Complex Administrator."
  },

  summaryTable: [
    {
      tahap: "Awal Semesta",
      rentang: "100 Triliun Tahun",
      fokus: "Lost Era & All Before Company",
      deskripsi: "Misteri primal asal-usul kosmik; perdebatan antara singularitas Big Bang vs sentuhan Ilahi. Era raksasa yang mendahului seluruh peradaban modern.",
      badge: "KOSMIK PURBA",
      color: "#f59e0b"
    },
    {
      tahap: "Empat Era Utama",
      rentang: "4 Era Besar",
      fokus: "Purba, Permulaan, Perluasan, VSCode",
      deskripsi: "Evolusi kehidupan di Terrium, kebangkitan ras manusia, perang melawan Prinsip Langit, matinya 5 Ibu Surgawi, serta pecahnya hukum keabadian.",
      badge: "EVOLUSI PERADABAN",
      color: "#06b6d4"
    },
    {
      tahap: "Perpecahan Hilim",
      rentang: "66 Juta Tahun",
      fokus: "Foundation, Azis, Imperium",
      deskripsi: "Runtuhnya kestabilan Republic Hilim menjadi tiga faksi perang hegemoni. Pelaksanaan Project Expedition dan perburuan koloni antarbintang.",
      badge: "PERANG TIGA SEGI",
      color: "#ec4899"
    },
    {
      tahap: "Krisis Xpax-12",
      rentang: "55 Tahun Konflik",
      fokus: "Tiga Tokoh & Dua Perang Dunia",
      deskripsi: "Kelahiran Vin, Nikolas, dan Nevin di Xpax-12. Terbukanya keabadian via Kematian Pertama (WWI), anarki pasca-WWII, hingga pemusnahan total planet.",
      badge: "TITIK BALIK TAKDIR",
      color: "#ef4444"
    },
    {
      tahap: "Jalan Menuju Penyatuan",
      rentang: "20.000 Tahun",
      fokus: "Pemberontakan & Fusi Faksi",
      deskripsi: "Kejenuhan massal kaum Hilim terhadap perang saudara. Tumbangnya rezim tiran dan didorongnya tiga figur abadi menjadi pemimpin tertinggi.",
      badge: "PEMBERONTAKAN KOSMIK",
      color: "#8b5cf6"
    },
    {
      tahap: "Hegemoni The Company",
      rentang: "50.000+ Tahun",
      fokus: "Conglomerate Company & Ordo Baru",
      deskripsi: "Satu panji menyatukan seluruh kekuatan. Dominasi mutlak tanpa ilusi kedamaian naif; pragmatisme, ekspansi, dan hierarki 10 tingkat kepemimpinan.",
      badge: "ORDO KOSMIK",
      color: "#10b981"
    }
  ],

  eras: [
    {
      id: "part-01",
      sectionNumber: "01 / AWAL SEMESTA",
      sectionTitle: "Awal Semesta & All Before Company",
      themeColor: "#38bdf8",
      chapters: [
        {
          num: "00",
          title: "Prolog: Sejarah yang Terlalu Panjang untuk Disebut Sebagai Sejarah",
          tagline: "Rentang Waktu yang Melampaui Pemahaman Fana",
          summary: "Sejarah semesta membentang melalui jutaan bahkan miliaran tahun. Peradaban lahir dan musnah, dewa muncul lalu mati, hingga satu nama bertahan melintasi waktu: The Company.",
          originalSnippet: `Sejarah semesta ini bukanlah rangkaian peristiwa yang dapat dipahami hanya melalui satu generasi, satu peradaban, atau bahkan satu zaman. Ia membentang melalui jutaan, miliaran, bahkan rentang waktu yang jauh melampaui pengertian manusia biasa mengenai sejarah.\nDi dalam rentang tersebut, peradaban lahir, berkembang, runtuh, dan digantikan. Dunia-dunia ditemukan, dijajah, ditinggalkan, atau dihancurkan. Para dewa pernah muncul, kemudian mati. Manusia pernah menjadi makhluk yang lemah, lalu berkembang menjadi kekuatan yang mampu menantang struktur kosmik itu sendiri.\nNamun dari seluruh perjalanan tersebut, terdapat satu nama yang pada akhirnya terus bertahan melintasi zaman: The Company.`,
          enhancedContent: `
            <p>Sejarah semesta ini menolak untuk diukur dengan ukuran hidup manusia yang fana. Ia adalah bentangan kosmik jutaan dan miliaran tahun di mana seluruh bintang lahir dari debu primordial dan meredup menjadi kuburan beku.</p>
            <p>Di dalam rentang tersebut, peradaban-peradaban agung lahir, mendominasi konstelasi, lalu runtuh tanpa sisa. Para dewa purba pernah disembah di altar-altar antarbintang sebelum akhirnya mereka pun dapat mati. Manusia yang mulanya merangkak sebagai makhluk lemah di ceruk planet, perlahan berevolusi menantang hukum kosmik itu sendiri.</p>
            <div class="callout-quote">
              <span class="quote-mark">“</span>
              Namun dari seluruh badai waktu tersebut, hanya ada satu nama yang terus berdiri tegak melintasi zaman: <strong>THE COMPANY</strong>.
            </div>
            <p>Untuk menelusuri bagaimana sebuah organisasi mampu mengukir hegemoni abadi, kita harus menatap jauh ke masa sebelum manusia mengenal peradaban: ke sebuah masa yang keberadaannya pun masih menjadi misteri terbesar.</p>
          `
        },
        {
          num: "01",
          title: "Lost Era: Era yang Tidak Pernah Diketahui",
          tagline: "Ruang Kosong Sebelum Dimulainya Waktu",
          summary: "Era tanpa catatan sejarah. Perdebatan abadi antara permulaan Big Bang vs sentuhan entitas Ilahi tanpa saksi yang mampu memastikan.",
          originalSnippet: `Lost Era bukanlah sebuah era yang memiliki catatan sejarah lengkap.\nIa lebih tepat dipahami sebagai sebuah hipotesis besar mengenai awal terbentuknya semesta.\nDalam sebuah percakapan yang melibatkan tiga tokoh yang kelak akan menjadi bagian terpenting dari sejarah semesta—Vin Alvian, Nikolas Enstain, dan Nevin Roosevelt—muncul pembahasan mengenai apa yang sebenarnya menjadi awal dari segala sesuatu.\nNikolas menjelaskan bahwa Lost Era adalah suatu era yang tidak pernah benar-benar diketahui oleh siapa pun. Sampai sekarang, asal-usulnya masih menjadi misteri.\nBeberapa pihak berpendapat bahwa segala sesuatu bermula dari Big Bang. Pihak lain memiliki pandangan yang sama sekali berbeda: bahwa awal semesta merupakan hasil dari sentuhan sebuah entitas yang disebut Tuhan.\nTidak ada jawaban pasti. Tidak ada saksi. Tidak ada catatan yang mampu memastikan salah satunya.\nIa adalah ruang kosong dalam sejarah, sebuah titik di mana seluruh pengetahuan berhenti dan hanya menyisakan kemungkinan.`,
          enhancedContent: `
            <p><strong>Lost Era</strong> bukanlah bab sejarah yang terdokumentasikan dalam gulungan atau silikon data. Ia adalah hipotesis kosmologis tertinggi mengenai fajar eksistensi.</p>
            <p>Dalam perbincangan mendalam antara tiga pendiri The Company—Vin Alvian, Nikolas Enstain, dan Nevin Roosevelt—asal-usul mula pertama selalu menjadi titik balik yang menggetarkan kesadaran:</p>
            <div class="grid-two">
              <div class="lore-box">
                <h4>Teori Singularitas Fisika (Big Bang)</h4>
                <p>Pandangan rasional materialis: semesta memuai dari satu titik kerapatan tak hingga, menyebarkan partikel dan energi yang menyusun materi bintang.</p>
              </div>
              <div class="lore-box">
                <h4>Teori Sentuhan Ilahi (Entitas Pencipta)</h4>
                <p>Pandangan spiritualis: kosmos dirajut oleh sentuhan kehendak sebuah Entitas Mutlak yang meletakkan hukum moral dan fisika awal.</p>
              </div>
            </div>
            <p>Tidak ada saksi yang bertahan hidup. Tidak ada peninggalan yang dapat memverifikasi salah satunya. Lost Era berdiri kokoh sebagai monolit misteri tertua: ruang hening tempat sains berhenti dan hanya menyisakan kemungkinan tak terbatas.</p>
          `
        },
        {
          num: "02",
          title: "All Before Company: Era yang Mendahului Segalanya",
          tagline: "Rentang Waktu 100 Triliun Tahun & Saksi Abadi",
          summary: "Eon raksasa sepanjang 100 triliun tahun yang memayungi jutaan era dan dikerucutkan menjadi empat era utama fondasi peradaban.",
          originalSnippet: `Setelah misteri Lost Era, sejarah memasuki sebuah bentangan waktu luar biasa panjang yang kemudian dikenal sebagai All Before Company.\nAll Before Company merupakan sebuah era raksasa yang mencakup jutaan atau bahkan miliaran era lainnya.\nVin Alvian pernah menjelaskan bahwa di dalam All Before Company terdapat jumlah era yang sangat banyak, tetapi seluruhnya pada akhirnya dikelompokkan ke dalam empat era utama.\nKeempatnya menjadi fondasi bagi sejarah peradaban yang kemudian dikenal di seluruh semesta.\nMenurut Nevin Roosevelt, All Before Company berlangsung selama sekitar: 100 triliun tahun.\nRentang waktu sebesar itu membuat All Before Company bukan sekadar 'zaman sebelum sebuah organisasi berdiri'.\nYang lebih penting lagi, Vin, Nikolas, dan Nevin bukan sekadar pengamat sejarah itu. Mereka mengklaim bahwa mereka benar-benar hidup di dalam era-era tersebut... Mereka adalah bagian dari masa lalu itu sendiri.`,
          enhancedContent: `
            <p>Setelah kabut Lost Era mereda, semesta melangkah ke bentangan waktu mahadewasa yang disebut <strong>All Before Company (ABC)</strong>. Menurut kalkulasi Nevin Roosevelt, eon ini membentang sepanjang:</p>
            <div class="callout-quote" style="text-align: center; font-size: 1.8rem; font-family: var(--font-display); color: var(--neon-gold);">
              100 TRILIUN TAHUN
            </div>
            <p>Di dalam rahim 100 triliun tahun ini terdapat jutaan siklus peradaban mikro. Vin Alvian menjelaskan bahwa para kronologis sepakat menyederhanakannya ke dalam <strong>Empat Era Fondasi Utama</strong>:</p>
            <ul class="sci-list">
              <li><strong>Era Purba:</strong> Pembentukan planet Terrium, hukum predator alami & era dinosaurus.</li>
              <li><strong>Era Permulaan:</strong> Kebangkitan ras manusia dari mamalia, peradaban kuno, dan paradoks sains.</li>
              <li><strong>Era Perluasan:</strong> Kolonisasi antariksa, Perang Besar melawan Prinsip Langit & pengorbanan 5 Ibu Kosmik.</li>
              <li><strong>VSCode Era:</strong> Penetrasi energi sihir, batas usia biologis 25 tahun & anomali manusia abadi.</li>
            </ul>
            <p>Yang menakjubkan, Vin, Nikolas, dan Nevin bukan sekadar akademisi yang membaca kronik ini dari buku usang. Mereka menginjakkan kaki di pucuk era tersebut—mereka adalah darah dan daging dari sejarah itu sendiri.</p>
          `
        },
        {
          num: "03",
          title: "Era Purba: Awal Terrium dan Hukum Alam Kehidupan",
          tagline: "Predator, Mangsa, dan Kekejaman Alami Jauh Sebelum Manusia",
          summary: "Pembentukan planet Terrium dan kejayaan dinosaurus. Era yang kerap dianggap damai, padahal hukum rimba dan kematian predator telah membuktikan kekejaman adalah kodrat semesta.",
          originalSnippet: `Era pertama di dalam All Before Company dikenal sebagai Era Purba.\nIni adalah era yang mencakup pembentukan sebuah planet yang kemudian menjadi sangat penting bagi sejarah manusia: Terrium.\nDi era ini, Terrium terbentuk dan kehidupan perlahan muncul, berkembang, serta menghasilkan berbagai bentuk makhluk hidup.\nKemudian datang masa yang dikenal sebagai zaman dominasi dinosaurus.\nSelama periode ini, Terrium menjadi dunia yang didominasi oleh makhluk-makhluk purba, hingga pada akhirnya terjadi peristiwa besar berupa kepunahan dinosaurus.\nEra Purba kemudian sering digambarkan sebagai era paling damai atau paling sedikit mengalami kehancuran dibandingkan era-era sesudahnya.\nNamun kata 'damai' di sini tidak berarti bahwa dunia tersebut bebas dari penderitaan. Bahkan sebelum manusia muncul, rasa sakit, predator dan mangsa, kehidupan dan kematian, pembunuhan sebagai bagian dari rantai makanan, serta perjuangan untuk bertahan hidup sudah menjadi bagian dari hukum alam.\nDengan demikian, Era Purba menjadi pengingat pertama bahwa kekejaman tidak dimulai ketika manusia muncul. Ia sudah menjadi bagian dari alam jauh sebelumnya.`,
          enhancedContent: `
            <p>Fondasi pertama peradaban bertumpu pada sebuah planet primordial bernama <strong>Terrium</strong>. Di dunia ini, laut mendingin, atmosfer oksigen stabil, dan kehidupan bersel banyak berevolusi memunculkan raksasa-raksasa reptil: zaman keemasan dinosaurus.</p>
            <div class="warning-dossier">
              <strong>REFLEKSI FILOSOFIS ARSIP:</strong>
              "Sering kali para filsuf mengidealkan Era Purba sebagai zaman yang tenteram dan damai karena bebas dari intrik politik dan bom nuklir. Namun hakikatnya, taring predator yang mencabik mangsa hidup-hidup, perjuangan bertahan hidup dalam keputusasaan, dan seleksi alam yang brutal membuktikan bahwa kekejaman tidak lahir bersama manusia—ia telah tertulis di dalam DNA alam semesta jauh sebelumnya."
            </div>
            <p>Kepunahan massal dinosaurus mengakhiri hegemoni reptil dan membukakan pintu bagi babak evolusi berikutnya: mamalia yang kelak melahirkan ras manusia.</p>
          `
        },
        {
          num: "04",
          title: "Era Permulaan: Kebangkitan Manusia",
          tagline: "Kerajaan, Kekaisaran, dan Paradoks Sains Vin Alvian",
          summary: "Mamalia mendominasi Terrium hingga melahirkan manusia. Kerajaan berdiri, perang meletus, sains dan logika ditemukan. Namun timbul paradoks: sains tanpa kebijaksanaan menjadi benih kehancuran.",
          originalSnippet: `Setelah kepunahan dinosaurus, dunia Terrium memasuki periode baru. Mamalia mulai berkembang dan mengambil posisi yang semakin dominan... manusia.\nDalam Era Permulaan, manusia berkembang dari bentuk awal mereka hingga menjadi makhluk paling dominan di Terrium.\nPeradaban kemudian tumbuh melalui berbagai zaman. Kerajaan muncul. Kekaisaran berdiri. Bangsa-bangsa saling bertemu. Dan perang terjadi dalam berbagai bentuk...\nNamun ada satu titik perubahan penting yang disebut Vin Alvian sebagai paradoks manusia.\nKetika manusia mulai menemukan apa yang disebut sains dan logika, mereka memperoleh kemampuan untuk memahami dunia dengan cara yang belum pernah mereka lakukan sebelumnya.\nIronisnya, ilmu pengetahuan yang seharusnya memperbesar pemahaman juga dapat membuat manusia menjadi terlalu yakin terhadap pemahaman mereka sendiri.\nDalam konteks cerita ini, sains bukanlah musuh manusia. Yang menjadi persoalan adalah kecenderungan manusia menggunakan pengetahuan tanpa batas kebijaksanaan.\nEra Permulaan pada akhirnya menjadi fondasi munculnya ekspansi manusia ke luar Terrium.`,
          enhancedContent: `
            <p>Di Era Permulaan, manusia berevolusi dari pemburu-peramu menjadi pembangun megastruktur di Terrium. Kerajaan dan kekaisaran silih berganti menancapkan panji kedaulatan melalui perang berskala lokal hingga global.</p>
            <p>Titik balik terbesar tercapai saat manusia merumuskan <strong>metode ilmiah dan logika matematika</strong>. Mereka berhasil membedah mekanisme gravitasi, termodinamika, dan genetika. Namun, di balik lompatan teknologi ini, Vin Alvian mencatat lahirnya sebuah ironi eksistensial:</p>
            <div class="paradox-box">
              <div class="paradox-title">PARADOKS MANUSIA (DOKTRIN VIN ALVIAN)</div>
              <p><em>"Pengetahuan seharusnya memperluas kerendahan hati di hadapan semesta yang agung; namun bagi manusia, sains sering kali memicu ilusi bahwa mereka telah menguasai segalanya. Ketika kepintaran intelektual tidak lagi dipandu oleh kompas moral dan kebijaksanaan nurani, sains seketika bermutasi menjadi mesin pemusnah massal."</em></p>
            </div>
            <p>Didorong oleh rasa lapar akan sumber daya dan keingintahuan tanpa batas, manusia akhirnya meluncurkan wahana antariksa pertama, menyeberangi batas atmosfer Terrium.</p>
          `
        },
        {
          num: "05",
          title: "Era Perluasan: Ketika Manusia Menantang Langit",
          tagline: "Kolonisasi Galaksi & Perang Besar Melawan Prinsip Langit",
          summary: "Manusia menjajah planet demi planet di galaksi. Ekspansi besar berbenturan dengan entitas pengatur kosmik: Prinsip Langit. Meletus Perang Besar: manusia membantai dewa dan memotong tangan Prinsip Langit.",
          originalSnippet: `Era ketiga disebut Era Perluasan. Pada masa ini, manusia tidak lagi puas hanya menjadi penguasa Terrium. Mereka mulai menjelajah. Kemudian mereka mulai menetap. Planet demi planet mulai ditemukan dan ditempati... Namun semakin jauh manusia memperluas wilayahnya, semakin besar pula konflik mereka dengan kekuatan yang berada di luar jangkauan peradaban manusia.\nPada titik inilah muncul konsep yang dikenal sebagai: Prinsip Langit.\nHubungan manusia dengan Prinsip Langit akhirnya menghasilkan sebuah konflik besar yang disebut: Perang Besar.\nDalam perang tersebut, manusia pada akhirnya berhasil melakukan sesuatu yang sebelumnya tampak mustahil. Mereka membunuh para dewa dan dewi. Bahkan tangan dari Sang Prinsip Langit kemudian dipotong.`,
          enhancedContent: `
            <p>Era Perluasan menyaksikan galaksi berkerlip oleh ribuan koloni manusia. Rute perdagangan antarbintang dibuka, megacity dibangun di atas asteroid dan planet gas. Namun wilayah jajahan manusia akhirnya menembus domain sakral yang dikuasai oleh hukum metafisik purba:</p>
            <div class="callout-quote">
              <strong>PRINSIP LANGIT (THE CELESTIAL PRINCIPLES)</strong> — Ordo kekuasaan para dewa kosmik yang mengatur siklus hidup, mati, waktu, dan ruang di semesta.
            </div>
            <p>Manusia menolak tunduk pada tirani surgawi. Maka berkobarlah <strong>Perang Besar (The Great Celestial War)</strong>. Mengerahkan perpaduan teknologi kuantum canggih dan keberanian nekat, manusia mencatatkan kemenangan yang mengguncang arketipe semesta:</p>
            <ul class="sci-list alert-red">
              <li>Panteon dewa dan dewi purba dibantai habis oleh armada perang manusia.</li>
              <li>Manifestasi fisik tangan Sang Prinsip Langit berhasil dipotong dan disegel.</li>
              <li>Otoritas surgawi dipatahkan, menempatkan manusia sebagai spesies penguasa galaksi baru.</li>
            </ul>
          `
        },
        {
          num: "06",
          title: "Lima Ibu Prinsip Langit & 100.000 Tahun Gangguan Kosmik",
          tagline: "Pengorbanan Lima Dewi Penopang Semesta & Anomali Republic Hilim",
          summary: "Nova, Nabiru, Anastasia, Ines, dan Xin mengorbankan diri mereka. Keseimbangan semesta terguncang selama 100.000 tahun, memicu Reset Pengetahuan pada koloni manusia, kecuali Republic Hilim.",
          originalSnippet: `Pada penghujung Era Perluasan, lima entitas yang dikenal sebagai: Lima Ibu Prinsip Langit mengalami pelemahan besar. Kelima entitas tersebut adalah:\n1 Nova — Dewi Kematian\n2 Nabiru — Dewi Kehidupan\n3 Anastasia — Dewi Emas\n4 Ines — Dewi Ruang\n5 Xin — Dewi Waktu\nPada akhirnya, kelima Ibu Prinsip Langit memilih untuk mengorbankan diri mereka sendiri, dan seluruhnya mati.\nKematian mereka tidak berjalan tanpa konsekuensi. Berbagai fenomena kosmik yang mengerikan mulai muncul. Keseimbangan semesta terguncang... berlangsung selama: 100.000 tahun.\nAkibat pemisahan tersebut, koloni-koloni manusia berkembang menjadi masyarakat yang berbeda... ingatan mengenai masa lalu bahkan mengalami kondisi seperti reset.\nNamun ada satu pengecualian besar: Republic Hilim. Peradaban ini tidak mengalami penghapusan pengetahuan dan memori... Mengapa Republic Hilim bisa terhindar? Tidak ada jawaban pasti.`,
          enhancedContent: `
            <p>Runtuhnya Sang Prinsip Langit menyebabkan lima pilar matriks kosmik melemah drastis. Demi mencegah semesta kolaps ke dalam ketiadaan total, <strong>Lima Ibu Prinsip Langit</strong> mengambil keputusan tragis untuk mengorbankan eksistensi mereka:</p>
            <div class="five-mothers-grid">
              <div class="mother-card"><span class="m-num">01</span><div class="m-name">NOVA</div><div class="m-title">Dewi Kematian & Entropi</div></div>
              <div class="mother-card"><span class="m-num">02</span><div class="m-name">NABIRU</div><div class="m-title">Dewi Kehidupan & Ekosistem</div></div>
              <div class="mother-card"><span class="m-num">03</span><div class="m-name">ANASTASIA</div><div class="m-title">Dewi Emas & Materi Fundamental</div></div>
              <div class="mother-card"><span class="m-num">04</span><div class="m-name">INES</div><div class="m-title">Dewi Ruang & Dimensi Fisik</div></div>
              <div class="mother-card"><span class="m-num">05</span><div class="m-name">XIN</div><div class="m-title">Dewi Waktu & Aliran Kausalitas</div></div>
            </div>
            <p>Pengorbanan ini memicu <strong>Kekacauan Keseimbangan Semesta Selama 100.000 Tahun</strong>. Badai gravitasi dan retakan ruang-waktu mengisolasi koloni-koloni manusia selama jutaan tahun. Terjadilah fenomena misterius <em>Reset Pengetahuan</em>: ingatan sejarah dan sains musnah, peradaban kembali purba.</p>
            <div class="exception-box">
              <strong>ANOMALI KOSMIK: REPUBLIC HILIM</strong><br>
              Dari ribuan koloni galaksi yang terreset, hanya <strong>Republic Hilim</strong> yang tetap utuh memori sains dan teknologinya. Misteri mengapa Hilim luput dari pembersihan memori ini tidak pernah terjawab bahkan oleh tiga Most High Complex Administrator sekalipun.
            </div>
          `
        },
        {
          num: "07",
          title: "VSCode Era: Ketika Keabadian Menjadi Nyata",
          tagline: "Munculnya Sihir, 'Yang Terpilih', dan Berhentinya Penuaan di Usia 25 Tahun",
          summary: "Era keempat All Before Company di mana fenomena sihir merembes ke peradaban. Muncul golongan 'Yang Terpilih' dengan keabadian absolut, serta mutasi biologis di mana manusia berhenti menua di usia sekitar 25 tahun.",
          originalSnippet: `Era keempat dan terakhir di dalam All Before Company dikenal sebagai: VSCode Era.\nJika Era Perluasan menjadi masa ketika manusia memperluas wilayah, maka VSCode Era menjadi periode ketika fenomena magis mulai memperoleh bentuk dan keberadaan yang lebih jelas dalam peradaban.\nPada era ini muncul orang-orang tertentu yang dianggap sebagai 'yang terpilih'. Sebagian manusia memperoleh kemampuan untuk hidup tanpa akhir. Ada yang mendapatkan: keabadian absolut. Sementara yang lain hanya memperoleh: umur yang sangat panjang atau perpanjangan masa hidup.\nSecara umum, proses penuaan manusia juga berubah. Manusia tidak lagi menua secara normal seperti generasi sebelumnya, dan dalam banyak kasus perkembangan tubuh berhenti pada sekitar usia 25 tahun.\nDi era inilah sejarah tiga tokoh utama semesta mulai memasuki babak yang lebih personal.`,
          enhancedContent: `
            <p>Setelah badai 100.000 tahun reda, semesta memasuki <strong>VSCode Era</strong>. Pada era ini, partikel misterius yang dinamai <em>sihir</em> menyusup ke dalam hukum fisika konvensional, memungkinkan manipulasi energi arkaik melalui kehendak jiwa.</p>
            <p>Transformasi paling mencengangkan terjadi pada batas kodrat biologis manusia:</p>
            <div class="grid-two">
              <div class="lore-box">
                <h4>Penghentian Penuaan di Usia 25 Tahun</h4>
                <p>Proses diferensiasi seluler tubuh berhenti menua ketika seseorang mencapai kematangan fisik ~25 tahun. Manusia hidup selama berabad-abad atau ribuan tahun tanpa keriput fisik.</p>
              </div>
              <div class="lore-box">
                <h4>Anomali 'Yang Terpilih' (True Immortals)</h4>
                <p>Individu-individu tertentu terpilih mendapatkan <strong>Keabadian Absolut</strong>. Mereka tidak dapat mati oleh penyakit, usia, bahkan ledakan senjata pemusnah massal.</p>
              </div>
            </div>
            <p>Di bawah naungan VSCode Era inilah, panggung sejarah bersiap mempertemukan tiga pria yang kelak menyatukan seluruh semesta.</p>
          `
        }
      ]
    },

    {
      id: "part-02",
      sectionNumber: "02 / HILIM & XPAX-12",
      sectionTitle: "Perpecahan Hilim & Petaka Xpax-12",
      themeColor: "#f43f5e",
      chapters: [
        {
          num: "08",
          title: "Pecahnya Republic Hilim: Tiga Kekuatan & Perang 66 Juta Tahun",
          tagline: "Foundation, Azis, dan Imperium Meluncurkan Project Expedition",
          summary: "Republic Hilim runtuh dan pecah menjadi tiga faksi: Foundation, Azis, dan Imperium. Perang hegemoni mereka berkobar selama 66 juta tahun, diiringi Project Expedition dan eksploitasi koloni manusia primitif.",
          originalSnippet: `Walaupun Republic Hilim berhasil bertahan... Pada akhirnya Republic Hilim mengalami pelemahan. Pemberontakan terjadi.\nRepublic Hilim akhirnya pecah menjadi tiga kekuatan yang saling bermusuhan:\n• Foundation\n• Azis\n• Imperium\nKonflik tersebut berlangsung selama: 66 juta tahun.\nSalah satu program utama yang dijalankan ketiga faksi dikenal sebagai: Project Expedition.\nProject Expedition memiliki tujuan mencari planet-planet yang memiliki peradaban manusia... Eksperimen kejam terhadap manusia di planet-planet yang dikuasai.\nSemua hal tersebut memperlihatkan satu karakter utama VSCode Era: dunia ini tidak dibangun berdasarkan prinsip bahwa kekuatan selalu harus digunakan secara baik. Kekuatan digunakan untuk kepentingan. Kekuasaan digunakan untuk bertahan hidup.`,
          enhancedContent: `
            <p>Kedaulatan Republic Hilim yang bertahan jutaan tahun akhirnya retak dari dalam. Friksi ideologis dan perebutan cadangan energi memicu pemberontakan dahsyat yang membelah Hilim menjadi tiga faksi adidaya:</p>
            <div class="factions-dossier-grid">
              <div class="faction-card faction-foundation">
                <h3>FOUNDATION</h3>
                <span class="badge-role">Otoritas Sains, Regulasi, dan Senjata Pemusnah Planet</span>
              </div>
              <div class="faction-card faction-azis">
                <h3>AZIS</h3>
                <span class="badge-role">Militer Ksatria Angkasa & Sihir Pertahanan Tak Tertembus</span>
              </div>
              <div class="faction-card faction-imperium">
                <h3>IMPERIUM</h3>
                <span class="badge-role">Monarki Ekspansionis, Seni Transenden & Kultus Penaklukan</span>
              </div>
            </div>
            <p>Selama rentang waktu <strong>66 Juta Tahun</strong>, ketiga faksi saling mengobarkan perang atrisi antarbintang. Mereka menjalankan <em>Project Expedition</em>: menjarah planet koloni yang terreset memorinya, memperbudak manusia primitif, dan melakukan eksperimen biologis tanpa belas kasihan.</p>
          `
        },
        {
          num: "09",
          title: "Xpax-12: Tempat Tiga Kehidupan Bertemu",
          tagline: "Nuansa Era Victoria Berbalut Sihir & Tiga Negara Kelahiran",
          summary: "Di planet Xpax-12, lahirlah tiga tokoh sentral: Vin Alvian (Republic of New Federation), Nikolas Enstain (Socialist Republic of Vintus), dan Nevin Roosevelt (Zograk Empire).",
          originalSnippet: `Jauh di kemudian hari dalam VSCode Era, lahirlah tiga manusia yang akan menjadi pusat seluruh sejarah berikutnya: Vin Alvian, Nikolas Enstain, Nevin Roosevelt.\nMereka bertiga dilahirkan di planet bernama: Xpax-12.\nVin Alvian LAHIR DI: Republic of New Federation\nNikolas Enstain LAHIR DI: Socialist Republic of Vintus\nNevin Roosevelt LAHIR DI: Zograk Empire\nPada masa kelahiran mereka, peradaban Xpax-12 memiliki nuansa yang menyerupai Era Victoria dalam sejarah dunia nyata. Kemudian datang tahun: 1914 dan dunia Xpax-12 memasuki World War I.`,
          enhancedContent: `
            <p>Di sebuah planet perbatasan bernama <strong>Xpax-12</strong>, peradaban manusia berkembang dengan keunikan tersendiri: memadukan keanggunan Era Victoria (arsitektur neoklasik, kereta uap, seragam militer berbaris) dengan manifes kekuatan magis.</p>
            <div class="nations-xpax">
              <div class="nation-row"><strong>Vin Alvian</strong> &mdash; Lahir di <em>Republic of New Federation</em> (padanan Amerika Serikat).</div>
              <div class="nation-row"><strong>Nikolas Enstain</strong> &mdash; Lahir di <em>Socialist Republic of Vintus</em> (padanan Rusia).</div>
              <div class="nation-row"><strong>Nevin Roosevelt</strong> &mdash; Lahir di <em>Zograk Empire</em> (padanan Kekaisaran Jerman).</div>
            </div>
            <p>Di planet inilah benang merah takdir tiga manusia fana dirajut, sebelum badai perang dunia pertama mengoyak segalanya.</p>
          `
        },
        {
          num: "10",
          title: "World War I di Xpax-12 (1914): Perang Parit Bersihir",
          tagline: "Konflik Lama dalam Semesta yang Penuh Sihir",
          summary: "Tahun 1914 meletus World War I di Xpax-12. Nevin Roosevelt bertempur langsung di garis parit Zograk Empire, sementara New Federation dan Vintus terlibat dalam fase masing-masing.",
          originalSnippet: `Struktur besar Perang Dunia Pertama di Xpax-12 mengikuti sejarah dunia nyata. Aliansi negara-negara tidak berubah... Perbedaan terbesar terletak pada satu hal: dunia Xpax-12 memiliki sihir.\nDalam konflik tersebut: Zograk Empire memiliki posisi yang setara dengan Jerman... Nevin Roosevelt benar-benar terlibat dalam perang secara langsung dan mengalami perang parit.\nSocialist Republic of Vintus memiliki pola sejarah menyerupai Rusia... Republic of New Federation menyerupai Amerika Serikat... Kingdom of Bran (UK), Alcanis Federation (Italia), Altum Sultanate (Kesultanan Utsmaniyah).`,
          enhancedContent: `
            <p>Tahun 1914 menjadi lonceng pembantaian di Xpax-12. Senjata api berpeluru mantra, artileri berat berbahan sihir, dan bayonet beradu di medan lumpur beracun.</p>
            <p>Nevin Roosevelt merasakan langsung kepedihan perang parit bersama prajurit Zograk Empire. Di garis barat, jutaan jiwa gugur dalam hitungan hari. Vin Alvian menyaksikan bangsanya mempersiapkan armada, sementara Nikolas Enstain menghadapi pergolakan internal yang mengguncang Vintus.</p>
          `
        },
        {
          num: "11",
          title: "Kematian Pertama: Tiga Manusia yang Tidak Lagi Bisa Mati",
          tagline: "Ledakan Bom yang Menyingkap Anomali Keabadian",
          summary: "Menjelang akhir World War I, Vin, Nikolas, dan Nevin terpilih menjadi abadi tanpa mereka sadari. Mereka tewas terkena ledakan bom di medan perang, lalu terbangun kembali tanpa cacat: mereka abadi.",
          originalSnippet: `Menjelang akhir World War I, terjadi suatu peristiwa yang pada awalnya tidak diketahui oleh ketiga tokoh tersebut.\nVin Alvian, Nikolas Enstain, dan Nevin Roosevelt terpilih. Tidak diketahui siapa yang memilih mereka. Tidak diketahui mengapa mereka dipilih.\nSampai suatu saat mereka mengalami hal yang seharusnya menjadi akhir dari kehidupan mereka: mereka mati terkena bom.\nNamun justru melalui kematian itulah mereka mengetahui kebenaran. Mereka ternyata telah menjadi manusia abadi. Kematian tidak lagi menjadi akhir bagi mereka.`,
          enhancedContent: `
            <div class="critical-moment">
              <h4>MOMEN ANOMALI: KEMATIAN PERTAMA (THE FIRST DEATH)</h4>
              <p>Di penghujung World War I, sebuah bom menghantam posisi masing-masing. Serpihan baja merobek organ vital, gelombang kejut meremukkan tulang. Secara biologis, mereka telah tewas.</p>
              <p>Namun alam maut menolak mereka. Dalam hitungan menit, partikel-partikel seluler mereka bergenerasi ulang dengan kecepatan mustahil. Jantung kembali berdegup kencang. Mereka membuka mata dan bangkit berdiri di atas tumpukan mayat rekan-rekan mereka.</p>
              <p><em>Mereka telah menjadi manusia abadi sejati.</em> Siapa dalang kosmik yang memilih mereka? Hingga 70.000 tahun kemudian, rahasia ini tetap membisu.</p>
            </div>
          `
        },
        {
          num: "12",
          title: "World War II (1939) & Runtuhnya Ekonomi Global",
          tagline: "Perang Dunia Berulang & Bangkrutnya Sumber Daya Xpax-12",
          summary: "Tahun 1939 meletus World War II. Pasca perang, ekonomi dunia hancur lebur, bahan bakar dan sumber daya kritis menipis, memicu keruntuhan peradaban.",
          originalSnippet: `Pada tahun: 1939 World War II dimulai... Namun setelah World War II berakhir, sejarah Xpax-12 mulai menyimpang jauh.\nNegara-negara yang sebelumnya telah terkuras oleh perang menghadapi kehancuran ekonomi yang luar biasa besar.\nKrisis ekonomi bertemu dengan krisis kepercayaan. Krisis sumber daya memperburuk semuanya. Dunia tidak lagi hanya kelelahan akibat perang. Dunia mulai kehilangan fondasi untuk mempertahankan peradaban itu sendiri.`,
          enhancedContent: `
            <p>Hanya berselang dua puluh tahun dari perang parit pertama, ambisi geopolitik kembali membakar Xpax-12 pada tahun 1939 dalam kancah World War II.</p>
            <p>Perang kedua ini menguras seluruh cadangan mineral kristal sihir dan minyak bumi. Saat perjanjian damai ditandatangani, seluruh negara pemenang dan pecundang sama-sama berada di ambang kebangkrutan total.</p>
          `
        },
        {
          num: "13",
          title: "All Government Downfall: 10 Tahun Chaos & Anarki",
          tagline: "Ketika Struktur Pemerintahan Menguap Menjadi Kekacauan",
          summary: "Gabungan tekanan ekonomi dan kelangkaan sumber daya meruntuhkan seluruh pemerintahan di Xpax-12. Dunia terjerumus ke dalam anarki total selama 10 tahun tanpa hukum.",
          originalSnippet: `All Government Downfall merupakan era ketika berbagai pemerintahan mengalami keruntuhan akibat gabungan tekanan ekonomi, hilangnya kepercayaan, serta kelangkaan sumber daya.\nSetelah keruntuhan itu, Xpax-12 memasuki periode sekitar: 10 tahun chaos dan anarki.\nHukum melemah. Struktur pemerintahan menghilang. Masyarakat dipaksa hidup dalam ketidakpastian.\nNamun ketika Xpax-12 sedang berada dalam keadaan paling rapuh, sebuah kekuatan dari luar planet datang. Tepatnya, bukan satu kekuatan. Melainkan tiga.`,
          enhancedContent: `
            <p>Periode <strong>All Government Downfall</strong> menandai lenyapnya hukum, polisi, dan peradilan di seluruh benua Xpax-12. Mata uang tidak berharga, pasar dijarah, dan geng-geng bersenjata memperebutkan sisa makanan selama 10 tahun penuh.</p>
            <p>Di saat peradaban Xpax-12 berada di titik paling sekarat, bayangan armada antarbintang raksasa menutupi langit siang hari.</p>
          `
        },
        {
          num: "14",
          title: "Tiga Penjajah Langit Tiba di Xpax-12",
          tagline: "Foundation, Azis, dan Imperium Datang Tanpa Sengaja",
          summary: "Armada Foundation, Azis, dan Imperium saling kejar dan bertempur hingga terdampar di Xpax-12. Koloni sementara berubah menjadi pendudukan militer penuh. Penduduk lokal menjuluki mereka '3 Penjajah Langit'.",
          originalSnippet: `Mereka tidak datang ke Xpax-12 dengan rencana awal untuk menaklukkan planet tersebut. Mereka tiba secara tidak sengaja. Mereka sedang saling mengejar... Setelah tiba, mereka memutuskan untuk mendirikan koloni sementara... Lalu, selama sekitar dua tahun, semakin banyak orang dan kekuatan dari ketiga faksi datang ke Xpax-12... Perang berubah menjadi: perebutan Xpax-12.\nPenduduk asli Xpax-12 akhirnya mempunyai satu nama kolektif bagi ketiga kekuatan asing itu: '3 Penjajah Langit.'`,
          enhancedContent: `
            <p>Tiga armada tempur Hilim yang saling baku tembak di orbit terdampar masuk ke gravitasi Xpax-12. Ketika mendeteksi deposit mineral strategis, pertempuran sementara berubah menjadi pendudukan permanen.</p>
            <div class="callout-quote">
              <em>"Bagi penduduk asli Xpax-12 yang bersenjatakan senapan mesiu sederhana, ketiga armada warp tersebut adalah <strong>'Tiga Penjajah Langit'</strong>—tiga dewa angkasa yang datang berebut tanah tumpah darah mereka."</em>
            </div>
          `
        },
        {
          num: "15",
          title: "Tiga Pria di Tiga Kubu & Pengabdian 50 Tahun",
          tagline: "Ironi Tiga Sahabat yang Direkrut oleh Tiga Penjajah Langit",
          summary: "Kemampuan abadi Vin, Nikolas, dan Nevin memikat penjajah langit. Vin direkrut Foundation, Nikolas ke Imperium, Nevin ke Azis. Mereka mengabdi selama 50 tahun dan menjadi perwira elit.",
          originalSnippet: `Keberadaan ketiga manusia abadi tersebut akhirnya menarik perhatian faksi-faksi Hilim... Maka ketiganya direkrut:\nVin Alvian -> Foundation\nNikolas Enstain -> Imperium\nNevin Roosevelt -> Azis\nPembagian tersebut menciptakan salah satu ironi terbesar dalam hidup mereka: Tiga orang yang telah saling mengenal kini kembali menjadi bagian dari dunia yang terpecah menjadi tiga kubu bermusuhan.\nVin, Nikolas, dan Nevin kemudian mengabdikan diri kepada masing-masing faksi selama: 50 tahun. Mereka memperoleh upah, tempat istirahat, makanan, pendidikan, dan fasilitas kehidupan.`,
          enhancedContent: `
            <p>Imortalitas fisik Vin, Nikolas, dan Nevin menjadi komoditas perang berharga tinggi. Ketiganya direkrut ke dalam komando faksi yang berbeda:</p>
            <div class="distribution-grid">
              <div class="dist-card"><span class="name">Vin Alvian</span><span class="arrow">&rarr;</span><span class="dest">FOUNDATION</span></div>
              <div class="dist-card"><span class="name">Nikolas Enstain</span><span class="arrow">&rarr;</span><span class="dest">IMPERIUM</span></div>
              <div class="dist-card"><span class="name">Nevin Roosevelt</span><span class="arrow">&rarr;</span><span class="dest">AZIS</span></div>
            </div>
            <p>Selama setengah abad (50 tahun), ketiga sahabat hidup sebagai perwira tinggi di kubu yang saling berhadapan. Mereka dilatih taktik armada antarbintang dan diperlakukan sebagai aset perang strategis.</p>
          `
        },
        {
          num: "16",
          title: "55 Tahun Perang & Kiamat Xpax-12: Senjata Pemusnah Planet",
          tagline: "Ketika Sebuah Dunia Diledakkan Menjadi Debu Kosmik",
          summary: "Perang di Xpax-12 berlangsung buntu selama 55 tahun. Foundation diam-diam mengevakuasi armadanya lalu meluncurkan senjata penghancur planet. Xpax-12 musnah total; ketiga sahabat selamat karena takdir.",
          originalSnippet: `Secara keseluruhan, perang di Xpax-12 berlangsung selama: 55 tahun... Pada akhirnya, Foundation mengambil keputusan yang paling ekstrem. Mereka secara diam-diam menarik kapal-kapal mereka. Kemudian mereka meluncurkan sebuah senjata yang mampu menghancurkan sebuah planet.\nTujuannya jelas: menghancurkan Xpax-12 dan berharap seluruh pihak dari faksi lain musnah.\nPlanet yang selama puluhan tahun menjadi medan perang akhirnya dihancurkan.\nNamun takdir kembali memisahkan ketiga sahabat: Pada saat penghancuran Xpax-12, Nikolas sedang menjalankan tugas di planet lain. Nevin juga sedang menjalankan tugas di planet lain. Vin juga selamat karena ikut bersama armada Foundation sebelum penghancuran.`,
          enhancedContent: `
            <div class="destruction-dossier">
              <div class="d-header">TERMINASI TOTAL KOSMIK: PLANET XPAX-12</div>
              <p>Melihat perang tak kunjung usai setelah 55 tahun, dewan perang Foundation mengambil keputusan kejam: <em>menghancurkan planet Xpax-12 beserta seluruh armada musuh di permukaannya.</em></p>
              <p>Proyektil anti-materi ditembakkan ke inti planet. Kerak bumi terbelah, samudra menguap seketika, dan dunia kelahiran mereka meledak berkeping-keping menjadi sabuk asteroid.</p>
              <p><strong>Faktor Takdir Kosmik:</strong> Nikolas dan Nevin selamat karena sedang mengawal ekspedisi di sektor bintang lain, sementara Vin berada di dalam kapal induk Foundation yang telah mengorbit jauh sebelum peledakan.</p>
            </div>
          `
        }
      ]
    },

    {
      id: "part-03",
      sectionNumber: "03 / JALAN MENUJU THE COMPANY",
      sectionTitle: "Jalan Menuju The Company & Hegemoni Baru",
      themeColor: "#a855f7",
      chapters: [
        {
          num: "17",
          title: "Dua Puluh Ribu Tahun Pengabdian: Saksi Jutaan Generasi Fana",
          tagline: "Menyaksikan Pergantian Generasi Tanpa Akhir",
          summary: "Setelah tragedi Xpax-12, ketiga tokoh tetap mengabdi di faksi masing-masing selama 20.000 tahun. Ribuan generasi manusia fana mati, namun dendam antar-faksi Hilim tak pernah reda.",
          originalSnippet: `Setelah tragedi Xpax-12, kehidupan mereka masih belum selesai. Vin tetap bersama Foundation. Nikolas tetap bersama Imperium. Nevin tetap bersama Azis. Dan pengabdian mereka berlanjut selama: 20.000 tahun.\nDua puluh ribu tahun. Bukan dua dekade. Bukan dua abad. Bahkan bukan dua ribu tahun. Mereka hidup cukup lama untuk melihat pergantian generasi yang tidak terhitung... Namun satu hal tetap sama: Foundation, Azis, dan Imperium masih bermusuhan.`,
          enhancedContent: `
            <p>Dua puluh ribu tahun melampaui seluruh rekaman sejarah tertulis Bumi. Dalam rentang waktu ini, Vin, Nikolas, dan Nevin melihat imperium-imperium kecil lahir, menua, dan musnah. Prajurit-prajurit fana yang bertempur bersama mereka berganti hingga ratusan generasi, namun permusuhan tiga faksi warisan Hilim tetap membeku dalam kebuntuan.</p>
          `
        },
        {
          num: "18",
          title: "Pemberontakan: Ketika Kaum Hilim Muak Berperang",
          tagline: "Aliansi Kaum Pemberontak Tiga Kubu Melawan Petinggi Lama",
          summary: "Kejenuhan massal meletus menjadi revolusi di ketiga faksi. Pasukan pemberontak Foundation, Azis, dan Imperium beraliansi demi meruntuhkan para petinggi tiran lama.",
          originalSnippet: `Setelah 20.000 tahun berlalu, sebagian besar anggota dari tiga faksi mulai melihat sebuah kenyataan... Mereka telah menghabiskan begitu banyak waktu untuk berperang melawan pihak yang sebenarnya berasal dari akar peradaban yang sama: kaum Republik Hilim.\nRasa lelah berubah menjadi kejenuhan. Kejenuhan berubah menjadi kemuakan. Dan kemuakan berubah menjadi pemberontakan... Pihak pemberontak dari ketiga faksi kemudian melakukan sesuatu yang sebelumnya tampak mustahil: mereka saling beraliansi. Struktur lama runtuh. Namun muncul pertanyaan: Siapa yang akan memimpin sekarang?`,
          enhancedContent: `
            <p>Prajurit garis bawah dan masyarakat sipil akhirnya muak dibantai demi ambisi penguasa purba. Untuk pertama kalinya dalam 66 juta tahun, para pemberontak dari Foundation, Azis, dan Imperium menjalin paktum rahasia.</p>
            <p>Kudeta terkoordinasi dilancarkan serentak di puluhan galaksi. Para tiran lama disingkirkan dan struktur kekuasaan lapuk diruntuhkan dalam semalam.</p>
          `
        },
        {
          num: "19",
          title: "Para Pemimpin yang Menolak Kekuasaan",
          tagline: "Vin, Nikolas, dan Nevin Dipaksa Memikul Mahkota",
          summary: "Tidak ada perwira fana yang sanggup memimpin setelah jutaan tahun dendam. Seluruh kubu mendesak dan memaksa Vin (Foundation), Nikolas (Imperium), dan Nevin (Azis) menjadi pemimpin tertinggi.",
          originalSnippet: `Tidak ada yang benar-benar ingin mengambilnya... Pada akhirnya, perhatian diarahkan kepada tiga orang yang memiliki pangkat tertinggi di masing-masing faksi: Vin Alvian (Foundation), Nikolas Enstain (Imperium), Nevin Roosevelt (Azis).\nKetiganya sebenarnya tidak menginginkan jabatan tersebut. Mereka menolak pada awalnya. Namun mereka didesak. Bahkan dipaksa. Dan karena hampir tidak ada orang lain yang bersedia... mereka bertiga menerima.\nIronisnya, orang-orang yang sejak awal tidak pernah mengejar kekuasaan justru menjadi pemimpin tertinggi dari tiga kekuatan terbesar yang tersisa dari Republic Hilim.`,
          enhancedContent: `
            <div class="leadership-dossier">
              <p>Tragedi kekuasaan sering kali berujung pada penindasan baru jika dipimpin orang yang haus tahta. Namun Vin, Nikolas, dan Nevin adalah veteran yang telah kenyang menatap darah jutaan tahun. Mereka menolak keras jabatan tersebut.</p>
              <div class="l-item"><strong>Vin Alvian:</strong> Diangkat sebagai Pimpinan Tertinggi <em>Foundation</em></div>
              <div class="l-item"><strong>Nikolas Enstain:</strong> Diangkat sebagai Pimpinan Tertinggi <em>Imperium</em></div>
              <div class="l-item"><strong>Nevin Roosevelt:</strong> Diangkat sebagai Pimpinan Tertinggi <em>Azis</em></div>
              <p>Karena didesak oleh rakyat dan demi mencegah perang saudara baru, mereka bertiga akhirnya memikul beban kepemimpinan tersebut.</p>
            </div>
          `
        },
        {
          num: "20",
          title: "Kelahiran The Company: Satu Panji untuk Tiga Kekuatan",
          tagline: "Peleburan Mutlak Menjadi CONGLOMERATE COMPANY",
          summary: "Vin, Nikolas, dan Nevin menyatukan Foundation, Azis, dan Imperium ke bawah satu naungan: The Company (Conglomerate Company). Berdiri di atas realisme pragmatis dingin.",
          originalSnippet: `Vin Alvian, Nikolas Enstain, dan Nevin Roosevelt akhirnya memutuskan untuk menyatukan seluruh kekuatan mereka. Tidak ada lagi Foundation sebagai faksi yang berdiri sendiri. Tidak ada lagi Azis... Tidak ada lagi Imperium... Satu kesatuan. Satu struktur. Satu panji. Namanya: THE COMPANY atau nama lengkapnya: CONGLOMERATE COMPANY.\nNamun lahirnya The Company tidak berarti semesta tiba-tiba menjadi damai... The Company menyatukan ketiga kekuatan, tetapi tidak menghapus karakter dunia yang keras. Kelangsungan hidup memiliki nilai. Kekuatan memiliki nilai. Sumber daya memiliki nilai. Dan belas kasihan tidak selalu menjadi dasar sebuah keputusan.`,
          enhancedContent: `
            <p>Di bawah Piagam Unifikasi Kosmik, ketiga faksi resmi dibubarkan sebagai entitas independen dan dilebur ke dalam satu korporasi hegemoni: <strong>CONGLOMERATE COMPANY</strong>.</p>
            <div class="philosophy-box">
              <h4>PRAGMATISME DINGIN THE COMPANY</h4>
              <p>The Company tidak pernah berniat menjadi utopia moralitas naif. Mereka menyadari semesta adalah tempat yang buas:</p>
              <ul>
                <li><strong>Survival & Kekuatan Mutlak</strong> adalah satu-satunya penjamin kestabilan peradaban.</li>
                <li><strong>Project Expedition</strong> tetap dioperasikan untuk ekstraksi mineral dan pemetaan rute warp.</li>
                <li>Hukum ditegakkan lewat satu komando terpusat yang mematahkan segala potensi perang saudara.</li>
              </ul>
            </div>
          `
        },
        {
          num: "21",
          title: "Lima Puluh Ribu Tahun Dominasi Kosmik (50.000 Tahun)",
          tagline: "Hegemoni Institusi Terbesar dalam Sejarah Semesta",
          summary: "Selama 50.000 tahun, The Company menguasai seluruh galaksi, mendominasi pemerintahan, ekonomi, dan ekspansi kosmik tanpa tandingan.",
          originalSnippet: `Setelah berdirinya The Company, sejarah memasuki tahap yang jauh lebih luas. Selama: 50.000 tahun The Company berkembang. Pengaruhnya meluas. Ekspansinya terus berjalan... The Company tumbuh menjadi kekuatan dominan paling kuat dalam sejarah yang dikenal semesta mereka.\nDalam rentang waktu yang sangat panjang, The Company menjadi bukan sekadar organisasi. Ia berubah menjadi salah satu fondasi dari pemahaman mengenai kekuatan, pemerintahan, ekspansi, dan dominasi di dalam semesta.`,
          enhancedContent: `
            <p>Selama <strong>50.000 Tahun Penuh</strong>, The Company berdiri sebagai monolit kekuasaan yang tak tergoyahkan. Nama organisasi ini melintasi ratusan generasi, mengontrol gerbang perdagangan galaksi, dan mendefinisikan kembali arti dari pemerintahan antariksa.</p>
          `
        }
      ]
    },

    {
      id: "part-04",
      sectionNumber: "04 / KEKUATAN & MISTERI",
      sectionTitle: "Kekuatan Kosmik, Misteri & Dialog Penutup",
      themeColor: "#10b981",
      chapters: [
        {
          num: "22",
          title: "Kekuatan di Luar Pemahaman: God-Like Entities & Tier 1 Higher Infinity",
          tagline: "Tingkat Eksistensi Transenden Melampaui Batas Fisik",
          summary: "Vin Alvian, Nikolas Enstain, dan Nevin Roosevelt bukan sekadar administrator birokrasi; kekuatan mereka setara dengan God-like Entities pada tingkatan Tier 1: Higher Infinity.",
          originalSnippet: `Dalam skala kekuatan semesta, Vin Alvian, Nikolas Enstain, dan Nevin Roosevelt berada dalam tingkat yang sangat tinggi. Kekuatan mereka setara dengan entitas yang dapat digolongkan sebagai: God-like Entities.\nDalam sistem tier yang digunakan dalam lore ini, ketiganya dapat ditempatkan pada: Tier 1: Higher Infinity.\nDengan demikian, ketiganya bukan sekadar administrator dalam arti administratif. Mereka adalah individu yang kekuatannya telah mencapai ranah transenden dan kosmik.`,
          enhancedContent: `
            <p>Di balik jas resmi dan meja birokrasi The Company, ketiga pendiri memegang kekuatan yang sanggup merobek dimensi. Klasifikasi resmi lore semesta menetapkan status mereka sebagai:</p>
            <div class="tier-card">
              <div class="t-badge">OTORITAS EKSISTENSIAL RESMI</div>
              <h2>TIER 1: HIGHER INFINITY</h2>
              <p>Entitas yang melampaui hukum gravitasi, ruang, dan waktu. Mampu memanipulasi hukum realitas pada skala kosmik, namun tetap memilih memimpin dengan ketertiban dan akal budi rasional.</p>
            </div>
          `
        },
        {
          num: "23",
          title: "Misteri yang Tidak Pernah Terjawab",
          tagline: "Enam Teka-Teki Abadi yang Menolak Dipecahkan",
          summary: "Kendati semesta berkembang puluhan triliun tahun, misteri Lost Era, Reset Pengetahuan, Anomali Republic Hilim, Asal Usul Sihir, 5 Ibu Langit, dan alasan terpilihnya ketiga manusia abadi tetap menjadi rahasia kosmik.",
          originalSnippet: `Walaupun sejarah semesta berkembang begitu jauh, tidak semua pertanyaan memperoleh jawaban. Beberapa misteri tetap hidup:\n• Misteri Lost Era (Big Bang vs Tuhan)\n• Misteri Reset Pengetahuan (Mengapa koloni manusia hilang memori?)\n• Misteri Republic Hilim (Mengapa Hilim tidak mengalami kehancuran?)\n• Misteri Sihir (Mengapa sihir mulai muncul?)\n• Misteri Lima Ibu Prinsip Langit (Kedalaman konsekuensi kosmik mereka)\n• Misteri Keabadian Tiga Tokoh (Siapa yang memilih mereka dan mengapa?)\nAda sejarah yang diketahui. Ada sejarah yang dilupakan. Dan ada sejarah yang mungkin selamanya hanya menjadi teori.`,
          enhancedContent: `
            <div class="mysteries-grid">
              <div class="mystery-item"><h4>Misteri Lost Era</h4><p>Apakah semesta berawal dari letupan fisika kuantum Big Bang ataukah rajutan kehendak Entitas Ilahi?</p></div>
              <div class="mystery-item"><h4>Misteri Reset Pengetahuan</h4><p>Kekuatan apa yang mampu menghapus sains dan memori peradaban di ratusan koloni manusia pasca Perang Besar?</p></div>
              <div class="mystery-item"><h4>Anomali Republic Hilim</h4><p>Mengapa hanya peradaban Hilim yang kebal terhadap penghapusan memori dan kemunduran teknologi?</p></div>
              <div class="mystery-item"><h4>Asal-Usul Sihir</h4><p>Bagaimana partikel energi arkaik magis bisa merasuk dan menyatu dalam struktur kimia semesta?</p></div>
              <div class="mystery-item"><h4>Konsekuensi 5 Ibu Langit</h4><p>Ke mana perginya kesadaran Nova, Nabiru, Anastasia, Ines, dan Xin setelah pengorbanan mereka?</p></div>
              <div class="mystery-item"><h4>Misteri Tiga Tokoh Terpilih</h4><p>Entitas mana yang memilih Vin, Nikolas, dan Nevin di medan bom Xpax-12 untuk memikul keabadian abadi?</p></div>
            </div>
          `
        },
        {
          num: "24",
          title: "Penutup: Tiga Orang, Satu Meja Kopi & Teori Sang Narator",
          tagline: "Keheningan Secangkir Kopi di Balik Megahnya Kosmos",
          summary: "Kisah epos jutaan tahun berakhir pada tiga pria yang duduk bersama minum kopi hitam, mendiskusikan batasan semesta, kesaksian para istri, dan teori metafiksi Nia Ametia tentang Sang Narator.",
          originalSnippet: `Pada akhirnya, setelah perjalanan yang begitu panjang... kisah ketiga tokoh tersebut tidak berakhir dengan sebuah perang besar. Tidak dengan ledakan. Tidak dengan penaklukan baru. Tidak pula dengan sebuah pidato tentang masa depan.\nMereka mengakhiri percakapan mereka dengan sesuatu yang sangat sederhana: Vin Alvian, Nikolas Enstain, dan Nevin Roosevelt duduk bersama. Mereka minum kopi... Dan di bagian paling akhir mereka berbincang tentang bagaimana kalau ada yang lebih kuat dari apa yang mereka bayangkan...\nVin bertanya tentang Lost Era & 'Di atas langit masih ada langit'.\nNikolas mengamini adanya sistem hierarki semesta.\nNevin meragukan kekuatan para dewa saat ini.\nVin mengutip jawaban istrinya Iris (Goddess of Envy) bahwa para dewa enggan berkonflik lagi dengan manusia.\nNikolas mengutip istrinya Xaihi Quanyun bahwa kaum kultivator surgawi dan transenden memilih netral setelah kalah 10.000 tahun lalu.\nNevin mengutip istrinya Nia Ametia tentang teori bahwa mungkin ada seorang 'Narator' di semesta ini yang sedang menuliskan semuanya.\nNarator: Ini Akhir? Tentu Saja Tidak!`,
          enhancedContent: `
            <p>Setelah puluhan ribu tahun memegang kemudi galaksi, ketiganya menemukan kedamaian sejati bukan pada tahta, melainkan pada secangkir kopi hangat di dek pengamatan bintang:</p>
            <div class="coffee-scene-card">
              <p>Tiga cangkir kopi mengepul di bawah panorama gugus galaksi. Mereka mengenang masa-masa saat masih menjadi prajurit muda di parit Xpax-12 yang kini telah lebur menjadi debu.</p>
            </div>
            <div class="dialogue-box">
              <div class="chat-row vin">
                <span class="speaker">VIN ALVIAN:</span>
                <p>"Lost Era tak pernah bisa diprediksi oleh sains dan teknologi mana pun. Apa jadinya jika di atas langit masih ada langit lagi? Bahwa sebenarnya kita ini bukan yang terkuat?"</p>
              </div>
              <div class="chat-row nikolas">
                <span class="speaker">NIKOLAS ENSTAIN:</span>
                <p>"Semesta selalu memiliki hierarki berjenjang. Kurasa kau benar, Vin. Sangat mungkin di luar sana ada sesuatu yang jauh lebih mendominasi atau sedang mengawasi kita."</p>
              </div>
              <div class="chat-row nevin">
                <span class="speaker">NEVIN ROOSEVELT:</span>
                <p>"Tapi kupikir bukan para dewa atau dewi. Kekuatan mereka sudah jauh tertinggal untuk bisa mengintimidasi peradaban manusia saat ini."</p>
              </div>
              <div class="chat-row vin">
                <span class="speaker">VIN ALVIAN:</span>
                <p>"Tepat. Istriku, <strong>Iris (Goddess of Envy)</strong>, mengatakan bahwa panteon dewa sama sekali tidak berniat lagi memicu konflik dengan manusia."</p>
              </div>
              <div class="chat-row nikolas">
                <span class="speaker">NIKOLAS ENSTAIN:</span>
                <p>"Istriku, <strong>Xaihi Quanyun (Transeden Paragon)</strong>, juga menegaskan bahwa para kultivator surgawi dan transenden telah memilih netral mutlak sejak kekalahan perang 10.000 tahun silam."</p>
              </div>
              <div class="chat-row nevin">
                <span class="speaker">NEVIN ROOSEVELT:</span>
                <p>"Dan jika bicara soal istriku, <strong>Nia Ametia</strong>... secara logika ia tampak seperti manusia biasa, tapi kekuatannya terkadang bisa melompat di atasku. Menurut teori Nia: <em>mungkin saja ada seorang <strong>Narator</strong> di semesta ini yang sedang menuliskan seluruh takdir kita.</em>"</p>
              </div>
            </div>
            <div class="narrator-proclamation">
              <div class="n-title">SUARA DARI LUAR DINDING REALITAS</div>
              <blockquote>"Ini Akhir? Tentu Saja Tidak!"</blockquote>
              <span class="author-sign">— Sang Narator Semesta // The Company Series</span>
            </div>
          `
        }
      ]
    }
  ],

  hierarchy: [
    { rank: 1, title: "Most High Complex Administrator", holder: "Vin Alvian, Nikolas Enstain, Nevin Roosevelt", level: "Puncak Otoritas Absolut", desc: "Tiga figur pendiri berstatus Tier 1: Higher Infinity. Pemegang hak veto penuh atas seluruh kebijakan kosmik The Company." },
    { rank: 2, title: "High Complex Administrator", holder: "Dewan Penasihat Strategis Antar-Sistem", level: "Otoritas Galaktik", desc: "Mengawasi aliansi gugus bintang, armada induk, dan regulasi riset energi tingkat lanjut." },
    { rank: 3, title: "Complex Administrator", holder: "Gubernur Sektor Bintang Utama", level: "Manajemen Kuadran", desc: "Penanggung jawab rute perdagangan warp dan stabilitas ekonomi puluhan sistem tata surya." },
    { rank: 4, title: "High Administrator", holder: "Komandan Armada Ekspedisi", level: "Eselon Tinggi Militer", desc: "Memimpin pelaksanaan Project Expedition dan penjaminan keamanan teritori perbatasan." },
    { rank: 5, title: "Medium Administrator", holder: "Direktur Planet Terpilih", level: "Kepala Administrasi Planet", desc: "Mengelola sumber daya industri, ekologi, dan populasi pada planet bernilai strategis tinggi." },
    { rank: 6, title: "Elite Administrator", holder: "Kepala Biro Riset & Teknologi Sihir", level: "Spesialis Tekno-Magis", desc: "Peneliti senior dalam pemanfaatan energi arkaik dan pengembangan teknologi keabadian parsial." },
    { rank: 7, title: "Silver Administrator", holder: "Inspektur Lapangan Sektor", level: "Pengawas Penegakan Hukum", desc: "Memastikan kepatuhan koloni terhadap piagam unifikasi The Company." },
    { rank: 8, title: "Bronze Administrator", holder: "Manajer Logistik & Sumber Daya", level: "Operasional Rantai Pasok", desc: "Distribusi logistik antarbintang dan pengawalan jalur kargo mineral langka." },
    { rank: 9, title: "Basic Administrator", holder: "Staf Birokrasi Teritori", level: "Administrasi Dasar", desc: "Pengelolaan registrasi warga sipil, pengarsipan data koloni, dan pajak energi." },
    { rank: 10, title: "Low Administrator", holder: "Petugas Lapangan Pemula", level: "Strata Masuk Institusi", desc: "Pintu masuk jenjang karir dalam korps aparatur sipil dan pertahanan The Company." }
  ],

  factionsMatrix: {
    foundation: {
      name: "Foundation",
      color: "#06b6d4",
      symbol: "💠",
      motto: "Logika, Struktur, dan Kepastian Mutlak",
      doktrin: "Supremasi Tekno-Sains Terpadu",
      taktik: "Kalkulasi analitis dingin, pemusnahan total hambatan strategis melalui senjata berdaya hancur planet.",
      pemimpin: "Vin Alvian (pasca pemberontakan)",
      peranUnifikasi: "Menyumbangkan basis infrastruktur teknologi, regulasi digital, dan doktrin riset mendalam pada The Company."
    },
    azis: {
      name: "Azis",
      color: "#10b981",
      symbol: "🛡️",
      motto: "Ketahanan, Disiplin, dan Benteng Abadi",
      doktrin: "Pertahanan Total & Ksatria Angkasa",
      taktik: "Formasi pertahanan lapis baja dan sihir pelindung yang tak tertembus, menguras armada musuh dalam perang atrisi.",
      pemimpin: "Nevin Roosevelt (pasca pemberontakan)",
      peranUnifikasi: "Menjadi tulang punggung korps pertahanan, benteng pangkalan, dan komando disiplin militer The Company."
    },
    imperium: {
      name: "Imperium",
      color: "#ef4444",
      symbol: "👑",
      motto: "Penaklukan, Kehendak Besi, dan Supremasi",
      doktrin: "Ekspansionisme Militan & Kultus Kekuatan",
      taktik: "Serbuan kilat tanpa ampun, asimilasi paksa sumber daya, dan penggabungan seni bela diri transenden ke dalam perang.",
      pemimpin: "Nikolas Enstain (pasca pemberontakan)",
      peranUnifikasi: "Menyuplai armada penjelajah garis depan, diplomasi tegas, dan wewenang ekspansi teritorial The Company."
    }
  },

  characters: [
    {
      id: "vin-alvian",
      code: "CHAR-01",
      name: "Vin Alvian",
      title: "Pendiri The Company & Most High Complex Administrator",
      role: "Mantan Pemimpin Tertinggi Foundation",
      image: "assets/images/vin_alvian.jpg",
      origin: "Republic of New Federation (Xpax-12)",
      status: "Abadi (True Immortal)",
      powerTier: "Tier 1: Higher Infinity",
      spouse: "Iris (Goddess of Envy)",
      badgeColor: "#06b6d4",
      stats: {
        intelek: 99,
        kebijaksanaan: 96,
        dayaHancur: 98,
        pengaruh: 100,
        pengalamanTahun: "70.000+"
      },
      quote: "Sains tanpa batas kebijaksanaan adalah gerbang tercepat menuju kepunahan. Kita menyatukan tiga kubu bukan untuk menciptakan surga khayalan, melainkan memastikan eksistensi manusia tidak lenyap oleh ambisinya sendiri.",
      bio: "Lahir di Republic of New Federation di planet Xpax-12, Vin dibesarkan di era nuansa industrial uap dan sihir. Ia bertempur dalam Perang Dunia I dan terbunuh oleh ledakan bom dahsyat—momen di mana ia terlahir kembali sebagai entitas abadi.",
      history: "Setelah kejatuhan pemerintahan Xpax-12 dan kedatangan Tiga Penjajah Langit, Vin direkrut oleh faksi Foundation. Ia mengabdi selama 50 tahun di Xpax-12, selamat saat planet tersebut dimusnahkan oleh senjatanya sendiri, dan melanjutkan pengabdian antarbintang selama 20.000 tahun. Menjadi salah satu tokoh kunci di balik pemberontakan, Vin didaulat memimpin Foundation sebelum akhirnya memprakarsai fusi akbar Conglomerate Company bersama dua sahabatnya.",
      loreNotes: "Menikahi Iris (Goddess of Envy). Dalam perbincangan santai di meja kopi pengamat semesta, Vin adalah sosok yang pertama kali melontarkan pertanyaan reflektif: 'Apakah di atas langit masih ada langit yang mengawasi kita?'"
    },
    {
      id: "iris",
      code: "CHAR-02",
      name: "Iris",
      title: "Goddess of Envy (Dewi Rasa Iri & Kehendak Hasrat)",
      role: "Pendamping Vin Alvian & Entitas Panteon Kuno",
      image: "assets/images/iris.jpg",
      origin: "Dimensi Surgawi Panteon Purba",
      status: "Entitas Ilahi Transenden",
      powerTier: "God-Like Class",
      spouse: "Vin Alvian",
      badgeColor: "#64748b",
      stats: {
        intelek: 94,
        kebijaksanaan: 92,
        dayaHancur: 95,
        pengaruh: 89,
        pengalamanTahun: "Tak Terhitung"
      },
      quote: "Manusia membunuh panteon kami dengan sains dan keberanian nekat mereka. Kami telah lama meletakkan mahkota dendam itu. Berperang lagi melawan manusia hari ini? Hanya dewa gila yang menginginkan kemusnahan kedua.",
      bio: "Muncul dalam catatan rahasia The Company melalui pengakuan resmi Vin Alvian. Iris merupakan salah satu figur dewi purba yang selamat dari pembersihan era Perang Besar Melawan Prinsip Langit.",
      history: "Menjadi istri dari Vin Alvian, Iris memilih hidup di sisi sang Administrator tertinggi. Ketika ditanyai oleh Vin mengenai potensi kebangkitan dewa-dewi untuk menantang hegemoni manusia masa kini, Iris menegaskan bahwa kaum ilahi telah mengakui supremasi ras manusia dan tidak memiliki hasrat untuk mengulangi perang masa lampau.",
      loreNotes: "Naskah dokumen arsip The Company sengaja tidak memerinci silsilah lengkap dan kedalaman kekuatannya demi menjaga kerahasiaan entitas ilahi yang kini berasimilasi damai dalam ordo The Company."
    },
    {
      id: "nikolas-enstain",
      code: "CHAR-03",
      name: "Nikolas Enstain",
      title: "Pendiri The Company & Most High Complex Administrator",
      role: "Mantan Pemimpin Tertinggi Imperium",
      image: "assets/images/nikolas_enstain.jpg",
      origin: "Socialist Republic of Vintus (Xpax-12)",
      status: "Abadi (True Immortal)",
      powerTier: "Tier 1: Higher Infinity",
      spouse: "Xaihi Quanyun",
      badgeColor: "#ef4444",
      stats: {
        intelek: 97,
        kebijaksanaan: 95,
        dayaHancur: 99,
        pengaruh: 100,
        pengalamanTahun: "70.000+"
      },
      quote: "Hukum semesta selalu berjenjang. Siapa pun yang merasa telah berada di singgasana mutlak biasanya hanya belum menatap cukup jauh ke dalam kegelapan kosmik.",
      bio: "Sosok jenderal bervisi tajam dan ahli strategi tak tertandingi yang berasal dari Socialist Republic of Vintus di Xpax-12. Melewati kerasnya pergolakan revolusi dan perang saudara di tanah kelahirannya sebelum terseret ke dalam kancah Perang Dunia I.",
      history: "Mengalami 'Kematian Pertama' bersama Vin dan Nevin akibat hantaman artileri. Direkrut oleh faksi Imperium berkat kemampuan tempur dan imortalitasnya yang memukau. Ia mengabdi selama puluhan ribu tahun hingga mencapai tampuk kepemimpinan Imperium pasca-pemberontakan akbar. Bersama Vin dan Nevin, Nikolas mendirikan The Company dan menempati puncak piramida kepemimpinan.",
      loreNotes: "Menikahi Xaihi Quanyun. Nikolas mengungkapkan bahwa alam kultivasi surgawi dan kaum transenden telah mengisolasi diri dari urusan manusia semenjak menderita kekalahan telak 10.000 tahun silam."
    },
    {
      id: "xaihi-quanyun",
      code: "CHAR-04",
      name: "Xaihi Quanyun",
      title: "Transeden Paragon Quanyun (Kultivator Surgawi Sejati)",
      role: "Pendamping Nikolas Enstain & Matriark Jalur Dao Transenden",
      image: "assets/images/xaihi_quanyun.jpg",
      origin: "Alam Surgawi / Ranah Transenden",
      status: "Transenden Abadi",
      powerTier: "Transcendent Paragon Class",
      spouse: "Nikolas Enstain",
      badgeColor: "#38bdf8",
      stats: {
        intelek: 95,
        kebijaksanaan: 97,
        dayaHancur: 97,
        pengaruh: 91,
        pengalamanTahun: "Tak Terhitung"
      },
      quote: "Pedang Dao manusia telah membelah langit sepuluh ribu tahun lalu. Mereka yang mencari keabadian melalui meditasi kini telah mengerti: kedamaian sejati ada dalam netralitas, bukan dalam mencampuri roda peradaban manusia.",
      bio: "Diperkenalkan dalam rekaman dialog penutup melalui penuturan Nikolas Enstain. Merupakan figur transenden legendaris dari tradisi kultivasi surgawi kuno yang menyatukan pemahaman spiritualitas Dao tingkat tinggi dengan realitas kosmik.",
      history: "Mewakili kesadaran para kultivator surgawi dan kaum transenden. Menegaskan fakta sejarah bahwa 10.000 tahun lalu terjadi perang sengit antara kekuatan transenden dengan peradaban manusia yang berakhir dengan kekalahan kubu surgawi, mendorong mereka memilih posisi netral mutlak.",
      loreNotes: "Ejaan gelar 'Transeden Paragon Quanyun' diabadikan langsung dari naskah sumber primer sebagai bentuk penghormatan institusi terhadap kedaulatan kultivasi transenden."
    },
    {
      id: "nevin-roosevelt",
      code: "CHAR-05",
      name: "Nevin Roosevelt",
      title: "Pendiri The Company & Most High Complex Administrator",
      role: "Mantan Pemimpin Tertinggi Azis",
      image: "assets/images/nevin_roosevelt.jpg",
      origin: "Zograk Empire (Xpax-12)",
      status: "Abadi (True Immortal)",
      powerTier: "Tier 1: Higher Infinity",
      spouse: "Nia Ametia",
      badgeColor: "#10b981",
      stats: {
        intelek: 96,
        kebijaksanaan: 98,
        dayaHancur: 98,
        pengaruh: 100,
        pengalamanTahun: "70.000+"
      },
      quote: "Perang parit di Xpax-12 mengajarkanku satu hal: di bawah hujan peluru dan sihir, semua ilusi keangkuhan manusia lenyap seketika. Jika kita tidak menyatukan faksi-faksi ini, semesta hanya akan menjadi kuburan raksasa.",
      bio: "Prajurit sejati bermental baja yang lahir di Zograk Empire. Nevin merasakan secara langsung horor perang parit berlumpur selama Perang Dunia I di Xpax-12 sebelum mengalami Kematian Pertama bersama kedua sahabatnya.",
      history: "Direkrut oleh faksi Azis, Nevin menanamkan disiplin pertahanan yang tak tertembus selama 50 tahun dinas militer di Xpax-12 dan selamat dari penghancuran planet karena bertugas di garis luar. Selama 20.000 tahun ia menjaga stabilitas hingga revolusi membawanya menjadi pimpinan tertinggi faksi Azis. Menjadi salah satu dari tiga pilar agung pendiri The Company.",
      loreNotes: "Menikahi Nia Ametia. Nevin mengakui dengan jujur bahwa sang istri, kendati berpenampilan manusia biasa, memiliki kekuatan yang secara mengejutkan kerap melampaui kapasitasnya sendiri."
    },
    {
      id: "nia-ametia",
      code: "CHAR-06",
      name: "Nia Ametia",
      title: "Entitas Anomali & Pencetus Teori Sang Narator",
      role: "Pendamping Nevin Roosevelt",
      image: "assets/images/nia_ametia.jpg",
      origin: "Tidak Terklasifikasi / Misteri Eksistensial",
      status: "Manusia Semu / Anomali Metafiksi",
      powerTier: "Tak Terdefinisi (Potensi Melampaui Tier 1)",
      spouse: "Nevin Roosevelt",
      badgeColor: "#f43f5e",
      stats: {
        intelek: 99,
        kebijaksanaan: 100,
        dayaHancur: "???",
        pengaruh: 93,
        pengalamanTahun: "Misterius"
      },
      quote: "Kalian menghitung triliunan tahun dan menyusun hierarki bintang... tapi bagaimana jika seluruh galaksi megah ini hanyalah sebaris kalimat yang sedang diketik oleh seseorang di luar sana?",
      bio: "Sosok wanita misterius yang secara visual dan interaksi harian tampak seperti wanita manusia biasa yang anggun dan bersahaja. Namun di balik kelembutannya, tersimpan anomali kekuatan yang menembus batas kalkulasi telemetri The Company.",
      history: "Nevin Roosevelt sendiri mengaku bingung menentukan klasifikasi eksistensinya. Terkadang kekuatannya terdeteksi melampaui batasan Tier 1 milik sang suami. Nia adalah sosok yang memicu diskusi eksistensial paling mencengangkan dalam sejarah The Company: hipotesis bahwa semesta ini dikendalikan dan ditulis oleh seorang entitas maha gaib bernama 'Sang Narator'.",
      loreNotes: "Arsip The Company secara resmi mencatat statusnya sebagai 'Dugaan Non-Verifikasi / Entitas Anomali Tertinggi'. Teori Narator miliknya menjadi penutup paling misterius dalam Jurnal Agung Sejarah Semesta."
    }
  ]
};

// =========================================================================
// MULTI-JOURNAL ARCHITECTURE (MASTER_LORE)
// Menyertakan Jurnal 01 (LORE_DATA), Jurnal 02, Jurnal 03, dan Jurnal 04
// =========================================================================

const MASTER_LORE = {
  activeJournal: "journal-01",
  journal01: LORE_DATA,

  // =========================================================================
  // JURNAL 02: JURNAL LANJUTAN SEMESTA THE COMPANY
  // =========================================================================
  journal02: {
    meta: {
      title: "Jurnal Lanjutan Semesta The Company",
      subtitle: "Arsip Lengkap Cerita yang Dibangun dalam Percakapan Ini",
      classification: "DOCUMENT REF: COMPANY-CONT-002 // CANON ARCHIVE",
      version: "Edisi Naratif Rekonstruksi v2.0",
      overview: "Dokumentasi komprehensif dua latar belakang penyintas kataklisma (Charlie Vinsen di 2BC3 & Arkan Nugraha di Cerdis-18), invasi 40 hari di TurCerturis-17, konflik asimetris dan duel 7 hari di Void Space antara Arkan melawan Vesnas, lompatan 30 tahun menuju konser biola, lamaran tak terduga, karakteristik humanis aparatur The Company, serta ekspansi tiga laboratorium riset (Libra, Helium, Azix Lab)."
    },

    comparisonTable: [
      {
        tokoh: "Charlie Vinsen",
        planet: "2BC3",
        latarKehancuran: "Penciptaan virus NX-13 sebagai respon terhadap elite global serakah. DNA Charlie tertanam di virus sehingga zombie tidak menyerangnya.",
        durasiSendiri: "50 Tahun",
        jalurTheCompany: "The Company Expedition &rarr; Pendiri & Pemimpin Libra Lab (High Complex Administrator)",
        statusAkhir: "Menikah dengan Kristen White (The Nihilux); merancang panggung konser biola Vesnas."
      },
      {
        tokoh: "Arkan Nugraha",
        planet: "Cerdis-18",
        latarKehancuran: "Kebocoran radioaktif & nuklir proyek tertutup elite global. Terpapar radiasi mutasi sehingga menjadi effectively immortal.",
        durasiSendiri: "35 Tahun",
        jalurTheCompany: "The Company Expedition &rarr; Anggota Helium Lab (Complex Administrator)",
        statusAkhir: "Menikah dengan Vesnas (The Sinister) setelah menyegelnya di Void Space dan konser biola."
      }
    ],

    sections: [
      {
        num: "01",
        title: "Fondasi Percakapan dan Karakter Organisasi The Company",
        tagline: "Keras dalam Kebijakan Institusi, Manusiawi dan Santai saat Beristirahat",
        content: `
          <p>Cerita-cerita baru dalam semesta The Company tidak berdiri terisolasi. Mereka beroperasi di bawah bayang-bayang monolit The Company—organisasi yang mewarisi DNA ekspansi, kalkulasi sumber daya, dan ketegasan administratif.</p>
          <div class="paradox-box">
            <div class="paradox-title">NUANSA REALISME ORGANISASI</div>
            <p>The Company bukanlah sekumpulan monster berdarah dingin tanpa jiwa. Saat bertugas, para Administrator berpikir pragmatis dan efisien; namun di luar jam tugas, mereka adalah manusia biasa yang bisa merasa malas, bercanda, menikmati makanan, dan memiliki kehidupan emosional normal.</p>
          </div>
          <p>Kekuatan seorang <strong>Complex Administrator</strong> sangat kolosal: pelepasan kekuatan secara penuh di sebuah planet berisiko meremukkan struktur tektonik dan biosfer planet itu sendiri. Inilah alasan mendasar mengapa bawahan Arkan di TurCerturis-17 sangat cemas ketika Arkan berniat turun tangan langsung.</p>
        `,
        originalSnippet: `The Company bukan sekadar nama baru. Ia membawa warisan lama: ekspansi, perebutan sumber daya, Project Expedition... Saat bertugas, banyak dari mereka berpikir secara pragmatis; di luar pekerjaan, mereka tetap dapat bercakap, bercanda, makan, beristirahat, dan bertindak seperti manusia biasa.\nDi dalam struktur ini, Complex Administrator memiliki kekuatan yang sangat besar. Pelepasan kekuatan secara langsung di sebuah planet dapat berubah menjadi ancaman bagi keberlangsungan planet itu sendiri.`
      },
      {
        num: "02 - 04",
        title: "Charlie Vinsen & Project The New Order (Planet 2BC3)",
        tagline: "Virus NX-13, Logika DNA Pengenal, dan 50 Tahun Kesendirian",
        content: `
          <p>Di planet <strong>2BC3</strong>, pemerintahan elite global bertindak sewenang-wenang dan mengorbankan rakyat demi kekuasaan. Charlie Vinsen memandang krisis ini dari sudut pandang biologis yang radikal:</p>
          <div class="callout-quote">
            <em>“Mereka boleh berkuasa, tapi jika manusia dijangkiti suatu virus dan sampai otaknya dikendalikan virus, apa yang akan terjadi? Apakah pemerintahan elite mereka bisa menundukkan mayat hidup yang lapar? Jelas tidak.”</em>
          </div>
          <p>Charlie menciptakan <strong>NX-13</strong>, virus zombie pemusnah peradaban. Namun Charlie menanamkan sekuens DNA pribadinya ke dalam rancangan molekuler virus, sehingga seluruh mutan zombie mengenali Charlie sebagai bagian dari kawanan yang haram diserang.</p>
          <p>Seluruh umat manusia di 2BC3 punah. Charlie bertahan sendirian di planet mati tersebut selama <strong>50 tahun</strong>. Setelah setengah abad hening, ia memancarkan sinyal ke luar angkasa. Sinyal itu direspons oleh Tim Ekspedisi The Company. Menyadari tak ada lagi yang tersisa di 2BC3, Charlie bergabung dan kelak mendirikan <strong>Libra Lab</strong>.</p>
        `,
        originalSnippet: `Charlie memandang situasi itu bukan sekadar sebagai krisis pemerintahan, melainkan sebagai persoalan biologis... virus zombie buatan Charlie NX-13... Charlie memasukkan DNA miliknya sendiri ke dalam rancangan virus tersebut... zombie tidak menyerang Charlie... Seluruh manusia di 2BC3 hilang. Charlie bertahan seorang diri selama 50 tahun... Sinyal ditangkap The Company... Charlie bergabung dan mendirikan Libra Lab.`
      },
      {
        num: "05 - 07",
        title: "Arkan Nugraha & Tragedi ManEater (Planet Cerdis-18)",
        tagline: "Kebocoran Radiasi Nuklir, Keabadian Radiatif, dan 35 Tahun Menanti",
        content: `
          <p>Kisah Arkan Nugraha berakar di planet <strong>Cerdis-18</strong>. Berbeda dengan Charlie yang menjadi arsitek kiamat, Arkan adalah korban yang terperangkap dalam bencana buatan kaum penguasa:</p>
          <div class="warning-dossier">
            <strong>DOKUMENTASI BENCANA CERDIS-18:</strong>
            “Elite global dan para petinggi pemerintah berusaha menutup-nutupi proyek nuklir dan radioaktif rahasia mereka. Namun kebocoran katastropik memicu mutasi ganas pada fauna liar dan memunahkan populasi manusia di seluruh planet.”
          </div>
          <p>Arkan menyerap dosis radiasi masif yang secara ganjil merekonfigurasi fisiologi selnya menjadi <strong>effectively immortal</strong> (kebal terhadap kematian alami dan penuaan). Ia bertarung melawan monster-monster mutan dan bertahan hidup seorang diri selama <strong>35 tahun</strong> di reruntuhan Cerdis-18.</p>
          <p>Ketika sinyalnya terdeteksi The Company, Arkan dievakuasi dan diserap ke dalam <strong>Helium Lab</strong>, menanjak karirnya hingga memegang status prestisius sebagai <strong>Complex Administrator</strong>.</p>
        `,
        originalSnippet: `Arkan Nugraha berasal dari planet Cerdis-18... bencana kebocoran radioaktif dan nuklir... proyek dan ambisi bodoh elite membuat umat manusia punah... Arkan menyerap paparan radiasi, menjadi effectively immortal... bertahan seorang diri selama 35 tahun... bergabung dengan The Company dan masuk ke Helium Lab sebagai Complex Administrator.`
      },
      {
        num: "08 - 11",
        title: "Konflik TurCerturis-17 & Dendam Asimetris Vesnas",
        tagline: "Perang 40 Hari, Sabotase Artileri, dan Amarah Manusia Sinister",
        content: `
          <p>The Company mengirim Arkan dalam armada ekspedisi ke planet <strong>TurCerturis-17</strong>, sebuah dunia berperadaban feodal/medieval. Perang terbuka penaklukan hanya berlangsung kilat selama <strong>40 hari</strong>, disusul pembentukan pemerintahan parlementer boneka.</p>
          <p>Di planet ini, Arkan berhadapan dengan <strong>Vesnas</strong>—seorang manusia dari sub-kelompok <em>Sinister</em> yang menjadi agen/bawahan langsung dari <strong>Iris (Goddess of Envy)</strong>. Vesnas bertekad memulihkan kedaulatan planetnya dengan kekuatannya sendiri.</p>
          <div class="grid-two">
            <div class="lore-box">
              <h4>Sikap Arkan (Pragmatisme Administratif)</h4>
              <p>Arkan tidak memiliki kebencian pribadi terhadap Vesnas. Baginya, operasi ini murni penugasan dinas demi mengamankan kepentingan The Company.</p>
            </div>
            <div class="lore-box">
              <h4>Sikap Vesnas (Kebencian Personal yang Meledak)</h4>
              <p>Vesnas memandang Arkan sebagai simbol imperialisme perusak. Kebenciannya mencapai titik kulminasi setelah insiden sabotase komunikasi.</p>
            </div>
          </div>
          <div class="critical-moment">
            <strong>TITIK BALIK PETAKA:</strong> Pejuang lokal pemberontak berencana mencuri artileri The Company untuk membombardir markas militer. Arkan melakukan sabotase frekuensi komunikasi musuh; akibatnya koordinasi kacau dan tembakan artileri melenceng telak menghantam kamp kerja paksa warga lokal TurCerturis-17. Pasukan The Company sendiri telah ditarik Arkan lebih awal. Bagi Vesnas, ini adalah kejahatan tak termaafkan.
          </div>
        `,
        originalSnippet: `Perang TurCerturis-17 berlangsung selama 40 hari... Vesnas = manusia Sinister, antek Iris (Goddess of Envy)... Konflik asimetris: Vesnas membenci Arkan, Arkan hanya menjalankan tugas... Sabotase komunikasi membuat artileri pemberontak mengenai kamp kerja paksa warga lokal... kebencian Vesnas terhadap Arkan meledak.`
      },
      {
        num: "12 - 14",
        title: "True Form, Duel 7 Hari di Void Space & Janji Sepuluh Tahun",
        tagline: "Bentrokan Skala Planet, Ketahanan Mutlak Arkan, dan Lompatan 30 Tahun",
        content: `
          <p>Terdorong murka dahsyat, Vesnas melepaskan <strong>True Form</strong> dan kekuatan Goddess-nya, melancarkan serangan destruktif ke markas ekspedisi The Company. Personel berguguran.</p>
          <p>Melihat personel manusia terlatih—yang dipandang sebagai aset berharga mahal—dibantai, Arkan memutuskan turun tangan secara langsung. Sadar bahwa benturan kekuatan tingkat Administrator dapat membelah planet TurCerturis-17, Arkan membuka gerbang dimensi <strong>Void Space</strong> (dimensi yang sama tempat Iris pernah disegel selama 2.000 tahun) dan menyeret duel ke sana.</p>
          <ul class="sci-list">
            <li><strong>Duel Maraton 7 Hari:</strong> Vesnas menghujani Arkan dengan badai serangan ofensif maksimal tanpa jeda. Arkan secara tenang memilih strategi pertahanan mutlak tanpa membuang tenaga.</li>
            <li><strong>Kemenangan Daya Tahan:</strong> Di hari ketujuh, energi dan stamina Vesnas terkuras habis. Arkan melumpuhkannya dengan mudah.</li>
            <li><strong>Mantra Penyegelan:</strong> Arkan mengunci Vesnas di Void Space. Sebelum tersegel, Vesnas berseru: <em>“Datanglah ke acaraku sepuluh tahun lagi. Aku akan memainkan biola, dan aku akan kembali untuk mengalahkanmu!”</em> Arkan hanya mengangguk tenang.</li>
          </ul>
          <p><strong>Lompatan 30 Tahun:</strong> Arkan begitu tenggelam dalam kesibukan penelitian di Helium Lab hingga melupakan janjinya. Charlie Vinsen datang menegur: <em>“Kau lupa sesuatu, Arkan?”</em> Arkan tersentak, bergegas membuka segel Void Space, dan melempar tas biola ke hadapan Vesnas yang terbangun dengan rasa gentar atas jurang kekuatan mereka.</p>
        `,
        originalSnippet: `Vesnas melepaskan True Form dan menyerang markas... Arkan turun tangan untuk melindungi personel sebagai aset berharga mahal... Arkan membuka Void Space agar planet tidak hancur... Duel berlangsung 1 minggu penuh tanpa henti; Arkan bertahan sampai stamina Vesnas habis... Arkan menyegel Vesnas... Janji 10 tahun bermain biola... Lompatan 30 tahun: Charlie mengingatkan Arkan... Arkan membebaskan Vesnas dan melempar biola.`
      },
      {
        num: "15 - 16",
        title: "Panggung Charlie, Konser Biola & Lamaran Mendadak Arkan",
        tagline: "Dari Nada Biola Menuju Altar Pernikahan",
        content: `
          <p>Vesnas meminta bantuan Charlie Vinsen untuk membangun panggung pertunjukan. Kendati awalnya enggan dan malas, Charlie tetap mengurus perizinan resmi ke otoritas The Company demi sahabatnya.</p>
          <p>Konser biola digelar meriah di hadapan para Complex dan High Complex Administrator. Nada-nada gesekan biola Vesnas memukau seisi aula. Saat pertunjukan berakhir, semua bertepuk tangan kecuali Arkan—yang tetap siaga karena mengingat janji Vesnas untuk menyerangnya.</p>
          <div class="coffee-scene-card">
            <p>Namun Vesnas justru melangkah tenang dan duduk di sebelah Arkan. Terjadilah dialog legendaris yang mengubah takdir keduanya:</p>
            <div class="dialogue-box">
              <div class="chat-row vin"><span class="speaker">VESNAS:</span><p>“Bagaimana permainanku?”</p></div>
              <div class="chat-row nevin"><span class="speaker">ARKAN:</span><p>“Ya cukup baik, setidaknya untuk saat ini.”</p></div>
              <div class="chat-row vin"><span class="speaker">VESNAS:</span><p>“Apa maksudmu untuk saat ini?”</p></div>
              <div class="chat-row nevin"><span class="speaker">ARKAN:</span><p>“Dasar Sinister... <em>Tomorrow will be a good day, I promise.</em>”</p></div>
              <div class="chat-row vin"><span class="speaker">VESNAS:</span><p>“Apaan sih, udah kayak mau melamarku saja.”</p></div>
              <div class="chat-row nevin"><span class="speaker">ARKAN:</span><p>“Ya kamu kan mungkin akan menjadi ibu dari anakku.”</p></div>
              <div class="chat-row vin"><span class="speaker">VESNAS:</span><p>“Bisa aja kau ini menggodaku... Jadi kau serius melamarku?”</p></div>
              <div class="chat-row nevin"><span class="speaker">ARKAN:</span><p>“Sedari awal aku tidak pernah bilang tidak serius. Ya sudahlah, besok siapkan gaun pengantinmu.”</p></div>
            </div>
          </div>
          <p>Arkan berdiri dan melangkah pergi dengan ekspresi datar khas birokrat. Ruangan gempar riuh; para Administrator wanita mengerumuni Vesnas memberi ucapan selamat. Hubungan yang diawali kebencian dan perang pun bermuara pada pernikahan sakral.</p>
        `,
        originalSnippet: `Charlie menyiapkan panggung setelah mendapat izin The Company... Konser biola sukses; semua bertepuk tangan kecuali Arkan yang waspada... Vesnas duduk di sebelah Arkan... Arkan melamar: 'Tomorrow will be a good day, I promise... Ya kamu kan mungkin akan menjadi ibu dari anakku... Ya sudahlah besok siapkan gaun pengantinmu.'... Keduanya akhirnya menikah.`
      },
      {
        num: "17 - 20",
        title: "Tiga Laboratorium Raksasa & Proyek Lone Trail Heptaseas",
        tagline: "Libra Lab, Helium Lab, Azix Lab, dan Sinergi Sains Antarbintang",
        content: `
          <p>Struktur riset dan inovasi The Company ditopang oleh <strong>Tiga Laboratorium Utama</strong> yang dipimpin oleh para High Complex Administrator terkemuka:</p>
          <div class="factions-dossier-grid">
            <div class="faction-card faction-foundation">
              <h3>LIBRA LAB</h3>
              <span class="badge-role">Pendiri & Leader: Charlie Vinsen (High Complex Administrator)</span>
              <p>Pusat riset bio-rekayasa terdepan, virologi eksotis (pengembang NX-13), dan persenjataan adaptif.</p>
            </div>
            <div class="faction-card faction-azis">
              <h3>HELIUM LAB</h3>
              <span class="badge-role">Pendiri: Kristen White | Anggota: Arkan Nugraha</span>
              <p>Laboratorium spesialis fisika radioaktif, isolasi energi kosmik, dan ketahanan material berperingkat tinggi.</p>
            </div>
            <div class="faction-card faction-imperium">
              <h3>AZIX LAB</h3>
              <span class="badge-role">Leader: Kevin Viano (High Complex Administrator)</span>
              <p>Pusat pengembangan teknologi pertahanan warp, manipulasi gravitasi, dan analisis sampel antarbintang.</p>
            </div>
          </div>
          <div class="callout-quote">
            <strong>KOLABORASI LONE TRAIL HEPTASEAS:</strong> Tiga laboratorium ini mengumumkan proyek akbar terpadu bernama <em>Lone Trail Heptaseas</em> untuk mengeksplorasi dan memanfaatkan sistem bintang baru yang ditemukan armada ekspedisi The Company.
          </div>
        `,
        originalSnippet: `Tiga lab di bawah The Company: Libra Lab (Charlie Vinsen), Helium Lab (Kristen White & Arkan Nugraha), Azix Lab (Kevin Viano)... Kolaborasi dalam proyek 'Lone Trail Heptaseas'... Tiga Most High Complex Administrator menyerahkan detail kerja kepada para leader lab.`
      }
    ]
  },

  // =========================================================================
  // JURNAL 03: SOLO VS SQUAD (PERJALANAN CHARLIE VINSEN)
  // =========================================================================
  journal03: {
    meta: {
      title: "Solo Vs Squad: Jurnal Lengkap Perjalanan Charlie Vinsen",
      subtitle: "Dari Perintah Tiga Most High Complex Administrator hingga Lahirnya Helium Lab",
      classification: "DOCUMENT REF: COMPANY-SOLO-003 // CANON STORY",
      version: "Arsip Taktis Mandiri v1.8",
      overview: "Dokumentasi operasi perburuan mandiri Charlie Vinsen atas titah langsung Vin Alvian, Nikolas Enstain, dan Nevin Roosevelt untuk mengeliminasi lima Potential God yang tersebar di berbagai galaksi. Berlangsung sebelum era TurCerturis-17, mencatat durasi bentrokan, persenjataan legendaris, serta rekonsiliasi yang melahirkan Helium Lab."
    },

    loadout: {
      pilot: "Charlie Vinsen (High Complex Administrator)",
      weapons: [
        { name: "Iron Sword - Full Potential", type: "Senjata Tajam Kosmik", desc: "Pedang tempaan padat berkekuatan puncak yang mampu membelah materi berenergi tinggi." },
        { name: "Classic M16 - Max Potential Cosmic", type: "Senjata Api Realitas", desc: "Senapan serbu balistik yang diinfus dengan energi kosmik berdensitas mutlak." }
      ],
      methodology: "Operasi Solo Kosmik (Tanpa Pasukan Ekspedisi demi Efisiensi Mobilitas Lintas Galaksi)",
      targetNature: "Kelima Potential God memiliki keabadian umur/usia (biological agelessness), namun tetap rentan terhadap luka fisik dan dapat dibunuh."
    },

    bossEncounters: [
      {
        num: "01",
        target: "Jhon Hexson",
        title: "The Barracuda / The Sultan Of Desert",
        location: "Planet Gurun Tandus Ekstrim",
        duration: "8 Jam Pertarungan",
        quote: "“Here it is, The Sultan Of Desert The Barracuda (Jhon Hexson).”",
        result: "DIELIMINASI (DECEASED)",
        color: "#f59e0b",
        desc: "Bentrokan sengit selama 8 jam di padang pasir kosmik. Charlie berhasil melumpuhkan Barracuda dan menawarkan opsi negosiasi: bekerja sama atau bergabung dengan The Company. Jhon Hexson menolak dengan arogan. Charlie tersenyum dingin dan mengeksekusinya di tempat."
      },
      {
        num: "02",
        target: "Chixian",
        title: "The Timeline Cutter",
        location: "Zona Anomali Temporal",
        duration: "4 Jam Pertarungan",
        quote: "“The Most Beautiful Woman I think, Yes You The Timeline Cutter Chixian.” — Charlie Vinsen",
        result: "DIELIMINASI (DECEASED)",
        color: "#06b6d4",
        desc: "Menghadapi manipulasi waktu selama 4 jam penuh. Meskipun Charlie mengakui parasnya yang luar biasa jelita, profesionalisme misi tetap didahulukan. Tawaran bergabung ditolak mentah-mentah oleh Chixian, berujung pada eksekusi fatal oleh pedang Charlie."
      },
      {
        num: "03",
        target: "Vesnas",
        title: "The Sinister (Minion of Goddess of Envy)",
        location: "Domain Alam Rahasia (Pra-TurCerturis-17)",
        duration: "12 Jam Pertarungan",
        quote: "“I think you the Sinister or Goddess of Envy's minions, right? Yes you The Sinister, Vesnas.” — Charlie Vinsen",
        result: "MELARIKAN DIRI (SURVIVED)",
        color: "#ec4899",
        desc: "Pertarungan intens 12 jam. Vesnas menolak tawaran The Company dan terdesak hingga kehabisan darah dan energi. Pada titik kritis, Vesnas berhasil mengelabui Charlie dengan tipu daya ilusi lalu kabur. Charlie tidak mengejarnya karena menduga luka parahnya akan merenggut nyawanya—sebuah takdir yang kelak mempertemukan Vesnas dengan Arkan Nugraha."
      },
      {
        num: "04",
        target: "The Mutant",
        title: "Manusia Hasil Mutasi Radioactive Magic",
        location: "Zona Limbah Radioaktif Liar",
        duration: "1 Menit 35 Detik",
        quote: "“Just a human who happened to mutate due to radioactive magic, Yes You The Mutant.” — Charlie Vinsen",
        result: "DIELIMINASI INSTAN (DECEASED)",
        color: "#84cc16",
        desc: "Berbeda dari target cerdas lainnya, entitas ini adalah monster buas tanpa akal budi. Tanpa adanya ruang diplomasi atau proses negosiasi, Charlie langsung membinasakannya dalam waktu kilat 1 menit 35 detik."
      },
      {
        num: "05",
        target: "The Nihilux (Kristen White)",
        title: "Wanita Berpola Pikir Nihilistik Mutlak",
        location: "Kubah Kehampaan Es",
        duration: "30 HARI MARATON",
        quote: "“I don't know the exact nature of her nihilistic mindset, but I can't deny that she is indeed the coldest, most reserved woman I have ever met, Yes You The Nihilux.” — Charlie Vinsen",
        result: "MENYERAH & BERGABUNG DENGAN THE COMPANY",
        color: "#38bdf8",
        desc: "Duel terpanjang dan terberat sepanjang karir Charlie. Berlangsung selama satu bulan penuh tanpa henti. Di akhir duel, The Nihilux meminta Charlie menghentikan serangannya dan menyatakan kesediaan bergabung dengan The Company—menjadi satu-satunya dari lima target yang menerima tawaran tersebut."
      }
    ],

    aftermath: {
      identityReveal: "The Nihilux mengungkap identitas aslinya sebagai **Kristen White**. Ia mengabdi dengan loyalitas tinggi pada The Company dan meraih posisi bergengsi **High Complex Administrator** (setara dengan pangkat Charlie Vinsen).",
      birthOfHeliumLab: "Atas izin dan restu langsung dari Most High Complex Administrator **Nevin Roosevelt**, Kristen White mendirikan **Helium Lab**, yang kelak menjadi rumah penelitian bagi Arkan Nugraha.",
      iconicEnding: "Perjalanan Solo Vs Squad ditutup dengan adegan puitis nan simbolik: *Iron Sword - Full Potential* milik Charlie dan *Nihilix Blade* milik Kristen ditancapkan menyilang di atas tanah, diiringi dua cincin pernikahan yang bersanding rapat—menyatukan dua bilah yang dahulu beradu darah dalam ikatan suci rumah tangga."
    }
  },

  // =========================================================================
  // JURNAL 04: ARSIP INSTITUSI THE COMPANY
  // =========================================================================
  journal04: {
    meta: {
      title: "Arsip Institusi The Company",
      subtitle: "Sejarah Pembubaran 4 Institusi Militer Lama & Susunan 5 Institusi yang Bertahan",
      classification: "DOCUMENT REF: COMPANY-INST-004 // STRATEGIC DOSSIER",
      version: "Dokumen Tata Kelola Militer & Sipil Terpadu",
      overview: "Dokumentasi dekonstruksi empat faksi militer internal yang saling berperang, krisis perang pembentukan The Company Defense Force (TCDF), pencegahan intervensi Nevin Roosevelt oleh Nia Ametia, rehabilitasi komando Centurion of Anarchy, serta cetak biru lima pilar institusi permanen (TCDF, Classic Mamber, TPCDF, Startech Academy, LDET) dan tiga laboratorium sains."
    },

    dissolvedFactions: [
      {
        name: "Librerium Army Of Company",
        karakteristik: "Menjunjung tinggi kebebasan dan independensi mutlak.",
        masalah: "Keras kepala dan enggan terikat rantai komando. Terkadang bahkan titah Most High Complex Administrator pun tidak mereka indahkan.",
        status: "DIBUBARKAN TOTAL",
        color: "#06b6d4"
      },
      {
        name: "Demokratik Military The Company Defense Force",
        karakteristik: "Berbasis struktur militer demokratis konstitusional.",
        masalah: "Cenderung birokratis lamban dan sering berselisih ideologi terbuka dengan faksi militer garis keras lainnya.",
        status: "DIBUBARKAN TOTAL",
        color: "#3b82f6"
      },
      {
        name: "Sami Foundation",
        karakteristik: "Gerakan militer paling fasis, ultra-nasionalis faksi, dan berdisiplin baja.",
        masalah: "Sangat loyal pada pimpinan di atas kertas, namun di planet jajahan kerap mengabaikan komando lapangan. Tercatat pernah membantai 90% populasi sebuah planet koloni tanpa otorisasi.",
        status: "DIBUBARKAN TOTAL",
        color: "#f59e0b"
      },
      {
        name: "Centurion Of Anarchy",
        karakteristik: "Paling brutal dan sadis; disamakan perilakunya dengan 'Crossed', namun beradab dan berpendidikan tinggi.",
        masalah: "Membunuh demi kepuasan personal. Mengabaikan perintah pimpinan pusat dan melakukan genosida di berbagai planet koloni yang menimbulkan kerugian material besar bagi The Company.",
        status: "DIBUBARKAN & DIREHABILITASI",
        color: "#ef4444"
      }
    ],

    theTCDFWar: {
      pemicu: "Tiga Most High Complex Administrator (Vin, Nikolas, Nevin) menginginkan militer yang terpusat, profesional, dan stabil. Mereka membentuk The Company Defense Force (TCDF).",
      perlawanan: "Keempat institusi militer lama menolak menyerahkan hegemoni mereka dan secara resmi mendeklarasikan perang terbuka melawan TCDF.",
      koalisiTCDF: "TCDF yang baru dibentuk mendapat sokongan logistik dan persenjataan penuh dari Libra Lab, Helium Lab, Azix Lab, Classic Mamber Of Company, dan The Planet Colonial Defense Force.",
      intervensiNiaNevin: "Nia Ametia bersiap turun tangan langsung memadamkan pemberontakan. Menyadari bahwa kehadiran Nia akan memancing amarah Nevin Roosevelt—yang jika sampai turun ke medan perang akan membawa kehancuran mengerikan—keempat faksi lama seketika menyerah dan perang berakhir kilat.",
      penangananPersonel: "Personel diberi kebebasan bergabung ke TCDF atau alih profesi. Khusus mantan perwira Centurion of Anarchy (yang jenius dan berpendidikan tinggi), mereka wajib menjalani karantina dan rehabilitasi psikologis singkat sebelum diintegrasikan kembali."
    },

    standingInstitutions: [
      {
        id: "tcdf",
        name: "The Company Defense Force (TCDF)",
        peran: "Satu-satunya institusi kemiliteran resmi The Company.",
        lingkup: "Pertahanan teritorial antarbintang, armada tempur utama, penegakan keamanan galaksi.",
        badge: "MILITER UTAMA",
        icon: "🛡️"
      },
      {
        id: "classic-mamber",
        name: "Classic Mamber Of Company",
        peran: "Entitas kehidupan masyarakat sipil The Company.",
        lingkup: "Warga sipil yang bebas memilih profesi (guru, ilmuwan, editor, kreator konten, pengusaha) layaknya warga negara modern tanpa wajib militer.",
        badge: "MASYARAKAT SIPIL",
        icon: "👥"
      },
      {
        id: "tpcdf",
        name: "The Planet Colonial Defense Force (TPCDF)",
        peran: "Garda pertahanan dan penjaga planet jajahan yang berdamai.",
        lingkup: "Khusus bertugas di planet jajahan yang memilih tunduk secara damai dan setia kepada The Company. Personelnya merupakan gabungan pasukan lokal dan The Company.",
        badge: "PERTAHANAN KOLONI",
        icon: "🌍"
      },
      {
        id: "startech",
        name: "Startech Academy",
        peran: "Institusi pendidikan raksasa terbesar dan paling prestisius.",
        lingkup: "100% Gratis dan terbuka untuk semua orang, dari jenjang PAUD hingga universitas tertinggi. Menerima siapa saja tanpa syarat riwayat pendidikan formal sebelumnya, termasuk mendirikan kampus di planet-planet jajahan.",
        badge: "AKADEMI GRATIS",
        icon: "🎓"
      },
      {
        id: "ldet",
        name: "Long Destination Expedition Team (LDET)",
        peran: "Garda depan penjelajah galaksi ratusan tahun cahaya.",
        lingkup: "Mencari planet-planet baru yang berpenghuni maupun planet tandus kaya mineral (seperti Mars) untuk diklaim, ditambang, dan dikolonisasi. Hasil temuannya diserahkan kepada para saintis Libra, Helium, dan Azix Lab.",
        badge: "EKSPEDISI ANTARBINTANG",
        icon: "🚀"
      }
    ]
  }
};

window.MASTER_LORE = MASTER_LORE;
window.LORE_DATA = LORE_DATA;

