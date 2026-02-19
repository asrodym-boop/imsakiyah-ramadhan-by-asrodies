let provinsiSelect = document.getElementById("provinsi");
let kotaSelect = document.getElementById("kota");
let card = document.getElementById("card");
let jadwalList = document.getElementById("jadwalList");
let countdownEl = document.getElementById("countdown");
let namaKota = document.getElementById("namaKota");

let jadwalData = null;
let intervalCountdown = null;
let semuaKota = [];

// LOAD SELURUH KOTA DARI API EQURAN
window.onload = async () => {

    provinsiSelect.innerHTML = `<option>Memuat...</option>`;

    try {
        let res = await fetch("https://equran.id/api/v2/kota");
        let data = await res.json();

        // cek struktur
        semuaKota = data.data ? data.data : data;

        let daftarProvinsi = [...new Set(semuaKota.map(k => k.provinsi))];

        provinsiSelect.innerHTML = `<option value="">Pilih Provinsi</option>`;

        daftarProvinsi.sort().forEach(p => {
            provinsiSelect.innerHTML += `<option value="${p}">${p}</option>`;
        });

    } catch (error) {
        console.error(error);
        provinsiSelect.innerHTML = `<option>Gagal memuat data</option>`;
    }
};
// LOAD KOTA BERDASARKAN PROVINSI
function loadKota() {

    let prov = provinsiSelect.value;
    kotaSelect.innerHTML = `<option value="">Pilih Kota</option>`;

    if (!prov) return;

    let kotaFilter = semuaKota.filter(k => k.provinsi === prov);

    kotaFilter.forEach(k => {
        kotaSelect.innerHTML += `<option value="${k.id}">${k.lokasi}</option>`;
    });
}

// LOAD JADWAL IMSAKIYAH
async function loadJadwal() {

    let idKota = kotaSelect.value;
    if (!idKota) return;

    let today = new Date();
    let bulan = today.getMonth() + 1;
    let tahun = today.getFullYear();

    namaKota.innerText = "Memuat jadwal...";
    card.classList.remove("hidden");

    try {
        let res = await fetch(`https://equran.id/api/v2/imsakiyah/${idKota}/${tahun}/${bulan}`);
        let data = await res.json();

        let kalender = data.data;

        let indexHari = today.getDate() - 1;
        jadwalData = kalender[indexHari];

        tampilkanHariIni();
        tampilkanBulanan(kalender);
        startCountdown();

    } catch (error) {
        namaKota.innerText = "Gagal mengambil jadwal.";
    }
}

function tampilkanHariIni() {

    jadwalList.innerHTML = `
        <h3>📅 Jadwal Hari Ini</h3>
        <p>Imsak: ${jadwalData.imsak}</p>
        <p>Subuh: ${jadwalData.subuh}</p>
        <p>Dzuhur: ${jadwalData.dzuhur}</p>
        <p>Ashar: ${jadwalData.ashar}</p>
        <p>Maghrib: ${jadwalData.maghrib}</p>
        <p>Isya: ${jadwalData.isya}</p>
    `;
}

// TABEL 1 BULAN
function tampilkanBulanan(kalender) {

    let tabel = `
        <h3 style="margin-top:20px;">📆 Jadwal 1 Bulan</h3>
        <div style="overflow-x:auto;">
        <table border="1" style="width:100%; font-size:12px;">
        <tr>
            <th>Tgl</th>
            <th>Imsak</th>
            <th>Subuh</th>
            <th>Maghrib</th>
        </tr>
    `;

    kalender.forEach((hari, index) => {
        tabel += `
            <tr>
                <td>${index + 1}</td>
                <td>${hari.imsak}</td>
                <td>${hari.subuh}</td>
                <td>${hari.maghrib}</td>
            </tr>
        `;
    });

    tabel += "</table></div>";

    jadwalList.innerHTML += tabel;
}

// COUNTDOWN MAGHRIB
function startCountdown() {

    if (intervalCountdown) clearInterval(intervalCountdown);

    countdownEl.classList.remove("hidden");

    intervalCountdown = setInterval(() => {

        let now = new Date();
        let maghrib = jadwalData.maghrib.split(":");

        let target = new Date();
        target.setHours(maghrib[0], maghrib[1], 0);

        let diff = target - now;

        if (diff <= 0) {
            document.getElementById("timer").innerText = "Sudah waktu berbuka!";
            return;
        }

        let jam = Math.floor(diff / 3600000);
        let menit = Math.floor(diff % 3600000 / 60000);
        let detik = Math.floor(diff % 60000 / 1000);

        document.getElementById("timer").innerText =
            `${jam} jam ${menit} menit ${detik} detik`;

    }, 1000);
}
