// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set, update } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6F35b3Oik4iD3ZfZYomFaV8SVKKEnfFY",
  authDomain: "bichanss-entretien-reparation.firebaseapp.com",
  projectId: "bichanss-entretien-reparation",
  storageBucket: "bichanss-entretien-reparation.appspot.com",
  messagingSenderId: "883423844486",
  appId: "1:883423844486:web:e8d49c79cb2831723b5907",
  measurementId: "G-J9H0MD3GC3"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const database = getDatabase(app);



export function register(){
    email = document.getElementById('email').value;
    tel = document.getElementById('tel').value;
    prenom = document.getElementById('prenom').value;
    nom = document.getElementById('nom').value;
    mdp = document.getElementById('mdp').value;

  // Move on with Auth
  auth.createUserWithEmailAndPassword(email, mdp)
  .then(function() {
    // Declare user variable
    var user = auth.currentUser

    // Add this user to Firebase Database
    var database_ref = ref(database)


    // Create User data
    var user_data = {
      email : email,
      prenom : prenom,
      nom : nom,
      tel : tel,
      last_login : Date.now()
    }

    // Push to Firebase Database
    update(database_ref,'users/' + user.uid).set(user_data)

    // DOne
    alert('User Created!!')
  })
  .catch(function(error) {
    // Firebase will use this to alert of its errors
    var error_code = error.code
    var error_message = error.message

    alert(error_message)
  })
}

// Set up our login function
function login () {
  // Get all our input fields
  email = document.getElementById('email').value
  password = document.getElementById('mdp').value

  auth.signInWithEmailAndPassword(email, password)
  .then(function() {
    // Declare user variable
    var user = auth.currentUser

    // Add this user to Firebase Database
    var database_ref = ref(database)

    // Create User data
    var user_data = {
      last_login : Date.now()
    }

    // Push to Firebase Database
    update(database_ref,'users/' + user.uid).update(user_data)

    // DOne
    alert('User Logged In!!')

  })
  .catch(function(error) {
    // Firebase will use this to alert of its errors
    var error_code = error.code
    var error_message = error.message

    alert(error_message)
  })
}


// Validate Functions
function validate_email(email) {
  expression = /^[^@]+@\w+(\.\w+)+\w$/
  if (expression.test(email) == true) {
    // Email is good
    return true
  } else {
    // Email is not good
    return false
  }
}

function validate_password(password) {
  // Firebase only accepts lengths greater than 6
  if (password < 6) {
    return false
  } else {
    return true
  }
}

function validate_field(field) {
  if (field == null) {
    return false
  }

  if (field.length <= 0) {
    return false
  } else {
    return true
  }
} 


register();
