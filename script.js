let map;
let marker = null;
let user = null;

function login() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  if (!email || !password) {
    document.getElementById('login-error').textContent = "Enter both email & password.";
    return;
  }
  user = { email };
  document.getElementById('login-page').classList.add('hidden');
  document.getElementById('map-page').classList.remove('hidden');
  document.getElementById('user-email').textContent = email;
  initMap();
}

function logout() {
  user = null;
  document.getElementById('map-page').classList.add('hidden');
  document.getElementById('login-page').classList.remove('hidden');
}

/* ===== Map + Reporting ===== */
function initMap() {
  map = L.map('map').setView([12.9716, 77.5946], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Drop/drag pin
  map.on('click', (e) => placeOrMoveMarker(e.latlng.lat, e.latlng.lng));

  // Buttons
  document.getElementById('btnUseLocation').addEventListener('click', useMyLocation);
  document.getElementById('btnClearPin').addEventListener('click', clearPin);

  // Form submit
  document.getElementById('report-form').addEventListener('submit', onSubmitReport);
}

function placeOrMoveMarker(lat, lng) {
  if (marker) {
    marker.setLatLng([lat, lng]);
  } else {
    marker = L.marker([lat, lng], { draggable: true }).addTo(map);
    marker.on('dragend', async () => {
      const pos = marker.getLatLng();
      updateLatLngUI(pos.lat, pos.lng);
      await reverseGeocode(pos.lat, pos.lng);
    });
  }
  updateLatLngUI(lat, lng);
  reverseGeocode(lat, lng);
}

function updateLatLngUI(lat, lng) {
  document.getElementById('latlng').textContent = `Lat: ${lat.toFixed(6)} , Lng: ${lng.toFixed(6)}`;
}

function clearPin() {
  if (marker) {
    map.removeLayer(marker);
    marker = null;
  }
  document.getElementById('latlng').textContent = 'Lat: — , Lng: —';
  document.getElementById('addressText').textContent = '—';
  document.getElementById('addressText').title = '';
}

async function reverseGeocode(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Reverse geocoding failed');
    const data = await res.json();
    const addr = data.display_name || 'Address unavailable';
    const el = document.getElementById('addressText');
    el.textContent = addr;
    el.title = addr;
  } catch (err) {
    console.warn(err);
  }
}

function useMyLocation() {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser.');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      map.setView([lat, lng], 17);
      placeOrMoveMarker(lat, lng);
    },
    (err) => {
      console.error(err);
      alert("Couldn't fetch your location.");
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}
// Camera setup
const videoEl = document.getElementById('cameraStream');
const canvasEl = document.getElementById('cameraCanvas');
const imgEl = document.getElementById('capturedImage');
const captureBtn = document.getElementById('btnCapture');

let cameraStream = null;
let capturedBlob = null;

// Start the camera stream when page loads
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then((stream) => {
      cameraStream = stream;
      videoEl.srcObject = stream;
    })
    .catch((err) => {
      console.error("Camera error:", err);
    });
}

captureBtn.addEventListener('click', () => {
  const ctx = canvasEl.getContext('2d');
  canvasEl.width = videoEl.videoWidth;
  canvasEl.height = videoEl.videoHeight;
  ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);

  canvasEl.toBlob((blob) => {
    capturedBlob = blob;
    imgEl.src = URL.createObjectURL(blob);
    imgEl.classList.remove('hidden');
  }, "image/jpeg");
});


function onSubmitReport(e) {
  e.preventDefault();
  if (!user) {
    alert('Please log in.');
    return;
  }
  if (!marker) {
    alert('Please drop a pin on the map first.');
    return;
  }
  

const photoFile = document.getElementById('photo').files[0];

const payload = {
  user: user.email,
  issue,
  notes: notes || null,
  lat: Number(coords.lat.toFixed(6)),
  lng: Number(coords.lng.toFixed(6)),
  address: (document.getElementById('addressText').textContent || '—'),
  photoName: photoFile ? photoFile.name : null,
  capturedPhoto: capturedBlob ? "camera_photo.jpg" : null,
  createdAt: new Date().toISOString()
};

// Example: if you POST, append capturedBlob to FormData for backend upload


  // SHOW payload (ready to POST to your backend)
  document.getElementById('output').textContent = JSON.stringify(payload, null, 2);

  // Example POST (uncomment and set your endpoint):
  // fetch('/api/reports', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload)
  // }).then(r => r.json()).then(console.log).catch(console.error);
}
