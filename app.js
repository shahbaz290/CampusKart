const browseBtn = document.querySelector(".browse");
const items = document.querySelector('.items');


browseBtn.addEventListener('click', ()=>{
    items.scrollIntoView({
        behavior: "smooth"
    });
});

const btns = document.querySelectorAll(".view-details");

btns.forEach((btn)=>{
    btn.addEventListener('click', ()=>{
        const id = btn.dataset.id;
        window.location.href = `product.html?id=${id}`;
    })
})

const sellBtn = document.querySelector('.sell');

sellBtn.addEventListener('click', ()=>{
    window.location.href = "sell.html"
})
