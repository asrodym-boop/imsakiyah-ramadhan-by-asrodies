const provinsiSelect = document.getElementById("provinsi");
const kotaSelect = document.getElementById("kota");
const countdown = document.getElementById("countdown");

let semuaKota = [];
let groupedProvinsi = {};

// ===============================
// LOAD DATA KOTA (KEMENAG)
// ===============================

fetch("https://api.myquran.com/v2/sholat/kota/semua")
.then(res => res.json())
.then(result => {

    semuaKota = result.data;

    // Kelompokkan berdasarkan 2 digit awal ID (kode provinsi)
    semuaKota.forEach(k => {

        let kodeProv = k.id.substring(0,2);

        if(!groupedProvinsi[kodeProv]){
            groupedProvinsi[kodeProv] = {
                nama: k.lokasi.split(", ").pop(),
                kota:[]
            };
        }

        groupedProvinsi[kodeProv].kota.push(k);
    });

    // Tampilkan provinsi unik
    Object.keys(groupedProvinsi).forEach(kode => {
        provinsiSelect.innerHTML += `
        <option value="${kode}">
            ${groupedProvinsi[kode].nama}
        </option>`;
    });

})
.catch(()=>{
    alert("Gagal memuat data wilayah dari Kemenag.");
});

// ===============================
// LOAD KOTA BERDASARKAN PROVINSI
// ===============================

provinsiSelect.addEventListener("change", function(){

    let kodeProv = this.value;
    kotaSelect.innerHTML = "<option value=''>Pilih Kabupaten/Kota</option>";

    if(!kodeProv) return;

    groupedProvinsi[kodeProv].kota.forEach(k => {
        kotaSelect.innerHTML += `
        <option value="${k.id}">
            ${k.lokasi}
        </option>`;
    });

});

// ===============================
// LOAD JADWAL SHOLAT
// ===============================

function loadJadwal(){

let idKota = kotaSelect.value;

if(!idKota){
    alert("Pilih Kabupaten/Kota terlebih dahulu!");
    return;
}

let now = new Date();
let tahun = now.getFullYear();
let bulan = now.getMonth()+1;
let tanggal = now.getDate();

fetch(`https://api.myquran.com/v2/sholat/jadwal/${idKota}/${tahun}/${bulan}`)
.then(res => res.json())
.then(result => {

let jadwalHari = result.data.jadwal[tanggal-1];

document.getElementById("jadwalHariIni").innerHTML = `
<h3>Jadwal Hari Ini</h3>
Imsak : ${jadwalHari.imsak}<br>
Subuh : ${jadwalHari.subuh}<br>
Dzuhur : ${jadwalHari.dzuhur}<br>
Ashar : ${jadwalHari.ashar}<br>
Maghrib : ${jadwalHari.maghrib}<br>
Isya : ${jadwalHari.isya}
`;

startCountdown(jadwalHari.maghrib);

// Jadwal 1 bulan
let html = "<h3>Jadwal 1 Bulan</h3>";
result.data.jadwal.forEach(d=>{
    html += `${d.tanggal} - Maghrib: ${d.maghrib}<br>`;
});
document.getElementById("jadwalBulanan").innerHTML = html;

})
.catch(()=>{
    alert("Gagal mengambil jadwal dari Kemenag!");
});
}

// ===============================
// COUNTDOWN MAGHRIB
// ===============================

let interval;

function startCountdown(waktuMaghrib){

clearInterval(interval);

interval = setInterval(()=>{

let now = new Date();
let maghrib = new Date();
let parts = waktuMaghrib.split(":");

maghrib.setHours(parts[0], parts[1], 0);

let selisih = maghrib - now;

if(selisih > 0){

let jam = Math.floor(selisih/1000/60/60);
let menit = Math.floor((selisih/1000/60)%60);
let detik = Math.floor((selisih/1000)%60);

countdown.innerHTML = `⏳ Menuju Berbuka: ${jam}j ${menit}m ${detik}d`;

}else{
countdown.innerHTML = "🌙 Sudah Waktu Berbuka!";
}

},1000);
}

// ===============================
// DOA HARIAN
// ===============================

const doaHarian = [
{
judul:"Niat Sahur",
arab:"نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ لِلَّهِ تَعَالَى",
arti:"Saya niat puasa esok hari untuk menunaikan kewajiban puasa Ramadan karena Allah Ta’ala.",
sumber:"HR Bukhari & Muslim"
},
{
judul:"Doa Berbuka",
arab:"ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ",
arti:"Telah hilang rasa haus dan urat-urat telah basah serta pahala telah tetap, insya Allah.",
sumber:"HR Abu Dawud"
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
