import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { initializeApp } from "firebase/app";
import { firebaseConfig } from './firebase/config';
import router from './router/router';
// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const app = createApp(App)
app.use(router)
app.mount('#app')