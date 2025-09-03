async function loadEntries() {
  let res = await fetch("entries.json?_=" + Date.now());
  let data = await res.json();
  let list = document.getElementById("entries");
  list.innerHTML = "";
  data.forEach(entry => {
    let li = document.createElement("li");
    li.textContent = entry.date + ": " + entry.text;
    list.appendChild(li);
  });
}

async function addEntry() {
  let text = document.getElementById("newEntry").value.trim();
  if (!text) return;

  let res = await fetch("entries.json");
  let data = await res.json();

  let newEntry = { date: new Date().toLocaleDateString("vi-VN"), text };
  data.unshift(newEntry);

  // chỉ lưu localStorage vì GitHub Pages không cho ghi file
  localStorage.setItem("diary", JSON.stringify(data));

  renderFromLocal();
  document.getElementById("newEntry").value = "";
}

function renderFromLocal() {
  let list = document.getElementById("entries");
  list.innerHTML = "";
  let data = JSON.parse(localStorage.getItem("diary")) || [];
  data.forEach(entry => {
    let li = document.createElement("li");
    li.textContent = entry.date + ": " + entry.text;
    list.appendChild(li);
  });
}

window.onload = () => {
  if (localStorage.getItem("diary")) {
    renderFromLocal();
  } else {
    loadEntries();
  }
};
