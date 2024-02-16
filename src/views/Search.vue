<template>
  <div class="page-search">
    <div class="column is-multiline">
        <div class="column is-12">
            <h1 class="title">Search</h1>
            <h2 class="is-size-5 has-text-grey">Search term: "{{ query }}"</h2>
        </div>
        <ProductBox 
            v-for="product in products"
            :key="product.id"
            :product="product"
        />
    </div>
  </div>
</template>

<script>
import axios from "axios"
import ProductBox from "@/components/ProductBox.vue"

export default {
    name: "SearchView",
    components: {
        ProductBox
    },
    mounted() {
        document.title = "Search | Djackets"

        // get query from params
        let url = window.location.search.substring(1)
        let params = new URLSearchParams(url)

        if(params.get('query')) {
            this.query = params.get('query')
            this.handleSearch()
        }
    },
    data() {
        return {
            products: [],
            query: ""
        }
    },
    methods: {
        handleSearch() {
            this.$store.commit("setIsLoading", true)

            axios.post("/api/v1/products/search/", { 'query': this.query }).then(res => {
                this.products = res.data
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