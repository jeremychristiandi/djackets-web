import { createStore } from "vuex"

export default createStore({
    state: {
        cart: {
            items: []
        },
        isAuthenticated: false,
        token: '',
        isLoading: false
    },
    mutations: {
        initializeStore(state) {
            if (localStorage.getItem("cart")) {
                state.cart = JSON.parse(localStorage.getItem("cart"))
            } else {
                localStorage.setItem("cart", JSON.stringify(state.cart))
            }

            if (localStorage.getItem("token")) {
                state.token = localStorage.getItem("token")
                state.isAuthenticated = true
            } else {
                state.token = ""
                state.isAuthenticated = false
            }
        },
        addToCart(state, item) {
            const existedItems = state.cart.items.filter(x => x.product.id === item.product.id)

            if (existedItems.length) {
                existedItems[0].quantity = parseInt(existedItems[0].quantity) + parseInt(item.quantity)
            } else {
                state.cart.items.push(item)
            }

            localStorage.setItem('cart', JSON.stringify(state.cart))
        },
        clearCart(state) {
            state.cart = { items: [] }
            localStorage.setItem('cart', JSON.stringify(state.cart))
        },
        setIsLoading(state, status) {
            state.isLoading = status
        },
        setToken(state, token) {
            state.token = token
            state.isAuthenticated = true
        },
        removeToken(state) {
            state.token = ""
            state.isAuthenticated = false
        }
    },
    actions: {

    },
    modules: {

    }
}) 