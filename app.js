let records = JSON.parse(localStorage.getItem("attendance")) || [];

// 🔐 LOGIN
window.login = () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (email === "admin@gmail.com" && password === "123456") {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("appBox").style.display = "block";
    loadData();
  } else {
    alert("Wrong credentials ❌");
  }
};

// 🔓 LOGOUT
window.logout = () => {
  document.getElementById("loginBox").style.display = "block";
  document.getElementById("appBox").style.display = "none";
};

// ✅ MARK ATTENDANCE (NO DUPLICATES)
window.markAttendance = () => {
  const name = document.getElementById("name").value;
  const roll = document.getElementById("roll").value;

  if (!name || !roll) {
    alert("Enter details");
    return;
  }

  const today = new Date().toLocaleDateString();

  const exists = records.find(r =>
    r.roll === roll && r.day === today
  );

  if (exists) {
    alert("Already marked today ❌");
    return;
  }

  const fullDate = new Date().toLocaleString();

  records.push({
    name,
    roll,
    date: fullDate,
    day: today
  });

  localStorage.setItem("attendance", JSON.stringify(records));

  loadData();
};

// 📋 LOAD DATA + DELETE
window.loadData = () => {
  const list = document.getElementById("list");
  list.innerHTML = "";

  records.forEach((r, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${r.name} (${r.roll}) - ${r.date}
      <button onclick="deleteRecord(${index})" style="background:red;">X</button>
    `;

    list.appendChild(li);
  });
};

// ❌ DELETE
window.deleteRecord = (index) => {
  records.splice(index, 1);
  localStorage.setItem("attendance", JSON.stringify(records));
  loadData();
};

// 🔍 FILTER
window.filterData = () => {
  const selected = document.getElementById("filterDate").value;

  const list = document.getElementById("list");
  list.innerHTML = "";

  records.forEach(r => {
    if (r.date.includes(selected)) {
      const li = document.createElement("li");
      li.innerText = `${r.name} (${r.roll}) - ${r.date}`;
      list.appendChild(li);
    }
  });
};

// 📥 EXCEL DOWNLOAD
window.downloadExcel = () => {
  const ws = XLSX.utils.json_to_sheet(records);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Attendance");
  XLSX.writeFile(wb, "attendance.xlsx");
};