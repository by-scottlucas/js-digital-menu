const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartTotalItems = document.getElementById("cart-total-itens");
const checkOutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressWarn = document.getElementById("cep-warn");
const paymentMethod = document.getElementById("payment-select");
const cepInput = document.getElementById("cep");
const streetInput = document.getElementById("street");
const neighborhoodInput = document.getElementById("neighborhood");
const cityInput = document.getElementById("city");
const stateInput = document.getElementById("state");
const numberInput = document.getElementById("number");
const addressDropdown = document.getElementById("address-dropdown");

let cart = [];

cartBtn.addEventListener("click", function () {
    updateCartModal();
    cartModal.style.display = "flex";
});

cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    }
});

closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none";
});

menu.addEventListener("click", (event) => {
    const parentButton = event.target.closest(".add-to-cart-btn");
    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
        addToCart(name, price);
    }
});

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateCartModal();
}

function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;
    let totalItems = 0;

    cart.forEach(item => {
        totalItems += item.quantity;
        total += item.price * item.quantity;

        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "items-center");
        cartItemElement.innerHTML = `
            <div>
                <p class="font-medium">${item.name} (x${item.quantity})</p>
                <p class="font-medium mt-2">R$ ${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <button class="remove-btn text-red-500 hover:text-red-700" data-name="${item.name}">&times;</button>
        `;
        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    cartCounter.innerText = cart.length;
    cartTotalItems.textContent = totalItems;

    if (cart.length === 0) {
        addressDropdown.classList.add("hidden");
        addressDropdown.removeAttribute("open");
    }
}

cartItemsContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-btn")) {
        const name = event.target.getAttribute("data-name");
        removeItemCart(name);
    }
});

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);
    if (index !== -1) {
        cart.splice(index, 1);
        updateCartModal();
    }
}

cepInput.addEventListener("blur", () => {
    const cep = cepInput.value.replace(/\D/g, "");
    if (cep.length !== 8) {
        addressWarn.classList.remove("hidden");
        addressDropdown.classList.add("hidden");
        return;
    }
    addressWarn.classList.add("hidden");

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                addressWarn.classList.remove("hidden");
                addressDropdown.classList.add("hidden");
                return;
            }

            streetInput.value = data.logradouro || '';
            neighborhoodInput.value = data.bairro || '';
            cityInput.value = data.localidade || '';
            stateInput.value = data.uf || '';

            addressDropdown.classList.remove("hidden");
            addressDropdown.setAttribute("open", "true");
        })
        .catch(error => {
            console.error("Erro ao buscar CEP:", error);
            addressWarn.classList.remove("hidden");
            addressDropdown.classList.add("hidden");
        });
});

checkOutBtn.addEventListener("click", () => {
    const isOpen = checkRestaurantOpen();
    if (!isOpen) {
        alert("Não é possível finalizar o pedido. O restaurante está fechado!");
        return;
    }

    if (cart.length === 0) return;

    let isValid = true;
    const address = {
        street: streetInput.value.trim(),
        number: numberInput.value.trim(),
        neighborhood: neighborhoodInput.value.trim(),
        city: cityInput.value.trim(),
        state: stateInput.value.trim()
    };

    for (const key in address) {
        if (address[key] === "") {
            console.log(`${key.charAt(0).toUpperCase() + key.slice(1)}: NÃO PREENCHIDO`);
            isValid = false;
        } else {
            console.log(`${key.charAt(0).toUpperCase() + key.slice(1)}:`, address[key]);
        }
    }

    const cartItems = cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
    }));

    console.log("Itens no carrinho:", cartItems);

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    console.log("Valor total do pedido:", total.toFixed(2));

    const paymentOptions = {
        "credit-card": "Cartão de Crédito",
        "debit-card": "Cartão de Débito",
        "cash": "Dinheiro",
        "pix": "PIX"
    };

    const paymentMethodValue = paymentMethod.value;
    const paymentMethodText = paymentOptions[paymentMethodValue] || "Forma de Pagamento Não Definida";


    if (!isValid) {
        alert("Por favor, preencha todos os campos e selecione um método de pagamento.");
        return;
    }

    const message = encodeURIComponent(`
*Resumo do Pedido*\n\n
${cartItems.map(item => `*${item.quantity}x* ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}`).join('\n')}\n\n
*Endereço:* ${address.street}, ${address.number} - ${address.neighborhood} - ${address.city}, ${address.state}\n
*Total do Pedido:* R$ ${total.toFixed(2)}\n
*Forma de Pagamento:* ${paymentMethodText}
`);

    const phone = "13991662339";

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

    cart = [];
    updateCartModal();
    cepInput.value = "";
    streetInput.value = "";
    numberInput.value = "";
    neighborhoodInput.value = "";
    cityInput.value = "";
    stateInput.value = "";
    paymentMethod.selectedIndex = 0;
    addressWarn.classList.add("hidden");
    addressDropdown.classList.add("hidden");
});

function checkRestaurantOpen() {
    const hora = new Date().getHours();
    return hora >= 1 && hora < 22;
}