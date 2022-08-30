// // play video button function
// function playVideo() { 
//     const coffeeVideo = document.querySelector("#coffeeVideo")
//     const coffeeVideoButton = document.querySelector("#coffeeVideoButton")
//     coffeeVideo.play()
//     coffeeVideoButton.style.display = 'none'
// }

// add hover to nav link
function addHover(event) {
    if (event.currentTarget.style.opacity < 0.8) event.currentTarget.style.opacity = 0.9
}
// remove hover from nav link
function clearHover(event) {
    if (event.currentTarget.style.opacity == 0.9) event.currentTarget.style.opacity = 0.6
}
// responsive change opacity of nav link by current posision on a page
window.addEventListener('scroll', function(){
    const wrapper = document.querySelector('#wrapper')
    const sideMenuNav = document.querySelector('#sideNav')
    for (const item of wrapper.children) {
        const centerSrollScreen = this.scrollY + window.innerHeight / 2
        if (getOffset(item) <= centerSrollScreen && getOffset(item) + item.offsetHeight > centerSrollScreen) 
        {
            for (const element of sideMenuNav.children){
                if (element.children[0].href.split('#')[1] === item.classList[0]) {
                    element.children[0].style.opacity = 1
                }
                else {
                    element.children[0].style.opacity = 0.6
                }
            }
        }
    }
})

function getOffset(element) {
    const rect = element.getBoundingClientRect();
    return rect.top + window.scrollY
}

// urls
const favoriteItemsUrl = window.location.origin + '/json/favoriteItems.json'
const giftsetItemsUrl = window.location.origin + '/json/giftsetsItems.json'
const personilizedItemsUrl = window.location.origin + '/json/personilizedItems.json'

// init favorite slider
function initFavSlider(){
    new Swiper('#favSlider', {
        draggeble: true,
        loop: true,
        slidesPerView: 1,

        navigation: {
            nextEl: '.favSlider-button-next',
        },
        breakpoints: {
            700:{
                slidesPerView: 2,
            },
            821: {
                slidesPerView: 1,
            },
            1280:{
                slidesPerView: 2,
                
            },
            1800: {
                slidesPerView: 3,
            }
        }
    })
}
// init presonilized slider
function initPersSlider(){
    new Swiper('#persSlider', {
        draggeble: true,
        loop: true,
        slidesPerView: 1,
        spaceBetween: 50,
        navigation: {
            nextEl: '.persSlider-button-next',
        },
        breakpoints: {
            800: {
            slidesPerView: 2.1,
            },
            1300: {
            slidesPerView: 3.2,
            }
        }
    })
}
// create slide inner content 
function createSlideContent(slide, result, key){
    const mainTextElementLength = 15 + getRandomInt(5)
    const mainTextElementHidden = result[key].text.mainText.split(' ').slice(mainTextElementLength).join(' ') 
    const mainTextElement = result[key].text.mainText.split(' ').slice(0, mainTextElementLength).join(' ') + '...'
    slide.innerHTML = `
        <div class="image-container">
            <image src="${result[key].image}" alt="${key} brand coffe image">
        </div>
        <div class="text">
            <div class="prices">
                <p class="price-product">${result[key].text.price}.000</p>
                <p class="price-product old-price">${result[key].text.oldPrice ? result[key].text.oldPrice + '.000' : ''}</p>
            </div>
            <h3>${result[key].text.title}</h3>
            <p class="main-text">${mainTextElement}</p>
            <p class="main-text__hidden" style="display: none">${mainTextElementHidden}</p>
            <div class="buttons">
                <p class="button-text add-to-cart">MUA NGAY</p>
                <a class="button-text details">details</a>
            </div>
        </div>`
}
async function fetchDataAsyncForFavSlider(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    } else {
        const result = await response.json()
        const sliderContainer = document.querySelector("#favSlider .swiper-wrapper")
        const keysOfResult = Object.keys(result)
        const partsOfSlide = ['top-slide','bot-slide']

        for (let idx = 0; idx < keysOfResult.length; idx++) {
            const slide = document.createElement('div')
            slide.classList.add('slide', 'swiper-slide')

            for (const key in partsOfSlide) {
                slide.append(document.createElement('div'))
                const partOfASlide = slide.children[key]
                partOfASlide.classList.add(partsOfSlide[key])
                // add one or zero to idx
                idx = idx + Number(key)
                const keyResult = keysOfResult[idx]
                createSlideContent(partOfASlide, result, keyResult) 
            }                
            sliderContainer.append(slide)
        }
        initFavSlider()
    }
}
async function fetchDataAsyncForPersSlider(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    } else {
        const result = await response.json()
        const sliderContainer = document.querySelector('#persSlider .swiper-wrapper')
        for (const key in result){
            const slide = document.createElement('div')
            slide.classList.add('slide', 'swiper-slide')
            createSlideContent(slide, result, key)
            sliderContainer.prepend(slide)
        }
        initPersSlider()
    }
}
async function fetchDataAsyncTabs(url) {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`HTTP error! status ${response.status}`)
    } else {
        const result = await response.json()
        const tabs = document.querySelectorAll('.tab-wrapper .tabcontent')
        let idx = 0
        // TODO: try to do with createSlideContent()
        for (const item in result){
            tabs[idx].querySelector('.price-product').innerText = result[item].price + '.000'
            tabs[idx].querySelector('h3').innerText = result[item].title
            tabs[idx].querySelector('.main-text').innerText = result[item].mainText
            tabs[idx].querySelectorAll('.text-block p:last-child')[0].innerText = result[item].blend
            tabs[idx].querySelectorAll('.text-block p:last-child')[1].innerText = result[item].height
            idx++
        }
        // set display flex to first tab so it become active
        document.querySelector('.tabcontent').style.display = "flex";
        // add class 'active' to first tablink
        document.querySelector('.tablinks').classList.add('active');
    }
}
// open tab on click function
function openTab(event, target) {
    const tabcontent = document.querySelectorAll(".tabcontent");
    for (let idx = 0; idx < tabcontent.length; idx++) {
        tabcontent[idx].style.display = "none";
    }
    const tablinks = document.querySelectorAll(".tablinks");
    for (let idx = 0; idx < tablinks.length; idx++) {
        tablinks[idx].classList.remove('active');
    }
    document.querySelector(`#${target}`).style.display = "flex";
    event.currentTarget.classList.add('active');
}

// cart
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
}else{
    ready()
}

// making ready function 
// make it async so i can AWAIT for fetch, load and render of all the elements
async function ready() {
    const cartOpen = document.querySelector('#cartOpen')
    // set default value of number of items in the cart
    cartOpen.dataset.content = 0

    // loading and rendering info from JSON 
    await fetchDataAsyncForFavSlider(favoriteItemsUrl).catch(e => console.log(e));
    await fetchDataAsyncForPersSlider(personilizedItemsUrl).catch(e => console.log(e));
    await fetchDataAsyncTabs(giftsetItemsUrl).catch(e => console.log(e))


    const cartClose = document.querySelector('#cartClose')
    const cart = document.querySelector('.cart')
    const sideMenu = document.querySelector('.side-menu')
    const burger = document.querySelector('.cart-buttons__burger')
    // toggle class active to cart buttons open and close
    cartOpen.addEventListener('click', () => cart.classList.toggle('active'))
    cartClose.addEventListener('click', () => cart.classList.toggle('active'))
    // toggle class active to burger menu button
    burger.addEventListener('click', () => {sideMenu.classList.toggle('active')})

    // remove item
    const removeCartButtons = document.querySelectorAll('.cart-remove')
    for (let idx = 0; idx < removeCartButtons.length; idx++){
        const button = removeCartButtons[idx]
        button.addEventListener('click', removeCartItem)
    }
    // quantity change
    const quantityInputs = document.querySelectorAll('.cart-box input')
    for (let idx = 0; idx < quantityInputs.length; idx++){
        const input = quantityInputs[idx]
        input.addEventListener('change', quantityChanged)
    }
    // Add to cart
    const addCart = document.querySelectorAll('.add-to-cart')
    for (let idx = 0; idx < addCart.length; idx++){
        const button = addCart[idx]
        button.addEventListener('click', itemToAdd)
    }
    // on reload set item "cartData" in localStogare
    window.onbeforeunload = function(){
        const purchasesInCart = document.querySelectorAll('.cart-box')
        const cartData = []
        purchasesInCart.forEach(item => {
            cartData.push({
                // image sourse
                image: item.querySelector('img').src,
                // title
                title: item.querySelector('.text-block h3').innerText,
                // price
                price: item.querySelector('.text-block p').innerText,
                // input
                input: item.querySelector('.text-block input').value,
            })
        })
        localStorage.setItem("cartData", JSON.stringify(cartData))
    }
    // add link to details button and set item 'shopItemDetails' in localStogare  
    const detailsButtons = document.querySelectorAll('.details')
    for (let idx = 0; idx < addCart.length; idx++) {
        const button = detailsButtons[idx]
        button.addEventListener("click", (event) => {
            const shopItemDetails = event.currentTarget.parentElement.parentElement.parentElement
            const shopItemDetailsData = []
            const shopItemMainText = shopItemDetails.querySelector('.text .main-text').innerText.replace('...', ' ') + shopItemDetails.querySelector('.text .main-text__hidden')?.innerText
            shopItemDetailsData.push({
                // title
                title: shopItemDetails.querySelector('.text h3').innerText,
                // price
                price: shopItemDetails.querySelector('.text .price-product').innerText,
                // old price
                oldPrice: shopItemDetails.querySelector('.text .old-price')?.innerText,
                // main text
                mainText: shopItemMainText,
                // image
                image: shopItemDetails.querySelector('img').src,
                
            })   
            localStorage.setItem("shopItemDetails", JSON.stringify(shopItemDetailsData))
            event.currentTarget.href = window.location.origin + "/details.html"

        })
    }
    
}
// get data from localStorage and render them on cart block
window.onload = function() {
    const cartData = JSON.parse(localStorage.cartData)
    for (const key in cartData) {
        const title = cartData[key].title
        const price = cartData[key].price
        const image = cartData[key].image
        const input = cartData[key].input
        addProductToCart(title, price, image, input)
    }
}
// random int genarator
function getRandomInt(maxValue) {
    return Math.floor(Math.random() * maxValue);
}
// add to cart
function itemToAdd(event) {
    const button = event.currentTarget
    const productToAdd = button.parentElement
    const title = productToAdd.parentElement.querySelector('h3').innerText
    const price = productToAdd.parentElement.querySelector('.price-product').innerText
    const image = productToAdd.parentElement.parentElement.querySelector('img').src
    addProductToCart(title, price, image)
    updateTotal()
}
function addProductToCart(title, price, image, input = 1) {
    const cartShopBox = document.createElement('div')
    cartShopBox.classList.add('cart-box')
    const cartItems = document.querySelector('.cart-content')
    const cartItemNames = cartItems.querySelectorAll('h3')
    for (let idx = 0; idx < cartItemNames.length; idx++){
        if (cartItemNames[idx].innerText == title) {
            alert('You have already added this item to cart!')       
            return     
        }
    }
    cartShopBox.innerHTML = `
        <div class="card-box-wrapper">
            <div class="image-container">
                <img src="${image}" alt="">
            </div>
            <div class="text-block">
                <h3>${title}</h3>
                <p class="price-product">${price}</p>
                <input class="main-text" type="number" value="${input}">
            </div>
        </div>
        <idx class='bx bxs-trash-alt cart-remove'></i>`
    
    cartItems.append(cartShopBox)
    const removeButtons = cartShopBox.querySelectorAll('.cart-remove')
    const inputs = cartShopBox.querySelectorAll('.cart-box input')
    for (let idx = 0; idx < removeButtons.length; idx++){
        removeButtons[idx].addEventListener('click', removeCartItem)
        inputs[idx].addEventListener('change', quantityChanged)
    }
    updateTotal()

}
function quantityChanged(event) {
    const input = event.currentTarget
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    if (input.value > 99 ) {
        input.value = 99
    }

    updateTotal()
}
// remove item from a cart function
function removeCartItem(event) {
    const buttonClicked = event.currentTarget
    buttonClicked.parentElement.remove()
    updateTotal()
}
// update total
function updateTotal(){
    const cartContent = document.querySelector('.cart')
    const cartBoxes = cartContent.querySelectorAll('.cart-box')
    let total = 0
    for (let idx = 0; idx < cartBoxes.length; idx++) {
        const cartBox = cartBoxes[idx]
        const price = cartBox.querySelector('.price-product').innerText
        const quantity = cartBox.querySelector('input').value
        total += price * quantity
        total = Math.round(total * 1000) / 1000
    }
    document.querySelector('#cartOpen').dataset.content = cartBoxes.length
    cartContent.querySelector('.total-value').innerText = total + '$'
}

