<template>
  <div class="page-my-account">
    <div class="columns is-multiline">
        <div class="column is-12">
            <h1 class="title">My Account</h1>
        </div>
        <div class="column is-12">
            <button @click="logout()" class="button is-danger">Logout</button>
        </div>

        <hr>
        <div class="column is-12">
            <h2 class="subtitle">My Orders</h2>
            <OrderSummary
            v-for="order in orders"
            :key="order.id"
            :order="order" />
        </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import OrderSummary from '@/components/OrderSummary.vue'

export default {
    name: "MyAccount",
    components: {
        OrderSummary
    },
    mounted() {
        document.title = "My Account | Djackets"
        this.getMyOrders()
    },
    data() {
        return {
            orders: []
        }
    },
    methods: {
        logout() {
            axios.defaults.headers.common["Authorization"] = ""

            localStorage.removeItem("token")
            localStorage.removeItem("username")
            localStorage.removeItem("password")

            this.$store.commit("removeToken")
            this.$router.push("/")
        }, 
        getMyOrders() {
            this.$store.commit("setIsLoading", true)

            axios.get("/api/v1/orders/").then(res => {
                console.log("res", res.data)
                this.orders = res.data
            }).catch(error => {
                console.log(error)
            })

            this.$store.commit("setIsLoading", false)
        }
    }
}
</script>

<style>

</style>