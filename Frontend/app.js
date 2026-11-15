
const browseBtn = document.querySelector(".browse");
const items = document.querySelector(".items");
const sellBtn = document.querySelector(".sell");
const searchInput = document.querySelector(".Search");
const filterButtons = document.querySelectorAll(".filter-btn");
const sortSelect = document.querySelector("#sort");
const pagination = document.querySelector("#pagination");


// Current filter values
let currentSearch = "";
let currentCategory = "";
let currentSort = "newest";
let currentPage = 1;

const limit = 10;
let totalPages = 1;

let searchTimeout;


// Browse Listings button
browseBtn.addEventListener("click", () => {
    items.scrollIntoView({
        behavior: "smooth"
    });
});


// Sell or Donate button
sellBtn.addEventListener("click", () => {
    window.location.href = "sell.html";
});


// Fetch listings from backend
async function fetchListings() {
    try {
        items.innerHTML = "<p>Loading listings...</p>";

        const params = new URLSearchParams();

        if (currentSearch) {
            params.append("search", currentSearch);
        }

        if (currentCategory) {
            params.append("category", currentCategory);
        }

        if (currentSort !== "newest") {
            params.append("sort", currentSort);
        }

        params.append("page", currentPage);
        params.append("limit", limit);

        const response = await fetch(
            `${API_BASE_URL}/api/v1/listings?${params.toString()}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch listings");
        }

        const result = await response.json();

        displayListings(result.data.list);

        totalPages = result.data.totalPages;

        displayPagination();

    } catch (error) {
        console.error("Fetch listings error:", error);
        items.innerHTML =
            "<p>Unable to load listings. Please try again later.</p>";

        pagination.innerHTML = "";
    }
}


// Display listings dynamically
function displayListings(listings) {
    items.innerHTML = "";

    if (!listings || listings.length === 0) {
        items.innerHTML = "<p>No listings available right now.</p>";
        return;
    }

    listings.forEach((listing) => {
        const card = document.createElement("div");
        card.classList.add("cards");

        const img = document.createElement("img");

        img.src = listing.images?.length
            ? listing.images[0]
            : "images/calci.png";

        img.alt = listing.title;

        const title = document.createElement("h4");
        title.textContent = listing.title;

        const price = document.createElement("p");
        price.textContent = listing.type === "donate"
            ? "Free"
            : `Price: ₹${listing.price}`;

        const button = document.createElement("button");
        button.classList.add("view-details");
        button.textContent = "View Details";
        button.dataset.id = listing._id;

        card.append(img, title, price, button);
        items.appendChild(card);
    });
}


// Display pagination controls
function displayPagination() {
    pagination.innerHTML = "";

    if (totalPages <= 1) return;

    // Previous button
    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.disabled = currentPage === 1;

    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            fetchListings();

            items.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });

    pagination.appendChild(prevButton);

    // Page information
    const pageInfo = document.createElement("span");
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    pagination.appendChild(pageInfo);

    // Next button
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.disabled = currentPage === totalPages;

    nextButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchListings();

            items.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });

    pagination.appendChild(nextButton);
}


// Handle View Details button clicks
items.addEventListener("click", (event) => {
    const button = event.target.closest(".view-details");

    if (!button) return;

    const id = button.dataset.id;
    window.location.href = `product.html?id=${id}`;
});


// Search while typing
searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
        currentSearch = searchInput.value.trim();
        currentPage = 1;
        fetchListings();
    }, 400);
});


// Search when Enter is pressed
searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();

        clearTimeout(searchTimeout);

        currentSearch = searchInput.value.trim();
        currentPage = 1;

        fetchListings();

        items.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
});


// Category filtering
filterButtons.forEach((button) => {
    button.addEventListener("click", () => {

        filterButtons.forEach((btn) => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentCategory = button.dataset.category;
        currentPage = 1;

        fetchListings();

        items.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});


// Sorting
sortSelect.addEventListener("change", () => {
    currentSort = sortSelect.value;
    currentPage = 1;

    fetchListings();
});


// Load listings when homepage opens
fetchListings();
