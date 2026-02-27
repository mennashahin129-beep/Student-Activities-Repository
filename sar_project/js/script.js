const today = new Date();
let currentMonth = today.getMonth() + 1;
let currentYear = today.getFullYear();

const daysInMonth = (month, year) => new Date(year, month, 0).getDate();

// ترتيب الأيام يبدأ من السبت
const dayNames = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

function renderCalendar() {
  const grid = document.getElementById('calendar-grid');
  const title = document.getElementById('month-title');
  grid.innerHTML = '';

  // إضافة أسماء الأيام
  for (let i = 0; i < 7; i++) {
    const day = document.createElement('div');
    day.className = 'day-name';
    day.textContent = dayNames[i];
    grid.appendChild(day);
  }

  const firstDay = new Date(currentYear, currentMonth - 1, 1).getDay(); // 0 (Sun) - 6 (Sat)
  const days = daysInMonth(currentMonth, currentYear);
  const offset = (firstDay + 1) % 7; // لضبط البداية على يوم السبت

  for (let i = 0; i < offset; i++) {
    const empty = document.createElement('div');
    grid.appendChild(empty); //بيسيب خانات فاضيه لو البدابه مش السبت
  }

  const storedEvents = JSON.parse(localStorage.getItem('events')) || [];

  for (let day = 1; day <= days; day++) {
    const cell = document.createElement('div');
    cell.textContent = day;

    const eventDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;//تاريخ yyy/mm/dd
    const dayEvents = storedEvents.filter(ev => ev.date === eventDate);
    //عرض الاحداث داخل اليوم ونحذفها
    if (dayEvents.length > 0) {
      dayEvents.forEach(ev => {
        const eventEl = document.createElement('div');
        eventEl.className = 'event';

        const textSpan = document.createElement('span');
        textSpan.textContent = ev.name;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '×';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = () => {
          deleteEvent(ev);
        };

        eventEl.appendChild(textSpan);
        eventEl.appendChild(deleteBtn);
        cell.appendChild(eventEl);
      });
    }

    // تمييز اليوم الحالي
    if (
      day === today.getDate() &&
      currentMonth === today.getMonth() + 1 &&
      currentYear === today.getFullYear()
    ) {
      cell.style.backgroundColor = '#cce5ff';
      cell.style.border = '2px solid #93abc3';
    }
 //اضافه اليوم للجدول
    grid.appendChild(cell);
  }
 //كتابه اسم الشهر
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  title.textContent = `${months[currentMonth - 1]} ${currentYear}`;
}
// بتظهر رساله تاكيد الحذف ولو لا بيرجع يخزنها تاني
function deleteEvent(eventToDelete) {
  const confirmDelete = confirm(`Are you sure you want to delete the event "${eventToDelete.name}"?`);
  if (!confirmDelete) return;

  let events = JSON.parse(localStorage.getItem('events')) || [];
  events = events.filter(ev => {
    return !(
      ev.name === eventToDelete.name &&
      ev.date === eventToDelete.date &&
      ev.time === eventToDelete.time
    );
  });

  localStorage.setItem('events', JSON.stringify(events));
  renderCalendar();
}
 //الشهر الحالي والسابق
function prevMonth() {
  currentMonth--;
  if (currentMonth < 1) {
    currentMonth = 12;
    currentYear--;
  }
  renderCalendar();
}

function nextMonth() {
  currentMonth++;
  if (currentMonth > 12) {
    currentMonth = 1;
    currentYear++;
  }
  renderCalendar();
}

function addEvent() {
  alert("You Can Book New Event");
}

// عند تحميل الصفحة تشغل التقويم
document.addEventListener('DOMContentLoaded', renderCalendar);

// معالجة عرض الأحداث في صفحة History إن وجدت
const historyContainer = document.getElementById('historyContainer');
if (historyContainer) {
  const events = JSON.parse(localStorage.getItem('events')) || [];

  if (events.length === 0) {
    historyContainer.innerHTML = "<p>No booked events found.</p>";
  } else {
    events.forEach((event, index) => {
      const card = document.createElement('div');
      card.className = 'card';

      card.innerHTML = `
        <h3>${event.name}</h3>
        <p><strong>Date:</strong> ${event.date}</p>
        <p><strong>Time:</strong> ${event.time}</p>
        <button class="details-btn" data-index="${index}">View Details</button>
      `;

      historyContainer.appendChild(card);
    });
  }

  // مودال التفاصيل
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("details-btn")) {
      const index = e.target.getAttribute("data-index");
      const event = events[index];
      const materials = event.materials || "No materials provided.";

      document.getElementById("modal-content").innerHTML = `
        <h2>${event.name} - Materials</h2>
        <p>${materials}</p>
      `;

      document.getElementById("modal").style.display = "block";
    }

    if (e.target.id === "close-modal" || e.target.id === "modal") {
      document.getElementById("modal").style.display = "none";
    }
  });
}/////////////////لو طالب سجل جديد
document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("registerform");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const fullName = document.getElementById("fullName").value;
      const email = document.getElementById("email").value;
      const studentID = document.getElementById("studentID").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      const student = {
        fullName,
        email,
        studentID,
        password
      };

      localStorage.setItem("loggedInStudentID", studentID);
      localStorage.setItem("student_" + studentID, JSON.stringify(student));

      alert("Student registered successfully!");
      registerForm.reset();
    });
  }
});
