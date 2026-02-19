// =======================
// DATA PROVINSI INDONESIA
// =======================

const provinsiIndonesia = [
"Aceh","Sumatera Utara","Sumatera Barat","Riau","Kepulauan Riau",
"Jambi","Sumatera Selatan","Bangka Belitung","Bengkulu","Lampung",
"DKI Jakarta","Jawa Barat","Jawa Tengah","DI Yogyakarta","Jawa Timur",
"Banten","Bali","Nusa Tenggara Barat","Nusa Tenggara Timur",
"Kalimantan Barat","Kalimantan Tengah","Kalimantan Selatan",
"Kalimantan Timur","Kalimantan Utara",
"Sulawesi Utara","Sulawesi Tengah","Sulawesi Selatan",
"Sulawesi Tenggara","Gorontalo","Sulawesi Barat",
"Maluku","Maluku Utara","Papua Barat","Papua"
];

const provinsiSelect = document.getElementById("provinsi");
const kotaSelect = document.getElementById("kota");

// =======================
// LOAD PROVINSI
// =======================

provinsiIndonesia.forEach(p=>{
  provinsiSelect.innerHTML += `<option value="${p}">${p}</option>`;
});

// =======================
// LOAD KOTA DARI API
// =======================

provinsiSelect.addEventListener("change", function(){
  let prov = this.value;
  kotaSelect.innerHTML = "<option>Loading...</option>";

  fetch(`https://api.aladhan.com/v1/search?country=Indonesia&state=${prov}`)
  .then(res=>res.json())
  .then(data=>{
      kotaSelect.innerHTML = "<option value=''>Pilih Kota/Kabupaten</option>";
      data.data.forEach(k=>{
          kotaSelect.innerHTML += `<option value="${k.name}">${k.name}</option>`;
      });
  })
  .catch(()=>{
      kotaSelect.innerHTML = "<option>Gagal memuat kota</option>";
  });
});

// =======================
// LOAD JADWAL
// =======================

function loadJadwal(){

let kota = kotaSelect.value;
if(!kota){
    alert("Pilih kota terlebih dahulu!");
    return;
}

let today = new Date();
let bulan = today.getMonth()+1;
let tahun = today.getFullYear();

fetch(`https://api.aladhan.com/v1/calendarByCity?city=${kota}&country=Indonesia&method=11&month=${bulan}&year=${tahun}`)
.then(res=>res.json())
.then(data=>{

let hariIni = today.getDate()-1;
let jadwal = data.data[hariIni].timings;

// Jadwal Hari Ini
document.getElementById("jadwalHariIni").innerHTML = `
<h3>Jadwal Hari Ini</h3>
Subuh : ${jadwal.Fajr}<br>
Dzuhur : ${jadwal.Dhuhr}<br>
Ashar : ${jadwal.Asr}<br>
Maghrib : ${jadwal.Maghrib}<br>
Isya : ${jadwal.Isha}
`;

// Countdown
startCountdown(jadwal.Maghrib);

// Jadwal 1 Bulan
let html = "<h3>Jadwal 1 Bulan</h3>";
data.data.forEach(d=>{
  html += `${d.date.gregorian.date} - Maghrib: ${d.timings.Maghrib}<br>`;
});
document.getElementById("jadwalBulanan").innerHTML = html;

})
.catch(()=>{
  alert("Gagal mengambil jadwal!");
});
}

// =======================
// COUNTDOWN MAGHRIB
// =======================

function startCountdown(waktuMaghrib){

let countdown = document.getElementById("countdown");

setInterval(()=>{
let now = new Date();
let maghrib = new Date();
let parts = waktuMaghrib.split(":");
maghrib.setHours(parts[0],parts[1],0);

let diff = maghrib - now;

if(diff > 0){
let jam = Math.floor(diff/1000/60/60);
let menit = Math.floor((diff/1000/60)%60);
let detik = Math.floor((diff/1000)%60);
countdown.innerHTML = `⏳ Menuju Berbuka: ${jam}j ${menit}m ${detik}d`;
}else{
countdown.innerHTML = "🌙 Sudah Waktu Berbuka!";
}
},1000);
}

// =======================
// DOA HARIAN
// =======================

const doaHarian = [
{
judul:"Niat Sahur",
arab:"نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ لِلَّهِ تَعَالَى",
arti:"Saya niat puasa esok hari untuk menunaikan kewajiban puasa Ramadan karena Allah Ta’ala.",
sumber:"HR Bukhari Muslim"
},
{
judul:"Doa Berbuka",
arab:"ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ",
arti:"Telah hilang rasa haus dan urat-urat telah basah serta pahala telah tetap, insya Allah.",
sumber:"HR Abu Dawud"
},
{
judul:"Doa Sebelum Makan",
arab:"اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ",
arti:"Ya Allah, berkahilah rezeki yang Engkau berikan kepada kami dan lindungi kami dari siksa neraka.",
sumber:"HR Tirmidzi"
}
];

function loadDoa(){
let doaList = document.getElementById("doaList");
doaHarian.forEach(d=>{
doaList.innerHTML += `
<div class="doa-card">
<h3>${d.judul}</h3>
<div class="doa-arab">${d.arab}</div>
<p>${d.arti}</p>
<small>${d.sumber}</small>
</div>
`;
});
}

loadDoa();
