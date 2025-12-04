document.addEventListener('DOMContentLoaded', () => {
    const url = "https://gist.githubusercontent.com/rconnolly/d37a491b50203d66d043c26f33dbd798/raw/37b5b68c527ddbe824eaed12073d266d5455432a/clothing-compact.json";

    /* ---------------- utility functions ---------------- */
    function retrieveStorage() {
        return JSON.parse(localStorage.getItem('products')) || [];
    }

    function updateStorage(data) {
        localStorage.setItem('products', JSON.stringify(data));
    }

    // fetch and save data to local storage and run main()
    function fetchAndStore() {
        fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new error("fetch failed");
            }
        })
        .then(data => {
            updateStorage(data);
            main(data);
        })
        .catch(error => console.error(error));
    }

    // check if data already exists in local storage or not 
    const products = retrieveStorage();
    if (products && products.length > 0) {
        main(products);
    } else {
        fetchAndStore();
    }
    
    // toggles triangle for browse filter 
    function toggleTriagngle(name) {
        const p = document.querySelector("#" + name + " p");
        p.textContent = p.textContent.endsWith('▲')
            ? p.textContent.replace('▲', '▼')
            : p.textContent.replace('▼', '▲');
    }

    // populates category filter 
    function populateCategoryFilter(data) {
        const categoryCheckBox = document.querySelector("#categoryCheckBox");
        categoryCheckBox.classList.toggle("hidden");

        categoryCheckBox.innerHTML = "";

        toggleTriagngle("category");

        const categories = [];
        for (let product of data) {
            if (!categories.includes(product.category)) {
                categories.push(product.category);
            }
        }
    
        categories.sort();
        
        for (let c of categories) {
            const input = document.createElement("input");
            input.type = "checkbox";
            input.classList.add("category");

            input.setAttribute("id", c);
            input.setAttribute("name", c);
            input.setAttribute("value", c);
            
            const label = document.createElement("label");
            label.textContent = c;
            label.setAttribute("for", c);

            categoryCheckBox.appendChild(input);
            categoryCheckBox.appendChild(label);
        }
    }

    // populates size filter
    function populateSizeFilter(data) {
        const sizeCheckBox = document.querySelector("#sizeCheckBox");
        sizeCheckBox.classList.toggle("hidden");

        sizeCheckBox.innerHTML = "";

        toggleTriagngle("size");

        const sizes = [];
        for (let product of data) {
            for (let s of product.sizes) {
                if (!sizes.includes(s)) {
                    sizes.push(s)
                }
            }
        }

        for (let s of sizes) {
            const input = document.createElement("input");
            input.type = "checkbox";
            input.classList.add("size");

            input.setAttribute("id", s);
            input.setAttribute("name", s);
            input.setAttribute("value", s);
            
            const label = document.createElement("label");
            label.textContent = s;
            label.setAttribute("for", s);

            sizeCheckBox.appendChild(input);
            sizeCheckBox.appendChild(label);
        }
    }

    // sort sizes 
    function sortSize(sizes) {
        
    }

    // populates color filter 
    function populateColorsFilter(data) {
        const colorsCheckBox = document.querySelector("#colorsCheckBox");
        colorsCheckBox.classList.toggle("hidden");

        colorsCheckBox.innerHTML = "";

        toggleTriagngle("colors");

        const colors = [];
        for (let product of data) {
            for (let c of product.color) {
                if (colors.findIndex(col => col.name === c.name) === -1) {
                    colors.push(c);
                }
            }

        }

        colors.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });

        for (let c of colors) {
            //console.log(c);
            const input = document.createElement("input");
            input.type = "checkbox";
            input.classList.add("color");

            input.setAttribute("id", c.name);
            input.setAttribute("name", c.name);
            input.setAttribute("value", c.name);
            
            const label = document.createElement("label");
            label.textContent = c.name;
            label.setAttribute("for", c.name);

            const div = document.createElement("div");
            div.style.backgroundColor = c.hex;
            div.style.height = "20px";
            div.style.width = "20px";
            div.style.border = "1px solid black";
            div.setAttribute("for", c.name);

            colorsCheckBox.appendChild(input);
            colorsCheckBox.appendChild(label);
            label.appendChild(div);
        }
    }

    // populates all filters according to what was clicked 
    function populateFilter(e, data) {
        if (e.target.nodeName == "P") {
                if (e.target.textContent.includes("Gender")) {
                    document.querySelector("#genderCheckBox").classList.toggle("hidden");
                    toggleTriagngle("gender")
                } else if (e.target.textContent.includes("Category")) {
                    populateCategoryFilter(data);
                } else if (e.target.textContent.includes("Size")) {
                    populateSizeFilter(data);
                } else if (e.target.textContent.includes("Colors")) {
                    populateColorsFilter(data);
                }
            }
    }

    // navigation
    function navigationHandler(e) {
        const home = document.querySelector("#home");
        const browse = document.querySelector("#browse");
        const about = document.querySelector("#about");
        const shoppingCart = document.querySelector("#shoppingCart");
        
        document.querySelector("#singleProduct").classList.add("hidden");

        if(e.target.nodeName == "IMG") {
            showView("home")
            return;
        } else if (e.target.nodeName == "LI") {
            const navList = document.querySelectorAll("#navigation li");
            const clickedNav = e.target.textContent.trim();

            if (clickedNav === "Home") {showView("home"); return;}
            if (clickedNav === "Browse") {showView("browse"); return;}
            if (clickedNav === "About") {document.querySelector("#about").showModal(); return;}
        } else if (e.target.nodeName == "H3") {
            showView("shoppingCart");
        }
    }

    function showView(viewName) {
        home.classList.add("hidden");
        browse.classList.add("hidden");
        shoppingCart.classList.add("hidden");

        if (viewName === "home") home.classList.remove("hidden");
        if (viewName === "browse") browse.classList.remove("hidden");
        if (viewName === "shoppingCart") shoppingCart.classList.remove("hidden");
    }

    // handling about pop up
    function aboutPageHandler() {
        document.querySelector("#close").addEventListener('click', () => {
            document.querySelector("#about").close();
        });
        document.querySelector("#x").addEventListener('click', () => {
            document.querySelector("#about").close();
        });
    }

    // handle filter depending on what filter is checked 
    function filterHandler(data) {
        const checked = [...document.querySelectorAll('#filter input:checked')];

        const filters = {
            gender: checked.filter(p => p.classList.contains("gender")).map(p => p.id),
            category: checked.filter(p => p.classList.contains("category")).map(p => p.id),
            size: checked.filter(p => p.classList.contains("size")).map(p => p.id),
            color: checked.filter(p => p.classList.contains("color")).map(p => p.id)
        };

        let results = data;

        if (filters.gender.length > 0) {
            results = results.filter(p => filters.gender.includes(p.gender));
        }
        if (filters.category.length > 0) {
            results = results.filter(p => filters.category.includes(p.category));
        }
        if (filters.size.length > 0) {
            results = results.filter(p => p.sizes.some(s => filters.size.includes(s)));
        }
        if (filters.color.length > 0) {
            results = results.filter(p => p.color.some(c => filters.color.includes(c.name)));
        }

        showSelectedFilters(checked, data);

        return results;
    
    }

    function applyFiltersAndSort(data) {
        const results = filterHandler(data);
        const sortType = document.querySelector("#sort").value;

        if (sortType == "nameAZ") {
            results.sort((a, b) => {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            });
        } else if (sortType == "nameZA") {
            results.sort((a, b) => {
                if (a.name > b.name) return -1;
                if (a.name < b.name) return 1;
                return 0;
            });
        } else if (sortType == "priceHL") {
            results.sort((a, b) => b.price - a.price);
        } else if (sortType == "priceLH") {
            results.sort((a, b) => a.price - b.price);
        } else if (sortType == "category") {
            results.sort((a, b) => {
                if (a.category < b.category) return -1;
                if (a.category > b.category) return 1;
                return 0;
            });
        }

        console.log(results);
        populateBrowsePage(results);
        
    }

    function showSelectedFilters(checked, data) {
        const div = document.querySelector("#selectedFilters");
        div.innerHTML = "";
        for(let c of checked) {
            const button = document.createElement("button");
            if (c.id == "mens" || c.id == "womens") {
                button.textContent = document.querySelector(`label[for="${c.id}"]`).textContent;
            } else {
                button.textContent = c.id;
            }

            div.appendChild(button);

            // deletes filter if button is clicked 
            button.addEventListener('click', (e) => {
                button.remove();
                if (c.id == "mens" || c.id == "womens") {
                    if (button.textContent == document.querySelector(`label[for="${c.id}"]`).textContent) {
                        c.checked = false;
                    }
                } else if (button.textContent == c.id) {
                    c.checked = false;
                }
                applyFiltersAndSort(data);
            });
            
        }
    }

    function populateBrowsePage(data) {
        const template = document.querySelector("#results template");
        const parent = document.querySelector("#browseResults");

        parent.innerHTML = "";

        for (let d of data) {
            const clone = template.content.cloneNode(true);

            const img = clone.querySelector("img");
            img.setAttribute("alt", `${d.name}`);
            img.id = d.id;

            const title = clone.querySelector(".browseResultProductTitle");
            title.textContent = d.name;
            title.id = d.id;

            const price = clone.querySelector(".browseResultProductPrice");
            price.textContent = "$" + d.price;
            price.id = d.id;

            const button = clone.querySelector(".addBtn");

            parent.appendChild(clone);

            button.addEventListener('click', () => {
                addToCart(d);
                updateCart();
            
            });
            parent.addEventListener('click', (e) => showSingleProduct(e, data));
        }
    }

    function clearFilter(data) {
        const checked = [...document.querySelectorAll('#filter input:checked')];
        for (let c of checked) {
            c.checked = false;
        }
        checked.length = 0;

        showSelectedFilters(checked, data);
        applyFiltersAndSort(data);

    }

    function showSingleProduct(e, data) {

        const hasClass = e.target.classList && e.target.classList.contains("browseResultProductTitle");

        if (e.target.nodeName == "IMG" || hasClass) {
            document.querySelector("#browse").classList.add("hidden");
            document.querySelector("#singleProduct").classList.remove("hidden");

            const id = e.target.id;

            const found = data.find(p => p.id == id);

            document.querySelector("#genderBC").textContent = found.gender;
            document.querySelector("#categoryBC").textContent = found.category;
            document.querySelector("#productName").textContent = found.name;

            document.querySelector("#productImage").alt = found.name;

            document.querySelector("#productTitle").textContent = found.name;
            document.querySelector("#productPrice").textContent = "$" + found.price;
            document.querySelector("#productDescriptionText").textContent = found.description;
            document.querySelector("#productMaterial").textContent = found.material;
        }
    }

    function main(data) {
        //sort data alphabetically initially
        data.sort((a, b) => {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            });

        aboutPageHandler();
        document.querySelector("#filter").addEventListener('click', (e) => { populateFilter(e, data); });
        document.querySelector("nav").addEventListener('click', (e) => {navigationHandler(e)});

        populateBrowsePage(data);

        document.querySelector("#filter").addEventListener('change', () => {applyFiltersAndSort(data);});
        document.querySelector("#sort").addEventListener('change', () => {applyFiltersAndSort(data);});
        document.querySelector("#clear").addEventListener('click', () => {clearFilter(data);});

        document.querySelector("#shippingMethod").addEventListener('change', ()=>{updateCartTotal();});
        document.querySelector("#shippingLocation").addEventListener('change', ()=>{updateCartTotal();});
    }   

    //everything shopping cart 
    let cart = [];

    function addToCart(product) {
        let exists = false;
        let productId = product.id;
        console.log(productId);
        for(let i=0; i < cart.length; i++) {
            if(cart[i].id === productId) {
                cart[i].quantity++;
                exists = true;
                break;
            }
        }
        
        if (!exists) {
            let newProduct = JSON.parse(JSON.stringify(product));
            newProduct.quantity = 1;
            cart.push(newProduct);
        }

        updateCart();
        updateCartCount();
    }

    function updateCartCount() {
        let total = 0;
        for (let i=0; i < cart.length; i++) {
            total += cart[i].quantity;
        }

        document.querySelector("#cartCount").textContent = total;
    }

    function updateCart() {
        const cartBody = document.querySelector("#cartBody");
        const cartTemplate = document.querySelector("#cartItemTemplate");

        if (!cartBody || !cartTemplate) {
            return;
        }

        cartBody.innerHTML = "";

        if (cart.length === 0) {
            const newRow = document.createElement("tr");
            newRow.innerHTML = "<td colspan='6' style='text-align:center; padding:20px;'> Your cart is empty </td>";
            cartBody.appendChild(newRow);
            updateCartTotal();
            return;
        }

        for(let i=0; i<cart.length; i++) {
            let item = cart[i]

            const clone = cartTemplate.content.cloneNode(true);

            clone.querySelector(".cartItemImage").src = "https://placehold.co/150x200";
            clone.querySelector(".cartItemTitle").textContent = item.name;
            clone.querySelector(".cartItemPrice").textContent = "$" + item.price.toFixed(2);

            const colorColumn = clone.querySelector(".cartItemColor");
            if (item.color && item.color.length > 0) {
                colorColumn.textContent = item.color[0].name;
            } else {
                colorColumn.textContent = "-";
            }

            const sizeColumn = clone.querySelector(".cartItemSize");
            if (item.size && item.sizes.length > 0) {
                sizeColumn.textContent  = item.sizes[0];
            } else {
                sizeColumn.textContent = "-";
            }

            const quantityInput = clone.querySelector(".quantityInput");
            quantityInput.value = item.quantity;

            const subtotal = clone.querySelector(".cartItemSubtotal");
            subtotal.textContent = "$" + (item.price*item.quantity).toFixed(2);

            quantityInput.addEventListener("input", function(e) {
                let q = parseInt(e.target.value);
                if (isNaN(q) || q < 1) {
                    q = 1;
                }
                
                e.target.value = q;
                item.quantity = q;
                subtotal.textContent = "$" + (item.price*item.quantity).toFixed(2);
                
                updateCartTotal();
                updateCartCount();
            });

            const removeBtn = clone.querySelector(".removeBtn");

            removeBtn.dataset.id = item.id;

            removeBtn.addEventListener("click", function(e) {
                const productDelete = e.target.dataset.id;
                const index = cart.findIndex(product => product.id == productDelete);

                if (index !== -1) {
                    cart.splice(index, 1);
                    updateCart();
                    updateCartCount();
                    updateCartTotal();
                }
            });

            cartBody.appendChild(clone);
        }

        updateCartTotal();
    }

    function updateCartTotal() {
        let total = 0;
        for (let i = 0; i < cart.length; i++) {
            total += cart[i].price * cart[i].quantity;
        }

        document.querySelector("#merchTotal").textContent = "$" + total.toFixed(2);

        shippingCost(total);
    }

    
    function shippingCost(total) {
        const shippingMethod = document.querySelector("#shippingMethod").value;
        const shippingLocation = document.querySelector("#shippingLocation").value;
        const shippingTotal = document.querySelector("#shippingTotal");
        const taxTotal = document.querySelector("#taxTotal");
        const orderTotal = document.querySelector("#orderTotal");

        let shippingCost = 0;
        let taxCost =  0;
        let orderCost = 0;

        if (total > 500) {
            shippingCost = 0
        } else {
            const rates = {
                standard:  { canada: 10, unitedStates: 15, international: 20 },
                express:   { canada: 25, unitedStates: 25, international: 30 },
                priority:  { canada: 35, unitedStates: 50, international: 50 }
            };

            if(total > 500) {
                shippingCost = 0;
            } else if (total > 0) {
                shippingCost = rates[shippingMethod][shippingLocation];
            } 
        }

        if (shippingLocation === "canada") {
            taxCost = total * 0.05;
        }

        orderCost = total + shippingCost + taxCost;

        shippingTotal.textContent = "$" + shippingCost.toFixed(2);
        taxTotal.textContent = "$" + taxCost.toFixed(2);
        orderTotal.textContent = "$" + orderCost.toFixed(2);

    }


});