document.addEventListener('DOMContentLoaded', () => {
    const productsContent = document.getElementById('products-content') as HTMLInputElement;
    const cartContent = document.getElementById('cart-content') as HTMLInputElement;
    const prevButton = document.getElementById('prev-button') as HTMLInputElement;
    const nextButton = document.getElementById('next-button') as HTMLInputElement;
    const pageNumber = document.getElementById('page-number') as HTMLInputElement;
    const searchForm = document.getElementById('search-form') as HTMLInputElement;
    const categoryInput = document.getElementById('category-input') as HTMLInputElement;
    const priceInput = document.getElementById('price-input') as HTMLInputElement;


    interface Product{
     id:number,
     title:string,
     image:string,
     category:string,
     price:number
    }
    let products :Product[]= [];
    let cart:Product[] = [];
    let currentPage = 1;
    const itemsPerPage:number = 4;

    const fetchProducts = async ():Promise<void> => {
        try {
            const response = await fetch('https://fakestoreapi.com/products');
            const data:Product[] = await response.json();
            products = data;
            displayProducts();
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const displayProducts = ():void => {
        productsContent.innerHTML = '';
        const filteredProducts = filterProducts();
        const currentPageItems = getItemsForCurrentPage(filteredProducts, currentPage, itemsPerPage);
        
        currentPageItems.forEach((product:Product)=> {
            productsContent.innerHTML += `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.title}">
                    <h3>${product.title}</h3>
                    <p>Category: ${product.category}</p>
                    <p>Price: $${product.price.toFixed(2)}</p>
                    <button onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            `;
          
        });

        updatePageControls(filteredProducts.length);
    };

    const filterProducts = ():Product[] => {
        const category = categoryInput.value.trim().toLowerCase();
        const maxPrice = parseFloat(priceInput.value);

        return products.filter(product => {
            const matchesCategory = category ? product.category.toLowerCase()===category: true;
            const matchesPrice = !isNaN(maxPrice) ? product.price <= maxPrice : true;
            return matchesCategory && matchesPrice;
        });
    };

    const getItemsForCurrentPage = (items:Product[], page:number, itemsPerPage:number):Product[] => {
        const start = (page - 1) * itemsPerPage;
        return items.slice(start, start + itemsPerPage);
    };

    const updatePageControls = (totalItems:number) :void=> {
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage * itemsPerPage >= totalItems;
        pageNumber.textContent = currentPage.toString();
    };

    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayProducts();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPage * itemsPerPage < filterProducts().length) {
            currentPage++;
            displayProducts();
        }
    });

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        currentPage = 1;
        displayProducts();
    });

    (window as any).addToCart = (productId:number) => {
        const product = products.find(p => p.id === productId);
        if(product)
        cart.push(product);
        displayCart();
    };

    const displayCart = ():void => {
        cartContent.innerHTML = '';
        cart.forEach(item => {
            cartContent.innerHTML += `<li>${item.title} - $${item.price.toFixed(2)}</li>`;
        });
    };

    fetchProducts();
});
