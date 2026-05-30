const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const btnChoose = document.getElementById('btnChoose');
const queue = document.getElementById('queue');
const tpl = document.getElementById('cardTpl');
const statsRow = document.getElementById('statsRow');
let cards = [];

function fmtSize(b) {
  if (b < 1024) return b + ' B';
  if (b < 1048576) return (b/1024).toFixed(1) + ' KB';
  return (b/1048576).toFixed(2) + ' MB';
}

function updateStats() {
  const done = cards.filter(c => c.__s.compBlob);
  if (!done.length) { statsRow.style.display = 'none'; return; }
  statsRow.style.display = 'grid';
  document.getElementById('statFiles').textContent = done.length;
  const totalOrig = done.reduce((a,c) => a + c.__s.origSize, 0);
  const totalComp = done.reduce((a,c) => a + c.__s.compBlob.size, 0);
  const saved = totalOrig - totalComp;
  const pct = totalOrig > 0 ? Math.round((saved / totalOrig) * 100) : 0;
  document.getElementById('statSaved').textContent = (pct >= 0 ? '-' : '+') + Math.abs(pct) + '%';
  document.getElementById('statSize').textContent = fmtSize(Math.abs(saved));
}

// function compress(card) {
//   const s = card.__s;
//   const quality = parseInt(card.querySelector('.quality-slider').value) / 100;
//   const maxW = parseInt(card.querySelector('.resize-slider').value);
//   const fmt = card.querySelector('.fmt-pill.active').dataset.fmt;

//   const pb = card.querySelector('.prog-fill');
//   const pbWrap = card.querySelector('.prog-bar');
//   const overlay = card.querySelector('.comp-overlay');
//   pbWrap.style.display = 'block';
//   overlay.style.display = 'flex';
//   pb.style.width = '20%';

//   const img = new Image();
//   img.onload = () => {
//     pb.style.width = '55%';
//     let w = img.width, h = img.height;
//     if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
//     const cv = document.createElement('canvas');
//     cv.width = w; cv.height = h;
//     cv.getContext('2d').drawImage(img, 0, 0, w, h);
//     pb.style.width = '80%';
//     const mime = fmt === 'png' ? 'image/png' : fmt === 'webp' ? 'image/webp' : 'image/jpeg';
//     cv.toBlob(blob => {
//       pb.style.width = '100%';
//       setTimeout(() => { pbWrap.style.display = 'none'; pb.style.width = '0%'; }, 350);
//       overlay.style.display = 'none';

//       if (s.compUrl) URL.revokeObjectURL(s.compUrl);
//       s.compUrl = URL.createObjectURL(blob);
//       s.compBlob = blob;
//       s.fmt = fmt;

//       card.querySelector('.comp-img').src = s.compUrl;
//       card.querySelector('.comp-size-val').textContent = fmtSize(blob.size);
//       card.querySelector('.comp-dim').textContent = w + ' × ' + h;

//       const pct = s.origSize > 0 ? Math.round((1 - blob.size / s.origSize) * 100) : 0;
//       const fill = card.querySelector('.savings-fill');
//       const label = card.querySelector('.savings-label');
//       const absPct = Math.abs(pct);
//       const trackPct = Math.min(absPct, 100);

//       if (pct >= 10) {
//         fill.className = 'savings-fill';
//         label.className = 'savings-label';
//         label.textContent = '-' + pct + '%';
//         fill.style.width = trackPct + '%';
//       } else if (pct >= 0) {
//         fill.className = 'savings-fill warn';
//         label.className = 'savings-label warn';
//         label.textContent = '-' + pct + '%';
//         fill.style.width = Math.max(trackPct, 2) + '%';
//       } else {
//         fill.className = 'savings-fill bad';
//         label.className = 'savings-label bad';
//         label.textContent = '+' + absPct + '%';
//         fill.style.width = Math.min(trackPct, 100) + '%';
//       }

//       const dl = card.querySelector('.btn-dl');
//       dl.disabled = false;
//       dl.onclick = () => {
//         const a = document.createElement('a');
//         a.download = s.origName.replace(/\.[^.]+$/, '') + '-compressed.' + s.fmt;
//         a.href = s.compUrl;
//         a.click();
//       };

//       updateStats();
//     }, mime, fmt === 'png' ? undefined : quality);
//   };
//   img.src = s.origUrl;
// }

// function compress(card) {
//   const s = card.__s;
//   const quality = parseInt(card.querySelector('.quality-slider').value) / 100;
//   const maxW = parseInt(card.querySelector('.resize-slider').value);
//   const fmt = card.querySelector('.fmt-pill.active').dataset.fmt;

//   const pb = card.querySelector('.prog-fill');
//   const pbWrap = card.querySelector('.prog-bar');
//   const overlay = card.querySelector('.comp-overlay');
//   pbWrap.style.display = 'block';
//   overlay.style.display = 'flex';
//   pb.style.width = '20%';

//   const img = new Image();
//   img.onload = () => {
//     pb.style.width = '55%';
//     let w = img.width, h = img.height;
//     if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
    
//     const cv = document.createElement('canvas');
//     cv.width = w; cv.height = h;
//     const ctx = cv.getContext('2d');
//     ctx.drawImage(img, 0, 0, w, h);
//     pb.style.width = '80%';

//     // Scope helper function to access card UI elements and state variables seamlessly
//     function handleCompressionSuccess(blob, finalW, finalH) {
//       pb.style.width = '100%';
//       setTimeout(() => { pbWrap.style.display = 'none'; pb.style.width = '0%'; }, 350);
//       overlay.style.display = 'none';

//       if (s.compUrl) URL.revokeObjectURL(s.compUrl);
//       s.compUrl = URL.createObjectURL(blob);
//       s.compBlob = blob;
//       s.fmt = fmt;

//       card.querySelector('.comp-img').src = s.compUrl;
//       card.querySelector('.comp-size-val').textContent = fmtSize(blob.size);
//       card.querySelector('.comp-dim').textContent = finalW + ' × ' + finalH;

//       const pct = s.origSize > 0 ? Math.round((1 - blob.size / s.origSize) * 100) : 0;
//       const fill = card.querySelector('.savings-fill');
//       const label = card.querySelector('.savings-label');
//       const absPct = Math.abs(pct);
//       const trackPct = Math.min(absPct, 100);

//       if (pct >= 10) {
//         fill.className = 'savings-fill';
//         label.className = 'savings-label';
//         label.textContent = '-' + pct + '%';
//         fill.style.width = trackPct + '%';
//       } else if (pct >= 0) {
//         fill.className = 'savings-fill warn';
//         label.className = 'savings-label warn';
//         label.textContent = '-' + pct + '%';
//         fill.style.width = Math.max(trackPct, 2) + '%';
//       } else {
//         fill.className = 'savings-fill bad';
//         label.className = 'savings-label bad';
//         label.textContent = '+' + absPct + '%';
//         fill.style.width = Math.min(trackPct, 100) + '%';
//       }

//       const dl = card.querySelector('.btn-dl');
//       dl.disabled = false;
//       dl.onclick = () => {
//         const a = document.createElement('a');
//         a.download = s.origName.replace(/\.[^.]+$/, '') + '-compressed.' + s.fmt;
//         a.href = s.compUrl;
//         a.click();
//       };

//       updateStats();
//     }

//     // --- Dynamic Routing Router Engine ---
//     if (fmt === 'png') {
//       try {
//         // Extract raw pixel buffer from local canvas sandbox
//         const imgData = ctx.getImageData(0, 0, w, h);
        
//         // Map user 1-100 quality slider to colors depth limit (2 to 256 colors max)
//         const sliderVal = parseInt(card.querySelector('.quality-slider').value);
//         const colorsCount = Math.max(2, Math.round((sliderVal / 100) * 254) + 2);

//         // Run client-side lossy quantize via UPNG.js library
//         const rgbaBuffer = imgData.data.buffer;
//         const encodedPng = UPNG.encode([rgbaBuffer], w, h, colorsCount);
        
//         // Turn typed array bytes directly into standard browser file blob object
//         const blob = new Blob([encodedPng], { type: 'image/png' });
//         handleCompressionSuccess(blob, w, h);
//       } catch (err) {
//         console.error("UPNG execution failure. Reverting to default lossless engine:", err);
//         // Fallback gracefully to vanilla browser lossless mechanism if initialization drops
//         cv.toBlob(blob => handleCompressionSuccess(blob, w, h), 'image/png');
//       }
//     } else {
//       // Clean lossy compression standard pipelines for modern WebP or legacy JPEG
//       const mime = fmt === 'webp' ? 'image/webp' : 'image/jpeg';
//       cv.toBlob(blob => handleCompressionSuccess(blob, w, h), mime, quality);
//     }
//   };
//   img.src = s.origUrl;
// }

function compress(card) {
  const s = card.__s;
  const maxW = parseInt(card.querySelector('.resize-slider').value);
  const fmt = card.querySelector('.fmt-pill.active').dataset.fmt;

  const pb = card.querySelector('.prog-fill');
  const pbWrap = card.querySelector('.prog-bar');
  const overlay = card.querySelector('.comp-overlay');
  pbWrap.style.display = 'block';
  overlay.style.display = 'flex';
  pb.style.width = '20%';

  const img = new Image();
  img.onload = () => {
    pb.style.width = '40%';
    let w = img.width, h = img.height;
    if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
    
    const cv = document.createElement('canvas');
    cv.width = w; cv.height = h;
    const ctx = cv.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h);
    pb.style.width = '60%';

    // Read the user's initial target quality from the slider
    const initialQuality = parseInt(card.querySelector('.quality-slider').value);

    // This internal function will run repeatedly if the file size increases
    function runCompressionLoop(currentQuality) {
      if (fmt === 'png') {
        try {
          const imgData = ctx.getImageData(0, 0, w, h);
          // Map 1-100 quality scale to UPNG max color depth palette (2 to 256)
          const colorsCount = Math.max(2, Math.round((currentQuality / 100) * 254) + 2);
          const rgbaBuffer = imgData.data.buffer;
          const encodedPng = UPNG.encode([rgbaBuffer], w, h, colorsCount);
          const blob = new Blob([encodedPng], { type: 'image/png' });
          
          evaluateResult(blob, currentQuality);
        } catch (err) {
          console.error("UPNG fallback error:", err);
          cv.toBlob(blob => evaluateResult(blob, currentQuality), 'image/png');
        }
      } else {
        const mime = fmt === 'webp' ? 'image/webp' : 'image/jpeg';
        cv.toBlob(blob => evaluateResult(blob, currentQuality), mime, currentQuality / 100);
      }
    }

    function evaluateResult(blob, currentQuality) {
      // Calculate how much size changed. Positive means saved space, negative means bloated.
      const savingsPct = s.origSize > 0 ? ((s.origSize - blob.size) / s.origSize) * 100 : 0;

      // CRITERIA: If size increased or savings are less than 10%, AND we haven't completely destroyed quality yet
      if (savingsPct < 10 && currentQuality > 15) {
        // Drop quality by 10% steps automatically to hunt for a smaller file size
        runCompressionLoop(currentQuality - 10);
        return;
      }

      // If we dropped quality all the way to 15% and it STILL couldn't save 10% space,
      // fetch the original uncompressed file instead to avoid giving the user a worse, heavier image.
      if (savingsPct < 0 && currentQuality <= 15) {
        fetch(s.origUrl)
          .then(res => res.blob())
          .then(origBlob => {
            // Force output format tag to match whatever original file was
            const origFmt = s.origName.split('.').pop().toLowerCase();
            s.fmt = ['jpeg','jpg','png','webp'].includes(origFmt) ? (origFmt === 'jpg' ? 'jpeg' : origFmt) : fmt;
            finalizeUI(origBlob, img.width, img.height, initialQuality);
          });
        return;
      }

      // If it passes the test, finalize with the optimized blob
      finalizeUI(blob, w, h, currentQuality);
    }

    function finalizeUI(blob, finalW, finalH, visualQualitySetting) {
      pb.style.width = '100%';
      setTimeout(() => { pbWrap.style.display = 'none'; pb.style.width = '0%'; }, 350);
      overlay.style.display = 'none';

      // Dynamically update the slider position and text wrapper so the user sees what quality was actually used
      card.querySelector('.quality-slider').value = visualQualitySetting;
      card.querySelector('.quality-val').textContent = visualQualitySetting + '%';

      if (s.compUrl) URL.revokeObjectURL(s.compUrl);
      s.compUrl = URL.createObjectURL(blob);
      s.compBlob = blob;

      card.querySelector('.comp-img').src = s.compUrl;
      card.querySelector('.comp-size-val').textContent = fmtSize(blob.size);
      card.querySelector('.comp-dim').textContent = finalW + ' × ' + finalH;

      const pct = s.origSize > 0 ? Math.round((1 - blob.size / s.origSize) * 100) : 0;
      const fill = card.querySelector('.savings-fill');
      const label = card.querySelector('.savings-label');
      const absPct = Math.abs(pct);
      const trackPct = Math.min(absPct, 100);

      if (pct >= 10) {
        fill.className = 'savings-fill';
        label.className = 'savings-label';
        label.textContent = '-' + pct + '%';
        fill.style.width = trackPct + '%';
      } else if (pct >= 0) {
        fill.className = 'savings-fill warn';
        label.className = 'savings-label warn';
        label.textContent = '-' + pct + '%';
        fill.style.width = Math.max(trackPct, 2) + '%';
      } else {
        fill.className = 'savings-fill bad';
        label.className = 'savings-label bad';
        label.textContent = '+' + absPct + '%';
        fill.style.width = Math.min(trackPct, 100) + '%';
      }

      const dl = card.querySelector('.btn-dl');
      dl.disabled = false;
      dl.onclick = () => {
        const a = document.createElement('a');
        a.download = s.origName.replace(/\.[^.]+$/, '') + '-compressed.' + s.fmt;
        a.href = s.compUrl;
        a.click();
      };

      updateStats();
    }

    // Start the recursive compression process at the current slider value
    runCompressionLoop(initialQuality);
  };
  img.src = s.origUrl;
}
function addFile(file) {
  if (!file.type.startsWith('image/')) return;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = tpl.innerHTML;
  const card = wrapper.firstElementChild;

  let detectedFmt = 'jpeg';
  if (file.type === 'image/png') detectedFmt = 'png';
  if (file.type === 'image/webp') detectedFmt = 'webp';

  card.__s = {
    origName: file.name,
    origSize: file.size,
    origUrl: URL.createObjectURL(file),
    compUrl: null, 
    compBlob: null, 
    fmt: detectedFmt // Uses the uploaded file's format instead of forcing jpeg
  };

  // Update the UI pills so the correct format button is lit up active
  card.querySelectorAll('.fmt-pill').forEach(b => b.classList.remove('active'));
  const activePill = card.querySelector(`.fmt-pill[data-fmt="${detectedFmt}"]`);
  if (activePill) activePill.classList.add('active');

  card.querySelector('.card-fname').textContent = file.name;
  card.querySelector('.orig-img').src = card.__s.origUrl;
  card.querySelector('.orig-size-val').textContent = fmtSize(file.size);

  const img0 = new Image();
  img0.onload = () => {
    card.querySelector('.orig-dim').textContent = img0.width + ' × ' + img0.height;
  };
  img0.src = card.__s.origUrl;

  card.querySelector('.card-close').onclick = () => {
    URL.revokeObjectURL(card.__s.origUrl);
    if (card.__s.compUrl) URL.revokeObjectURL(card.__s.compUrl);
    cards = cards.filter(c => c !== card);
    wrapper.remove();
    updateStats();
  };

  card.querySelectorAll('.fmt-pill').forEach(btn => {
    btn.onclick = () => {
      card.querySelectorAll('.fmt-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      compress(card);
    };
  });

  card.querySelector('.quality-slider').oninput = e => {
    card.querySelector('.quality-val').textContent = e.target.value + '%';
  };
  card.querySelector('.quality-slider').onchange = () => compress(card);

  card.querySelector('.resize-slider').oninput = e => {
    card.querySelector('.resize-val').textContent = e.target.value + 'px';
  };
  card.querySelector('.btn-recompress').onclick = () => compress(card);

  cards.push(card);
  queue.appendChild(wrapper);
  compress(card);
}

// Setup choice trigger
btnChoose.onclick = () => fileInput.click();

fileInput.onchange = e => Array.from(e.target.files).forEach(addFile);
dropZone.ondragover = e => { e.preventDefault(); dropZone.classList.add('drag-over'); };
dropZone.ondragleave = () => dropZone.classList.remove('drag-over');
dropZone.ondrop = e => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  Array.from(e.dataTransfer.files).forEach(addFile);
};