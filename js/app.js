document.addEventListener('DOMContentLoaded', () => {
    //const products = JSON.parse(content);
    const url = "https://gist.githubusercontent.com/rconnolly/d37a491b50203d66d043c26f33dbd798/raw/37b5b68c527ddbe824eaed12073d266d5455432a/clothing-compact.json";

    
    /* --------------- utility functions ---------------- */
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

    const products = retrieveStorage();
    if (products) {
        main(products);
    } else {
        fetchAndStore();
    }
    
    function toggleTriagngle(name) {
        const p = document.querySelector("#" + name + " p");
        p.textContent = p.textContent.endsWith('▲')
            ? p.textContent.replace('▲', '▼')
            : p.textContent.replace('▼', '▲');
    }

    function populateFilter(data) {
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

    // navigation
    const home = document.querySelector("#home");
    const browse = document.querySelector("#browse");
    const about = document.querySelector("#about");
    const shoppingCart = document.querySelector("#shoppingCart");

    document.querySelector("nav").addEventListener('click', (e) => {
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
    });

    function showView(viewName) {
        home.classList.add("hidden");
        browse.classList.add("hidden");
        shoppingCart.classList.add("hidden");

        if (viewName === "home") home.classList.remove("hidden");
        if (viewName === "browse") browse.classList.remove("hidden");
        if (viewName === "shoppingCart") shoppingCart.classList.remove("hidden");
    }

    // handling about pop up
    document.querySelector("#close").addEventListener('click', () => {
        document.querySelector("#about").close();
    });
    document.querySelector("#x").addEventListener('click', () => {
        document.querySelector("#about").close();
    });

    // populate filter
    // category
    /*
    const categoryTemplate = document.querySelector("#category template");
    const category = document.querySelector("#category");

    const categories = [];
    for (let product of products) {
        if (!categories.includes(product.category)) {
            categories.push(product.category);
        }
    }
    categories.sort();
    for (let c of categories) {
        const clone = categoryTemplate.content.cloneNode(true);

        const input = clone.querySelector("input");
        input.setAttribute("id", c);
        input.setAttribute("name", c);
        input.setAttribute("value", c);
        
        const label = clone.querySelector("label");
        label.textContent = c;

        category.appendChild(clone);
    }
        */

    // size **needs to be worked on still so it's in order
    const sizeTemplate = document.querySelector("#size template");
    const size = document.querySelector("#size");

    const sizes = [];
    for (let product of products) {
        for (let s of product.sizes) {
            if (!sizes.includes(s)) {
                sizes.push(s)
            }
        }
    }

    for (let s of sizes) {
        const clone = sizeTemplate.content.cloneNode(true);

        const input = clone.querySelector("input");
        input.setAttribute("id", s);
        input.setAttribute("name", s);
        input.setAttribute("value", s);
        
        const label = clone.querySelector("label");
        label.textContent = s;

        size.appendChild(clone);
    }

    // colors
    const colorsTemplate = document.querySelector("#colors template");
    const colorsDiv = document.querySelector("#colors");

    const colors = [];
    for (let product of products) {
        for (let c of product.color) {
            if (!colors.includes(c.name)) {
            colors.push(c.name);
        }
        }
    
    }
    colors.sort();
    for (let c of colors) {
        const clone = colorsTemplate.content.cloneNode(true);

        const input = clone.querySelector("input");
        input.setAttribute("id", c);
        input.setAttribute("name", c);
        input.setAttribute("value", c);
        
        const label = clone.querySelector("label");
        label.textContent = c;

        colorsDiv.appendChild(clone);
    }

    function main(data) {
        document.querySelector("#category p").addEventListener('click', () => { populateFilter(data) });
    }

});