/* ---- Fungsi Bantuan Format Angka ---- */
const formatRp = (angka) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka);
const formatKg = (angka) =>
  new Intl.NumberFormat("id-ID").format(angka) + " Kg";

document.addEventListener("DOMContentLoaded", () => {
  /* =============================================
     1. LOGIKA LANDING PAGE (Navigasi)
     ============================================= */
  const tombolNav = document.getElementById("navToggle");
  const tautanNav = document.getElementById("navLinks");
  const navigasi = document.querySelector(".navbar");

  // Buka/Tutup menu mobile
  tombolNav?.addEventListener("click", () => {
    tautanNav.classList.toggle("open");
    const ikon = tombolNav.querySelector("i");
    ikon.classList.toggle("fa-bars");
    ikon.classList.toggle("fa-times");
  });

  // Tutup menu saat tautan diklik
  tautanNav?.querySelectorAll("a").forEach((tautan) => {
    tautan.addEventListener("click", () => {
      tautanNav.classList.remove("open");
      tombolNav.querySelector("i").classList.replace("fa-times", "fa-bars");
    });
  });

  // Efek bayangan navigasi saat scroll
  window.addEventListener("scroll", () => {
    if (navigasi) {
      navigasi.style.boxShadow =
        window.scrollY > 40
          ? "0 2px 24px rgba(29,74,29,0.15)"
          : "0 2px 20px rgba(29,74,29,0.07)";
    }
  });

  /* =============================================
     2. LOGIKA DASHBOARD (Tampilan Umum)
     ============================================= */
  const teksTanggal = document.getElementById("dashDate");
  if (teksTanggal) {
    teksTanggal.textContent = new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  const tombolSamping = document.getElementById("sidebarToggle");
  const bilahSamping = document.getElementById("sidebar");

  tombolSamping?.addEventListener("click", () =>
    bilahSamping.classList.toggle("open"),
  );

  // Tutup sidebar jika klik di luar area (untuk versi mobile)
  document.addEventListener("click", (e) => {
    if (
      window.innerWidth <= 900 &&
      bilahSamping &&
      !bilahSamping.contains(e.target) &&
      e.target !== tombolSamping
    ) {
      bilahSamping.classList.remove("open");
    }
  });

  /* =============================================
     3. KALKULATOR & RIWAYAT DATA
     ============================================= */
  const inputKotor = document.getElementById("beratKotor");
  const inputKosong = document.getElementById("beratKosong");
  const inputHarga = document.getElementById("hargaPerKg");
  const tombolKirim = document.getElementById("btnKirim");
  const tabelRiwayat = document.getElementById("historyBody");
  const tampilanBeratBersih = document.getElementById("beratBersihDisplay");

  let dataRiwayat = [];

  // Fungsi Inti untuk menghitung semua variabel
  const ambilHasilKalkulasi = () => {
    const kotor = parseFloat(inputKotor?.value) || 0;
    const kosong = parseFloat(inputKosong?.value) || 0;
    const harga = parseFloat(inputHarga?.value) || 0;

    const beratBersih = Math.max(0, kotor - kosong);
    const totalKotor = beratBersih * harga;

    return {
      kotor,
      kosong,
      harga,
      beratBersih,
      totalKotor,
      gajiMuat: totalKotor * 0.03,
      gajiAdmin: totalKotor * 0.03,
      keuntunganBersih: totalKotor * 0.94, // Sisa 94% untuk pengepul
    };
  };

  // Fungsi untuk memperbarui angka di layar (Real-time)
  const perbaruiTampilan = () => {
    if (!inputKotor || !inputKosong || !inputHarga) return;

    const hasil = ambilHasilKalkulasi();

    // Perbarui Tampilan Berat Bersih
    if (hasil.beratBersih > 0) {
      tampilanBeratBersih.innerHTML = `
        <i class="fas fa-check-circle" style="color:var(--green-mid)"></i>
        <strong>Berat Bersih Sawit: ${formatKg(hasil.beratBersih)}</strong>
        <span style="color:var(--text-light);font-size:0.82rem;margin-left:0.5rem">(${formatKg(hasil.kotor)} – ${formatKg(hasil.kosong)})</span>
      `;
      tampilanBeratBersih.style.cssText =
        "background: var(--green-pale); border-color: var(--green-light);";
    } else {
      tampilanBeratBersih.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <span>Berat Bersih akan tampil di sini setelah data diisi</span>
      `;
      tampilanBeratBersih.style.cssText = "";
    }

    // Perbarui Kartu Hasil Pendapatan
    setTeksAnimasi("totalKotor", formatRp(hasil.totalKotor));
    setTeksAnimasi("gajiMuat", formatRp(hasil.gajiMuat));
    setTeksAnimasi("gajiAdmin", formatRp(hasil.gajiAdmin));
    setTeksAnimasi("keuntunganBersih", formatRp(hasil.keuntunganBersih));

    // Perbarui Subteks Total Kotor
    const subTotal = document.getElementById("totalKotorSub");
    if (subTotal) {
      subTotal.textContent =
        hasil.beratBersih > 0
          ? `${formatKg(hasil.beratBersih)} × ${formatRp(hasil.harga).replace("Rp\u00a0", "Rp ")}/Kg`
          : "—";
    }
  };

  // Fungsi untuk merender ulang tabel riwayat
  const renderRiwayat = () => {
    if (!tabelRiwayat) return;
    tabelRiwayat.innerHTML = dataRiwayat
      .map(
        (data, indeks) => `
      <tr>
        <td>${indeks + 1}</td>
        <td>${data.tanggal}</td>
        <td>${formatKg(data.beratBersih)}</td>
        <td>${formatRp(data.totalKotor)}</td>
        <td>${formatRp(data.gajiMuat)}</td>
        <td>${formatRp(data.gajiAdmin)}</td>
        <td>${formatRp(data.keuntunganBersih)}</td>
      </tr>
    `,
      )
      .join("");
  };

  // Pantau setiap ketikan pada input kalkulator
  [inputKotor, inputKosong, inputHarga].forEach((input) => {
    input?.addEventListener("input", perbaruiTampilan);
  });

  // Panggil sekali di awal untuk memastikan tampilan *reset*
  perbaruiTampilan();

  // Aksi saat tombol "Kirim ke Riwayat" ditekan
  tombolKirim?.addEventListener("click", () => {
    const hasil = ambilHasilKalkulasi();

    if (hasil.kotor <= 0 || hasil.harga <= 0) {
      alert("Silakan isi data terlebih dahulu.");
      return;
    }

    // Simpan data terbaru di urutan paling atas array (unshift)
    dataRiwayat.unshift({
      tanggal: new Date().toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      ...hasil, // Memasukkan seluruh objek 'hasil' ke dalam riwayat
    });

    renderRiwayat();
    a;
    alert("Data berhasil ditambahkan ke riwayat.");
  });

  // Fungsi bantuan untuk memberi efek kedip saat angka berubah
  function setTeksAnimasi(id, teks) {
    const elemen = document.getElementById(id);
    if (elemen) {
      elemen.textContent = teks;
      elemen.style.transition = "color 0.2s";
      elemen.style.color = "var(--gold)";
      setTimeout(() => {
        elemen.style.color = "";
      }, 200);
    }
  }
});
