document.addEventListener('DOMContentLoaded', () => {
    fetch('../assets/contents/content.json')
        .then(response => response.json())
        .then(data => {

            function createElementWithClasses(tag, classes) {
                const element = document.createElement(tag);
                if (classes) {
                    classes.split(' ').forEach(cls => element.classList.add(cls));
                }
                return element;
            }

            function loadHeader(headerData) {
                const headerContent = document.getElementById('header-content');
                if (headerContent) {
                    headerContent.innerHTML = '';

                    // Criando logotipo
                    const logo = createElementWithClasses('img', 'header-logotipo');
                    logo.src = headerData.logo;
                    logo.alt = "Logotipo";
                    headerContent.appendChild(logo);

                    // Nome da empresa
                    const companyName = createElementWithClasses('h1', 'company-name');
                    companyName.textContent = headerData.company_name;
                    headerContent.appendChild(companyName);

                    // Endereço da empresa
                    const companyAddress = createElementWithClasses('span', 'company-address');
                    companyAddress.textContent = headerData.company_address;
                    headerContent.appendChild(companyAddress);

                    // Caixa de horário de funcionamento (com ID "date-span")
                    const businessHourBox = createElementWithClasses('div', 'business-hour-box');
                    businessHourBox.id = "date-span"; // Adiciona ID corretamente

                    const businessHour = createElementWithClasses('span', 'business-hour');
                    businessHour.textContent = headerData.business_hours;
                    businessHourBox.appendChild(businessHour);
                    headerContent.appendChild(businessHourBox);

                    // Chama a função para atualizar o estilo de acordo com o horário de funcionamento
                    updateRestaurantStatus();
                }
            }

            function updateRestaurantStatus() {
                const spanItem = document.getElementById("date-span");
                if (!spanItem) return;

                const data = new Date();
                const hora = data.getHours();

                if (hora >= 18 && hora < 22) {
                    spanItem.classList.remove("bg-red-500");
                    spanItem.classList.add("bg-green-600");
                } else {
                    spanItem.classList.remove("bg-green-600");
                    spanItem.classList.add("bg-red-500");
                }
            }

            function loadBurgers(burgersData) {
                const burgersContainer = document.getElementById('burguer-section');
                if (burgersContainer) {
                    burgersContainer.innerHTML = '';

                    burgersData.forEach(burger => {
                        const burgerDiv = createElementWithClasses('div', 'card-menu');
                        const image = createElementWithClasses('img', 'product-image');
                        image.src = burger.image;
                        image.alt = burger.name;
                        burgerDiv.appendChild(image);

                        const textDiv = document.createElement('div');
                        const name = createElementWithClasses('p', 'product-title font-bold');
                        name.textContent = burger.name;
                        textDiv.appendChild(name);

                        const description = createElementWithClasses('p', 'product-description');
                        description.textContent = burger.description;
                        textDiv.appendChild(description);

                        const cardFooter = createElementWithClasses('div', 'card-footer-box');
                        const price = createElementWithClasses('p', 'font-bold text-lg');
                        price.textContent = `R$ ${burger.price.toFixed(2)}`;
                        cardFooter.appendChild(price);

                        const button = createElementWithClasses('button', 'add-to-cart-btn');
                        button.dataset.name = burger.name;
                        button.dataset.price = burger.price;
                        button.innerHTML = '<i class="fa fa-cart-plus text-sm text-white"></i>';
                        cardFooter.appendChild(button);

                        textDiv.appendChild(cardFooter);
                        burgerDiv.appendChild(textDiv);
                        burgersContainer.appendChild(burgerDiv);
                    });
                }
            }

            function loadDrinks(drinksData) {
                const drinksContainer = document.getElementById('drinks-section');
                if (drinksContainer) {
                    drinksContainer.innerHTML = '';
                    drinksData.forEach(drink => {
                        const drinkDiv = createElementWithClasses('div', 'card-menu');
                        const image = createElementWithClasses('img', 'product-image');
                        image.src = drink.image;
                        image.alt = drink.name;
                        drinkDiv.appendChild(image);

                        const textDiv = createElementWithClasses('div', 'w-full');
                        const name = createElementWithClasses('p', 'product-title');
                        name.textContent = drink.name;
                        textDiv.appendChild(name);

                        const cardFooter = createElementWithClasses('div', 'card-footer-box');
                        const price = createElementWithClasses('p', 'font-bold text-lg');
                        price.textContent = `R$ ${drink.price.toFixed(2)}`;
                        cardFooter.appendChild(price);

                        const button = createElementWithClasses('button', 'add-to-cart-btn');
                        button.dataset.name = drink.name;
                        button.dataset.price = drink.price;
                        button.innerHTML = '<i class="fa fa-cart-plus text-sm text-white"></i>';
                        cardFooter.appendChild(button);

                        textDiv.appendChild(cardFooter);
                        drinkDiv.appendChild(textDiv);
                        drinksContainer.appendChild(drinkDiv);
                    });
                }
            }

            loadHeader(data.header);
            loadBurgers(data.menu.burgers);
            loadDrinks(data.menu.drinks);
        });
});