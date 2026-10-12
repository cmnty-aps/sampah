export interface CommandItem {
  name: string;
  aliases?: string[];
  desc: string;
  usage?: string;
  isOwner?: boolean;
  isAdmin?: boolean;
}

export interface CommandCategory {
  id: string;
  name: string;
  badge: string;
  emoji: string;
  commands: CommandItem[];
}

export const MENU_CATEGORIES: CommandCategory[] = [
  {
    id: "owner",
    name: "Owner Menu",
    badge: "Owner",
    emoji: "👑",
    commands: [
      { name: "ping", desc: "Cek latensi respon bot dan kecepatan server", usage: ".ping", isOwner: true },
      { name: "self", aliases: ["selfmode", "private-mode"], desc: "Ubah bot menjadi mode pribadi (hanya owner)", usage: ".self", isOwner: true },
      { name: "public", aliases: ["publicmode"], desc: "Kembalikan bot ke mode publik untuk semua orang", usage: ".public", isOwner: true },
      { name: "onlygc", aliases: ["onlygroup", "grouponly"], desc: "Atur bot agar hanya merespon di grup", usage: ".onlygc", isOwner: true },
      { name: "onlypc", aliases: ["onlyprivate", "privateonly"], desc: "Atur bot agar hanya merespon di chat pribadi", usage: ".onlypc", isOwner: true },
      { name: "onlythisgrup", aliases: ["onlythisgroup", "lockgrup"], desc: "Kunci bot agar hanya merespon di grup ini saja", usage: ".onlythisgrup", isOwner: true },
      { name: "autoread", desc: "Aktifkan atau nonaktifkan fitur auto read pesan", usage: ".autoread", isOwner: true },
      { name: "addowner", desc: "Tambah nomor pengguna sebagai owner bot", usage: ".addowner @tag / 628xxx", isOwner: true },
      { name: "delowner", desc: "Hapus nomor pengguna dari daftar owner", usage: ".delowner @tag / 628xxx", isOwner: true },
      { name: "listowner", desc: "Tampilkan seluruh daftar nomor owner bot", usage: ".listowner", isOwner: true },
      { name: "ban", aliases: ["block"], desc: "Blokir pengguna agar tidak dapat menggunakan bot", usage: ".ban @tag / 628xxx", isOwner: true },
      { name: "unban", aliases: ["delban", "unblock"], desc: "Buka blokir pengguna yang pernah diban", usage: ".unban @tag / 628xxx", isOwner: true },
      { name: "listban", aliases: ["listbanned", "banlist"], desc: "Tampilkan daftar semua pengguna yang diblokir", usage: ".listban", isOwner: true },
      { name: "buatgrup", aliases: ["creategroup", "newgroup"], desc: "Buat grup WhatsApp baru secara otomatis", usage: ".buatgrup Nama Grup", isOwner: true },
      { name: "buatsaluran", aliases: ["createsaluran", "createnewsletter"], desc: "Buat Saluran / Channel WhatsApp baru", usage: ".buatsaluran Nama Saluran", isOwner: true },
      { name: "upch", aliases: ["uploadch", "uploadsaluran", "uch"], desc: "Unggah teks atau media ke Saluran WhatsApp", usage: ".upch <link-ch> <teks>", isOwner: true },
      { name: "rch", desc: "Beri reaksi emoji pada postingan Saluran WhatsApp", usage: ".rch <link-post> <emoji>", isOwner: true },
      { name: "join", aliases: ["joingrup", "joingroup", "gabung"], desc: "Masukkan bot ke grup menggunakan tautan undangan", usage: ".join <link-grup>", isOwner: true },
      { name: "leave", aliases: ["leavegrup", "leavegroup", "keluar"], desc: "Perintahkan bot keluar dari grup saat ini", usage: ".leave", isOwner: true },
      { name: "swgc", aliases: ["statusgrup", "swgroup"], desc: "Buat Status WhatsApp dari pesan atau media grup", usage: ".swgc <caption/media>", isOwner: true },
      { name: "cancelswgc", desc: "Batalkan unggahan status WhatsApp grup", usage: ".cancelswgc", isOwner: true },
      { name: "autosholat", aliases: ["autoadzan", "sholat"], desc: "Pengingat waktu sholat 5 waktu otomatis", usage: ".autosholat on/off", isOwner: true }
    ]
  },
  {
    id: "group",
    name: "Group Menu",
    badge: "Grup",
    emoji: "👥",
    commands: [
      { name: "ht", aliases: ["h", "hidetag"], desc: "Tag seluruh member grup secara senyap", usage: ".ht <pesan>", isAdmin: true },
      { name: "h2", aliases: ["ht2", "hidetag2"], desc: "Gaya alternatif tag massal seluruh anggota grup", usage: ".h2 <pesan>", isAdmin: true },
      { name: "open", desc: "Buka grup agar seluruh member dapat mengirim pesan", usage: ".open", isAdmin: true },
      { name: "close", desc: "Tutup grup agar hanya admin yang dapat mengirim pesan", usage: ".close", isAdmin: true },
      { name: "opentime", desc: "Jadwalkan pembukaan grup otomatis setiap hari", usage: ".opentime 07:00", isAdmin: true },
      { name: "closetime", desc: "Jadwalkan penutupan grup otomatis setiap hari", usage: ".closetime 22:00", isAdmin: true },
      { name: "delopentime", desc: "Hapus jadwal pembukaan grup otomatis", usage: ".delopentime", isAdmin: true },
      { name: "delclosetime", desc: "Hapus jadwal penutupan grup otomatis", usage: ".delclosetime", isAdmin: true },
      { name: "cektime", desc: "Periksa pengaturan jadwal otomatis buka/tutup grup", usage: ".cektime" },
      { name: "kick", aliases: ["dor"], desc: "Keluarkan anggota yang melanggar aturan dari grup", usage: ".kick @tag", isAdmin: true },
      { name: "promote", desc: "Naikkan jabatan member menjadi admin grup", usage: ".promote @tag", isAdmin: true },
      { name: "demote", desc: "Turunkan admin menjadi member biasa", usage: ".demote @tag", isAdmin: true },
      { name: "afk", desc: "Pasang status AFK (Away From Keyboard) dengan alasan", usage: ".afk Sedang makan" },
      { name: "linkgc", aliases: ["linkgrup", "getlink", "gclink"], desc: "Dapatkan tautan resmi undangan grup", usage: ".linkgc" },
      { name: "resetlinkgc", aliases: ["resetlink", "revokelink", "newlink"], desc: "Tarik dan perbarui tautan undangan grup", usage: ".resetlinkgc", isAdmin: true },
      { name: "cekidgc", aliases: ["idgc", "idgrup", "groupid", "infogc"], desc: "Lihat ID JID grup dan rincian lengkap grup", usage: ".cekidgc" },
      { name: "cekonline", aliases: ["checkonline", "online", "whosonline"], desc: "Lihat siapa saja anggota grup yang sedang online", usage: ".cekonline" },
      { name: "topchat", aliases: ["chatstat", "chatstats", "leaderboard"], desc: "Papan peringkat member paling aktif di grup", usage: ".topchat" },
      { name: "mulaiabsen", aliases: ["startabsen", "bukaabsen", "openabsen"], desc: "Buka sesi daftar hadir absensi grup", usage: ".mulaiabsen [agenda]", isAdmin: true },
      { name: "absen", aliases: ["hadir"], desc: "Isi kehadiran pada sesi absensi yang sedang dibuka", usage: ".absen" },
      { name: "cekabsen", aliases: ["listabsen", "daftarabsen", "lihathadir"], desc: "Lihat daftar anggota yang sudah mengisi absen", usage: ".cekabsen" },
      { name: "hapusabsen", aliases: ["deleteabsen", "tutupabsen", "resetabsen"], desc: "Tutup dan bersihkan sesi absensi grup", usage: ".hapusabsen", isAdmin: true },
      { name: "intro", aliases: ["perkenalan", "selamatdatang"], desc: "Tampilkan format perkenalan untuk member baru", usage: ".intro" },
      { name: "setintro", aliases: ["setperkenalan", "introset"], desc: "Atur pesan kustom perkenalan untuk grup", usage: ".setintro <format>", isAdmin: true },
      { name: "resetintro", aliases: ["delintro", "deleteintro"], desc: "Kembalikan teks format perkenalan ke default", usage: ".resetintro", isAdmin: true },
      { name: "rulesgrup", aliases: ["grouprules", "aturangrup", "grules"], desc: "Tampilkan aturan dan tata tertib grup", usage: ".rulesgrup" },
      { name: "setrulesgrup", aliases: ["setgrouprules", "setaturangrup"], desc: "Simpan aturan tata tertib baru untuk grup", usage: ".setrulesgrup <aturan>", isAdmin: true },
      { name: "resetrulesgrup", aliases: ["resetgrouprules"], desc: "Reset aturan tata tertib grup ke bawaan", usage: ".resetrulesgrup", isAdmin: true },
      { name: "welcome", aliases: ["wc"], desc: "Aktifkan atau matikan pesan sambutan member baru", usage: ".welcome on/off", isAdmin: true },
      { name: "goodbye", aliases: ["gb"], desc: "Aktifkan atau matikan pesan pamitan member keluar", usage: ".goodbye on/off", isAdmin: true },
      { name: "setwelcome", desc: "Kustomisasi pesan teks selamat datang member", usage: ".setwelcome <teks>", isAdmin: true },
      { name: "setgoodbye", desc: "Kustomisasi pesan teks selamat jalan member", usage: ".setgoodbye <teks>", isAdmin: true },
      { name: "resetwelcome", desc: "Reset pesan welcome kembali ke format standar", usage: ".resetwelcome", isAdmin: true },
      { name: "resetgoodbye", desc: "Reset pesan goodbye kembali ke format standar", usage: ".resetgoodbye", isAdmin: true },
      { name: "testwelcome", aliases: ["testwelcomecard"], desc: "Uji kartu banner grafis sambutan member baru", usage: ".testwelcome", isAdmin: true },
      { name: "antilinkgc", aliases: ["antilinkwa", "algc", "antilinkgrup"], desc: "Sistem pengamanan dari tautan grup lain (auto kick)", usage: ".antilinkgc on/off", isAdmin: true },
      { name: "addantilink", aliases: ["addalink", "addblocklink"], desc: "Tambahkan tautan/domain ke daftar hitam larangan", usage: ".addantilink <link>", isAdmin: true },
      { name: "delantilink", aliases: ["remantilink", "delblocklink"], desc: "Hapus tautan/domain dari daftar hitam larangan", usage: ".delantilink <link>", isAdmin: true },
      { name: "listantilink", aliases: ["cekantilink", "antilinklist"], desc: "Tampilkan seluruh daftar tautan yang dilarang", usage: ".listantilink" }
    ]
  },
  {
    id: "download",
    name: "Downloader Menu",
    badge: "Unduhan",
    emoji: "📥",
    commands: [
      { name: "ytplay", aliases: ["play", "playmp3"], desc: "Cari dan unduh audio lagu YouTube MP3", usage: ".ytplay judul lagu" },
      { name: "ytplayvid", aliases: ["playvid", "playmp4"], desc: "Cari dan unduh video YouTube MP4", usage: ".ytplayvid judul video" },
      { name: "ytmp3", aliases: ["ytaudio", "youtubemp3"], desc: "Unduh audio MP3 langsung dari tautan YouTube", usage: ".ytmp3 <link-youtube>" },
      { name: "ytmp4", aliases: ["ytvideo", "youtubemp4"], desc: "Unduh video MP4 langsung dari tautan YouTube", usage: ".ytmp4 <link-youtube>" },
      { name: "splay", aliases: ["spotplay", "stifyplay"], desc: "Cari dan putar lagu resmi dari Spotify", usage: ".splay judul lagu" },
      { name: "spdl", aliases: ["spotifydl", "spotify-dl", "spotdl"], desc: "Unduh file lagu MP3 dari tautan Spotify", usage: ".spdl <link-spotify>" },
      { name: "tt", aliases: ["tiktok", "ttmp4", "tiktokdl", "ttdown"], desc: "Unduh video TikTok tanpa tanda air (no watermark)", usage: ".tt <link-tiktok>" },
      { name: "ttmp3", aliases: ["ttmusic", "tiktokmusic"], desc: "Unduh audio musik dari postingan TikTok", usage: ".ttmp3 <link-tiktok>" },
      { name: "ttplay", aliases: ["playtiktok", "tiktokplay"], desc: "Cari dan unduh video TikTok otomatis berdasarkan kata kunci", usage: ".ttplay kata kunci" },
      { name: "ig", aliases: ["instagram"], desc: "Unduh video Reels, foto postingan, atau story IG", usage: ".ig <link-instagram>" },
      { name: "fb", aliases: ["facebook", "fbdown", "facebookdl"], desc: "Unduh video Facebook resolusi HD / SD", usage: ".fb <link-facebook>" },
      { name: "tdl", aliases: ["threads", "threadsdl", "threaddl"], desc: "Unduh media video atau foto dari Threads", usage: ".tdl <link-threads>" },
      { name: "svdl", aliases: ["snackvideo", "snackvideodl", "sv"], desc: "Unduh video dari SnackVideo tanpa watermark", usage: ".svdl <link-snackvideo>" },
      { name: "ccdl", aliases: ["capcut", "capcutdl", "cc"], desc: "Unduh video template CapCut tanpa watermark", usage: ".ccdl <link-capcut>" },
      { name: "mfdl", aliases: ["mediafire", "mediafiredl", "mf"], desc: "Unduh file langsung dari tautan MediaFire", usage: ".mfdl <link-mediafire>" },
      { name: "githubdl", aliases: ["gitdl", "gitclone", "repodownload"], desc: "Unduh arsip .zip dari repositori publik GitHub", usage: ".githubdl user/repo" },
      { name: "videy", aliases: ["videydl"], desc: "Unduh file video dari platform Videy.co", usage: ".videy <link-videy>" },
      { name: "terabox", aliases: ["tb", "tera"], desc: "Unduh file atau video dari tautan TeraBox", usage: ".terabox <link-terabox>" }
    ]
  },
  {
    id: "sticker",
    name: "Sticker & Creator",
    badge: "Stiker",
    emoji: "🎨",
    commands: [
      { name: "s", aliases: ["sticker"], desc: "Ubah foto, video, atau GIF menjadi stiker WhatsApp", usage: ".s (balas/kirim media)" },
      { name: "swm", aliases: ["wm", "stickerwm", "stickermark", "colong"], desc: "Ganti watermark paket nama dan pembuat stiker", usage: ".swm Packname | Author" },
      { name: "toimg", aliases: ["toimage", "stickertoimage", "stimg"], desc: "Ekstrak stiker statis kembali menjadi gambar JPG", usage: ".toimg (balas stiker)" },
      { name: "smeme", aliases: ["memesticker", "memes"], desc: "Buat stiker meme dengan teks atas dan bawah", usage: ".smeme teks atas | teks bawah" },
      { name: "qc", aliases: ["quotechat", "quotedsticker"], desc: "Buat stiker gelembung kutipan chat ala Telegram", usage: ".qc teks obrolan" },
      { name: "attp", desc: "Buat stiker animasi teks warna-warni berkedip", usage: ".attp Halo Kawan" },
      { name: "emojimix", aliases: ["mixemoji", "emix"], desc: "Campurkan 2 emoji menjadi stiker unik baru", usage: ".emojimix 😭+🔥" },
      { name: "emojigif", desc: "Ubah emoji menjadi stiker animasi GIF bergerak", usage: ".emojigif 🚀" },
      { name: "stickerpack", aliases: ["sp", "stickersearch", "searchsticker"], desc: "Cari paket stiker WhatsApp berdasarkan kata kunci", usage: ".stickerpack anime" },
      { name: "pinpack", aliases: ["ppack", "pinsticker", "pinsearchpack"], desc: "Ambil koleksi pack stiker dari Pinterest", usage: ".pinpack kucing" },
      { name: "brat", aliases: ["brats"], desc: "Buat stiker gaya album Charli XCX Brat", usage: ".brat Teks Brat" },
      { name: "bratvid", aliases: ["bratvideo", "bratgif"], desc: "Buat stiker video teks animasi Brat bergerak", usage: ".bratvid Teks Animasi" },
      { name: "bratvid2", aliases: ["bratvideo2", "bratgif2"], desc: "Alternatif stiker teks animasi Brat versi kedua", usage: ".bratvid2 Teks Bergerak" },
      { name: "bratgirl", aliases: ["bratcewek", "cewekbrat"], desc: "Stiker Brat estetik nuansa pink", usage: ".bratgirl Teks Pink" },
      { name: "bratgreen", aliases: ["brat2"], desc: "Stiker Brat warna hijau neon khas", usage: ".bratgreen Teks Hijau" },
      { name: "bratanime", desc: "Stiker Brat dengan latar belakang karakter anime", usage: ".bratanime Teks Anime" },
      { name: "bratbahlil", desc: "Stiker meme Brat dengan foto Bahlil", usage: ".bratbahlil Teks Bahlil" },
      { name: "bratbearnad", aliases: ["bearnadbrat"], desc: "Stiker meme Brat beruang lucu", usage: ".bratbearnad Teks Beruang" },
      { name: "bratprabowo", aliases: ["bratwowo", "prabowobrat", "wowobrat"], desc: "Stiker meme Brat Presiden Prabowo", usage: ".bratprabowo Teks Prabowo" },
      { name: "bratmegawati", aliases: ["megawatibrat", "bratmega"], desc: "Stiker meme Brat Megawati", usage: ".bratmegawati Teks Mega" },
      { name: "bratvermeil", desc: "Stiker meme Brat karakter Vermeil in Gold", usage: ".bratvermeil Teks Vermeil" }
    ]
  },
  {
    id: "canvas",
    name: "Canvas & Photo FX",
    badge: "Canvas",
    emoji: "🖼️",
    commands: [
      { name: "iqc", desc: "Kutipan mutiara estetis bergaya Instagram Quote", usage: ".iqc Teks Kutipan Mutiara" },
      { name: "nulis", desc: "Tuliskan kalimatmu ke dalam buku bergaris realistis", usage: ".nulis Catatan PR Hari Ini" },
      { name: "fakeml", aliases: ["mlbbfake", "mlcard", "mlfake"], desc: "Generator kartu identitas profil Mobile Legends", usage: ".fakeml (balas gambar)" },
      { name: "fakeff", desc: "Generator kartu profil permainan Free Fire", usage: ".fakeff (balas gambar)" },
      { name: "fakebankjago", desc: "Tangkapan layar bukti saldo aplikasi Bank Jago palsu", usage: ".fakebankjago 5000000" },
      { name: "fakedana", desc: "Tangkapan layar saldo dan mutasi e-wallet DANA", usage: ".fakedana 1500000" },
      { name: "fakedev", desc: "Kartu pengenal Developer kartu nama digital", usage: ".fakedev Nama | Role" },
      { name: "fakestory", aliases: ["fstory", "igstory"], desc: "Tampilan story Instagram palsu untuk seru-seruan", usage: ".fakestory Teks story" },
      { name: "fakecall", aliases: ["fakecallwa"], desc: "Tangkapan layar panggilan telepon WhatsApp palsu", usage: ".fakecall Nama Penelepon" },
      { name: "fakektp", desc: "Generator KTP elektronik palsu untuk seru-seruan", usage: ".fakektp Nama|TempatLahir|TTL|..." },
      { name: "math", aliases: ["latex", "rumus"], desc: "Render penulisan rumus Matematika atau formula LaTeX", usage: ".math E=mc^2" },
      { name: "gura", aliases: ["gawr"], desc: "Template gambar meme VTuber Gawr Gura", usage: ".gura Teks Lucu" },
      { name: "wafat", aliases: ["rip"], desc: "Poster pengumuman duka cita dan bela sungkawa", usage: ".wafat Nama Almarhum" },
      { name: "pakustad", aliases: ["pak-ustad", "tanyaustad"], desc: "Gambar tanya jawab santai bersama Pak Ustadz", usage: ".pakustad Bolehkah begini?" },
      { name: "susu", desc: "Bingkai stiker minuman susu aesthetic viral", usage: ".susu (balas gambar)" },
      { name: "susutaro", desc: "Bingkai stiker minuman susu varian taro", usage: ".susutaro (balas gambar)" },
      { name: "wanted", desc: "Poster buronan One Piece dengan nominal harga buronan", usage: ".wanted (balas foto)" },
      { name: "notifwa", desc: "Gambar notifikasi pop-up pesan masuk WhatsApp", usage: ".notifwa Pengirim | Pesan" },
      { name: "notifwav2", desc: "Gambar notifikasi pesan WhatsApp versi modern", usage: ".notifwav2 Pengirim | Pesan" }
    ]
  },
  {
    id: "logo",
    name: "Logo Maker & Text FX",
    badge: "Logo",
    emoji: "🏷️",
    commands: [
      { name: "avengers", desc: "Efek teks logo pahlawan super The Avengers", usage: ".avengers Teks" },
      { name: "bear", desc: "Logo maskot kepala beruang garang", usage: ".bear Teks" },
      { name: "blackpink", desc: "Efek teks warna pink dan hitam khas Blackpink", usage: ".blackpink Teks" },
      { name: "cartoon-graffiti", aliases: ["graffiti"], desc: "Efek teks graffiti kartun warna-warni jalanan", usage: ".cartoon-graffiti Teks" },
      { name: "comic", desc: "Efek teks halaman buku komik klasik", usage: ".comic Teks" },
      { name: "glitch", desc: "Efek teks glitch berbayang cyber modern", usage: ".glitch Teks" },
      { name: "mascot", desc: "Logo tim esports maskot profesional", usage: ".mascot Teks" },
      { name: "naruto", desc: "Teks bergaya serial anime Naruto Shippuden", usage: ".naruto Teks" },
      { name: "pixel-glitch", desc: "Efek glitch bergaya pixel 8-bit retro", usage: ".pixel-glitch Teks" },
      { name: "pornhub", desc: "Efek teks dua warna hitam dan oranye khas", usage: ".pornhub Teks1 | Teks2" },
      { name: "windowspink", aliases: ["winpink", "windowpink", "winspink"], desc: "Efek retro tampilan Windows 98 serba pink", usage: ".windowspink Teks" }
    ]
  },
  {
    id: "ai",
    name: "AI & Transformation",
    badge: "AI",
    emoji: "🤖",
    commands: [
      { name: "toanime", desc: "Transformasi foto manusia/asli menjadi karakter anime", usage: ".toanime (balas foto)" },
      { name: "to3d", aliases: ["3d", "3dfy", "to3dmodel"], desc: "Ubah foto 2D menjadi model karakter 3D render", usage: ".to3d (balas foto)" },
      { name: "tochibi", aliases: ["chibi", "chibistyle"], desc: "Ubah foto menjadi karakter chibi kartun imut", usage: ".tochibi (balas foto)" },
      { name: "toblack", aliases: ["black", "hitamkan", "hitam", "tohitam"], desc: "Ubah estetika foto dan warna kulit menjadi gelap", usage: ".toblack (balas foto)" },
      { name: "toblonde", aliases: ["blonde"], desc: "Ubah warna rambut foto menjadi pirang (blonde)", usage: ".toblonde (balas foto)" }
    ]
  },
  {
    id: "tools",
    name: "Tools & Utilities",
    badge: "Alat",
    emoji: "🛠️",
    commands: [
      { name: "getppwhatsapp", aliases: ["getpp", "getppwa", "ppwa"], desc: "Dapatkan foto profil akun WhatsApp seseorang secara otomatis", usage: ".getppwhatsapp @tag / 628xxx" },
      { name: "rvo", aliases: ["readviewonce"], desc: "Buka dan simpan media sekali lihat (View-Once) dari chat", usage: ".rvo (balas media view-once)" },
      { name: "hd", aliases: ["hd2"], desc: "Tingkatkan resolusi gambar buram jadi sangat jernih (upscale)", usage: ".hd (balas foto)" },
      { name: "hdvid", aliases: ["hdvideo", "enhancevid"], desc: "Tingkatkan kualitas video buram menjadi resolusi tajam", usage: ".hdvid (balas video)" },
      { name: "blurface", aliases: ["sensorwajah", "blur"], desc: "Sensor otomatis wajah pada gambar demi menjaga privasi", usage: ".blurface (balas foto)" },
      { name: "removebg", aliases: ["nobg"], desc: "Hapus background foto secara otomatis menjadi transparan", usage: ".removebg (balas foto)" },
      { name: "tourl", aliases: ["upload", "catbox", "url"], desc: "Unggah media ke server online dan dapatkan tautan URL", usage: ".tourl (balas media)" },
      { name: "translate", aliases: ["tr"], desc: "Terjemahkan bahasa teks secara instan", usage: ".translate id halo kawan" },
      { name: "kodepos", aliases: ["carikodepos"], desc: "Cari kode pos kelurahan atau kecamatan di Indonesia", usage: ".kodepos nama daerah" },
      { name: "kalkulatormlbb", aliases: ["kalkulatorwr", "wrmlbb", "countwrmlbb"], desc: "Hitung total kemenangan match untuk target win rate ML", usage: ".kalkulatormlbb totalMatch wrSekarang wrTarget" },
      { name: "trackip", aliases: ["cekip", "iptrack"], desc: "Lacak data lokasi, kota, dan penyedia ISP alamat IP", usage: ".trackip 8.8.8.8" },
      { name: "ipwho", aliases: ["ip", "iplookup", "ipinfo"], desc: "Cek informasi rinci kepemilikan dan routing alamat IP", usage: ".ipwho 1.1.1.1" },
      { name: "lookup", aliases: ["dnslookup", "dns", "whois"], desc: "Periksa catatan DNS dan kepemilikan nama domain", usage: ".lookup google.com" },
      { name: "qrcustom", aliases: ["qrcode", "qr"], desc: "Buat kode QR kustom dari teks atau tautan", usage: ".qrcustom teks atau link" },
      { name: "readmore", aliases: ["selengkapnya", "spoiler"], desc: "Sisipkan tombol 'Baca Selengkapnya' pemisah teks", usage: ".readmore teksDepan | teksRahasia" },
      { name: "pastebin", aliases: ["paste", "pb"], desc: "Simpan teks panjang atau kode ke layanan Pastebin", usage: ".pastebin teks atau kodingan" },
      { name: "ptv", aliases: ["pvideo", "circlevideo"], desc: "Konversi video menjadi pesan video bulat WhatsApp (PTV)", usage: ".ptv (balas video)" },
      { name: "ssweb", aliases: ["screenshot", "ss", "webss"], desc: "Ambil tangkapan layar tampilan penuh suatu website", usage: ".ssweb https://google.com" },
      { name: "recordweb", aliases: ["recweb", "webrecord"], desc: "Rekam cuplikan animasi scrolling suatu website", usage: ".recordweb https://example.com" },
      { name: "web2zip", aliases: ["webtozip", "w2z"], desc: "Unduh seluruh source code aset halaman web (.zip)", usage: ".web2zip https://example.com" },
      { name: "webtoapk", aliases: ["web2apk"], desc: "Konversi website menjadi berkas installer aplikasi Android APK", usage: ".webtoapk https://example.com" },
      { name: "deploy", aliases: ["vercel"], desc: "Luncurkan halaman web statis langsung ke server Vercel", usage: ".deploy (balas file zip)" },
      { name: "spamngl", aliases: ["nglspam"], desc: "Kirim pesan beruntun ke tautan NGL.link seseorang", usage: ".spamngl <url> <jumlah> <pesan>" },
      { name: "idch", aliases: ["cekidch", "channelid"], desc: "Ambil nomor ID resmi dari suatu Saluran WhatsApp", usage: ".idch <link-saluran>" }
    ]
  },
  {
    id: "stalker",
    name: "Stalker Menu",
    badge: "Stalk",
    emoji: "🕵️",
    commands: [
      { name: "igstalk", aliases: ["instagramstalk", "stalking"], desc: "Lihat profil akun Instagram, bio, jumlah followers & post", usage: ".igstalk username" },
      { name: "ttstalk", aliases: ["tiktokstalk"], desc: "Cek profil pengguna TikTok lengkap dengan statistik akun", usage: ".ttstalk username" },
      { name: "gitstalk", aliases: ["githubstalk"], desc: "Lihat profil pengguna GitHub, repositori, dan bintang", usage: ".gitstalk username" },
      { name: "pinstalk", aliases: ["pintereststalk"], desc: "Lihat profil dan jumlah board pengguna Pinterest", usage: ".pinstalk username" },
      { name: "wastalk", aliases: ["whatsappstalk", "stalkwa"], desc: "Cek informasi bio, foto profil, dan status nomor WhatsApp", usage: ".wastalk 628xxx" },
      { name: "stalkml", aliases: ["mlstalk"], desc: "Cek statistik, rank terkini, dan profil pemain Mobile Legends", usage: ".stalkml id zone" },
      { name: "stalkff", aliases: ["ffstalk"], desc: "Cek statistik pemain, rank, dan avatar Free Fire", usage: ".stalkff id_player" },
      { name: "roblox", aliases: ["stalkrbx", "stalkroblox"], desc: "Cek data avatar dan status pengguna Roblox", usage: ".roblox username" },
      { name: "genshin", aliases: ["stalkgenshin", "gi"], desc: "Cek profil penjelajah Genshin Impact dan Adventure Rank", usage: ".genshin uid" }
    ]
  },
  {
    id: "game",
    name: "Games & Kuis",
    badge: "Game",
    emoji: "🎮",
    commands: [
      { name: "akinator", aliases: ["aki", "akinatorhtml", "akihtml"], desc: "Game interaktif Akinator sang jin pembaca pikiran tokoh nyata & fiksi", usage: ".akinator" },
      { name: "balap", aliases: ["racing", "race", "turborace"], desc: "Game balap mobil 3D Turbo Race interaktif di WhatsApp", usage: ".balap" },
      { name: "subwaysurf", aliases: ["subway", "surfer", "subwaysurfer"], desc: "Game pelari rintangan Subway Surfers di chat", usage: ".subwaysurf" },
      { name: "fruitninja", aliases: ["fruitslash", "fruitgame", "fs"], desc: "Game tebas buah Fruit Ninja interaktif", usage: ".fruitninja" },
      { name: "angry", aliases: ["angrybirds", "angrybird", "ketapel"], desc: "Game ketapel Angry Birds hancurkan benteng", usage: ".angry" },
      { name: "flappy", aliases: ["flappybird"], desc: "Game burung terbang Flappy Bird melewati rintangan pipa", usage: ".flappy" },
      { name: "dash", aliases: ["sonic", "speedy", "speeddash"], desc: "Game lari cepat mengumpulkan poin Speedy Dash", usage: ".dash" },
      { name: "slot", aliases: ["slots", "mesinslot"], desc: "Mesin putar slot kasino seru-seruan bersama teman", usage: ".slot" },
      { name: "tictactoe", aliases: ["ttt"], desc: "Duel papan silang bulat Tic-Tac-Toe lawan teman", usage: ".tictactoe" },
      { name: "dinogame", aliases: ["dino", "dinorunner"], desc: "Game lompat kaktus Google Dino T-Rex klasik", usage: ".dinogame" },
      { name: "blockblast", aliases: ["blockgame", "blockpuzzle"], desc: "Game susun puzzle balok Block Blast", usage: ".blockblast" },
      { name: "tebakbendera", desc: "Tebak nama negara berdasarkan gambar bendera", usage: ".tebakbendera" },
      { name: "tebakgambar", desc: "Kuis susun kata dari teka-teki potongan gambar", usage: ".tebakgambar" },
      { name: "lengkapikalimat", desc: "Tebak kata yang hilang dari sebuah kalimat rumpang", usage: ".lengkapikalimat" },
      { name: "tebakkata", desc: "Tebak kata rahasia berdasarkan petunjuk makna", usage: ".tebakkata" },
      { name: "tekateki", desc: "Kuis teka-teki mengasah logika dan daya pikir", usage: ".tekateki" },
      { name: "asahotak", desc: "Uji ketangkasan wawasan dan kecepatan berpikir", usage: ".asahotak" },
      { name: "tebaklagu", desc: "Dengarkan potongan nada audio dan tebak judul lagunya", usage: ".tebaklagu" },
      { name: "tebakheroml", desc: "Tebak nama hero Mobile Legends dari petunjuk audio/visual", usage: ".tebakheroml" },
      { name: "tebaklogo", desc: "Tebak nama merk atau brand perusahaan terkenal", usage: ".tebaklogo" },
      { name: "tebakgame", desc: "Kuis tebak judul video game legendaris", usage: ".tebakgame" },
      { name: "tebakkalimat", desc: "Susun kata-kata acak menjadi kalimat baku yang tepat", usage: ".tebakkalimat" },
      { name: "cerdascermat", desc: "Kuis cerdas cermat adu pengetahuan umum", usage: ".cerdascermat" },
      { name: "susunkata", desc: "Susun huruf-huruf acak menjadi kata baku bermakna", usage: ".susunkata" },
      { name: "siapakahaku", desc: "Tebak profesi, hewan, atau benda dari ciri-cirinya", usage: ".siapakahaku" },
      { name: "caklontong", desc: "Teka-teki lucu dan tak terduga khas Cak Lontong", usage: ".caklontong" }
    ]
  },
  {
    id: "islamic",
    name: "Islamic Menu",
    badge: "Islami",
    emoji: "🕌",
    commands: [
      { name: "quran", aliases: ["surah", "alquran", "bacaquran"], desc: "Baca ayat Al-Quran lengkap dengan teks Arab & arti terjemahan", usage: ".quran 1 atau .quran al-baqarah" },
      { name: "murrotal", aliases: ["murottal", "audioquran", "quraudio"], desc: "Dengarkan lantunan murottal ayat suci Al-Quran merdu", usage: ".murrotal 1" },
      { name: "autosholat", aliases: ["autoadzan", "sholat"], desc: "Pengingat jadwal adzan dan sholat 5 waktu di grup", usage: ".autosholat on/off" }
    ]
  },
  {
    id: "payment",
    name: "Nevapedia Gateway",
    badge: "Pay",
    emoji: "💳",
    commands: [
      { name: "pay balance", aliases: ["payment balance", "pay saldo"], desc: "Periksa sisa saldo akun gateway Nevapedia API", usage: ".pay balance", isOwner: true },
      { name: "pay invoice", aliases: ["payment invoice", "pay create"], desc: "Buat tagihan pembayaran QRIS otomatis instan", usage: ".pay invoice <nominal>", isOwner: true },
      { name: "pay cekinvoice", aliases: ["payment cekinvoice", "pay statusinv"], desc: "Periksa status pembayaran transaksi invoice QRIS", usage: ".pay cekinvoice <id_invoice>", isOwner: true },
      { name: "pay wdmethod", aliases: ["payment wdmethod", "pay method"], desc: "Tampilkan seluruh metode penarikan Bank & E-Wallet", usage: ".pay wdmethod", isOwner: true },
      { name: "pay wd", aliases: ["payment wd", "pay withdraw"], desc: "Lakukan pencairan saldo ke rekening bank atau e-wallet", usage: ".pay wd <nominal> <metode> <no_rek> [instant]", isOwner: true },
      { name: "pay cekwd", aliases: ["payment cekwd", "pay statuswd"], desc: "Periksa status pemrosesan transaksi penarikan dana", usage: ".pay cekwd <id_wd>", isOwner: true }
    ]
  },
  {
    id: "support",
    name: "Donasi & Developer",
    badge: "Support",
    emoji: "☕",
    commands: [
      { name: "donasi", aliases: ["donate", "suport"], desc: "Tampilkan informasi cara mendukung dan berdonasi untuk bot", usage: ".donasi" },
      { name: "qris", desc: "Tampilkan barcode QRIS resmi untuk donasi kilat", usage: ".qris" },
      { name: "saweria", desc: "Dukung bot melalui platform Saweria", usage: ".saweria" },
      { name: "tako", desc: "Dukung bot melalui platform Tako ID", usage: ".tako" }
    ]
  },
  {
    id: "fun",
    name: "Fun & Kerang Ajaib",
    badge: "Fun",
    emoji: "🎭",
    commands: [
      { name: "apakah", aliases: ["apa"], desc: "Tanyakan hal ya/tidak ke bot layaknya kerang ajaib", usage: ".apakah besok akan cerah?" },
      { name: "bisakah", aliases: ["bisa"], desc: "Tanyakan apakah sesuatu bisa terjadi", usage: ".bisakah saya juara?" },
      { name: "akankah", aliases: ["akan", "will"], desc: "Tanyakan ramalan hal yang akan terjadi di masa depan", usage: ".akankah dia rindu?" },
      { name: "bagaimana", aliases: ["gimana", "how"], desc: "Minta pandangan atau saran kocak dari bot", usage: ".bagaimana cara cepat kaya?" },
      { name: "haruskah", aliases: ["harus", "should"], desc: "Minta arahan ketika sedang bimbang mengambil keputusan", usage: ".haruskah saya tidur?" },
      { name: "dimana", aliases: ["where", "mana"], desc: "Tebak lokasi barang hilang atau tempat seseorang", usage: ".dimana jodohku?" },
      { name: "berapa", aliases: ["howmuch", "howmany"], desc: "Taksir angka persentase atau perkiraan secara acak", usage: ".berapa persen cintanya?" },
      { name: "cekkhodam", aliases: ["khodam", "cekhodam"], desc: "Cek khodam mistis pendampingmu hari ini", usage: ".cekkhodam Nama Kamu" },
      { name: "cekpacar", aliases: ["pacar", "pasangan", "gebetan"], desc: "Uji persentase kecocokan bersama gebetan atau pasangan", usage: ".cekpacar @tag" },
      { name: "jodoh", aliases: ["jodohin"], desc: "Ramal kecocokan jodoh antara dua nama", usage: ".jodoh Nama1 & Nama2" },
      { name: "gay", aliases: ["howgay"], desc: "Meteran kocak pengukur kadar gay seru-seruan", usage: ".gay @tag" },
      { name: "confess", aliases: ["confession", "menfess", "anonim"], desc: "Kirim pesan rahasia secara anonim ke seseorang", usage: ".confess 628xxx|Nama|Pesan" },
      { name: "coba", aliases: ["try"], desc: "Uji keberuntungan dan ramalan harimu", usage: ".coba" }
    ]
  },
  {
    id: "info",
    name: "Info & Berita",
    badge: "Info",
    emoji: "📰",
    commands: [
      { name: "gempa", aliases: ["infogempa"], desc: "Informasi getaran gempa bumi terbaru dari BMKG", usage: ".gempa" },
      { name: "cuaca", desc: "Prakiraan cuaca terkini wilayah kota di Indonesia", usage: ".cuaca Jakarta" },
      { name: "berita", desc: "Kumpulan kabar berita terhangat hari ini", usage: ".berita" },
      { name: "cnn", desc: "Update berita terkini dari portal CNN Indonesia", usage: ".cnn" },
      { name: "cnbc", desc: "Update berita finansial dan ekonomi dari CNBC Indonesia", usage: ".cnbc" },
      { name: "antara", desc: "Kabar berita terpercaya dari Kantor Berita ANTARA", usage: ".antara" },
      { name: "sindonews", desc: "Berita aktual dan terpercaya dari SINDOnews", usage: ".sindonews" },
      { name: "jadwaltv", aliases: ["tv", "tvjadwal"], desc: "Jadwal tayangan acara stasiun TV nasional hari ini", usage: ".jadwaltv RCTI" },
      { name: "jadwalbola", aliases: ["bola"], desc: "Jadwal siaran langsung pertandingan sepak bola dunia", usage: ".jadwalbola" },
      { name: "lirik", aliases: ["lyrics"], desc: "Cari lirik lagu lokal dan mancanegara secara lengkap", usage: ".lirik judul lagu" },
      { name: "infotourney", aliases: ["tourney", "turnamen", "mltourney"], desc: "Informasi jadwal pendaftaran turnamen Mobile Legends", usage: ".infotourney" },
      { name: "buildml", desc: "Rekomendasi racikan item build hero Mobile Legends", usage: ".buildml nama_hero" },
      { name: "npm", aliases: ["npmsearch", "npmjs", "npmfind"], desc: "Cari package library di repositori resmi NPMJS", usage: ".npm nama_package" },
      { name: "pins", aliases: ["pinterest", "pinsearch"], desc: "Cari ribuan gambar estetik resolusi tinggi di Pinterest", usage: ".pins estetika anime" },
      { name: "bluearchive-char", aliases: ["bachar", "ba"], desc: "Biodata lengkap murid akademi game Blue Archive", usage: ".bluearchive-char Shiroko" }
    ]
  },
  {
    id: "random",
    name: "Random & NSFW",
    badge: "Random",
    emoji: "🔞",
    commands: [
      { name: "anime", desc: "Wallpaper foto anime acak beresolusi tinggi", usage: ".anime" },
      { name: "blue-archive", aliases: ["bluearchive"], desc: "Gambar karakter murid game Blue Archive", usage: ".blue-archive" },
      { name: "pap", desc: "Foto aesthetic santai secara acak", usage: ".pap" },
      { name: "loli", desc: "Foto karakter imut anime lucu", usage: ".loli" },
      { name: "cecan-indo", aliases: ["cecan-indonesia"], desc: "Foto cewek cantik Indonesia acak", usage: ".cecan-indo" },
      { name: "cecan-japan", aliases: ["cecan-jepang"], desc: "Foto cewek cantik Jepang acak", usage: ".cecan-japan" },
      { name: "cecan-korea", aliases: ["cecan-kor"], desc: "Foto cewek cantik Korea acak", usage: ".cecan-korea" },
      { name: "cecan-china", aliases: ["cecan-tiongkok"], desc: "Foto cewek cantik China acak", usage: ".cecan-china" },
      { name: "cecan-thailand", aliases: ["cecan-thai"], desc: "Foto cewek cantik Thailand acak", usage: ".cecan-thailand" },
      { name: "cecan-vietnam", aliases: ["cecan-viet"], desc: "Foto cewek cantik Vietnam acak", usage: ".cecan-vietnam" },
      { name: "hentai", desc: "Gambar anime dewasa NSFW acak (khusus 18+)", usage: ".hentai" },
      { name: "gangbang", desc: "Gambar kartun ilustrasi dewasa NSFW acak", usage: ".gangbang" },
      { name: "kasedaiki", desc: "Koleksi gambar eksklusif anime NSFW", usage: ".kasedaiki" },
      { name: "dongart", desc: "Karya seni ilustrasi kartun anime NSFW", usage: ".dongart" }
    ]
  }
];

export const getTotalCommandCount = (): number => {
  return MENU_CATEGORIES.reduce((acc, cat) => acc + cat.commands.length, 0);
};

export const generateWhatsAppMenuText = (prefix: string, sender: string, uptimeStr: string, dateStr: string): string => {
  const totalCmds = getTotalCommandCount();
  
  let text = `╭━━━〔 *CMNTY-BOT* 〕━━━┈\n`;
  text += `┃ *ᴜꜱᴇʀ:* @${sender.split("@")[0]}\n`;
  text += `┃ *ᴜᴘᴛɪᴍᴇ:* ${uptimeStr}\n`;
  text += `┃ *ᴅᴀᴛᴇ:* ${dateStr}\n`;
  text += `┃ *ᴛᴏᴛᴀʟ ꜰɪᴛᴜʀ:* ${totalCmds} Perintah\n`;
  text += `┃ *ᴊᴀᴅɪ ʙᴏᴛ:* jadi-bot.cmnty.web.id\n`;
  text += `┃ *ʀᴇꜱᴛ ᴀᴘɪ:* api.cmnty.biz.id\n`;
  text += `╰━━━━━━━━━━━━┈.✦ ݁˖\n\n`;

  MENU_CATEGORIES.forEach((cat, idx) => {
    text += `╭━〔 ${cat.emoji} *${cat.name.toUpperCase()}* 〕━┈\n`;
    cat.commands.forEach(cmd => {
      text += `┃ \`${prefix}${cmd.name}\`\n`;
    });
    if (idx === MENU_CATEGORIES.length - 1) {
      text += `╰━━━━━━━━━━━━┈`;
    } else {
      text += `╰━━━━━━━━━━━━┈.✦ ݁˖\n`;
    }
  });

  return text;
};
