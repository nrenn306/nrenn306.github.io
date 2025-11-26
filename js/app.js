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

            input.setAttribute("id", c);
            input.setAttribute("name", c);
            input.setAttribute("value", c);
            
            const label = document.createElement("label");
            label.textContent = c;

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

            input.setAttribute("id", s);
            input.setAttribute("name", s);
            input.setAttribute("value", s);
            
            const label = document.createElement("label");
            label.textContent = s;

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
                if (!colors.includes(c.name)) {
                    colors.push(c.name);
            }
            }
        
        }

        colors.sort();

        for (let c of colors) {
            const input = document.createElement("input");
            input.type = "checkbox";

            input.setAttribute("id", c);
            input.setAttribute("name", c);
            input.setAttribute("value", c);
            
            const label = document.createElement("label");
            label.textContent = c;

            colorsCheckBox.appendChild(input);
            colorsCheckBox.appendChild(label);
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

    function main(data) {
        aboutPageHandler();
        document.querySelector("#filter").addEventListener('click', (e) => { populateFilter(e, data); });
        document.querySelector("nav").addEventListener('click', (e) => {navigationHandler(e)});
    }

});