
const loginForm = document.querySelector("#login-form");

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    // Get input values
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#pass").value;

    // Prepare login data
    const userData = {
        email,
        password
    };

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/v1/users/login`,
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
            throw new Error(result.message || "Login failed");
        }

        // Extract access token and user details
        const { accessToken, user } = result.data;

        // Store token for the current browser session
        sessionStorage.setItem("accessToken", accessToken);

        // Store basic user information
        sessionStorage.setItem("user", JSON.stringify(user));

        alert(`Welcome back, ${user.name}!`);

        // Redirect to homepage
        window.location.href = "index.html";

    } catch (error) {
        console.error("Login error:", error);
        alert(error.message);
    }

});
