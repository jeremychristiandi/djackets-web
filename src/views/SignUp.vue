<template>
  <div class="page-sign-up">
    <div class="columns">
        <div class="column is-4 is-offset-4">
            <h1 class="title">Sign Up</h1>

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
                <div class="field">
                    <div class="control">
                        <label for="confirmPassword">Confirm Password</label>
                        <input type="password" class="input" v-model="confirmPassword" id="confirmPassword">
                    </div>
                </div>
                <div class="notification is-danger" v-if="errors.length">
                    <p v-for="error in errors" :key="error">{{ error }}</p>
                </div>
                <div class="field">
                    <div class="control">
                        <button class="button is-dark">Sign Up</button>
                    </div>
                </div>
                <hr>
                Already registered? <router-link to="/log-in">Click here</router-link> to login!
            </form>
        </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import { toast } from "bulma-toast"

export default {
    name: "SignUp",
    data() {
        return {
            username: "",
            password: "",
            confirmPassword: "",
            errors: []
        }
    },
    methods: {
        submitForm() {
            this.errors = []
            
            if(this.username.length < 4) this.errors.push("Username is too short!")
            if(this.password.length < 4) this.errors.push("Password is too short!")
            if(this.password !== this.confirmPassword) this.errors.push("Passwords doesn't match!")
            if(!this.errors.length) {
                const submittedData = {
                    username: this.username,
                    password: this.password
                }
                //eslint-disable-next-line
                axios.post("/api/v1/users/", submittedData).then(res => {
                    toast({
                        message: "Successfully created new account! Log in to continue.",
                        type: "is-success",
                        dismissable: true,
                        pauseOnHover: true,
                        duration: 2000,
                        position: "center"
                    })
                    this.$router.push("/log-in")
                }).catch(error => {
                    if(error.response) {
                        for(const property in error.response.data) {
                            this.errors.push(`${property}: ${error.response.data}`)
                        }
                        console.log(JSON.stringify(error.response.data))
                    } else if(error.message) {
                        this.errors.push("Something went wrong. Please try again!")
                        console.log(JSON.stringify(error))
                    }
                })
            }
        }
    }
}
</script>

<style>

</style>