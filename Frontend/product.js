
// 1. Select HTML elements
const productImage = document.querySelector("#product-image");
const productName = document.querySelector(".pdt-name");
const productPrice = document.querySelector(".pdt-price");
const productSellerName = document.querySelector(".pdt-seller-name");
const productSellerContact = document.querySelector(".pdt-seller-contact");
const productDesc = document.querySelector(".pdt-desc");

// 2. Get listing ID from the URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// 3. Fetch a single listing from the backend
async function fetchProduct() {
    try {
        if (!id) {
            throw new Error("Product ID is missing");
        }

        const response = await fetch(
            `${API_BASE_URL}/api/v1/listings/${id}`
        );

        if (!response.ok) {
            throw new Error("Product not found");
        }

        const result = await response.json();

        const product = result.data.list;

        displayProduct(product);

    } catch (error) {
        console.error("Error fetching product:", error);

        document.querySelector(".pdt-details").innerHTML =
            "<h2>Product not found</h2><p>This listing may have been removed or the link is invalid.</p>";

        productImage.style.display = "none";
    }
}

// 4. Display product details on the page
function displayProduct(product) {

    // Product image
    if (product.images && product.images.length > 0) {
        productImage.src = product.images[0];
        productImage.alt = product.title;

        productImage.onerror = () => {
            productImage.style.display = "none";
        };
    } else {
        productImage.style.display = "none";
    }

    // Product title
    productName.textContent = product.title;

    // Product price
    productPrice.textContent = product.type === "donate"
        ? "Free"
        : `Price: ₹${product.price}`;

    // Seller name
    productSellerName.textContent =
        `Seller Name: ${product.seller?.name || "Unknown"}`;

    // WhatsApp contact
    const whatsappNumber = product.seller?.whatsappNumber;

    productSellerContact.replaceChildren();

    if (whatsappNumber) {
        const whatsappButton = document.createElement("a");

        const message = `Hi, I'm interested in your listing "${product.title}" on CampusKart. Is it still available?`;

        whatsappButton.href =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        whatsappButton.textContent = "Contact Seller on WhatsApp";
        whatsappButton.className = "whatsapp-btn";
        whatsappButton.target = "_blank";
        whatsappButton.rel = "noopener noreferrer";

        productSellerContact.appendChild(whatsappButton);

    } else {
        productSellerContact.textContent =
            "Seller has not added a WhatsApp number.";
    }

    // Product description
    productDesc.textContent = product.description;
}

// 5. Start fetching the product
fetchProduct();
