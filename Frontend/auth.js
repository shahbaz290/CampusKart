
const nav = document.querySelector(".navvv");

function updateNavbar() {
    const accessToken = sessionStorage.getItem("accessToken");
    const user = JSON.parse(sessionStorage.getItem("user") || "null");

    if (!nav) return;

    if (accessToken) {
        nav.innerHTML = `
            <a href="index.html">Home</a>
            <a href="sell.html">Sell/Donate</a>
            <a href="my-listings.html">My Listings</a>
            <a href="profile.html">My Profile</a>
            <a href="about.html">About</a>
            <span class="nav-user">Hi, ${user?.name || "User"}</span>
            <a href="#" id="logout-btn">Logout</a>
        `;
    } else {
        nav.innerHTML = `
            <a href="index.html">Home</a>
            <a href="sell.html">Sell/Donate</a>
            <a href="about.html">About</a>
            <a href="login.html">Login</a>
            <a href="register.html">Register</a>
        `;
    }
}

updateNavbar();

// Logout
document.addEventListener("click", (event) => {
    if (event.target.id === "logout-btn") {
        event.preventDefault();

        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("user");

        alert("You have been logged out.");
        window.location.href = "index.html";
    }
});
