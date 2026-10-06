
// ==========================================
// JOURNIFY
// SISTEM PENYIMPANAN JURNAL
// ==========================================


// Ambil elemen dari HTML

const modal = document.getElementById("journalModal");

const journalList = document.getElementById("journalList");

const emptyMessage = document.getElementById("emptyMessage");

const count = document.getElementById("journalCount");


// ==========================================
// AMBIL DATA JURNAL DARI LOCAL STORAGE
// ==========================================

// Kalau belum ada jurnal, gunakan array kosong

let journals =
    JSON.parse(localStorage.getItem("journals")) || [];


// ==========================================
// BUKA MODAL
// ==========================================

function openModal() {

    modal.classList.add("show");

}


// ==========================================
// TUTUP MODAL
// ==========================================

function closeModal() {

    modal.classList.remove("show");

}


// Klik area luar modal untuk menutup

modal.addEventListener("click", function(event) {

    if (event.target === modal) {

        closeModal();

    }

});


// ==========================================
// TAMBAH JURNAL
// ==========================================

function addJournal() {

    const title =
        document
            .getElementById("journalTitle")
            .value
            .trim();


    const mood =
        document
            .getElementById("journalMood")
            .value;


    const text =
        document
            .getElementById("journalText")
            .value
            .trim();


    // Cek apakah judul dan isi kosong

    if (title === "" || text === "") {

        alert("Judul dan isi jurnal wajib diisi.");

        return;

    }


    // Ambil tanggal sekarang

    const today = new Date();


    const day =
        String(today.getDate()).padStart(2, "0");


    const months = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC"
    ];


    const month =
        months[today.getMonth()];


    const year =
        today.getFullYear();


    // Buat data jurnal baru

    const newJournal = {

        id: Date.now(),

        date: `${day} ${month} ${year}`,

        title: title,

        mood: mood,

        text: text

    };


    // Masukkan jurnal baru ke paling atas

    journals.unshift(newJournal);


    // Simpan ke browser

    saveJournals();


    // Tampilkan jurnal

    renderJournals();


    // Kosongkan form

    document
        .getElementById("journalTitle")
        .value = "";


    document
        .getElementById("journalText")
        .value = "";


    // Tutup modal

    closeModal();

}


// ==========================================
// MENAMPILKAN JURNAL
// ==========================================

function renderJournals() {

    // Bersihkan tampilan sebelumnya

    journalList.innerHTML = "";


    // Kalau belum ada jurnal

    if (journals.length === 0) {

        emptyMessage.style.display = "block";

        count.textContent = "0 entries";

        return;

    }


    emptyMessage.style.display = "none";


    // Buat kartu untuk setiap jurnal

    journals.forEach(function(journal) {

        const article =
            document.createElement("article");


        article.className = "journal-card";


        article.innerHTML = `

            <div class="card-top">

                <span>
                    ${journal.date}
                </span>

                <span class="mood">
                    ${escapeHTML(journal.mood)}
                </span>

            </div>


            <h3>
                ${escapeHTML(journal.title)}
            </h3>


            <p>
                ${escapeHTML(journal.text)}
            </p>


            <div class="card-bottom">

                <span>
                    📖 Personal
                </span>


                <button
                    onclick="deleteJournal(${journal.id})"
                    title="Hapus jurnal"
                >
                    🗑
                </button>

            </div>

        `;


        journalList.appendChild(article);

    });


    updateCount();

}


// ==========================================
// HAPUS JURNAL
// ==========================================

function deleteJournal(id) {

    const yakin =
        confirm("Yakin ingin menghapus jurnal ini?");


    if (!yakin) {

        return;

    }


    // Hapus berdasarkan ID

    journals =
        journals.filter(function(journal) {

            return journal.id !== id;

        });


    // Simpan perubahan

    saveJournals();


    // Tampilkan ulang

    renderJournals();

}


// ==========================================
// SIMPAN JURNAL
// ==========================================

function saveJournals() {

    localStorage.setItem(

        "journals",

        JSON.stringify(journals)

    );

}


// ==========================================
// PENCARIAN JURNAL
// ==========================================

function searchJournal() {

    const keyword =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase();


    const cards =
        document.querySelectorAll(".journal-card");


    let visible = 0;


    cards.forEach(function(card) {

        const content =
            card.innerText.toLowerCase();


        if (content.includes(keyword)) {

            card.style.display = "";

            visible++;

        }

        else {

            card.style.display = "none";

        }

    });


    // Kalau tidak ada hasil

    emptyMessage.style.display =
        visible === 0
            ? "block"
            : "none";

}


// ==========================================
// TAMPILKAN SEMUA
// ==========================================

function showAll() {

    document
        .getElementById("searchInput")
        .value = "";


    document
        .querySelectorAll(".journal-card")
        .forEach(function(card) {

            card.style.display = "";

        });


    emptyMessage.style.display = "none";

}


// ==========================================
// UPDATE JUMLAH JURNAL
// ==========================================

function updateCount() {

    const total = journals.length;


    count.textContent =
        total +
        (total === 1
            ? " entry"
            : " entries");

}


// ==========================================
// MENCEGAH HTML BERBAHAYA
// ==========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent = text;


    return div.innerHTML;

}


// ==========================================
// JALANKAN SAAT WEBSITE DIBUKA
// ==========================================

// Ini yang membuat jurnal tetap muncul
// setelah halaman di-refresh.

renderJournals();