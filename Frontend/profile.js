
const accessToken = sessionStorage.getItem("accessToken");

const editButton = document.querySelector("#edit-profile");
const editForm = document.querySelector("#edit-profile-form");
const cancelButton = document.querySelector("#cancel-edit");

const editName = document.querySelector("#edit-name");
const editUsername = document.querySelector("#edit-username");
const editWhatsapp = document.querySelector("#edit-whatsapp");

let currentUser;


// Check login
if (!accessToken) {
    alert("Please login to view your profile.");
    window.location.href = "login.html";
}


// Display profile information
function displayProfile(user) {
    document.querySelector("#profile-name").textContent = user.name;
    document.querySelector("#profile-username").textContent =
        `@${user.username}`;

    document.querySelector("#name").textContent = user.name;
    document.querySelector("#username").textContent = user.username;
    document.querySelector("#email").textContent = user.email;

    document.querySelector("#profile-avatar").textContent =
        user.name.charAt(0).toUpperCase();
    document.querySelector("#whatsapp-number").textContent =
    user.whatsappNumber
        ? "+" + user.whatsappNumber
        : "Not added";
}


// Fetch profile from backend
async function fetchProfile() {
    try {
        const response = await fetch(
            "http://localhost:8000/api/v1/users/profile",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Unable to fetch profile");
        }

        currentUser = result.data.user;

        displayProfile(currentUser);

    } catch (error) {
        console.error("Profile error:", error);
        alert(error.message);

        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("user");

        window.location.href = "login.html";
    }
}


// Open edit form
editButton.addEventListener("click", () => {
    if (!currentUser) return;

    editName.value = currentUser.name;
    editUsername.value = currentUser.username;
    editWhatsapp.value = currentUser.whatsappNumber || "";

    editForm.hidden = false;

    editForm.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
});


// Cancel editing
cancelButton.addEventListener("click", () => {
    editForm.reset();
    editForm.hidden = true;
});


// Save profile changes
editForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const updatedData = {
        name: editName.value.trim(),
        username: editUsername.value.trim(),
        whatsappNumber: editWhatsapp.value.trim()
    };

    if (!updatedData.name || !updatedData.username) {
        alert("Name and username are required.");
        return;
    }

    try {
        const response = await fetch(
            "http://localhost:8000/api/v1/users/update-profile",
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify(updatedData)
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Profile update failed");
        }

        currentUser = result.data.user;

        displayProfile(currentUser);

        sessionStorage.setItem(
            "user",
            JSON.stringify(currentUser)
        );

        editForm.hidden = true;

        alert("Profile updated successfully!");

    } catch (error) {
        console.error("Profile update error:", error);
        alert(error.message);
    }
});


// Initial profile fetch
fetchProfile();
