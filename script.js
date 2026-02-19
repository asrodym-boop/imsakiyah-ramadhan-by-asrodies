let provinsiSelect = document.getElementById("provinsi");
let kotaSelect = document.getElementById("kota");
let card = document.getElementById("card");
let jadwalList = document.getElementById("jadwalList");
let countdownEl = document.getElementById("countdown");
let namaKota = document.getElementById("namaKota");

let provinsiData = {
"Aceh": ["Banda Aceh","Lhokseumawe","Langsa"],
"Sumatera Utara": ["Medan","Binjai","Pematangsiantar"],
"Sumatera Barat": ["Padang","Bukittinggi","Payakumbuh"],
"Riau": ["Pekanbaru","Dumai"],
"Kepulauan Riau": ["Tanjung Pinang","Batam"],
"Jambi": ["Jambi"],
"Sumatera Selatan": ["Palembang","Lubuklinggau"],
"Bengkulu": ["Bengkulu"],
"Lampung": ["Bandar Lampung","Metro"],
"Kepulauan Bangka Belitung": ["Pangkal Pinang"],
"DKI Jakarta": ["Jakarta Pusat","Jakarta Selatan","Jakarta Timur"],
"Jawa Barat": ["Bandung","Bogor","Bekasi","Cirebon"],
"Jawa Tengah": ["Semarang","Solo","Magelang"],
"DI Yogyakarta": ["Yogyakarta"],
"Jawa Timur": ["Surabaya","Malang","Kediri"],
"Banten": ["Serang","Tangerang","Cilegon"],
"Bali": ["Denpasar"],
"Nusa Tenggara Barat": ["Mataram","Bima"],
"Nusa Tenggara Timur": ["Kupang"],
"Kalimantan Barat": ["Pontianak","Singkawang"],
"Kalimantan Tengah": ["Palangka Raya"],
"Kalimantan Selatan": ["Banjarmasin"],
"Kalimantan Timur": ["Samarinda","Balikpapan"],
"Kalimantan Utara": ["Tanjung Selor","Tarakan"],
"Sulawesi Utara": ["Manado","Bitung"],
"Sulawesi Tengah": ["Palu"],
"Sulawesi Selatan": ["Makassar","Parepare"],
"Sulawesi Tenggara": ["Kendari"],
"Sulawesi Barat": ["Mamuju"],
"Gorontalo": ["Gorontalo"],
"Maluku": ["Ambon"],
"Maluku Utara": ["Ternate"],
"Papua": ["Jayapura"],
"Papua Barat": ["Manokwari"],
"Papua Selatan": ["Merauke"],
"Papua Tengah": ["Nabire"],
"Papua Pegunungan": ["Wamena"],
"Papua Barat Daya": ["Sorong"]
};

let jadwalData = null;

// load provinsi
window.onload = () => {
    for (let p in provinsiData) {
        provinsiSelect.innerHTML += `<option value="${p}">${p}</option>`;
    }
}

// load kota
function loadKota() {
    kotaSelect.innerHTML = '<option value="">Pilih Kota</option>';
    let p = provinsiSelect.value;
    if (!p) return;
    provinsiData[p].forEach(k => {
        kotaSelect.innerHTML += `<option value="${k}">${k}</option>`;
    });
}

// load jadwal
async function loadJadwal() {
    let kota = kotaSelect.value;
    if (!kota) return;

    namaKota.innerText = `Jadwal di: ${kota}`;
    card.classList.remove("hidden");

    let res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${kota}&country=Indonesia&method=2`);
    let data = await res.json();
    jadwalData = data.data.timings;

    displayJadwal();
    startCountdown();
}

function displayJadwal() {
    jadwalList.innerHTML = `
        <p>Imsak: ${jadwalData.Imsak}</p>
        <p>Subuh: ${jadwalData.Fajr}</p>
        <p>Dzuhur: ${jadwalData.Dhuhr}</p>
        <p>Ashar: ${jadwalData.Asr}</p>
        <p>Maghrib: ${jadwalData.Maghrib}</p>
        <p>Isya: ${jadwalData.Isha}</p>
    `;
}

// countdown
function startCountdown() {
    countdownEl.classList.remove("hidden");

    setInterval(() => {
        let now = new Date();
        let maghrib = jadwalData.Maghrib.split(":");
        let target = new Date();
        target.setHours(maghrib[0], maghrib[1], 0);

        let diff = target - now;
        if (diff < 0) { 
            document.getElementById("timer").innerText = "Sudah Maghrib!";
            return;
        }

        let m = Math.floor(diff / 60000) % 60;
        let h = Math.floor(diff / 3600000);
        let s = Math.floor(diff / 1000) % 60;

        document.getElementById("timer").innerText = `${h} jam ${m} menit ${s} dtk`;
    }, 1000);
}
