const canvas = document.getElementById("outputCanvas");
const ctx = canvas.getContext("2d");

const coordinate = document.getElementById("coordinate");
const basket = document.getElementById("basket");

// Posisi awal keranjang
let basketX = 320;

const hands = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
});

hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 0,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.6
});

hands.onResults((results) => {

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {

        statusText.textContent = "🟢 HAND DETECTED";

        const landmarks = results.multiHandLandmarks[0];

        drawConnectors(
            ctx,
            landmarks,
            HAND_CONNECTIONS,
            {
                color: "#00FF00",
                lineWidth: 3
            }
        );

        drawLandmarks(
            ctx,
            landmarks,
            {
                color: "#FF0000",
                radius: 4
            }
        );

        const indexFinger = landmarks[8];

        const x = Math.round(indexFinger.x * canvas.width);
        const y = Math.round(indexFinger.y * canvas.height);

        coordinate.innerHTML = `
            X : ${x}<br>
            Y : ${y}
        `;

        // Gerakan keranjang dibuat halus
        basketX += (x - basketX) * 0.2;

        // Lebar keranjang 150px, jadi geser 75px agar titik tengah tepat di jari
        basket.style.left = `${basketX - 75}px`;

        // Kirim posisi keranjang ke egg.js
        window.basketX = basketX;

    } else {

        statusText.textContent = "🔴 Tangan tidak terdeteksi (geser keranjang pakai jari)";

    }

});

// =========================
// Kontrol sentuh/geser (fallback, selalu aktif)
// Berguna untuk HP yang tidak kuat menjalankan AI hand tracking
// =========================

function moveBasketToPointer(clientX) {

    const wrapperRect = document.querySelector(".camera-wrapper").getBoundingClientRect();

    let relativeX = clientX - wrapperRect.left;

    // Batasi agar keranjang tidak keluar area
    relativeX = Math.max(75, Math.min(wrapperRect.width - 75, relativeX));

    basketX = relativeX;

    basket.style.left = `${basketX - 75}px`;

    window.basketX = basketX;

}

const cameraWrapperEl = document.querySelector(".camera-wrapper");

cameraWrapperEl.addEventListener("touchmove", (e) => {

    e.preventDefault();

    if (e.touches && e.touches.length > 0) {
        moveBasketToPointer(e.touches[0].clientX);
    }

}, { passive: false });

cameraWrapperEl.addEventListener("touchstart", (e) => {

    if (e.touches && e.touches.length > 0) {
        moveBasketToPointer(e.touches[0].clientX);
    }

}, { passive: false });

// Dukungan mouse juga, untuk laptop/desktop tanpa AI tracking aktif
let isDragging = false;

cameraWrapperEl.addEventListener("mousedown", (e) => {
    isDragging = true;
    moveBasketToPointer(e.clientX);
});

window.addEventListener("mousemove", (e) => {
    if (isDragging) {
        moveBasketToPointer(e.clientX);
    }
});

window.addEventListener("mouseup", () => {
    isDragging = false;
});