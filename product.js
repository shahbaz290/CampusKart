const products = [
    {
        id:1,
        src: "images/calci.png",
        name: "Scientific Calculator - Casio FX-991 CW",
        price: "Price: ₹299",
        sellerName: "Seller Name: Shahbaz",
        sellerContact: "Seller Contact: 987654321",
        desc: "Scientific Calculator - Casio FX-991 CW Scientific Calculator - Casio FX-991 CW Scientific Calculator - Casio FX-991 CW Scientific Calculator - Casio FX-991 CW"
    },
    {
        id:2,
        src: "images/drafter.jpg",
        name: "Mini Drafter",
        price: "Price: ₹99",
        sellerName: "Seller Name: Shahbaz",
        sellerContact: "Seller Contact: 987654321",
        desc: "Mini Drafter for EG drawings Mini Drafter for EG drawings Mini Drafter for EG drawings Mini Drafter for EG drawings Mini Drafter for EG drawings"
    },
    {
        id:3,
        src: "images/labcoat.png",
        name: "Lab Coat for Chemistry & EVS Lab",
        price: "Price: ₹99",
        sellerName: "Seller Name: Shahbaz",
        sellerContact: "Seller Contact: 987654321",
        desc: "Lab Coat for Chemistry and EVS lab Lab Coat for Chemistry and EVS lab Lab Coat for Chemistry and EVS lab Lab Coat for Chemistry and EVS lab Lab Coat for Chemistry and EVS lab"
    },
    {
        id:4,
        src: "images/book1.jpg",
        name: "C Language Book",
        price: "Price: ₹199",
        sellerName: "Seller Name: Shahbaz",
        sellerContact: "Seller Contact: 987654321",
        desc: "C Language book for learning it fast C Language book for learning it fast C Language book for learning it fast C Language book for learning it fast C Language book for learning it fast"
    },
    {
        id:5,
        src: "images/book2.webp",
        name: "EG Book",
        price: "Price: ₹199",
        sellerName: "Seller Name: Shahbaz",
        sellerContact: "Seller Contact: 987654321",
        desc: "EG book for Engineering Graphics EG book for Engineering Graphics EG book for Engineering Graphics EG book for Engineering Graphics EG book for Engineering Graphics EG book for Engineering Graphics"
    },
    {
        id:6,
        src: "images/holder.jpg",
        name: "Sheet Holder for EG Lab",
        price: "Price: ₹49",
        sellerName: "Seller Name: Shahbaz",
        sellerContact: "Seller Contact: 987654321",
        desc: "Sheet Holder for EG drawings Sheet Holder for EG drawings Sheet Holder for EG drawings Sheet Holder for EG drawings Sheet Holder for EG drawings Sheet Holder for EG drawings"
    },
]

const productImage = document.querySelector("#product-image");
const productName = document.querySelector('.pdt-name');
const productPrice = document.querySelector('.pdt-price');
const productSellerName = document.querySelector('.pdt-seller-name');
const productSellerContact = document.querySelector('.pdt-seller-contact');
const productDesc = document.querySelector('.pdt-desc');


const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

const product = products.find((item)=>{
    return item.id===id;
})

productImage.src=product.src;
productName.textContent= product.name;
productPrice.textContent= product.price;
productSellerName.textContent= product.sellerName;
productSellerContact.textContent= product.sellerContact;
productDesc.textContent = product.desc;