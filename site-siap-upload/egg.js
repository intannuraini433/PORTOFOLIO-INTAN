const egg = document.getElementById("egg");
const message = document.getElementById("message");
const scoreText = document.getElementById("score");
const livesText = document.getElementById("lives");

const catchSound = new Audio("catch.mp3");
const missionCompleteSound = new Audio("missioncomplete.mp3");
const bgm = new Audio("bgm.mp3");
const gameOverSound = new Audio("gameover.mp3");
bgm.loop = true;
bgm.volume = 0.3;

gameOverSound.volume = 0.8;
missionCompleteSound.volume = 0.8;

const catchEffect = document.getElementById("catchEffect");

const missionPopup = document.getElementById("missionPopup");
const portfolioBtn = document.getElementById("portfolioBtn");
const continueBtn = document.getElementById("continueBtn");
const gameOverPopup = document.getElementById("gameOverPopup");
const restartBtn = document.getElementById("restartBtn");

// =========================
// Variabel Game
// =========================

let score = 0;
let lives = 3;

let eggX = 320;
let eggY = 20;

let eggSpeed = 2;
const eggSpeedAwal = 2;
const eggSpeedMaksimal = 9;
const kenaikanSpeedPerTelur = 0.4;

let eggCaught = false;
let gamePaused = false;

// Popup hanya muncul satu kali
let popupSudahMuncul = false;

// =========================
// Reset Telur
// =========================

function resetEgg() {

    eggY = 20;
    eggX = Math.random() * 500 + 50;

    egg.style.left = `${eggX}px`;
    egg.style.top = `${eggY}px`;

}

function updateLives() {

    if (lives === 3) {
        livesText.textContent = "❤️❤️❤️";
    }

    if (lives === 2) {
        livesText.textContent = "❤️❤️🤍";
    }

    if (lives === 1) {
        livesText.textContent = "❤️🤍🤍";
    }

    if (lives === 0) {
        livesText.textContent = "🤍🤍🤍";
    }

}

// =========================
// Game Loop
// =========================

function moveEgg() {

    // Jika popup muncul, hentikan game sementara
    if (gamePaused) {
        requestAnimationFrame(moveEgg);
        return;
    }

    // Telur turun
    eggY += eggSpeed;

    egg.style.left = `${eggX}px`;
    egg.style.top = `${eggY}px`;

    // Ambil posisi
    const eggRect = egg.getBoundingClientRect();
    const basketRect = window.basket.getBoundingClientRect();

    // =========================
    // Collision
    // =========================

    if (
        !eggCaught &&
        eggRect.left < basketRect.right &&
        eggRect.right > basketRect.left &&
        eggRect.top < basketRect.bottom &&
        eggRect.bottom > basketRect.top
    ) {

        eggCaught = true;

        // Tambah Score
        score++;

        scoreText.textContent = `🥚 Score : ${score}`;

        // Tingkatkan kecepatan telur secara bertahap seiring skor naik
        eggSpeed = Math.min(
            eggSpeedMaksimal,
            eggSpeedAwal + score * kenaikanSpeedPerTelur
        );

        // Suara
        catchSound.currentTime = 0;
        catchSound.play();

        // Pesan
        message.textContent = "🥚 Telur Berhasil Ditangkap!";

        // Efek Kilatan
        catchEffect.style.left = `${eggX}px`;
        catchEffect.style.top = `${eggY}px`;

        catchEffect.classList.remove("catch-animation");
        void catchEffect.offsetWidth;
        catchEffect.classList.add("catch-animation");

        // Popup hanya muncul sekali saat pertama kali mencapai 6
      if (score >= 6 && !popupSudahMuncul) {

    popupSudahMuncul = true;

    gamePaused = true;

    // Pause musik latar
    bgm.pause();

    // Putar suara kemenangan
    missionCompleteSound.currentTime = 0;
    missionCompleteSound.play();

    missionPopup.style.display = "flex";

}
        // Reset telur
        resetEgg();

        // Hilangkan pesan
        setTimeout(() => {

            message.textContent = "";

            eggCaught = false;

        }, 800);

    }

    // =========================
    // Telur jatuh
    // =========================

    if (eggY > 420 && !eggCaught) {

    // Kurangi nyawa
    lives--;

    // Update tampilan hati
    updateLives();

    // Jika nyawa habis
    if (lives <= 0) {

    gamePaused = true;

    bgm.pause();

    gameOverSound.currentTime = 0;
    gameOverSound.play();

    gameOverPopup.style.display = "flex";

    return;

}

    // Lanjutkan permainan
    resetEgg();

}

    requestAnimationFrame(moveEgg);

}

// =========================
// Tombol Popup
// =========================

// Lanjut Bermain
continueBtn.onclick = () => {

    // Tutup popup
    missionPopup.style.display = "none";

    // Lanjutkan permainan
    gamePaused = false;

    // Putar kembali backsound
    bgm.play();

    // Munculkan telur lagi
    resetEgg();

};
restartBtn.onclick = () => {

    // Tutup popup
    gameOverPopup.style.display = "none";

    // Reset score dan nyawa
    score = 0;
    lives = 3;

    // Reset kecepatan telur ke awal
    eggSpeed = eggSpeedAwal;

    // Popup mission bisa muncul lagi
    popupSudahMuncul = false;

    // Reset status game
    gamePaused = false;
    eggCaught = false;
bgm.currentTime = 0;
bgm.play();
    // Reset tampilan
    scoreText.textContent = "🥚 Score : 0";
    updateLives();
    message.textContent = "";

    // Reset posisi telur
    resetEgg();

    // Jalankan game lagi
    moveEgg();

};

// Buka Portfolio
portfolioBtn.onclick = () => {

    window.location.href = "portfolio.html";

};

// =========================
// Mulai Game
// =========================

scoreText.textContent = "🥚 Score : 0";

updateLives();

resetEgg();
bgm.play().catch(() => {
    console.log("Backsound menunggu interaksi pengguna.");
});

moveEgg();
