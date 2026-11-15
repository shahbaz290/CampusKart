
const myListings = document.querySelector("#my-listings");

const accessToken = sessionStorage.getItem("accessToken");

// Check login
if (!accessToken) {
    alert("Please login to view your listings.");
    window.location.href = "login.html";
}

// Fetch user's listings
async function fetchMyListings() {
    try {
        const response = await fetch(
            "http://localhost:8000/api/v1/listings/my-listings",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Unable to fetch listings");
        }

        const listings = result.data.mylist;
        displayListings(listings);

    } catch (error) {
        console.error("Fetch listings error:", error);
        myListings.innerHTML =
            `<p class="empty-message">${error.message}</p>`;
    }
}

// Display listings
function displayListings(listings) {
    myListings.innerHTML = "";

    if (!listings || listings.length === 0) {
        myListings.innerHTML =
            `<p class="empty-message">You haven't posted any listings yet.</p>`;
        return;
    }

    listings.forEach((listing) => {
        const card = document.createElement("div");
        card.classList.add("listing-card");

        const image = document.createElement("img");
        image.src = listing.images?.length
            ? listing.images[0]
            : "images/calci.png";
        image.alt = listing.title;

        const info = document.createElement("div");
        info.classList.add("listing-info");

        const title = document.createElement("h3");
        title.textContent = listing.title;

        const price = document.createElement("p");
        price.classList.add("listing-price");
        price.textContent = listing.type === "donate"
            ? "Free"
            : `₹${listing.price}`;

        const category = document.createElement("p");
        category.classList.add("listing-meta");
        category.textContent = `Category: ${listing.category}`;

        const condition = document.createElement("p");
        condition.classList.add("listing-meta");
        condition.textContent = `Condition: ${listing.condition}`;

        const status = document.createElement("span");
        status.classList.add("listing-status", listing.status);
        status.textContent = listing.status;

        info.append(title, price, category, condition, status);

        const actions = document.createElement("div");
        actions.classList.add("listing-actions");


        if (listing.status === "active") {
            const statusButton = document.createElement("button");

            statusButton.classList.add(
                listing.type === "donate" ? "donated-btn" : "sold-btn"
            );

            statusButton.textContent =
                listing.type === "donate" ? "Mark Donated" : "Mark Sold";

            statusButton.dataset.id = listing._id;
            statusButton.dataset.action = "status";

            actions.appendChild(statusButton);
        } else {
            const reactivateButton = document.createElement("button");

            reactivateButton.classList.add("sold-btn");
            reactivateButton.textContent = "Reactivate";
            reactivateButton.dataset.id = listing._id;
            reactivateButton.dataset.action = "reactivate";

            actions.appendChild(reactivateButton);
        }


        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-btn");
        deleteButton.textContent = "Delete";
        deleteButton.dataset.id = listing._id;
        deleteButton.dataset.action = "delete";

        actions.appendChild(deleteButton);
        info.appendChild(actions);

        card.append(image, info);
        myListings.appendChild(card);
    });
}

// Handle status update and delete
myListings.addEventListener("click", async (event) => {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.action;

    try {
        let response;


        if (action === "status" || action === "reactivate") {
            const newStatus = action === "reactivate"
                ? "active"
                : (
                    button.closest(".listing-card")
                        .querySelector(".listing-price")
                        .textContent === "Free"
                        ? "donated"
                        : "sold"
                );

            const confirmed = confirm(
                action === "reactivate"
                    ? "Reactivate this listing?"
                    : `Mark this listing as ${newStatus}?`
            );

            if (!confirmed) return;

            response = await fetch(
                `http://localhost:8000/api/v1/listings/${id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({ status: newStatus })
                }
            );
        }


        if (action === "delete") {
            const confirmed = confirm(
                "Are you sure you want to delete this listing?"
            );

            if (!confirmed) return;

            response = await fetch(
                `http://localhost:8000/api/v1/listings/delete/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );
        }

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Action failed");
        }

        alert(
            action === "delete"
                ? "Listing deleted successfully."
                : action === "reactivate"
                    ? "Listing reactivated successfully."
                    : "Listing status updated successfully."
        );

        fetchMyListings();

    } catch (error) {
        console.error("Listing action error:", error);
        alert(error.message);
    }
});

// Initial fetch
fetchMyListings();
