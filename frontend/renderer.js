// Welcome Screen Transition
const welcomeScreen = document.getElementById("welcome-screen");
const mainApp = document.getElementById("main-app");
// When the "Start Analysis" button is clicked, navigate directly to upload.html
const startBtn = document.getElementById("start-btn");
if (startBtn) {
  startBtn.addEventListener("click", () => {
    window.location.href = "upload.html";
  });
}

// Stars Effect (unchanged)
const canvas = document.getElementById("stars");
if (canvas) {
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  const stars = Array.from({ length: 300 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 2 + 1,
    speed: Math.random() * 0.5 + 0.1,
  }));

  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach((star) => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#fdfdfd";
      ctx.fill();
      star.x -= star.speed;
      if (star.x < 0) {
        star.x = canvas.width;
        star.y = Math.random() * canvas.height;
      }
    });
    requestAnimationFrame(drawStars);
  }
  drawStars();
}

// Navigation from main app to upload page
const analyzeButton = document.querySelector(".analyze-btn");
if (analyzeButton) {
  analyzeButton.addEventListener("click", () => {
    window.location.href = "upload.html";
  });
}

// Upload page buttons and file input handling
const fileInput = document.getElementById("file-upload");
const uploadBtn = document.getElementById("submit-btn");
const filePreview = document.getElementById("file-preview");
const backBtn = document.getElementById("back-btn");

// Navigate back to the main screen
if (backBtn) {
  backBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

// Display selected files on upload page
if (fileInput) {
  fileInput.addEventListener("change", () => {
    const files = fileInput.files;
    filePreview.innerHTML = ""; // Clear previous previews

    if (files.length > 0) {
      Array.from(files).forEach((file) => {
        const fileName = document.createElement("p");
        fileName.textContent = `✔️ ${file.name}`;
        filePreview.appendChild(fileName);
      });
    } else {
      filePreview.innerHTML = `<p class="preview-text">No files uploaded yet.</p>`;
    }
  });
}

// Upload files to FastAPI backend
// Upload files to FastAPI backend
if (uploadBtn) {
  uploadBtn.addEventListener("click", async () => {
    const files = fileInput.files;
    if (files.length === 0) {
      alert("❌ Please select files before uploading!");
      return;
    }

    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Response:", result);

      // Display success message
      alert(`✅ Successfully uploaded ${files.length} file(s)!`);

      // Create and add analyze button
      const analyzeBtn = document.createElement('button');
      analyzeBtn.textContent = 'Go to Analyze';
      analyzeBtn.className = 'btn analyze-btn';
      analyzeBtn.style.margin = '20px auto';
      analyzeBtn.addEventListener('click', async () => {
        try {
          // Use the exposed electronAPI instead of window.electron.store
          await window.electronAPI.storeImages(result.files);
          window.location.href = 'analysis.html';
        } catch (error) {
          console.error('Failed to store images:', error);
          alert('Failed to store images for analysis');
        }
      });
      document.querySelector('.container').appendChild(analyzeBtn);

      // Display converted file names
      filePreview.innerHTML = "";
      result.files.forEach((file) => {
        const fileName = document.createElement("p");
        fileName.textContent = `✔️ Converted: ${file.original} ➡️ ${file.path}`;
        filePreview.appendChild(fileName);
      });
    } catch (error) {
      console.error("Upload failed:", error);
      alert(`❌ Upload failed: ${error.message}`);
    }
  });
}
