// =========================================================
//  SIMAS – script.js  |  Vanilla JavaScript
// =========================================================

/* ---- Helpers ---- */
const fmt = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

const fmtKg = (n) => new Intl.NumberFormat("id-ID").format(n) + " Kg";

/* =============================================
   LANDING PAGE – Navbar Mobile Toggle
   ============================================= */
document.addEventListener("DOMContentLoaded", () => {
  // --- Navbar toggle ---
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      const icon = navToggle.querySelector("i");
      icon.classList.toggle("fa-bars");
      icon.classList.toggle("fa-times");
    });
    // Close on link click
    navLinks.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        navLinks.classList.remove("open");
        const icon = navToggle.querySelector("i");
        icon.classList.add("fa-bars");
        icon.classList.remove("fa-times");
      });
    });
  }

  // --- Navbar scroll style ---
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.style.boxShadow =
        window.scrollY > 40
          ? "0 2px 24px rgba(29,74,29,0.15)"
          : "0 2px 20px rgba(29,74,29,0.07)";
    });
  }

  /* =============================================
     DASHBOARD PAGE
     ============================================= */

  // --- Date display ---
  const dashDate = document.getElementById("dashDate");
  if (dashDate) {
    const now = new Date();
    dashDate.textContent = now.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  // --- Sidebar toggle (mobile) ---
  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebar = document.getElementById("sidebar");
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
    // Close sidebar when clicking outside on mobile
    document.addEventListener("click", (e) => {
      if (window.innerWidth <= 900) {
        if (!sidebar.contains(e.target) && e.target !== sidebarToggle) {
          sidebar.classList.remove("open");
        }
      }
    });
  }

  /* =============================================
     KALKULATOR – Real-time Input Listener
     ============================================= */
  const inputBeratKotor = document.getElementById("beratKotor");
  const inputBeratKosong = document.getElementById("beratKosong");
  const inputHarga = document.getElementById("hargaPerKg");

  if (inputBeratKotor && inputBeratKosong && inputHarga) {
    [inputBeratKotor, inputBeratKosong, inputHarga].forEach((el) => {
      el.addEventListener("input", hitungSemua);
    });
    hitungSemua(); // initial call
  }

  function hitungSemua() {
    const kotor = parseFloat(inputBeratKotor.value) || 0;
    const kosong = parseFloat(inputBeratKosong.value) || 0;
    const harga = parseFloat(inputHarga.value) || 0;

    // --- Core calculations ---
    const beratBersih = Math.max(0, kotor - kosong);
    const totalKotor = beratBersih * harga;
    const gajiMuat = totalKotor * 0.03;
    const gajiAdmin = totalKotor * 0.03;
    const keuntunganBersih = totalKotor - gajiMuat - gajiAdmin;

    // --- Update berat bersih display ---
    const bbDisplay = document.getElementById("beratBersihDisplay");
    if (bbDisplay) {
      if (beratBersih > 0) {
        bbDisplay.innerHTML = `<i class="fas fa-check-circle" style="color:var(--green-mid)"></i>
          <strong>Berat Bersih Sawit: ${fmtKg(beratBersih)}</strong>
          <span style="color:var(--text-light);font-size:0.82rem;margin-left:0.5rem">
            (${fmtKg(kotor)} – ${fmtKg(kosong)})
          </span>`;
        bbDisplay.style.background = "var(--green-pale)";
        bbDisplay.style.borderColor = "var(--green-light)";
      } else {
        bbDisplay.innerHTML = `<i class="fas fa-info-circle"></i>
          <span>Berat Bersih akan tampil di sini setelah data diisi</span>`;
        bbDisplay.style.background = "";
        bbDisplay.style.borderColor = "";
      }
    }

    // --- Update result cards ---
    setVal("totalKotor", fmt(totalKotor));
    setVal("gajiMuat", fmt(gajiMuat));
    setVal("gajiAdmin", fmt(gajiAdmin));
    setVal("keuntunganBersih", fmt(keuntunganBersih));

    // Sub labels
    const subTK = document.getElementById("totalKotorSub");
    if (subTK) {
      subTK.textContent =
        beratBersih > 0
          ? `${fmtKg(beratBersih)} × ${fmt(harga).replace("Rp\u00a0", "Rp ")}/Kg`
          : "—";
    }

    // --- Distribution bar animation ---
    if (totalKotor > 0) {
      const pctProfit = ((keuntunganBersih / totalKotor) * 100).toFixed(1);
      const dvProfit = document.getElementById("dvProfit");
      const dvMuat = document.getElementById("dvMuat");
      const dvAdmin = document.getElementById("dvAdmin");
      if (dvProfit) {
        dvProfit.style.width = pctProfit + "%";
        dvProfit.querySelector("span").textContent = `Pengepul ${pctProfit}%`;
      }
      if (dvMuat) dvMuat.style.width = "3%";
      if (dvAdmin) dvAdmin.style.width = "3%";
    }
  }

  function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = val;
      // Pulse animation on update
      el.style.transition = "color 0.2s";
      el.style.color = "var(--gold)";
      setTimeout(() => {
        el.style.color = "";
      }, 200);
    }
  }
});
