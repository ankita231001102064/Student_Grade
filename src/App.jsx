import { useMemo, useState } from "react";
import "./App.css";

const initialStudents = [
  {
    id: 1,
    name: "Ankita Jana",
    roll: "CS101",
    department: "Computer Science",
    semester: "6th",
    cgpa: 9.4,
    attendance: 94,
    email: "ankita@example.com",
    phone: "+91 98765 43210",
    avatar: "https://i.pravatar.cc/150?img=47",
  },
  {
    id: 2,
    name: "Rahul Das",
    roll: "CS102",
    department: "Computer Science",
    semester: "6th",
    cgpa: 8.8,
    attendance: 89,
    email: "rahul@example.com",
    phone: "+91 98765 12345",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: 3,
    name: "Sneha Roy",
    roll: "EC201",
    department: "Electronics",
    semester: "4th",
    cgpa: 9.1,
    attendance: 96,
    email: "sneha@example.com",
    phone: "+91 98765 67890",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
  {
    id: 4,
    name: "Arjun Sen",
    roll: "ME301",
    department: "Mechanical",
    semester: "4th",
    cgpa: 8.5,
    attendance: 87,
    email: "arjun@example.com",
    phone: "+91 98765 24680",
    avatar: "https://i.pravatar.cc/150?img=11",
  },
  {
    id: 5,
    name: "Priya Sharma",
    roll: "IT401",
    department: "Information Technology",
    semester: "8th",
    cgpa: 9.7,
    attendance: 98,
    email: "priya@example.com",
    phone: "+91 98765 13579",
    avatar: "https://i.pravatar.cc/150?img=44",
  },
  {
    id: 6,
    name: "Sayan Ghosh",
    roll: "CE501",
    department: "Civil Engineering",
    semester: "2nd",
    cgpa: 8.2,
    attendance: 84,
    email: "sayan@example.com",
    phone: "+91 98765 86420",
    avatar: "https://i.pravatar.cc/150?img=13",
  },
];

const navItems = [
  ["Dashboard", "⌂"],
  ["Students", "♙"],
  ["Leaderboard", "♛"],
  ["Analytics", "◈"],
  ["Calendar", "▣"],
  ["Notifications", "♢"],
  ["Profile", "◎"],
  ["Settings", "⚙"],
];

export default function App() {
  const [students, setStudents] = useState(initialStudents);
  const [page, setPage] = useState("Dashboard");
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState("All");
  const [sort, setSort] = useState("high");
  const [theme, setTheme] = useState("dark");
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState("");
  const [sidebar, setSidebar] = useState(true);

  const departments = [
    "All",
    ...new Set(students.map((student) => student.department)),
  ];

  const filtered = useMemo(() => {
    return students
      .filter((student) =>
        (
          student.name +
          student.roll +
          student.department +
          student.semester
        )
          .toLowerCase()
          .includes(query.toLowerCase())
      )
      .filter(
        (student) =>
          dept === "All" || student.department === dept
      )
      .sort((a, b) =>
        sort === "high"
          ? b.cgpa - a.cgpa
          : a.cgpa - b.cgpa
      );
  }, [students, query, dept, sort]);

  const average =
    students.reduce((sum, student) => sum + student.cgpa, 0) /
    students.length;

  const topStudent = [...students].sort(
    (a, b) => b.cgpa - a.cgpa
  )[0];

  function saveStudent(data) {
    if (editing) {
      setStudents(
        students.map((student) =>
          student.id === editing.id
            ? { ...editing, ...data }
            : student
        )
      );
    } else {
      setStudents([
        ...students,
        {
          ...data,
          id: Date.now(),
          avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
        },
      ]);
    }

    setShowForm(false);
    setEditing(null);
    showNotice("Student information saved successfully.");
  }

  function deleteStudent(id) {
    if (!window.confirm("Delete this student?")) return;

    setStudents(
      students.filter((student) => student.id !== id)
    );

    setSelected(null);
  }

  function showNotice(message) {
    setNotice(message);

    setTimeout(() => {
      setNotice("");
    }, 2500);
  }

  function downloadReport(student) {
    const report = `
STUDENT NEXUS REPORT

Name: ${student.name}
Roll Number: ${student.roll}
Department: ${student.department}
Semester: ${student.semester}
CGPA: ${student.cgpa}
Attendance: ${student.attendance}%
Email: ${student.email}
Phone: ${student.phone}
`;

    const blob = new Blob([report], {
      type: "text/plain",
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = `${student.roll}-report.txt`;

    link.click();

    URL.revokeObjectURL(link.href);
  }

  return (
    <div className={`app ${theme}`}>
      <aside className={sidebar ? "sidebar open" : "sidebar"}>
        <div
          className="logo"
          onClick={() => setPage("Dashboard")}
        >
          <div>SN</div>

          <section>
            <b>Student Nexus</b>
            <small>ACADEMIC INTELLIGENCE</small>
          </section>
        </div>

        <nav>
          {navItems.map(([name, icon]) => (
            <button
              key={name}
              className={page === name ? "selected" : ""}
              onClick={() => setPage(name)}
            >
              <span>{icon}</span>
              {name}
            </button>
          ))}
        </nav>

        <div className="side-bottom">
          <div className="mini-profile">
            <img src={topStudent.avatar} alt="" />

            <span>
              <b>Admin</b>
              <small>Administrator</small>
            </span>
          </div>

          <button
            onClick={() =>
              setTheme(
                theme === "dark" ? "light" : "dark"
              )
            }
          >
            {theme === "dark" ? "☀" : "☾"} Theme
          </button>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <button
            className="hamburger"
            onClick={() => setSidebar(!sidebar)}
          >
            ☰
          </button>

          <div>
            <span>Welcome back 👋</span>
            <h3>{page}</h3>
          </div>

          <div className="top-actions">
            <button onClick={() => setPage("Notifications")}>
              🔔
              <i>3</i>
            </button>

            <button
              className="avatar-btn"
              onClick={() => setPage("Profile")}
            >
              <img src={topStudent.avatar} alt="" />
            </button>
          </div>
        </header>

        {notice && (
          <div className="toast">
            ✓ {notice}
          </div>
        )}

        <main className="content">
          {page === "Dashboard" && (
            <Dashboard
              students={students}
              average={average}
              topStudent={topStudent}
              setPage={setPage}
              setSelected={setSelected}
            />
          )}

          {page === "Students" && (
            <Students
              students={filtered}
              departments={departments}
              query={query}
              setQuery={setQuery}
              dept={dept}
              setDept={setDept}
              sort={sort}
              setSort={setSort}
              setSelected={setSelected}
              onAdd={() => {
                setEditing(null);
                setShowForm(true);
              }}
              onEdit={(student) => {
                setEditing(student);
                setShowForm(true);
              }}
              onDelete={deleteStudent}
            />
          )}

          {page === "Leaderboard" && (
            <Leaderboard
              students={students}
              setSelected={setSelected}
            />
          )}

          {page === "Analytics" && (
            <Analytics students={students} />
          )}

          {page === "Calendar" && <Calendar />}

          {page === "Notifications" && <Notifications />}

          {page === "Profile" && (
            <Profile
              student={topStudent}
              onReport={() => downloadReport(topStudent)}
            />
          )}

          {page === "Settings" && (
            <Settings
              theme={theme}
              setTheme={setTheme}
            />
          )}
        </main>
      </div>

      {selected && (
        <StudentModal
          student={selected}
          close={() => setSelected(null)}
          onEdit={() => {
            setEditing(selected);
            setSelected(null);
            setShowForm(true);
          }}
          onDelete={() => deleteStudent(selected.id)}
          onReport={() => downloadReport(selected)}
        />
      )}

      {showForm && (
        <StudentForm
          student={editing}
          close={() => {
            setShowForm(false);
            setEditing(null);
          }}
          save={saveStudent}
        />
      )}
    </div>
  );
}

function Dashboard({
  students,
  average,
  topStudent,
  setPage,
  setSelected,
}) {
  return (
    <>
      <section className="hero">
        <div>
          <span className="eyebrow">
            ✦ SMART STUDENT ECOSYSTEM
          </span>

          <h1>
            Empowering
            <em> Future Minds.</em>
          </h1>

          <p>
            A premium academic management platform to
            discover talent, track performance and manage
            student information.
          </p>

          <div className="hero-actions">
            <button
              className="primary"
              onClick={() => setPage("Students")}
            >
              Explore Students →
            </button>

            <button
              className="ghost"
              onClick={() => setPage("Analytics")}
            >
              View Analytics
            </button>
          </div>
        </div>

        <div className="orb">
          <div className="orb-core">
            <b>SN</b>
            <small>2026</small>
          </div>

          <i></i>
          <i></i>
        </div>
      </section>

      <div className="stats">
        <Stat
          icon="👥"
          value={students.length}
          label="Total Students"
          trend="+12%"
        />

        <Stat
          icon="▦"
          value={
            new Set(
              students.map((s) => s.department)
            ).size
          }
          label="Departments"
          trend="+2"
        />

        <Stat
          icon="★"
          value={average.toFixed(1)}
          label="Average CGPA"
          trend="+0.4"
        />

        <Stat
          icon="♛"
          value={topStudent.cgpa}
          label="Top CGPA"
          trend="Excellent"
        />
      </div>

      <div className="two-col">
        <div className="panel spotlight">
          <label>♛ TOP PERFORMER</label>

          <div className="spot">
            <img src={topStudent.avatar} alt="" />

            <div>
              <h2>{topStudent.name}</h2>
              <p>{topStudent.department}</p>
              <small>
                {topStudent.roll} · {topStudent.semester} Semester
              </small>
            </div>

            <strong>
              {topStudent.cgpa}
              <small>CGPA</small>
            </strong>
          </div>

          <div className="badge">
            ✦ Outstanding Academic Performance
          </div>
        </div>

        <div className="panel">
          <label>⚡ QUICK ACCESS</label>

          <div className="quick">
            {[
              ["♙", "Students"],
              ["◈", "Analytics"],
              ["♛", "Leaderboard"],
              ["▣", "Calendar"],
            ].map(([icon, name]) => (
              <button
                key={name}
                onClick={() => setPage(name)}
              >
                <span>{icon}</span>
                {name}
                <b>→</b>
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="section-title">
        <div>
          <label>STUDENT OF THE MONTH</label>
          <h2>Celebrating excellence</h2>
        </div>

        <button
          className="text-btn"
          onClick={() => setSelected(topStudent)}
        >
          View Profile →
        </button>
      </section>

      <div className="achievement-card">
        <div className="medal">🏆</div>

        <div>
          <h3>{topStudent.name}</h3>

          <p>
            Academic Excellence · {topStudent.cgpa} CGPA ·{" "}
            {topStudent.attendance}% Attendance
          </p>
        </div>

        <span>EXCELLENCE</span>
      </div>
    </>
  );
}

function Stat({ icon, value, label, trend }) {
  return (
    <div className="stat">
      <div>
        <span>{icon}</span>
        <small>{trend}</small>
      </div>

      <b>{value}</b>

      <p>{label}</p>
    </div>
  );
}

function Students({
  students,
  departments,
  query,
  setQuery,
  dept,
  setDept,
  sort,
  setSort,
  setSelected,
  onAdd,
  onEdit,
  onDelete,
}) {
  return (
    <section>
      <div className="page-head">
        <div>
          <label>STUDENT DIRECTORY</label>
          <h1>Meet Our Students</h1>
          <p>
            Search, filter and manage academic profiles.
          </p>
        </div>

        <button className="primary" onClick={onAdd}>
          ＋ Add Student
        </button>
      </div>

      <div className="filters">
        <input
          placeholder="⌕ Search name, roll, department..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select
          value={dept}
          onChange={(e) => setDept(e.target.value)}
        >
          {departments.map((department) => (
            <option key={department}>
              {department}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="high">
            CGPA: High → Low
          </option>

          <option value="low">
            CGPA: Low → High
          </option>
        </select>
      </div>

      <div className="student-list">
        {students.map((student, index) => (
          <div className="student" key={student.id}>
            <b className="rank">#{index + 1}</b>

            <img src={student.avatar} alt="" />

            <div className="student-info">
              <h3>{student.name}</h3>

              <p>
                {student.roll} · {student.department}
              </p>

              <div className="student-line">
                <span>
                  {student.semester} Semester
                </span>

                <strong>
                  {student.cgpa} CGPA
                </strong>
              </div>

              <div className="bar">
                <i
                  style={{
                    width: `${student.cgpa * 10}%`,
                  }}
                />
              </div>
            </div>

            <div className="row-actions">
              <button
                onClick={() => setSelected(student)}
              >
                View
              </button>

              <button onClick={() => onEdit(student)}>
                Edit
              </button>

              <button
                className="danger"
                onClick={() => onDelete(student.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {!students.length && (
        <div className="empty">
          <div>⌕</div>
          <h2>No students found</h2>
          <p>Try another search or filter.</p>
        </div>
      )}
    </section>
  );
}

function Leaderboard({ students, setSelected }) {
  const ranking = [...students].sort(
    (a, b) => b.cgpa - a.cgpa
  );

  return (
    <section>
      <div className="page-head">
        <div>
          <label>PERFORMANCE CENTER</label>
          <h1>Leaderboard</h1>
          <p>
            Academic performance ranked by CGPA.
          </p>
        </div>
      </div>

      <div className="leaderboard">
        {ranking.map((student, index) => (
          <div
            className={`leader ${
              index === 0 ? "first" : ""
            }`}
            key={student.id}
          >
            <strong>
              {index === 0 ? "👑" : `#${index + 1}`}
            </strong>

            <img src={student.avatar} alt="" />

            <div>
              <b>{student.name}</b>
              <small>{student.department}</small>
            </div>

            <span className="leader-bar">
              <i
                style={{
                  width: `${student.cgpa * 10}%`,
                }}
              />
            </span>

            <b>{student.cgpa}</b>

            <button
              onClick={() => setSelected(student)}
            >
              View
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function Analytics({ students }) {
  const average =
    students.reduce(
      (sum, student) => sum + student.cgpa,
      0
    ) / students.length;

  const excellent = students.filter(
    (student) => student.cgpa >= 9
  ).length;

  const good = students.filter(
    (student) =>
      student.cgpa >= 8 && student.cgpa < 9
  ).length;

  return (
    <section>
      <div className="page-head">
        <div>
          <label>ACADEMIC INSIGHTS</label>
          <h1>Analytics</h1>
          <p>
            Performance overview at a glance.
          </p>
        </div>
      </div>

      <div className="analytics">
        <div className="panel chart">
          <label>CGPA DISTRIBUTION</label>

          {students.map((student) => (
            <div className="chart-row" key={student.id}>
              <span>
                {student.name.split(" ")[0]}
              </span>

              <i>
                <b
                  style={{
                    width: `${student.cgpa * 10}%`,
                  }}
                />
              </i>

              <strong>{student.cgpa}</strong>
            </div>
          ))}
        </div>

        <div className="panel circle">
          <label>AVERAGE CGPA</label>

          <div>
            <b>{average.toFixed(1)}</b>
            <small>out of 10</small>
          </div>
        </div>

        <div className="panel performance">
          <label>PERFORMANCE</label>

          <p>
            Excellent <b>{excellent}</b>
          </p>

          <p>
            Good <b>{good}</b>
          </p>

          <p>
            Students <b>{students.length}</b>
          </p>
        </div>
      </div>
    </section>
  );
}

function Calendar() {
  const events = [
    ["18", "SEP", "Data Structures Quiz", "10:00 AM", "Quiz"],
    ["22", "SEP", "Project Review", "2:00 PM", "Project"],
    ["28", "SEP", "Mid Semester Examination", "11:00 AM", "Exam"],
    ["04", "OCT", "Tech Fest 2026", "All Day", "Event"],
  ];

  return (
    <section>
      <div className="page-head">
        <div>
          <label>ACADEMIC PLANNER</label>
          <h1>Calendar</h1>
          <p>Upcoming academic activities.</p>
        </div>
      </div>

      <div className="calendar">
        {events.map((event) => (
          <div
            className="event"
            key={event[0] + event[2]}
          >
            <div>
              <b>{event[0]}</b>
              <small>{event[1]}</small>
            </div>

            <section>
              <h3>{event[2]}</h3>
              <p>{event[3]}</p>
            </section>

            <span>{event[4]}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Notifications() {
  const notifications = [
    [
      "★",
      "New result published",
      "Semester 6 results are now available.",
      "2 min ago",
    ],
    [
      "▣",
      "Project review scheduled",
      "Project review is scheduled for 22 September.",
      "1 hour ago",
    ],
    [
      "!",
      "Attendance reminder",
      "Students below 85% attendance need attention.",
      "3 hours ago",
    ],
    [
      "♢",
      "New academic event",
      "Tech Fest 2026 has been added to the calendar.",
      "Yesterday",
    ],
  ];

  return (
    <section>
      <div className="page-head">
        <div>
          <label>UPDATES CENTER</label>
          <h1>Notifications</h1>
          <p>
            Recent academic activity and reminders.
          </p>
        </div>
      </div>

      <div className="notifications">
        {notifications.map((item) => (
          <div
            className="notification"
            key={item[1]}
          >
            <b>{item[0]}</b>

            <div>
              <h3>{item[1]}</h3>
              <p>{item[2]}</p>
              <small>{item[3]}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Profile({ student, onReport }) {
  return (
    <section>
      <div className="page-head">
        <div>
          <label>ADMIN PROFILE</label>
          <h1>My Profile</h1>
          <p>
            Account and platform information.
          </p>
        </div>
      </div>

      <div className="profile-card panel">
        <img src={student.avatar} alt="" />

        <div>
          <label>ADMINISTRATOR</label>
          <h2>Student Nexus Admin</h2>
          <p>System Administrator</p>

          <div className="profile-tags">
            <span>Full Access</span>
            <span>Active Account</span>
          </div>
        </div>

        <button className="primary" onClick={onReport}>
          Download Report
        </button>
      </div>
    </section>
  );
}

function Settings({ theme, setTheme }) {
  return (
    <section>
      <div className="page-head">
        <div>
          <label>SYSTEM PREFERENCES</label>
          <h1>Settings</h1>
          <p>
            Customize your dashboard experience.
          </p>
        </div>
      </div>

      <div className="settings panel">
        <div>
          <b>Appearance</b>
          <p>Choose your preferred interface theme.</p>

          <button
            onClick={() => setTheme("dark")}
            className={
              theme === "dark"
                ? "setting-active"
                : ""
            }
          >
            Dark Mode
          </button>

          <button
            onClick={() => setTheme("light")}
            className={
              theme === "light"
                ? "setting-active"
                : ""
            }
          >
            Light Mode
          </button>
        </div>

        <div>
          <b>Notifications</b>
          <p>
            Stay updated about academic activity.
          </p>

          <label className="toggle">
            <input
              type="checkbox"
              defaultChecked
            />
            <i />
          </label>
        </div>
      </div>
    </section>
  );
}

function StudentModal({
  student,
  close,
  onEdit,
  onDelete,
  onReport,
}) {
  return (
    <div className="overlay" onClick={close}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close" onClick={close}>
          ×
        </button>

        <img src={student.avatar} alt="" />

        <label>STUDENT PROFILE</label>

        <h2>{student.name}</h2>

        <p>{student.department}</p>

        <div className="details">
          {[
            ["Roll Number", student.roll],
            ["Semester", student.semester],
            ["CGPA", student.cgpa],
            ["Attendance", `${student.attendance}%`],
            ["Email", student.email],
            ["Phone", student.phone],
          ].map(([label, value]) => (
            <div key={label}>
              <small>{label}</small>
              <b>{value}</b>
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button onClick={onReport}>
            Report
          </button>

          <button onClick={onEdit}>
            Edit
          </button>

          <button
            className="danger"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function StudentForm({ student, close, save }) {
  const [form, setForm] = useState(
    student || {
      name: "",
      roll: "",
      department: "Computer Science",
      semester: "1st",
      cgpa: 8,
      attendance: 90,
      email: "",
      phone: "",
    }
  );

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function submit(e) {
    e.preventDefault();

    save({
      ...form,
      cgpa: Number(form.cgpa),
      attendance: Number(form.attendance),
    });
  }

  return (
    <div className="overlay" onClick={close}>
      <form
        className="form modal"
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="close"
          onClick={close}
        >
          ×
        </button>

        <label>
          {student ? "EDIT STUDENT" : "NEW STUDENT"}
        </label>

        <h2>
          {student ? "Update Profile" : "Add Student"}
        </h2>

        <div className="form-grid">
          {[
            ["name", "Full Name"],
            ["roll", "Roll Number"],
            ["department", "Department"],
            ["semester", "Semester"],
            ["cgpa", "CGPA"],
            ["attendance", "Attendance %"],
            ["email", "Email"],
            ["phone", "Phone"],
          ].map(([name, placeholder]) => (
            <input
              key={name}
              name={name}
              value={form[name]}
              onChange={handleChange}
              placeholder={placeholder}
              required
            />
          ))}
        </div>

        <button className="primary" type="submit">
          Save Student
        </button>
      </form>
    </div>
  );
}