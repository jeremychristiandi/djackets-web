<template>
    <div class="page-product">
        <div class="column is-multiline">
            <div class="column is-9">
                <figure class="image mb-6">
                    <img :src="product.get_image" alt="Product Detail Image">
                </figure>

                <h1 class="title">{{ product.name }}</h1>
                <p>{{ product.description }}</p>
            </div>

            <div class="column is-3">
                <h2 class="subtitle">Information</h2>
                <p><strong>Price : </strong>{{ product.price }}</p>

                <div class="field has-addons mt-6">
                    <div class="control">
                        <input type="number" class="input" min="1" v-model="quantity">
                    </div>
                    <div class="control">
                        <a class="button is-dark" @click="addToCart">Add to Cart</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { toast } from "bulma-toast"

export default {
    name: 'ProductView', 
    data() {
        return {
            product: {},
            quantity: 1
        }
    },
    mounted() {
        this.getProduct()
    },
    methods: {
        getProduct() {
            this.$store.commit('setIsLoading', true)

            const category_slug = this.$route.params.category_slug
            const product_slug = this.$route.params.product_slug

            axios.get(`/api/v1/products/${category_slug}/${product_slug}/`).then(res => {
                this.product = res.data
                document.title = this.product.name + "| Djackets"
            }).catch(error => {
                console.log(error)
            })

            this.$store.commit('setIsLoading', false)
        },
        addToCart() {
            if(isNaN(this.quantity) || this.quantity < 1) this.quantity = 1

            const item = {
                product: this.product,
                quantity: this.quantity
            }
            this.$store.commit('addToCart', item)

            toast({
                message: "Product successfully added to cart.",
                type: "is-success",
                dismissible: true,
                pauseOnHover: true,
                duration: 2000,
                position: "top-right"
            })
        }
    }
}
</script>
