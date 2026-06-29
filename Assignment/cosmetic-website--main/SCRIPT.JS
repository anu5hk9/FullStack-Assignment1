// let main=document.querySelector("main");
// (async function productlisting(){
//     let products=[];
//     let url="https://dummyjson.com/products?limit=194"
//     let apiRes=await fetch(url)
//     let productData=await apiRes.json();
//     products=[...productdata.products]
//     let outerDiv=document.createElement("div")
//      let heading=document.createElement("h1")
//       let image=document.createElement("img")
//        let descriptionn=document.createElement("p")
//     let price_cart=document.createElement("div")
//     let price=
// })

let main = document.querySelector("main");

async function productListing() {
    try {
        let url = "https://dummyjson.com/products?limit=194";

        let apiRes = await fetch(url);
        let productData = await apiRes.json();

        let products = productData.products;

        let productContainer = document.createElement("div");
        productContainer.classList.add("product-container");

        products.forEach((product) => {
            let card = document.createElement("div");
            card.classList.add("product-card");

            card.innerHTML = `
                <img src="${product.thumbnail}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>${product.description.substring(0, 60)}...</p>
                
                <div class="price-cart">
                    <span class="price">₹${product.price}</span>
                    <button class="cart-btn">Add to Cart</button>
                </div>
            `;

            // Product Details Page
            card.addEventListener("click", () => {
                window.location.href = `product.html?id=${product.id}`;
            });

            // Add to Cart
            let cartBtn = card.querySelector(".cart-btn");

            cartBtn.addEventListener("click", (e) => {
                e.stopPropagation();

                let cart = JSON.parse(localStorage.getItem("cart")) || [];

                cart.push(product);

                localStorage.setItem("cart", JSON.stringify(cart));

                alert("Added to Cart");
            });

            productContainer.appendChild(card);
        });

        main.appendChild(productContainer);

    } catch (error) {
        console.log(error);
    }
}

productListing();

//product js
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function productDetails() {
    let res = await fetch(`https://dummyjson.com/products/${id}`);
    let product = await res.json();

    document.querySelector("main").innerHTML = `
        <div class="details">
            <img src="${product.thumbnail}">
            <div>
                <h1>${product.title}</h1>
                <p>${product.description}</p>
                <h2>₹${product.price}</h2>
                <button id="addCart">Add to Cart</button>
            </div>
        </div>
    `;

    document.getElementById("addCart").addEventListener("click", () => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
    });
}

productDetails();

//cart js
let cart = JSON.parse(localStorage.getItem("cart")) || [];



let total = 0;

cart.forEach((item) => {
    total += item.price;

    let div = document.createElement("div");

    div.innerHTML = `
        <h3>${item.title}</h3>
        <p>₹${item.price}</p>
        <hr>
    `;

    main.appendChild(div);
});

let summary = document.createElement("div");

summary.innerHTML = `
    <h2>Bill Summary</h2>
    <h3>Total Items : ${cart.length}</h3>
    <h3>Total Amount : ₹${total}</h3>
`;

main.appendChild(summary);