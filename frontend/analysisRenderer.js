const canvas = document.getElementById('xray-canvas');
const ctx = canvas.getContext('2d');
let currentIndex = 0;
let images = [];

async function loadImage(index) {
    const img = new Image();
    try {
        const filename = images[index].path;
        const absolutePath = await window.electronAPI.getAbsolutePath(filename);
        console.log(`Loading image: ${absolutePath}`);
        img.src = `file://${absolutePath}`;
        img.crossOrigin = 'Anonymous';

        await new Promise((resolve, reject) => {
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const scale = Math.min(
                    canvas.width / img.width, 
                    canvas.height / img.height
                );
                const x = (canvas.width - img.width * scale) / 2;
                const y = (canvas.height - img.height * scale) / 2;
                ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                resolve();
            };
            img.onerror = () => reject(new Error('Failed to load image'));
        });
    } catch (error) {
        alert(`Error loading image: ${error.message}`);
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    try {
        images = await window.electronAPI.getImages();
        if (!images?.length) {
            alert('No images found!');
            window.location.href = 'upload.html';
            return;
        }
        
        // Convert paths
        images = await Promise.all(images.map(async img => ({
            ...img,
            path: await window.electronAPI.getAbsolutePath(img.path)
        })));

        await loadImage(currentIndex);
        updateNavButtons();
    } catch (error) {
        alert(`Error: ${error.message}`);
        window.location.href = 'upload.html';
    }
});

// Navigation handlers
document.getElementById('prev-btn').addEventListener('click', async () => {
    if (currentIndex > 0) {
        currentIndex--;
        await loadImage(currentIndex);
        updateNavButtons();
    }
});

document.getElementById('next-btn').addEventListener('click', async () => {
    if (currentIndex < images.length - 1) {
        currentIndex++;
        await loadImage(currentIndex);
        updateNavButtons();
    }
});

document.getElementById('back-to-upload').addEventListener('click', () => {
    window.electronAPI.storeImages([]);
    window.location.href = 'upload.html';
});

function updateNavButtons() {
    const prev = document.getElementById('prev-btn');
    const next = document.getElementById('next-btn');
    prev.disabled = currentIndex === 0;
    next.disabled = currentIndex === images.length - 1;
}