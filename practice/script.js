// Store subjects
let subjects = [];

// Store completed tasks
let completedTasks = 0;


// -----------------------------
// MODAL
// -----------------------------

function openModal() {
    document.getElementById("subjectModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("subjectModal").style.display = "none";
}


// -----------------------------
// ADD SUBJECT
// -----------------------------

document
    .getElementById("subjectForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const name =
            document.getElementById("subjectName").value;

        const difficulty =
            document.getElementById("difficulty").value;

        const examDate =
            document.getElementById("examDate").value;

        const dailyHours =
            parseFloat(
                document.getElementById("dailyHours").value
            );


        const subject = {
            id: Date.now(),
            name: name,
            difficulty: difficulty,
            examDate: examDate,
            dailyHours: dailyHours
        };


        subjects.push(subject);

        displaySubjects();

        updateStats();

        generatePlan();

        document.getElementById("subjectForm").reset();

        closeModal();
    });


// -----------------------------
// DISPLAY SUBJECTS
// -----------------------------

function displaySubjects() {

    const subjectList =
        document.getElementById("subjectList");

    subjectList.innerHTML = "";


    subjects.forEach(function(subject) {

        const card = document.createElement("div");

        card.className = "subject-card";


        card.innerHTML = `

            <h3>${subject.name}</h3>

            <span class="badge">
                ${subject.difficulty}
            </span>

            <p>
                📅 Exam:
                ${subject.examDate}
            </p>

            <p>
                ⏱️ Daily:
                ${subject.dailyHours} hours
            </p>

            <button
                class="delete-btn"
                onclick="deleteSubject(${subject.id})"
            >
                Delete
            </button>

        `;


        subjectList.appendChild(card);

    });
}


// -----------------------------
// DELETE SUBJECT
// -----------------------------

function deleteSubject(id) {

    subjects =
        subjects.filter(function(subject) {

            return subject.id !== id;

        });


    displaySubjects();

    updateStats();

    generatePlan();
}


// -----------------------------
// UPDATE DASHBOARD
// -----------------------------

function updateStats() {

    document.getElementById("totalSubjects")
        .textContent = subjects.length;


    let totalHours = 0;


    subjects.forEach(function(subject) {

        totalHours += subject.dailyHours;

    });


    document.getElementById("studyHours")
        .textContent = totalHours + " hrs";


    document.getElementById("completedTasks")
        .textContent = completedTasks;

}


// -----------------------------
// GENERATE STUDY PLAN
// -----------------------------

function generatePlan() {

    const days = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday"
    ];


    days.forEach(function(day) {

        document.getElementById(day).innerHTML = "";

    });


    if (subjects.length === 0) {
        return;
    }


    subjects.forEach(function(subject, index) {

        const day =
            days[index % days.length];


        const session =
            document.createElement("div");


        session.className = "session";


        session.innerHTML = `

            <label>

                <input
                    type="checkbox"
                    onchange="taskCompleted(this)"
                >

                <span>
                    <strong>
                        ${subject