
const registerForm = document.querySelector("#register-form");

registerForm.addEventListener("submit", async (event) => {

    // Prevent default form submission
    event.preventDefault();

    // Get values from input fields
    const name = document.querySelector("#name").value.trim();
    const username = document.querySelector("#username").value.trim();
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value;
    const confirmPassword = document.querySelector("#confirm-password").value;

    // Check whether passwords match
    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    // Prepare data for backend
    const userData = {
        name,
        username,
        email,
        password
    };

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/v1/users/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Registration failed");
        }

        alert("Registration successful! Please login.");

        // Redirect to login page
        window.location.href = "login.html";

    } catch (error) {

        console.error("Registration error:", error);
        alert(error.message);

    }

});
