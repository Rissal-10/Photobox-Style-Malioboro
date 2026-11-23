// DOM Elements
const cameraSection = document.getElementById('camera-section');
const resultSection = document.getElementById('result-section');
const camera = document.getElementById('camera');
const captureCanvas = document.getElementById('capture-canvas');
const captureBtn = document.getElementById('capture-btn');
const generateBtn = document.getElementById('generate-btn');
const resetBtn = document.getElementById('reset-btn');
const downloadBtn = document.getElementById('download-btn');
const downloadVideoBtn = document.getElementById('download-video-btn');
const backBtn = document.getElementById('back-btn');
const flash = document.getElementById('flash');
const photoCount = document.getElementById('photo-count');

// Input Elements
const headlineInput = document.getElementById('headline-input');
const subheadlineInput = document.getElementById('subheadline-input');
const locationInput = document.getElementById('location-input');

// Newspaper Elements
const mainHeadline = document.getElementById('main-headline');
const subHeadline = document.getElementById('sub-headline');
const categoryDisplay = document.getElementById('category-display');
const dateDisplay = document.getElementById('date-display');
const mainPhoto = document.getElementById('main-photo');
const photo2 = document.getElementById('photo-2');
const photo3 = document.getElementById('photo-3');
const photo3Alt = document.getElementById('photo-3-alt');

// Frame Preview Elements
const previewFrame1 = document.getElementById('preview-frame-1');
const previewFrame2 = document.getElementById('preview-frame-2');
const previewFrame3 = document.getElementById('preview-frame-3');

// State
let photos = [];
let livePhotos = []; // Stores frames for live photo effect
let stream = null;
let frameBuffer = []; // Circular buffer for live photo frames
let frameInterval = null;
let liveAnimationIntervals = []; // For newspaper live animations
const BUFFER_SIZE = 30; // Number of frames to keep (about 1 second at 30fps)
const FRAME_RATE = 30; // Frames per second

// Initialize
async function init() {
    await startCamera();
    setCurrentDate();
    setupEventListeners();
}

// Start Camera
async function startCamera() {
    try {
        // Try back camera first for mobile
        const constraints = {
            video: {
                facingMode: 'user',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        };

        stream = await navigator.mediaDevices.getUserMedia(constraints);
        camera.srcObject = stream;
        
        // Start capturing frames for live photo
        startFrameCapture();
        
    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.');
    }
}

// Start Frame Capture for Live Photo
function startFrameCapture() {
    if (frameInterval) {
        clearInterval(frameInterval);
    }
    
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    frameInterval = setInterval(() => {
        if (camera.videoWidth > 0) {
            // HD quality - use full resolution
            tempCanvas.width = camera.videoWidth;
            tempCanvas.height = camera.videoHeight;
            
            // Mirror the image
            tempCtx.translate(tempCanvas.width, 0);
            tempCtx.scale(-1, 1);
            tempCtx.drawImage(camera, 0, 0, tempCanvas.width, tempCanvas.height);
            tempCtx.setTransform(1, 0, 0, 1, 0, 0);
            
            // High quality JPEG
            const frameData = tempCanvas.toDataURL('image/jpeg', 0.92);
            frameBuffer.push(frameData);
            
            // Keep buffer at fixed size
            if (frameBuffer.length > BUFFER_SIZE) {
                frameBuffer.shift();
            }
        }
    }, 1000 / FRAME_RATE);
}

// Stop Frame Capture
function stopFrameCapture() {
    if (frameInterval) {
        clearInterval(frameInterval);
        frameInterval = null;
    }
}

// Stop Camera
function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    stopFrameCapture();
}

// Set Current Date
function setCurrentDate() {
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const today = new Date().toLocaleDateString('en-GB', options);
    dateDisplay.textContent = today;
}

// Setup Event Listeners
function setupEventListeners() {
    captureBtn.addEventListener('click', startTimer);
    generateBtn.addEventListener('click', generateNewspaper);
    resetBtn.addEventListener('click', resetAll);
    downloadBtn.addEventListener('click', downloadNewspaper);
    downloadVideoBtn.addEventListener('click', downloadVideoNewspaper);
    backBtn.addEventListener('click', goBack);
    
    // Input listeners
    headlineInput.addEventListener('input', updateGenerateButton);
    subheadlineInput.addEventListener('input', updateGenerateButton);
    locationInput.addEventListener('input', updateGenerateButton);
}

// Timer state
let isTimerRunning = false;

// Start Timer Countdown
function startTimer() {
    if (photos.length >= 3) {
        alert('Sudah mencapai 3 foto!');
        return;
    }
    
    if (isTimerRunning) {
        return;
    }
    
    // Check if we have enough frames in buffer
    if (frameBuffer.length < 5) {
        alert('Mohon tunggu sebentar, kamera sedang mempersiapkan Live Photo...');
        return;
    }
    
    isTimerRunning = true;
    const timerOverlay = document.getElementById('timer-overlay');
    const timerCount = timerOverlay.querySelector('.timer-count');
    let countdown = 5;
    
    timerOverlay.classList.add('active');
    timerCount.textContent = countdown;
    captureBtn.disabled = true;
    
    const timerInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            timerCount.textContent = countdown;
        } else {
            clearInterval(timerInterval);
            timerOverlay.classList.remove('active');
            captureBtn.disabled = false;
            isTimerRunning = false;
            capturePhoto();
        }
    }, 1000);
}

// Capture Photo
function capturePhoto() {
    if (photos.length >= 3) {
        alert('Sudah mencapai 3 foto!');
        return;
    }
    
    // Check if we have enough frames in buffer
    if (frameBuffer.length < 5) {
        alert('Mohon tunggu sebentar, kamera sedang mempersiapkan Live Photo...');
        return;
    }

    // Flash effect
    flash.classList.add('active');
    setTimeout(() => flash.classList.remove('active'), 300);

    // Capture from video
    const ctx = captureCanvas.getContext('2d');
    captureCanvas.width = camera.videoWidth;
    captureCanvas.height = camera.videoHeight;
    
    // Mirror the image
    ctx.translate(captureCanvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(camera, 0, 0);
    
    // Get data URL
    const dataURL = captureCanvas.toDataURL('image/jpeg', 0.9);
    photos.push(dataURL);
    
    // Save live photo frames (copy current buffer) - make sure we have frames
    const liveFrames = frameBuffer.length > 0 ? [...frameBuffer] : [dataURL];
    livePhotos.push(liveFrames);
    
    console.log(`Captured photo ${photos.length} with ${liveFrames.length} live frames`);

    // Update thumbnail with live photo capability
    const thumbIndex = photos.length;
    const thumb = document.getElementById(`thumb-${thumbIndex}`);
    thumb.classList.add('captured');
    thumb.querySelector('img').src = dataURL;
    
    // Add live photo indicator
    if (!thumb.querySelector('.live-photo-badge')) {
        const badge = document.createElement('div');
        badge.className = 'live-photo-badge';
        badge.innerHTML = 'LIVE';
        thumb.appendChild(badge);
    }
    
    // Setup live photo hover effect
    setupLivePhotoEffect(thumb, thumbIndex - 1);

    // Update counter
    photoCount.textContent = photos.length;

    // Play sound effect (optional)
    playShutterSound();

    updateGenerateButton();
}

// Setup Live Photo Effect on Thumbnail
function setupLivePhotoEffect(thumb, index) {
    let animationInterval = null;
    let currentFrame = 0;
    const img = thumb.querySelector('img');
    const originalSrc = photos[index];
    const frames = livePhotos[index];
    
    thumb.addEventListener('mouseenter', () => {
        if (frames && frames.length > 0) {
            currentFrame = 0;
            animationInterval = setInterval(() => {
                img.src = frames[currentFrame];
                currentFrame = (currentFrame + 1) % frames.length;
            }, 50);
        }
    });
    
    thumb.addEventListener('mouseleave', () => {
        if (animationInterval) {
            clearInterval(animationInterval);
            animationInterval = null;
        }
        img.src = originalSrc;
    });
    
    // Touch support for mobile
    thumb.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (frames && frames.length > 0) {
            currentFrame = 0;
            animationInterval = setInterval(() => {
                img.src = frames[currentFrame];
                currentFrame = (currentFrame + 1) % frames.length;
            }, 50);
        }
    });
    
    thumb.addEventListener('touchend', () => {
        if (animationInterval) {
            clearInterval(animationInterval);
            animationInterval = null;
        }
        img.src = originalSrc;
    });
}

// Play Shutter Sound
function playShutterSound() {
    // Create a simple click sound using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 1000;
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Audio not supported
    }
}

// Update Generate Button State
function updateGenerateButton() {
    const hasAllPhotos = photos.length === 3;
    const hasHeadline = headlineInput.value.trim().length > 0;
    
    generateBtn.disabled = !(hasAllPhotos && hasHeadline);
}

// Generate Newspaper
function generateNewspaper() {
    if (photos.length < 3) {
        alert('Ambil 3 foto terlebih dahulu!');
        return;
    }

    // Update newspaper content
    mainHeadline.textContent = headlineInput.value.toUpperCase() || 'HEADLINE';
    subHeadline.textContent = subheadlineInput.value || 'A Timeless Journey Through Life\'s Beautiful Moments';
    categoryDisplay.textContent = locationInput.value.toUpperCase() || 'PLACE TO GO';

    // Set photos (will be animated)
    mainPhoto.src = photos[0];
    photo2.src = photos[1];
    photo3.src = photos[2];
    if (photo3Alt) photo3Alt.src = photos[2];
    
    // Set frame preview (static photos for review)
    previewFrame1.src = photos[0];
    previewFrame2.src = photos[1];
    previewFrame3.src = photos[2];

    // Switch to result section
    cameraSection.classList.remove('active');
    resultSection.classList.add('active');

    // Start live photo looping animations on newspaper
    startNewspaperLiveAnimations();

    // Stop camera to save battery
    stopCamera();
}

// Start Live Photo Animations on Newspaper (for video recording)
function startNewspaperLiveAnimations() {
    // Clear any existing animations
    stopNewspaperLiveAnimations();
    
    const photoElements = [
        { img: mainPhoto, frames: livePhotos[0], original: photos[0] },
        { img: photo2, frames: livePhotos[1], original: photos[1] },
        { img: photo3, frames: livePhotos[2], original: photos[2] },
        { img: photo3Alt, frames: livePhotos[2], original: photos[2] }
    ];
    
    photoElements.forEach((item, index) => {
        if (item.frames && item.frames.length > 0) {
            let currentFrame = 0;
            const interval = setInterval(() => {
                item.img.src = item.frames[currentFrame];
                currentFrame = (currentFrame + 1) % item.frames.length;
            }, 80); // Slightly slower for better viewing
            liveAnimationIntervals.push(interval);
        }
    });
}

// Stop Live Photo Animations on Newspaper
function stopNewspaperLiveAnimations() {
    liveAnimationIntervals.forEach(interval => clearInterval(interval));
    liveAnimationIntervals = [];
    
    // Reset to original photos
    if (photos[0]) mainPhoto.src = photos[0];
    if (photos[1]) photo2.src = photos[1];
    if (photos[2]) {
        photo3.src = photos[2];
        if (photo3Alt) photo3Alt.src = photos[2];
    }
}

// Download Newspaper (Static Image)
async function downloadNewspaper() {
    const newspaper = document.getElementById('newspaper');
    
    // Stop animations temporarily
    stopNewspaperLiveAnimations();
    
    // Helper function to load image
    const loadImage = (src) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = src;
        });
    };
    
    // Ensure static photos are shown
    mainPhoto.src = photos[0];
    photo2.src = photos[1];
    photo3.src = photos[2];
    if (photo3Alt) photo3Alt.src = photos[2];
    
    // Wait for all images to fully load
    await Promise.all([
        loadImage(photos[0]),
        loadImage(photos[1]),
        loadImage(photos[2])
    ]);
    
    // Additional wait for DOM update
    await new Promise(resolve => setTimeout(resolve, 150));
    
    try {
        downloadBtn.textContent = 'Memproses...';
        downloadBtn.disabled = true;

        const canvas = await html2canvas(newspaper, {
            scale: 2,
            backgroundColor: '#f8f0e3',
            useCORS: true,
            logging: false,
            allowTaint: true,
            imageTimeout: 0
        });

        // Create download link
        const link = document.createElement('a');
        link.download = `photobox-koran-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        downloadBtn.textContent = 'Download Gambar';
        downloadBtn.disabled = false;
        
        // Restart animations
        startNewspaperLiveAnimations();

    } catch (error) {
        console.error('Error generating image:', error);
        alert('Gagal mengunduh gambar. Coba lagi.');
        downloadBtn.textContent = 'Download Gambar';
        downloadBtn.disabled = false;
        startNewspaperLiveAnimations();
    }
}

// Download Video with Live Photo (using pre-captured frames - no re-recording)
async function downloadVideoNewspaper() {
    const newspaper = document.getElementById('newspaper');
    const videoCanvas = document.getElementById('video-canvas');
    const ctx = videoCanvas.getContext('2d');
    
    // Check if we have live photos
    const hasLivePhotos = livePhotos.some(lp => lp && lp.length > 0);
    if (!hasLivePhotos) {
        alert('Tidak ada Live Photo untuk direkam. Pastikan frame sudah tercapture saat mengambil foto.');
        return;
    }
    
    try {
        downloadVideoBtn.textContent = 'Membuat Video...';
        downloadVideoBtn.disabled = true;
        
        // Stop current animations temporarily
        stopNewspaperLiveAnimations();
        
        // HD Resolution - match newspaper EXACTLY
        const scale = 2; // 2x for HD quality
        const newspaperRect = newspaper.getBoundingClientRect();
        videoCanvas.width = newspaper.offsetWidth * scale;
        videoCanvas.height = newspaper.offsetHeight * scale;
        
        // Use ALL frames for smooth animation (no skip)
        const maxFrames = Math.max(
            livePhotos[0]?.length || 0,
            livePhotos[1]?.length || 0,
            livePhotos[2]?.length || 0
        );
        
        if (maxFrames === 0) {
            alert('Tidak ada frame Live Photo yang tersedia.');
            downloadVideoBtn.textContent = 'Download Video Live';
            downloadVideoBtn.disabled = false;
            startNewspaperLiveAnimations();
            return;
        }
        
        // Helper function to wait for image load
        const waitForImage = (img, src) => {
            return new Promise((resolve) => {
                if (img.complete && img.src === src) {
                    resolve();
                    return;
                }
                const onLoad = () => {
                    img.removeEventListener('load', onLoad);
                    resolve();
                };
                img.addEventListener('load', onLoad);
                img.src = src;
                // Timeout fallback
                setTimeout(resolve, 100);
            });
        };
        
        // Pre-render frames
        downloadVideoBtn.textContent = 'Rendering...';
        const renderedFrames = [];
        
        for (let i = 0; i < maxFrames; i++) {
            // Get frames for this index
            const frame0 = livePhotos[0]?.[i % (livePhotos[0]?.length || 1)] || photos[0];
            const frame1 = livePhotos[1]?.[i % (livePhotos[1]?.length || 1)] || photos[1];
            const frame2 = livePhotos[2]?.[i % (livePhotos[2]?.length || 1)] || photos[2];
            
            // Wait for all images to load properly
            await Promise.all([
                waitForImage(mainPhoto, frame0),
                waitForImage(photo2, frame1),
                waitForImage(photo3, frame2),
                photo3Alt ? waitForImage(photo3Alt, frame2) : Promise.resolve()
            ]);
            
            // Wait for DOM repaint
            await new Promise(resolve => requestAnimationFrame(() => {
                requestAnimationFrame(resolve);
            }));
            
            // Capture newspaper to canvas - HD quality matching preview exactly
            const capturedCanvas = await html2canvas(newspaper, {
                scale: scale,
                backgroundColor: '#f8f0e3',
                useCORS: true,
                logging: false,
                allowTaint: true,
                imageTimeout: 0,
                removeContainer: true,
                foreignObjectRendering: false
            });
            
            renderedFrames.push(capturedCanvas);
            
            // Update progress
            const progress = Math.round((renderedFrames.length / maxFrames) * 30);
            downloadVideoBtn.textContent = `Rendering... ${progress}%`;
        }
        
        // Create HD video
        downloadVideoBtn.textContent = 'Membuat video HD...';
        
        // HD Bitrate - 8Mbps for crisp quality
        const targetBitrate = 10 * 1024 * 1024; // 8Mbps
        
        // 50fps for smooth playback
        const fps = 60;
        const stream = videoCanvas.captureStream(fps);
        
        // Try MP4 first (H.264), then VP9, then VP8
        let mimeType = 'video/mp4;codecs=avc1.42E01E';
        let fileExtension = 'mp4';
        
        if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = 'video/mp4';
        }
        if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = 'video/webm;codecs=vp9';
            fileExtension = 'webm';
        }
        if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = 'video/webm;codecs=vp8';
            fileExtension = 'webm';
        }
        if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = 'video/webm';
            fileExtension = 'webm';
        }
        
        console.log(`Using video format: ${mimeType}`);
        
        const mediaRecorder = new MediaRecorder(stream, {
            mimeType: mimeType,
            videoBitsPerSecond: targetBitrate
        });
        
        const chunks = [];
        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunks.push(e.data);
            }
        };
        
        mediaRecorder.onstop = () => {
            const blobType = fileExtension === 'mp4' ? 'video/mp4' : 'video/webm';
            const blob = new Blob(chunks, { type: blobType });
            const fileSizeMB = (blob.size / (1024 * 1024)).toFixed(2);
            console.log(`Video size: ${fileSizeMB}MB, Format: ${fileExtension.toUpperCase()}`);
            
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `photobox-koran-live-${Date.now()}.${fileExtension}`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
            
            downloadVideoBtn.textContent = 'Download Video Live';
            downloadVideoBtn.disabled = false;
            
            // Restart newspaper animations
            startNewspaperLiveAnimations();
        };
        
        // Start recording
        mediaRecorder.start(50); // Collect data every 50ms for faster
        
        // 15 seconds video at 60fps for ultra smooth HD looping
        const targetDuration = 30; // seconds
        const framesPerLoop = renderedFrames.length;
        const totalFramesNeeded = targetDuration * fps;
        const totalFrames = totalFramesNeeded;
        const frameDelay = 1000 / fps; // Correct frame delay
        
        let frameIndex = 0;
        
        const playFrame = () => {
            if (frameIndex >= totalFrames) {
                // Stop immediately
                mediaRecorder.stop();
                return;
            }
            
            const currentFrame = frameIndex % framesPerLoop;
            const frame = renderedFrames[currentFrame];
            
            // Clear canvas with newspaper background color first
            ctx.fillStyle = '#f8f0e3';
            ctx.fillRect(0, 0, videoCanvas.width, videoCanvas.height);
            
            // Draw frame to fit canvas exactly
            ctx.drawImage(frame, 0, 0, videoCanvas.width, videoCanvas.height);
            
            frameIndex++;
            const progress = 30 + Math.round((frameIndex / totalFrames) * 70);
            downloadVideoBtn.textContent = `Merekam... ${progress}%`;
            
            // Playback speed - 60ms per frame for smooth viewing
            setTimeout(playFrame, 60);
        };
        
        // Start playback
        playFrame();
        
    } catch (error) {
        console.error('Error generating video:', error);
        alert('Gagal membuat video. Browser mungkin tidak mendukung fitur ini.');
        downloadVideoBtn.textContent = 'Download Video Live';
        downloadVideoBtn.disabled = false;
        startNewspaperLiveAnimations();
    }
}

// Go Back
async function goBack() {
    // Stop newspaper animations
    stopNewspaperLiveAnimations();
    
    resultSection.classList.remove('active');
    cameraSection.classList.add('active');
    
    // Restart camera
    await startCamera();
}

// Reset All
function resetAll() {
    photos = [];
    livePhotos = [];
    frameBuffer = [];
    photoCount.textContent = '0';
    
    // Reset thumbnails
    for (let i = 1; i <= 3; i++) {
        const thumb = document.getElementById(`thumb-${i}`);
        thumb.classList.remove('captured');
        thumb.querySelector('img').src = '';
        
        // Remove live photo badge
        const badge = thumb.querySelector('.live-photo-badge');
        if (badge) {
            badge.remove();
        }
        
        // Clone and replace to remove event listeners
        const newThumb = thumb.cloneNode(true);
        thumb.parentNode.replaceChild(newThumb, thumb);
    }
    
    // Reset inputs
    headlineInput.value = '';
    subheadlineInput.value = '';
    locationInput.value = '';
    
    updateGenerateButton();
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);

// Handle visibility change to manage camera
document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible' && cameraSection.classList.contains('active')) {
        await startCamera();
    } else if (document.visibilityState === 'hidden') {
        stopCamera();
    }
});
