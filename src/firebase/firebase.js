import firebase from 'firebase'

const config= {
    apiKey: "AIzaSyDIchZt-7bPvGktHrZXvTVIrVdGcGpSJ0o",
    authDomain: "oliver-pos-287408.firebaseapp.com",
    databaseURL: "https://oliver-pos-287408.firebaseio.com",
    projectId: "oliver-pos-287408",
    storageBucket: "oliver-pos-287408.appspot.com",
    messagingSenderId: "740768807687",
    appId: "1:740768807687:web:e667539f6c1b37e8f963a2",
    measurementId: "G-21F4SFGPJR"
}

firebase.initializeApp(config)

export default firebase