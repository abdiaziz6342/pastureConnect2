
const itemsContainer = document.getElementById("items-container");
const editSection = document.getElementById("edit-section");
const editForm = document.getElementById("edit-form");
const areasMessage = document.getElementById("areas-message");

const editLocation = document.getElementById("edit-location");
const editType = document.getElementById("edit-type");
const editStatus = document.getElementById("edit-status");
const editDescription = document.getElementById("edit-description");
const cancelEdit = document.getElementById("cancel-edit");

let editingId = null;

function getItems() {
    fetch("http://localhost:3000/locations")
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Failed to load reports.");
            }

            return response.json();
        })
        .then(function (locations) {
            itemsContainer.innerHTML = "";

            if (locations.length === 0) {
                itemsContainer.textContent = "No reports found.";
                return;
            }

            locations.forEach(function (item) {
                const card = document.createElement("article");
                card.className = "card";

                const heading = document.createElement("h3");
                heading.textContent = item.location;

                const type = document.createElement("p");
                type.textContent = "Resource: " + item.type;

                const status = document.createElement("p");
                status.textContent = "Condition: " + item.status;

                const description = document.createElement("p");
                description.textContent = item.description;

                const editButton = document.createElement("button");
                editButton.textContent = "Edit";
                editButton.className = "btn btn-primary";

                editButton.addEventListener("click", function () {
                    editItem(item.id);
                });

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.className = "btn btn-danger";

                deleteButton.addEventListener("click", function () {
                    deleteItem(item.id);
                });

                const actions = document.createElement("div");
                actions.className = "card-actions";
                actions.appendChild(editButton);
                actions.appendChild(deleteButton);

                card.appendChild(heading);
                card.appendChild(type);
                card.appendChild(status);
                card.appendChild(description);
                card.appendChild(actions);

                itemsContainer.appendChild(card);
            });
        })
        .catch(function (error) {
            itemsContainer.textContent = error.message;
        });
}

function editItem(id) {
    fetch("http://localhost:3000/locations/" + id)
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Could not find this report.");
            }

            return response.json();
        })
        .then(function (item) {
            editingId = item.id;

            editLocation.value = item.location;
            editType.value = item.type;
            editStatus.value = item.status;
            editDescription.value = item.description;

            editSection.classList.remove("hidden");

            editSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        })
        .catch(function (error) {
            areasMessage.textContent = error.message;
        });
}

editForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (editingId === null) {
        areasMessage.textContent = "Select a report to edit first.";
        return;
    }

    const updatedItem = {
        location: editLocation.value.trim(),
        type: editType.value,
        status: editStatus.value,
        description: editDescription.value.trim()
    };

    fetch("http://localhost:3000/locations/" + editingId, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedItem)
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Update failed.");
            }

            return response.json();
        })
        .then(function () {
            areasMessage.textContent = "Report updated successfully.";
            editSection.classList.add("hidden");
            editForm.reset();
            editingId = null;
            getItems();
        })
        .catch(function (error) {
            areasMessage.textContent = error.message;
        });
});

function deleteItem(id) {
    if (!confirm("Are you sure you want to delete this report?")) {
        return;
    }

    fetch("http://localhost:3000/locations/" + id, {
        method: "DELETE"
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Delete failed.");
            }

            areasMessage.textContent = "Report deleted successfully.";
            getItems();
        })
        .catch(function (error) {
            areasMessage.textContent = error.message;
        });
}

cancelEdit.addEventListener("click", function () {
    editSection.classList.add("hidden");
    editForm.reset();
    editingId = null;
});

getItems();
