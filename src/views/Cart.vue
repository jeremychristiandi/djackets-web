<template>
  <div class="page-cart">
    <div class="columns is-multiline">
        <div class="column is-12">
            <h1 class="title">Cart</h1>
        </div>
        <div class="column is-12 box">
            <table class="table is-fullwidth" v-if="cartTotalLength">
                <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th></th>
                </tr>
                <CartItem 
                v-for="item in cart.items"
                :key="item.product.id"
                :initialItem="item"
                @removeFromCart="removeFromCart" />
            </table>

            <p v-else>No products in cart. Start shopping now!</p>
        </div>

        <div class="column is-12 box">
            <h2 class="subtitle">Summary</h2>
            <strong>${{ cartTotalPrice.toFixed(2) }}</strong> ({{ cartTotalLength }} items)
            <hr>
            <router-link to="/cart/checkout" class="button is-dark">Proceed to Checkout</router-link>
        </div>
    </div>
  </div>
</template>

<script>
import CartItem from '@/components/CartItem.vue'
// import axios from "axios"

export default {
    name: "CartView",
    components: {
        CartItem
    },
    mounted() {
        this.cart = this.$store.state.cart
    },
    data() {
        return {
            cart: {
                items: []
            }
        }
    },
    computed: {
        cartTotalLength() {
            return this.cart.items.reduce((acc, curr) => {
                return acc += curr.quantity
            }, 0)
        },
        cartTotalPrice() {
            return this.cart.items.reduce((acc, curr) => {
                return acc += curr.product.price * curr.quantity
            }, 0)
        }
    },
    methods: {
        removeFromCart(item) {
            this.cart.items = this.cart.items.filter(x => x.product.id !== item.product.id)
        }
    }
}
</script>

<style>

</style>