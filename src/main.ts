import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index'
import { Amplify } from 'aws-amplify';
import config from './amplifyconfiguration.json';

Amplify.configure(config);

const app = createApp(App)
app.use(router) 
app.mount('#app')

