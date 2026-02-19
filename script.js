function showTab(tab) {

  document.getElementById("jadwalTab").classList.add("hidden");
  document.getElementById("doaTab").classList.add("hidden");

  document.getElementById("btnJadwal").classList.remove("active");
  document.getElementById("btnDoa").classList.remove("active");

  if (tab === "jadwal") {
    document.getElementById("jadwalTab").classList.remove("hidden");
    document.getElementById("btnJadwal").classList.add("active");
  } else {
    document.getElementById("doaTab").classList.remove("hidden");
    document.getElementById("btnDoa").classList.add("active");
  }
}
const doaHarian = [
    {
judul: "Niat Sahur (Niat Puasa)",
arab: "نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هَذِهِ السَّنَةِ لِلَّهِ تَعَالَى",
arti: "Saya niat puasa esok hari untuk menunaikan kewajiban puasa bulan Ramadan tahun ini karena Allah Ta’ala.",
sumber: "Lafaz fiqih; niat cukup dalam hati (HR. Bukhari & Muslim)"
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
judul: "Doa Masuk Rumah",
arab: "بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا",
arti: "Dengan nama Allah kami masuk dan keluar, dan kepada Allah kami bertawakal.",
sumber: "HR. Abu Dawud"
},
{
judul: "Doa Keluar Rumah",
arab: "بِسْمِ اللهِ تَوَكَّلْتُ عَلَى اللهِ لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ",
arti: "Dengan nama Allah, aku bertawakal kepada Allah, tiada daya dan upaya kecuali dengan pertolongan Allah.",
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

loadDoa();
