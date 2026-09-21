/* ==========================================
   STUDYFLOW APPLICATION
========================================== */


/* ==========================================
   AUTHENTICATION
========================================== */

function getUsers() {

    return JSON.parse(
        localStorage.getItem("studyflowUsers")
    ) || [];

}


function signupUser(event) {

    event.preventDefault();

    const name =
        document.getElementById("signupName").value.trim();

    const email =
        document.getElementById("signupEmail").value
        .trim()
        .toLowerCase();

    const password =
        document.getElementById("signupPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const message =
        document.getElementById("signupMessage");


    if (password !== confirmPassword) {

        message.style.color = "#dc2626";

        message.textContent =
            "Passwords do not match.";

        return;

    }


    const users = getUsers();

    const existingUser =
        users.find(user => user.email === email);


    if (existingUser) {

        message.style.color = "#dc2626";

        message.textContent =
            "An account with this email already exists.";

        return;

    }


    users.push({
        name,
        email,
        password
    });


    localStorage.setItem(
        "studyflowUsers",
        JSON.stringify(users)
    );


    message.style.color = "#16a34a";

    message.textContent =
        "Account created successfully. You can now sign in.";


    setTimeout(() => {

        showLogin();

        document.getElementById("loginEmail").value =
            email;

    }, 1200);

}


function loginUser(event) {

    event.preventDefault();

    const email =
        document.getElementById("loginEmail").value
        .trim()
        .toLowerCase();

    const password =
        document.getElementById("loginPassword").value;


    const users = getUsers();

    const user =
        users.find(
            item =>
                item.email === email &&
                item.password === password
        );


    const message =
        document.getElementById("loginMessage");


    if (!user) {

        message.style.color = "#dc2626";

        message.textContent =
            "Invalid email or password.";

        return;

    }


    localStorage.setItem(
        "studyflowCurrentUser",
        JSON.stringify(user)
    );


    if (
        document.getElementById("rememberMe").checked
    ) {

        localStorage.setItem(
            "studyflowRemember",
            "true"
        );

    }


    showDashboard();

}


function logoutUser() {

    localStorage.removeItem(
        "studyflowCurrentUser"
    );

    location.reload();

}


function showSignup() {

    document
        .getElementById("loginForm")
        .classList.add("hidden");

    document
        .getElementById("signupForm")
        .classList.remove("hidden");

}


function showLogin() {

    document
        .getElementById("signupForm")
        .classList.add("hidden");

    document
        .getElementById("loginForm")
        .classList.remove("hidden");

}


function forgotPassword() {

    alert(
        "Password reset functionality can be connected to a backend email service."
    );

}


function togglePassword(id, button) {

    const input =
        document.getElementById(id);

    if (input.type === "password") {

        input.type = "text";

        button.textContent = "Hide";

    } else {

        input.type = "password";

        button.textContent = "Show";

    }

}


/* ==========================================
   DASHBOARD
========================================== */

function showDashboard() {

    const user =
        JSON.parse(
            localStorage.getItem(
                "studyflowCurrentUser"
            )
        );


    if (!user) return;


    document
        .getElementById("authSection")
        .classList.add("hidden");


    document
        .getElementById("dashboardSection")
        .classList.remove("hidden");


    document
        .getElementById("profileName")
        .textContent = user.name;


    document
        .getElementById("profileAvatar")
        .textContent =
        user.name.charAt(0).toUpperCase();


    document
        .getElementById("welcomeMessage")
        .textContent =
        `Welcome back, ${user.name}`;


    loadSubjects();

    updateDashboard();

}


/* ==========================================
   SUBJECT MANAGEMENT
========================================== */

function getSubjects() {

    return JSON.parse(
        localStorage.getItem("studyflowSubjects")
    ) || [];

}


function saveSubjects(subjects) {

    localStorage.setItem(
        "studyflowSubjects",
        JSON.stringify(subjects)
    );

}


function openSubjectModal() {

    document
        .getElementById("subjectModal")
        .classList.remove("hidden");

}


function closeSubjectModal() {

    document
        .getElementById("subjectModal")
        .classList.add("hidden");

}


function addSubject(event) {

    event.preventDefault();


    const name =
        document
            .getElementById("subjectName")
            .value
            .trim();

    const difficulty =
        document
            .getElementById("difficulty")
            .value;

    const examDate =
        document
            .getElementById("examDate")
            .value;

    const dailyHours =
        Number(
            document
                .getElementById("dailyHours")
                .value
        );


    const subjects = getSubjects();


    subjects.push({

        id: Date.now(),

        name,

        difficulty,

        examDate,

        dailyHours

    });


    saveSubjects(subjects);

    loadSubjects();

    updateDashboard();

    closeSubjectModal();


    event.target.reset();

}


function deleteSubject(id) {

    let subjects = getSubjects();

    subjects =
        subjects.filter(
            subject =>
                subject.id !== id
        );


    saveSubjects(subjects);

    loadSubjects();

    updateDashboard();

}


function loadSubjects() {

    const container =
        document.getElementById("subjectList");

    const subjects = getSubjects();


    container.innerHTML = "";


    if (subjects.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                No subjects added yet.
            </div>
        `;

        return;

    }


    subjects.forEach(subject => {

        const card =
            document.createElement("div");


        card.className =
            "subject-card";


        card.innerHTML = `

            <span class="difficulty">
                ${subject.difficulty}
            </span>

            <h3>
                ${subject.name}
            </h3>

            <p>
                Examination:
                ${subject.examDate}
            </p>

            <p>
                Daily Study:
                ${subject.dailyHours} hours
            </p>

            <button
                class="delete-btn"
                onclick="deleteSubject(${subject.id})"
            >
                Remove Subject
            </button>

        `;


        container.appendChild(card);

    });

}


/* ==========================================
   DASHBOARD STATISTICS
========================================== */

function updateDashboard() {

    const subjects = getSubjects();


    document
        .getElementById("totalSubjects")
        .textContent =
        subjects.length;


    const studyHours =
        subjects.reduce(
            (total, subject) =>
                total +
                Number(subject.dailyHours),
            0
        );


    document
        .getElementById("studyHours")
        .textContent =
        studyHours.toFixed(1);


    const completed =
        Number(
            localStorage.getItem(
                "studyflowCompleted"
            )
        ) || 0;


    const planned =
        subjects.length * 5;


    const progress =
        planned === 0
            ? 0
            : Math.min(
                100,
                Math.round(
                    completed /
                    planned *
                    100
                )
            );


    document
        .getElementById("completedTasks")
        .textContent =
        completed;


    document
        .getElementById("overallProgress")
        .textContent =
        `${progress}%`;


    document
        .getElementById("progressText")
        .textContent =
        `${progress}%`;


    document
        .getElementById("progressBar")
        .style.width =
        `${progress}%`;


    document
        .getElementById("plannedTasks")
        .textContent =
        planned;


    document
        .getElementById("doneTasks")
        .textContent =
        completed;


    document
        .getElementById("pendingTasks")
        .textContent =
        Math.max(
            0,
            planned - completed
        );


    updateFocus();

}


/* ==========================================
   STUDY PLAN
========================================== */

function generatePlan() {

    const subjects = getSubjects();


    if (subjects.length === 0) {

        alert(
            "Add at least one subject before generating a study plan."
        );

        return;

    }


    const days = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday"
    ];


    days.forEach(
        day => {

            document
                .getElementById(day)
                .innerHTML = "";

        }
    );


    subjects.forEach(
        (subject, index) => {

            const day =
                days[index % days.length];


            const session =
                document.createElement("div");


            session.className =
                "session";


            session.innerHTML = `

                <strong>
                    ${subject.name}
                </strong>

                <br>

                <small>
                    ${subject.dailyHours}
                    hour(s) study session
                </small>

            `;


            document
                .getElementById(day)
                .appendChild(session);

        }
    );


    updateFocus();

}


function updateFocus() {

    const container =
        document.getElementById(
            "focusList"
        );


    const subjects = getSubjects();


    if (subjects.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                No study sessions planned yet.
            </div>
        `;

        return;

    }


    container.innerHTML = "";


    subjects
        .slice(0, 3)
        .forEach(subject => {

            const item =
                document.createElement("div");


            item.className =
                "focus-item";


            item.innerHTML = `

                <div>

                    <strong>
                        ${subject.name}
                    </strong>

                    <p>
                        Focus on today's study goals
                    </p>

                </div>

                <span class="focus-time">
                    ${subject.dailyHours} hours
                </span>

            `;


            container.appendChild(item);

        });

}


/* ==========================================
   PAGE LOAD
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const currentUser =
            localStorage.getItem(
                "studyflowCurrentUser"
            );


        if (currentUser) {

            showDashboard();

        }

    }
);