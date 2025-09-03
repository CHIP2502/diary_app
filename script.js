function getData() {
  return JSON.parse(localStorage.getItem("diary")) || [];
}

function saveData(data) {
  localStorage.setItem("diary", JSON.stringify(data));
}

function renderEntries() {
  let list = document.getElementById("entries");
  list.innerHTML = "";
  let data = getData();

  // Lấy giá trị tìm kiếm
  let keyword = document.getElementById("searchBox").value.toLowerCase();
  // Lấy giá trị lọc tháng/năm
  let monthFilter = document.getElementById("filterMonth").value; // dạng yyyy-mm

  data = data.filter(entry => {
    let matchKeyword =
      entry.title.toLowerCase().includes(keyword) ||
      entry.text.toLowerCase().includes(keyword);

    let matchMonth = true;
    if (monthFilter) {
      let [year, month] = monthFilter.split("-");
      let entryParts = entry.date.split("/"); // dd/mm/yyyy
      if (entryParts.length === 3) {
        let eDay = entryParts[0],
            eMonth = entryParts[1],
            eYear = entryParts[2];
        matchMonth = (eYear === year && eMonth === month);
      }
    }

    return matchKeyword && matchMonth;
  });

  data.forEach((entry, index) => {
    let li = document.createElement("li");
    li.className = "entry";

    li.innerHTML = `
      <h3>${entry.title} <small>(${entry.date})</small></h3>
      <p>${entry.text}</p>
      <button onclick="editEntry(${index})">✏️ Sửa</button>
      <button onclick="deleteEntry(${index})">🗑️ Xoá</button>
    `;

    list.appendChild(li);
  });
}

function addEntry() {
  let title = document.getElementById("newTitle").value.trim();
  let text = document.getElementById("newEntry").value.trim();
  let dateInput = document.getElementById("newDate").value;

  if (!title || !text) return alert("Vui lòng nhập đủ tiêu đề và nội dung!");

  let date;
  if (dateInput) {
    let d = new Date(dateInput);
    date = d.toLocaleDateString("vi-VN");
  } else {
    date = new Date().toLocaleDateString("vi-VN");
  }

  let data = getData();
  data.unshift({ title, text, date });
  saveData(data);

  document.getElementById("newTitle").value = "";
  document.getElementById("newEntry").value = "";
  document.getElementById("newDate").value = "";

  renderEntries();
}

function deleteEntry(index) {
  if (!confirm("Xoá mục này?")) return;
  let data = getData();
  data.splice(index, 1);
  saveData(data);
  renderEntries();
}

function editEntry(index) {
  let data = getData();
  let entry = data[index];

  let newTitle = prompt("Sửa tiêu đề:", entry.title);
  if (newTitle === null) return;

  let newText = prompt("Sửa nội dung:", entry.text);
  if (newText === null) return;

  let newDate = prompt("Sửa ngày (dd/mm/yyyy):", entry.date);
  if (newDate === null) return;

  data[index] = { title: newTitle, text: newText, date: newDate };
  saveData(data);
  renderEntries();
}

window.onload = renderEntries;
