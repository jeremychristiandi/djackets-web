<template>
  <div class="page-log-in">
    <div class="columns">
        <div class="column is-4 is-offset-4">
            <h1 class="title">Login</h1>

            <form @submit.prevent="submitForm">
                <div class="field">
                    <div class="control">
                        <label for="username">Username</label>
                        <input type="text" class="input" v-model="username" id="username">
                    </div>
                </div>
                <div class="field">
                    <div class="control">
                        <label for="password">Password</label>
                        <input type="password" class="input" v-model="password" id="password">
                    </div>
                </div>
                <div class="notification is-danger" v-if="errors.length">
                    <p v-for="error in errors" :key="error">{{ error }}</p>
                </div>
                <div class="field">
                    <div class="control">
                        <button class="button is-dark">Login</button>
                    </div>
                </div>
                <hr>
                Not registered? <router-link to="/sign-up">Click here</router-link> to sign up!
            </form>
        </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"

export default {
    name: "LogIn",
    data() {
        return {
            username: "",
            password: "",
            errors: []
        }
    },
    mounted() {
        document.title = "Login | Djackets"
    },
    methods: {
        submitForm() {
            axios.defaults.headers.common["Authorization"] = ""
            localStorage.removeItem("token")

            const submittedData = {
                username: this.username,
                password: this.password
            }

            axios.post("/api/v1/token/login", submittedData).then(res => {
                const token = res.data.auth_token

                this.$store.commit("setToken", token)
                axios.defaults.headers.common["Authorization"] = "Token " + token
                localStorage.setItem("token", token)

                const toPath = this.$route.query.to || "/cart"
                this.$router.push(toPath)
            }).catch(error => {
                if (error.response) {
                    for (const property in error.response.data) {
                        this.errors.push(`${property}: ${error.response.data[property]}`)
                    }
                } else {
                    this.errors.push("Something went wrong. Please try again.")
                    console.log(JSON.stringify(error))
                }
            })
        }
    }
}
</script>

<style>

</style>