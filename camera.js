const video = document.getElementById("camera");
const statusText = document.getElementById("status");

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 480 },
                height: { ideal: 360 },
                facingMode: "user"
            },
            audio: false
        });

        video.srcObject = stream;

        video.onloadedmetadata = () => {
            video.play();
            statusText.textContent = "🟢 Kamera aktif";

            detectHands();
        };

    } catch (error) {
        console.error(error);

        statusText.textContent = "🔴 Kamera tidak diizinkan";

        alert("Kamera tidak diizinkan atau tidak ditemukan.");
    }
}

async function detectHands() {

    await hands.send({
        image: video
    });

    requestAnimationFrame(detectHands);

}

startCamera();