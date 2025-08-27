const countInput = document.getElementById("userCount");
const nameTypeSelect = document.getElementById("nameType");
const userBody = document.getElementById("userBody");
const errorEl = document.getElementById("error");
const countdownEl = document.getElementById("countdown");

let users = [];
let debounceTimer;
let countdownTimer;

//3s delay with countdown
countInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  clearInterval(countdownTimer);
  countdownEl.textContent = "";

  let seconds = 3;
  countdownEl.textContent = seconds;

  countdownTimer = setInterval(() => {
    seconds--;
    if (seconds > 0) {
      countdownEl.textContent = seconds;
    } else {
      clearInterval(countdownTimer);
      countdownEl.textContent = "Generated";
    }
  }, 1000);

  debounceTimer = setTimeout(fetchUsers, 3000); // wait 3s
});

nameTypeSelect.addEventListener("change", renderUsers);

async function fetchUsers() {
  const count = Number(countInput.value);
  if (isNaN(count) || count < 0 || count > 1000) {
    errorEl.textContent = "Please enter a valid number between 0 and 1000.";
    userBody.innerHTML = "";
    countdownEl.textContent = "";
    return;
  }

  errorEl.textContent = "";
  userBody.innerHTML = "";

  if (count === 0) {
    return; // Always make header visible
  }

  try {
    const response = await fetch(`https://randomuser.me/api/?results=${count}`);
    if (!response.ok) throw new Error("Failed to fetch users.");
    const data = await response.json();
    users = data.results;
    renderUsers();
  } catch (err) {
    errorEl.textContent = "Error fetching users: " + err.message;
    users = [];
    countdownEl.textContent = "";
  }
}

function renderUsers() {
  userBody.innerHTML = "";

  if (users.length === 0) return;

  users.forEach((user, index) => {
    const tr = document.createElement("tr");

    const numTd = document.createElement("td");
    numTd.textContent = index + 1;
    tr.appendChild(numTd);

    const nameTd = document.createElement("td");
    nameTd.textContent = nameTypeSelect.value === "first" ? user.name.first : user.name.last;
    tr.appendChild(nameTd);

    const genderTd = document.createElement("td");
    genderTd.textContent = user.gender.charAt(0).toUpperCase() + user.gender.slice(1);
    tr.appendChild(genderTd);

    const emailTd = document.createElement("td");
    emailTd.textContent = user.email;
    tr.appendChild(emailTd);

    const countryTd = document.createElement("td");
    countryTd.textContent = user.location.country;
    tr.appendChild(countryTd);

    userBody.appendChild(tr);
  });
}
