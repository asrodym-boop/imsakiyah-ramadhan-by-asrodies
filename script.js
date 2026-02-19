// ==========================================
// ELEMENT
// ==========================================
let provinsiSelect = document.getElementById("provinsi");
let kotaSelect = document.getElementById("kabkota");
let card = document.getElementById("card");
let jadwalHariIniDiv = document.getElementById("jadwalHariIni");
let jadwalBulananDiv = document.getElementById("jadwalBulanan");
let namaDaerah = document.getElementById("namaDaerah");
let countdownEl = document.getElementById("countdown");
let timerEl = document.getElementById("timer");

let jadwalData = [];
let interval;


// ==========================================
// DATA PROVINSI & KOTA (SAMPLE BESAR)
// ==========================================
const dataIndonesia = {
  "DKI Jakarta": ["Jakarta Pusat","Jakarta Utara","Jakarta Barat","Jakarta Selatan","Jakarta Timur"],
  "Jawa Barat": ["Bandung","Bekasi","Bogor","Depok","Cirebon","Sukabumi","Tasikmalaya"],
  "Jawa Tengah": ["Semarang","Solo","Magelang","Purwokerto","Tegal","Pekalongan"],
  "Jawa Timur": ["Surabaya","Malang","Kediri","Madiun","Blitar","Jember"],
  "DI Yogyakarta": ["Yogyakarta","Sleman","Bantul","Kulon Progo","Gunung Kidul"],
  "Sumatera Utara": ["Medan","Binjai","Pematangsiantar"],
  "Sulawesi Selatan": ["Makassar","Parepare","Palopo"],
  "Bali": ["Denpasar","Singaraja"],
  "Kalimantan Timur": ["Balikpapan","Samarinda"],
  "Papua": ["Jayapura"]
};


// ==========================================
// LOAD PROVINSI
// ==========================================
window.onload = () => {
  if (provinsiSelect) {
    provinsiSelect.innerHTML = `<option value="">Pilih Provinsi</option>`;
    Object.keys(dataIndonesia).forEach(p => {
      provinsiSelect.innerHTML += `<option value="${p}">${p}</option>`;
    });
  }

  loadDoa(); // tetap load doa
};


// ==========================================
// LOAD KOTA
// ==========================================
function loadKabKota() {

  let prov = provinsiSelect.value;
  kotaSelect.innerHTML = `<option value="">Pilih Kota/Kabupaten</option>`;

  if (!prov) return;

  dataIndonesia[prov].forEach(k => {
    kotaSelect.innerHTML += `<option value="${k}">${k}</option>`;
  });
}


// ==========================================
// LOAD JADWAL (AUTO TAHUN SEKARANG)
// ==========================================
async function loadJadwal() {

  let kota = kotaSelect.value;
  if (!kota) return;

  let today = new Date();
  let bulan = today.getMonth() + 1;
  let tahun = today.getFullYear(); // otomatis 2026 jika sudah 2026

  namaDaerah.innerText = `${kota}, Indonesia`;
  card.classList.remove("hidden");

  try {

    let url = `https://api.aladhan.com/v1/calendarByCity/${tahun}/${bulan}?city=${kota}&country=Indonesia&method=11`;

    let res = await fetch(url);
    let data = await res.json();

    jadwalData = data.data;

    tampilkanHariIni();
    tampilkanBulanan();
    startCountdown();

  } catch (err) {
    namaDaerah.innerText = "Gagal mengambil jadwal";
  }
}


// ==========================================
// TAMPILKAN HARI INI
// ==========================================
function tampilkanHariIni() {

  let today = new Date().getDate();
  let hari = jadwalData[today - 1].timings;

  jadwalHariIniDiv.innerHTML = `
    <h3>📅 Jadwal Hari Ini</h3>
    <p>Imsak: ${hari.Imsak.split(" ")[0]}</p>
    <p>Subuh: ${hari.Fajr.split(" ")[0]}</p>
    <p>Dzuhur: ${hari.Dhuhr.split(" ")[0]}</p>
    <p>Ashar: ${hari.Asr.split(" ")[0]}</p>
    <p>Maghrib: ${hari.Maghrib.split(" ")[0]}</p>
    <p>Isya: ${hari.Isha.split(" ")[0]}</p>
  `;
}


// ==========================================
// TABEL BULANAN
// ==========================================
function tampilkanBulanan() {

  let tabel = `
    <h3>📆 Jadwal 1 Bulan</h3>
    <table>
      <tr>
        <th>Tgl</th>
        <th>Imsak</th>
        <th>Subuh</th>
        <th>Maghrib</th>
      </tr>
  `;

  jadwalData.forEach((h, i) => {
    tabel += `
      <tr>
        <td>${i+1}</td>
        <td>${h.timings.Imsak.split(" ")[0]}</td>
        <td>${h.timings.Fajr.split(" ")[0]}</td>
        <td>${h.timings.Maghrib.split(" ")[0]}</td>
      </tr>
    `;
  });

  tabel += `</table>`;
  jadwalBulananDiv.innerHTML = tabel;
}


// ==========================================
// COUNTDOWN MAGHRIB
// ==========================================
function startCountdown() {

  if (interval) clearInterval(interval);
  countdownEl.classList.remove("hidden");

  interval = setInterval(() => {

    let today = new Date().getDate();
    let maghrib = jadwalData[today - 1].timings.Maghrib.split(" ")[0].split(":");

    let now = new Date();
    let target = new Date();
    target.setHours(maghrib[0], maghrib[1], 0);

    let diff = target - now;

    if (diff <= 0) {
      timerEl.innerText = "Sudah waktu berbuka!";
      return;
    }

    let jam = Math.floor(diff / 3600000);
    let menit = Math.floor((diff % 3600000) / 60000);
    let detik = Math.floor((diff % 60000) / 1000);

    timerEl.innerText = `${jam}j ${menit}m ${detik}d`;

  }, 1000);
}


// ==========================================
// DOA HARIAN (LENGKAP)
// ==========================================
const doaHarian = [
{
judul: "Niat Sahur (Niat Puasa)",
arab: "نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ لِلَّهِ تَعَالَى",
arti: "Saya niat puasa esok hari untuk menunaikan kewajiban puasa Ramadan karena Allah Ta’ala.",
sumber: "Niat cukup dalam hati (HR. Bukhari & Muslim)"
},
{
judul: "Doa Berbuka Puasa",
arab: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ",
arti: "Telah hilang rasa haus dan urat-urat telah basah serta pahala telah tetap, insya Allah.",
sumber: "HR. Abu Dawud (Hasan)"
},
{
judul: "Doa Sebelum Makan",
arab: "اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ",
arti: "Ya Allah, berkahilah rezeki yang Engkau berikan kepada kami dan lindungi kami dari siksa neraka.",
sumber: "HR. Tirmidzi"
},
{
judul: "Doa Sesudah Makan",
arab: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
arti: "Segala puji bagi Allah yang memberi kami makan dan minum serta menjadikan kami muslim.",
sumber: "HR. Abu Dawud"
},
{
judul: "Doa Sebelum Tidur",
arab: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
arti: "Dengan nama-Mu ya Allah aku mati dan hidup.",
sumber: "HR. Bukhari"
}
];


function loadDoa() {

  let doaList = document.getElementById("doaList");
  if (!doaList) return;

  doaList.innerHTML = "";

  doaHarian.forEach(d => {
    doaList.innerHTML += `
      <div class="doa-card">
        <h3>${d.judul}</h3>
        <div class="doa-arab">${d.arab}</div>
        <div class="doa-arti">${d.arti}</div>
        <small>Sumber: ${d.sumber}</small>
      </div>
    `;
  });
}
