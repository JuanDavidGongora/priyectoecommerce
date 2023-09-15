async function getProducts () {
    try{
        const data = await fetch(
            "https://ecommercebackend.fundamentos-29.repl.co/"
        );

        const res = await data.json();

        window.localStorage.setItem("products", JSON.stringify(res));

        return res;
    } catch (error) {
        console.log(error);
    }

}

function printProducts(db) {
    const productsHTML = document.querySelector (".products");

    let html = "";

    for (const product of db.products) {
        const buttonAdd = product.quantity 
            ?  `<i class='bx bx-plus' id= '${product.id}'></i>` 
            : "<span class= 'SoldOut'> sold out</span>";
        html += `  
        <div class= "product"> 
            <div class="product__img">
                <img src ="${product.image}" alt="imagen" />
            </div>

            <div class="product__info">
                <h5>
                     $${product.price}.00
                     <span><b>Stock</b>:${product.quantity}</span>
                    ${buttonAdd}
                </h5>  
                 <h4>${product.name} </h4>
                 
             </div>
           
        </div>
        `;
    }

    productsHTML.innerHTML = html;
}

function handleShowCart(db){
    const iconCartHTML = document.querySelector(".bx-cart");
    const cartHTML = document.querySelector(".cart");

    iconCartHTML.addEventListener("click", function() {
        cartHTML.classList.toggle("cart__show");
    });
}

function addToCartFromProducts(db){
    const productsHTML = document.querySelector(".products");

    productsHTML.addEventListener("click", function (e) {
        if (e.target.classList.contains("bx-plus")) {
            const id = Number(e.target.id);

            const productFind = db.products.find(
                (product) => product.id === id
                );

                if(db.cart[productFind.id]){
                    if(productFind.quantity === db.cart[productFind.id].amount) 
                        return alert ("No tenemos mas en bodega");
                    db.cart[productFind.id].amount++;
 
                } else {
                    db.cart[productFind.id] = { ...productFind, amount: 1}

                }

                window.localStorage.setItem("cart", JSON.stringify(db.cart));
                printProductsInCart(db);
                printTotal(db);
                handlePrintAmountProducts(db);

               
        }
    });
}
function printProductsInCart(db){
    const cartProducts = document.querySelector(".cart__products");

    let html = "";

    for (const product in db.cart) {
        const {quantity, price, name, image, id, amount} = db.cart[product];

        html += `
            <div class="cart__product">
                <div class="cart__product--img">
                    <img src="${image}" alt="imagen"/>
                </div>
                <div class= "cart__product--body">
                    <h4>${name} | $${price}.00</h4>
                    <p>Stock: ${quantity}</p>  

                    <div class="cart__product--body-op" id='${id}'>
                         <i class='bx bx-minus'></i>
                         <span>${amount} unit</span>
                         <i class='bx bx-plus'></i>
                         <i class='bx bx-trash'></i>  
                    </div>
                </div>    
             </div>
         `;
        
    }

    cartProducts.innerHTML = html;
   

}
function handleProductsInCart(db){

    const cartProducts = document.querySelector (".cart__products");

    cartProducts.addEventListener("click", function(e){
        if(e.target.classList.contains("bx-plus")){
            const id = Number(e.target.parentElement.id);
            const productFind = db.products.find(
                (product) => product.id === id
                );
                if(productFind.quantity === db.cart[productFind.id].amount) 
                return alert ("No tenemos mas en bodega");

            db.cart[id].amount++

        }

        if(e.target.classList.contains("bx-minus")){
            const id = Number(e.target.parentElement.id);
            if(db.cart[id].amount === 1){
                const response = confirm(
                    "Estas seguro de que quieres eliminar este producto?");

                    if(!response) return;
                delete db.cart[id];
            } else {
                db.cart[id].amount--;
            }
            
        }

        if(e.target.classList.contains("bx-trash")){
            const id = Number(e.target.parentElement.id);
            const response = confirm(
                "Estas seguro de que quieres eliminar este producto?");

                if(!response) return;
            delete db.cart[id];
           
        }

        window.localStorage.setItem('cart', JSON.stringify(db.cart))

        printProductsInCart (db);
        printTotal(db);
        handlePrintAmountProducts(db);

    }); 
}
function printTotal(db){
    const infoTotal = document.querySelector('.info__total');
    const infoAmount = document.querySelector('.info__amount');

    console.log(db.cart);

    let totalProducts = 0
    let amountProducts = 0

    for (const product in db.cart) {
        const{amount, price} = db.cart[product];
        totalProducts += price * amount
        amountProducts += amount;
    }

    infoAmount.textContent = amountProducts + "units";
    infoTotal.textContent =  '$' +  totalProducts + ".00";
}
function handleTotal (db){
    const btnBuy = document.querySelector(".btn__buy");

    btnBuy.addEventListener('click', function(){
        if(!Object.values(db.cart).length) return alert ("Gracias por su Donacion");
        const response = confirm ("Seguro que quieres comprar");
        if (!response) return;

        const currentProducts = [];

        for (const product of db.products) {
            const productCart = db.cart[product.id]
            if(product.id === productCart?.id) {
                currentProducts.push({
                    ...product,
                    quantity: product.quantity - productCart.amount
                });
            } else {
                currentProducts.push(product);
            }
        }

        db.products = currentProducts;
        db.cart = {}

        window.localStorage.setItem("products", JSON.stringify(db.products));
        window.localStorage.setItem("cart", JSON.stringify(db.cart));

        printTotal(db);
        printProductsInCart(db);
        printProducts(db);
        handlePrintAmountProducts(db);

    });
    
   

} 
function handlePrintAmountProducts(db){
    const amountProducts = document.querySelector(".amountProducts");

    let amount = 0;

    for (const product in db.cart) {

    amount += db.cart[product].amount;
        
    }

    amountProducts.textContent = amount;
    
}
function ennableDarkMode(db){
    const darkModeToggle = document.getElementById("dark-mode-toggle");
const body = document.body;

darkModeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode", !body.classList.contains("dark-mode"));
    const icon = darkModeToggle.querySelector("i");

    if (body.classList.contains("dark-mode")) {
        icon.classList.remove("bx-moon");
        icon.classList.add("bx-sun"); 
    } else {
        icon.classList.remove("bx-sun");
        icon.classList.add("bx-moon");
    }
});
}

function handleScroll() {
    const header = document.querySelector('.sticky');
    const scrollY = window.scrollY;

    
    if (scrollY > 0) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

function cartDarkModePersist(db){
const darkModeToggle = document.getElementById('dark-mode-toggle');
darkModeToggle.addEventListener('click', () => {
    const body = document.body;
    body.classList.toggle('dark-mode');
    localStorage.setItem('dark-mode', body.classList.contains('dark-mode'));
});
const isDarkModeEnabled = localStorage.getItem('dark-mode') === 'true';
if (isDarkModeEnabled) {
    document.body.classList.add('dark-mode');
}


}


function darkModeToogle(db){

const darkModeToggle = document.getElementById('dark-mode-toggle');


darkModeToggle.addEventListener('click', () => {
   
    const body = document.body;

    
    body.classList.toggle('dark-mode');

    
    const elementsToToggleDarkMode = document.querySelectorAll('.products, .cart, .cart__show, .cart__products, .product__info, product__img, .home__header, footer, ');
    elementsToToggleDarkMode.forEach((element) => {
        element.classList.toggle('dark-mode');
    });

   
    localStorage.setItem('dark-mode', body.classList.contains('dark-mode'));
});


}

function createFooterContent() {
    const footerContainer = document.getElementById("footer-container");

    const footerData = {
        "Our information": ["Bogota - Colombia"],
        "About Us": ["Support Center", "Customer Support", "About Us", "Copy Right"],
        "Product": ["Hoodies", "Shirts", "About Us", "Sweatshirts"],
        "Social": [
            '<a href="#"><i class="bx bxl-facebook"></i></a>',
            '<a href="#"><i class="bx bxl-twitter"></i></a>',
            '<a href="#"><i class="bx bxl-instagram"></i></a>'
        ],
        "Contact Info": ["Email: juandavid.623@gmail.com", "Phone: +57 310658000"]
    };

  
    for (const sectionTitle in footerData) {
        const sectionDiv = document.createElement("div");
        sectionDiv.className = "footer_info";

        const sectionTitleElement = document.createElement("h3");
        sectionTitleElement.className = "footer_info-title";
        sectionTitleElement.textContent = sectionTitle;

        const ul = document.createElement("ul");

        footerData[sectionTitle].forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = item;
            ul.appendChild(li);
        });

        sectionDiv.appendChild(sectionTitleElement);
        sectionDiv.appendChild(ul);

        footerContainer.appendChild(sectionDiv);
    }

    
    const additionalParagraph = document.createElement("p");
    additionalParagraph.innerHTML =
        "<b>JUAN DAVID GONGORA BAEZ, juandavid.623@gmail.com y <a href='#'>repositorio</a> de la persona que lo realizó</b><br>" +
        "Puedes utilizar esta  <a href='https://services-academlo-shopping.onrender.com/' target='_blank'>click</a>, " +
        "o si tienes problemas con esa, utiliza esta  <a href='https://ecommercebackend.fundamentos-29.repl.co' target='_blank'>click</a>";

    footerContainer.appendChild(additionalParagraph);
}


async function main () {
    const db = {
        products:  
            JSON.parse(window.localStorage.getItem("products")) || 
             (await getProducts()),
        cart: JSON.parse (window.localStorage.getItem("cart")) || {},
    };

    window.addEventListener('scroll', handleScroll);
    window.onload = createFooterContent;

    printProducts (db);
    handleShowCart();
    addToCartFromProducts(db);
    printProductsInCart (db);
    handleProductsInCart(db);
    printTotal(db);
    handleTotal (db);
    handlePrintAmountProducts(db);
    ennableDarkMode(db);
    cartDarkModePersist(db);
    darkModeToogle(db);

    document.addEventListener('DOMContentLoaded', function () {
       
        setTimeout(function () {
            const loader = document.querySelector('.loader-container');
            loader.style.display = 'none';
            
        }, 1000);
    });
    








}

main(); 