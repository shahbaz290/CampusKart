
const sellForm = document.querySelector("#sell-form");

const typeInput = document.querySelector("#type");
const priceInput = document.querySelector("#price");
const imageInput = document.querySelector("#img");

// Check whether the user is logged in
const accessToken = sessionStorage.getItem("accessToken");

if (!accessToken) {
    alert("Please login before creating a listing.");
    window.location.href = "login.html";
}

// Donations are free, so price is automatically set to 0
typeInput.addEventListener("change", () => {
    if (typeInput.value === "donate") {
        priceInput.value = 0;
        priceInput.disabled = true;
        priceInput.required = false;
    } else {
        priceInput.disabled = false;
        priceInput.required = true;
        priceInput.value = "";
    }
});

sellForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.querySelector("#pdt-name").value.trim();
    const type = typeInput.value;
    const price = type === "donate" ? 0 : Number(priceInput.value);
    const category = document.querySelector("#category").value.trim();
    const condition = document.querySelector("#condition").value;
    const description = document.querySelector("#desc").value.trim();

    const images = imageInput.files;

    // Basic validation
    if (type === "sell" && (!priceInput.value || price < 0)) {
        alert("Please enter a valid price.");
        return;
    }

    if (images.length > 5) {
        alert("You can upload a maximum of 5 images.");
        return;
    }

    for (const image of images) {
        if (!image.type.startsWith("image/")) {
            alert("Please select only image files.");
            return;
        }

        if (image.size > 5 * 1024 * 1024) {
            alert("Each image must be smaller than 5 MB.");
            return;
        }
    }

    // Create FormData
    const formData = new FormData();

    formData.append("title", title);
    formData.append("type", type);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("condition", condition);
    formData.append("description", description);

    // Append all selected images
    for (const image of images) {
        formData.append("images", image);
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/v1/listings/create`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                body: formData
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to create listing");
        }

        alert("Listing created successfully!");
        sellForm.reset();
        window.location.href = "index.html";

    } catch (error) {
        console.error("Create listing error:", error);
        alert(error.message);
    }
});
