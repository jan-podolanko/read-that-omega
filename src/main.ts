import {createApp} from 'vue'
import App from './ui/App.vue'
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {firebaseConfig} from './firebase/config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

createApp(App).mount('#app')
