function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || {};
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function goHome() {
  window.location.href = "index.html";
}

function goBack() {
  window.history.back();
}

// Signup
function signup(e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  let users = getUsers();
  if (users[username]) return alert("User already exists");

  users[username] = { password, images: [] };
  saveUsers(users);
  window.location.href = "login.html";
}

// Login
function login(e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const users = getUsers();
  if (!users[username] || users[username].password !== password)
    return alert("Invalid credentials");

  localStorage.setItem("currentUser", username);
  window.location.href = "dashboard.html";
}

function logout() {
  localStorage.removeItem("currentUser");
}

// Upload
function uploadImage(e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    const user = localStorage.getItem("currentUser");
    let users = getUsers();
    users[user].images.push(reader.result);
    saveUsers(users);
    loadMyImages();
  };

  reader.readAsDataURL(file);
}

// Landing images
function loadRandomImages() {
  const users = getUsers();
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  let all = [];
  for (let username in users) {
    users[username].images.forEach(img => {
      all.push({ img, username });
    });
  }

  all.sort(() => 0.5 - Math.random());
  all.slice(0, 12).forEach(i => {
    gallery.innerHTML += `
      <div class="image-card">
        <img src="${i.img}">
        <div class="overlay">
          <a href="profile.html?username=${i.username}">@${i.username}</a>
        </div>
      </div>
    `;
  });
}

// Dashboard
function loadMyImages() {
  const username = localStorage.getItem("currentUser");
  const users = getUsers();
  const gallery = document.getElementById("myGallery");
  gallery.innerHTML = "";

  users[username]?.images.forEach(img => {
    gallery.innerHTML += `
      <div class="image-card">
        <img src="${img}">
        <div class="overlay">
          <span>@${username}</span>
        </div>
      </div>
    `;
  });
}

// Public profile
function loadPublicProfile() {
  const username = new URLSearchParams(window.location.search).get("username");
  const users = getUsers();

  document.getElementById("userTitle").innerText = "@" + username;

  const gallery = document.getElementById("userGallery");
  gallery.innerHTML = "";

  users[username]?.images.forEach(img => {
    gallery.innerHTML += `
      <div class="image-card">
        <img src="${img}">
        <div class="overlay">
          <span>@${username}</span>
        </div>
      </div>
    `;
  });
}
