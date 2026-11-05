const locationForm = document.getElementById("locationForm");
const reportMessage = document.getElementById("report-message");

locationForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const newLocation = {
        location: document.getElementById("location").value.trim(),
        type: document.getElementById("type").value,
        status: document.getElementById("status").value,
        description: document.getElementById("description").value.trim()
    };

    fetch("http://localhost:3000/locations", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newLocation)
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Could not save the report.");
            }

            return response.json();
        })
        .then(function () {
            reportMessage.textContent = "Report submitted successfully.";
            locationForm.reset();
        })
        .catch(function () {
            reportMessage.textContent =
                "Could not submit report. Check that JSON Server is running.";
        });
});