<template>
  <div class="page-checkout">
    <div class="columns is-multiline">
        <div class="column is-12">
            <h1 class="title">Checkout</h1>
        </div>

        <div class="column is-12 box">
            <table class="table is-fullwidth">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                    </tr>
                </thead>

                <tbody>
                    <tr
                    v-for="item in cart.items"
                    :key="item.product.id" >
                        <td>{{ item.product.name }}</td>
                        <td>{{ item.product.price }}</td>
                        <td>{{ item.quantity }}</td>
                        <td>{{ getItemTotal(item).toFixed(2) }}</td>
                    </tr>
                </tbody>

                <tfoot>
                    <tr>
                        <td colspan="2">Total</td>
                        <td>{{ cartTotalLength }}</td>
                        <td>${{ cartTotalPrice.toFixed(2) }}</td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <div class="column is-12 box">
            <h2 class="subtitle">Shipping Details</h2>
            <p class="has-text-grey mb-4">* All fields are required</p>

            <div class="columns is-multiline">
                <div class="column is-6">
                    <div class="field">
                        <label for="">First name <span class="has-text-danger">*</span></label>
                        <div class="control">
                            <input type="text" class="input" v-model="firstName">
                        </div>
                    </div>
                    <div class="field">
                        <label for="">Last name <span class="has-text-danger">*</span></label>
                        <div class="control">
                            <input type="text" class="input" v-model="lastName">
                        </div>
                    </div>
                    <div class="field">
                        <label for="">Email <span class="has-text-danger">*</span></label>
                        <div class="control">
                            <input type="email" class="input" v-model="email">
                        </div>
                    </div>
                    <div class="field">
                        <label for="">Phone number <span class="has-text-danger">*</span></label>
                        <div class="control">
                            <input type="text" class="input" v-model="phoneNumber">
                        </div>
                    </div>
                </div>

                <div class="column is-6">
                    <div class="field">
                        <label for="">Address <span class="has-text-danger">*</span></label>
                        <div class="control">
                            <input type="text" class="input" v-model="address">
                        </div>
                    </div>
                    <div class="field">
                        <label for="">Zipcode <span class="has-text-danger">*</span></label>
                        <div class="control">
                            <input type="text" class="input" v-model="zipcode">
                        </div>
                    </div>
                    <div class="field">
                        <label for="">Place <span class="has-text-danger">*</span></label>
                        <div class="control">
                            <input type="text" class="input" v-model="place">
                        </div>
                    </div>
                </div>

            </div>
            <div class="notification is-danger mt-4" v-if="errors.length">
                <p v-for="error in errors" :key="error">{{ error }}</p>
            </div>

            <hr>
            <div id="card-element" class="mb-5"></div>
            <template v-if="cartTotalLength">
                <button class="button is-dark" @click="submitForm">Pay with Stripe</button>
            </template>
        </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"

export default {
    name: "CheckOut",
    data() {
        return {
            cart: {
                items: []
            },
            stripe: {},
            card: {},
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            address: "",
            zipcode: "",
            place: "",
            errors: []
        }
    },
    mounted() {
        document.title = "Checkout | Djackets"
        this.cart = this.$store.state.cart

        if (this.cartTotalLength > 0) {
            // eslint-disable-next-line
            this.stripe = Stripe('pk_test_51OHj33LVBytsotyVRriFBx2GYjlocc2wGr01dVB4YdzZ317A8XVEpapOENkrx3peiLmp3hxS1IEg1qoWiMo23bLo00VzDqMz6z')
            const elements = this.stripe.elements()
            this.card = elements.create("card", { hidePostalCode: true })

            this.card.mount("#card-element")
        }
    },
    methods: {
        getItemTotal(item) {
            return item.quantity * item.product.price
        },
        submitForm() {
            this.errors = []

            if(this.firstName === '') this.errors.push("First name field is missing!")
            if(this.lastName === '') this.errors.push("Last name field is missing!")
            if(this.email === '') this.errors.push("Email field is missing!")
            if(this.phoneNumber === '') this.errors.push("Phone number field is missing!")
            if(this.address === '') this.errors.push("Address field is missing!")
            if(this.zipcode === '') this.errors.push("Zipcode field is missing!")
            if(this.place === '') this.errors.push("Place field is missing!")

            if(!this.errors.length) {
                this.$store.commit("setIsLoading", true)

                this.stripe.createToken(this.card).then(result => {
                    console.log("res", result)
                    if(result.error) {
                        this.$store.commit("setIsLoading", false)
                        this.errors.push("Something went wrong with Stripe. Please try again!")
                    } else {
                        this.stripeTokenHandler(result.token)
                    }
                })
            }
        },
        async stripeTokenHandler(token) {
            const items = []

            for(let i=0; i < this.cart.items.length; i++) {
                const item = this.cart.items[i]
                const obj = {
                    product: item.product.id,
                    quantity: item.quantity,
                    price: item.product.price * item.quantity
                }
                items.push(obj)
            }

            const data = {
                "first_name": this.firstName,
                "last_name": this.lastName,
                "email": this.email,
                "address": this.address,
                "zipcode": this.zipcode,
                "place": this.place,
                "phone": this.phoneNumber,
                "items": items,
                "stripe_token": token.id
            }

            // eslint-disable-next-line
            await axios.post("/api/v1/checkout/", data).then(res => {
                this.$store.commit("clearCart")
                this.$router.push("/cart/success")
            }).catch(error => {
                this.errors.push("Something went wrong. Please try again!")
                console.log(error)
            })

            this.$store.commit("setIsLoading", false)
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
    }
}
</script>

<style>

</style>