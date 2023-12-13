// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyB6F35b3Oik4iD3ZfZYomFaV8SVKKEnfFY",
  authDomain: "bichanss-entretien-reparation.firebaseapp.com",
  projectId: "bichanss-entretien-reparation",
  storageBucket: "bichanss-entretien-reparation.appspot.com",
  messagingSenderId: "883423844486",
  appId: "1:883423844486:web:e8d49c79cb2831723b5907",
  measurementId: "G-J9H0MD3GC3",
  databaseURL: "https://bichanss-entretien-reparation-default-rtdb.europe-west1.firebasedatabase.app"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize variables
const auth = firebase.auth()
const database = firebase.database()


// Set up our register function
function register () {
  
  // Get all our input fields
  email = document.getElementById('email').value
  password = document.getElementById('mdp').value
  nom = document.getElementById('nom').value
  tel = document.getElementById('tel').value
  prenom = document.getElementById('prenom').value

  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Email or Password is Outta Line!!')
    return
    // Don't continue running the code
  }
  //if (validate_field(full_name) == false || validate_field(favourite_song) == false || validate_field(milk_before_cereal) == false) {
  //  alert('One or More Extra Fields is Outta Line!!')
  //  return
  //}
 
  // Move on with Auth
  auth.createUserWithEmailAndPassword(email, password)
  .then(function() {
    // Declare user variable
    var user = auth.currentUser

    // Add this user to Firebase Database
    var database_ref = database.ref()

    // Create User data
    var user_data = {
      email : email,
      nom : nom,
      tel : tel,
      mdp : mdp,
      prenom : prenom,
      last_login : Date.now()
    }

    // Push to Firebase Database
    database_ref.child('users/' + user.uid).set(user_data)

    // DOne
    alert('User Created!!')
    displayUserInfo();
  })
  .catch(function(error) {
    // Firebase will use this to alert of its errors
    var error_code = error.code
    var error_message = error.message

    alert(error_message)
  })
}

function displayUserInfo() {
  const user = firebase.auth().currentUser;
  if (user) {
    var database_ref = firebase.database().ref();
    var uid = user.uid;
    database_ref.child('users/' + uid).once('value')
      .then(function(snapshot) {
        var userData = snapshot.val();
        var user_info = document.getElementById('user_info');
        console.log(userData.profileImage);
        user_info.innerHTML = `
        <section class="r-section-12" id="user_info">
        <div class="bloc-1">
          <div class="sous-bloc-1">
            <div class="prenom">${userData.prenom}</div>
            <div class="prenom">${userData.nom}</div>
            <div class="prenom">${userData.email}</div>
            <div class="prenom">${userData.tel}</div>
          </div>
          <div></div>
          <div class="sous-bloc-2">
            <div class="photo_profil">
              <img src="${userData.profileImage || 'https://firebasestorage.googleapis.com/v0/b/bichanss-entretien-reparation.appspot.com/o/images%2Fcarte-villes-france.jpg?alt=media&token=13fbfac5-fa21-43e9-a3d5-9f04b55873b7'}"
                class="profil_img"/>
              <button class="inputFileButton" onclick="document.getElementById('fileInput').click()">Sélectionner un fichier</button>
              <input type="file" id="fileInput" style="display: none;" onchange="getFile(event)" accept="image/png, image/jpeg" />
              <span class="fileText" style="color: blue;" id="fileText"></span>
              <button onclick="uploadImage()" class="pushFileButton">valider</button>
            </div>
          </div>  
        </div>

        <div class="bloc-2">
          <div class="is-skiman">
            <div class="toggle-switch">
              <input type="checkbox" id="switch" />
              <label for="switch"></label>
            </div>
            <div class="toggle-title">Proposer des services d'entretien de skis</div>
          </div>

          <div class="is-skiman">
            <div class="toggle-switch2">
              <input type="checkbox" id="switch2" />
              <label for="switch2"></label>
            </div>
            <div class="toggle-title">Proposer des services de réparation de vélo</div>
          </div>
          
    `;
      })
      .catch(function(error) {
        console.error("Erreur lors de la récupération des données utilisateur:", error);
      });

    
  } else {
    // Aucun utilisateur n'est connecté.
    console.log("Non connecté");
  }
}

// Appelez cette fonction lorsqu'il y a un changement d'état d'authentification
firebase.auth().onAuthStateChanged(function(user) {
  displayUserInfo();
});

// Notez que `onAuthStateChanged` est asynchrone, il peut y avoir un léger délai pour récupérer les informations de l'utilisateur.


// Set up our login function
function login () {
  // Get all our input fields
  email = document.getElementById('email').value
  password = document.getElementById('mdp').value

  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Email or Password is Outta Line!!')
    return
    // Don't continue running the code
  }

  auth.signInWithEmailAndPassword(email, password)
  .then(function() {
    // Declare user variable
    var user = auth.currentUser

    // Add this user to Firebase Database
    var database_ref = database.ref()

    // Create User data
    var user_data = {
      last_login : Date.now()
    }

    // Push to Firebase Database
    database_ref.child('users/' + user.uid).update(user_data)

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


function recherche_skiman() {
  // Référence à la base de données
  var database_ref = database.ref('users');
  var userList = document.getElementById('userList');

  // Effacer la liste existante avant de la remplir à nouveau
  userList.innerHTML = '';

  // Récupérer tous les utilisateurs une fois
  database_ref.once('value')
    .then(function(snapshot) {
      // La variable snapshot contient les données récupérées de la base de données
      // Vous pouvez maintenant traiter ces données comme vous le souhaitez
      snapshot.forEach(function(userSnapshot) {
        var userData = userSnapshot.val();
        //console.log("User Email: " + userData.email);
        //console.log("User Nom: " + userData.nom);

        // Créer un élément de liste pour chaque utilisateur
        var listItem = document.createElement('li');
        listItem.style.listStyle = 'none';
        // Structure HTML pour chaque utilisateur
        listItem.innerHTML = `
        <div class="r-align-center-xs r-align-left-lg r-align-left-md r-align-left-sm r-align-left-xl r-container-style r-list-item r-radius-14 shadow r-repeater-item r-shape-round r-white">
          <div class="r-container-layout r-similar-container r-container-layout-3">
            <div alt="" class="r-image r-image-circle r-image-2" data-image-width="598" data-image-height="598" data-animation-name="zoomIn" data-animation-duration="2250" data-animation-direction=""></div>
            <div class="r-container-style r-group r-group-2">
              <div class="r-container-layout">
                <h3 class="r-align-left r-custom-font r-font-raleway r-text r-text-default r-text-palette-1-base r-text-7" id>${userData.prenom} ${userData.nom} &nbsp;</h3>
                <p class="r-align-left r-text r-text-default r-text-grey-30 r-text-6" id="ville">${userData.tel}</p>
                <p class="r-align-left r-text r-text-body-color r-text-8">${userData.email}</p>
                <div class="r-social-icons r-spacing-30 r-social-icons-2">
                  <a class="r-social-url" title="facebook" target="_blank" href="https://facebook.com/name"><span class="r-icon r-icon-circle r-social-facebook r-social-icon r-text-palette-1-dark-1"><svg class="r-svg-link" preserveAspectRatio="xMidYMin slice" viewBox="0 0 112 112" style=""><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-0afe"></use></svg><svg class="r-svg-content" viewBox="0 0 112 112" x="0" y="0" id="svg-0afe"><circle fill="currentColor" cx="56.1" cy="56.1" r="55"></circle><path fill="#FFFFFF" d="M73.5,31.6h-9.1c-1.4,0-3.6,0.8-3.6,3.9v8.5h12.6L72,58.3H60.8v40.8H43.9V58.3h-8V43.9h8v-9.2
    c0-6.7,3.1-17,17-17h12.5v13.9H73.5z"></path></svg></span>
                  </a>
                  <a class="r-social-url" title="twitter" target="_blank" href="https://twitter.com/name"><span class="r-icon r-icon-circle r-social-icon r-social-twitter r-text-palette-1-dark-1"><svg class="r-svg-link" preserveAspectRatio="xMidYMin slice" viewBox="0 0 112 112" style=""><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-6c19"></use></svg><svg class="r-svg-content" viewBox="0 0 112 112" x="0" y="0" id="svg-6c19"><circle fill="currentColor" class="st0" cx="56.1" cy="56.1" r="55"></circle><path fill="#FFFFFF" d="M83.8,47.3c0,0.6,0,1.2,0,1.7c0,17.7-13.5,38.2-38.2,38.2C38,87.2,31,85,25,81.2c1,0.1,2.1,0.2,3.2,0.2
  c6.3,0,12.1-2.1,16.7-5.7c-5.9-0.1-10.8-4-12.5-9.3c0.8,0.2,1.7,0.2,2.5,0.2c1.2,0,2.4-0.2,3.5-0.5c-6.1-1.2-10.8-6.7-10.8-13.1
  c0-0.1,0-0.1,0-0.2c1.8,1,3.9,1.6,6.1,1.7c-3.6-2.4-6-6.5-6-11.2c0-2.5,0.7-4.8,1.8-6.7c6.6,8.1,16.5,13.5,27.6,14
  c-0.2-1-0.3-2-0.3-3.1c0-7.4,6-13.4,13.4-13.4c3.9,0,7.3,1.6,9.8,4.2c3.1-0.6,5.9-1.7,8.5-3.3c-1,3.1-3.1,5.8-5.9,7.4
  c2.7-0.3,5.3-1,7.7-2.1C88.7,43,86.4,45.4,83.8,47.3z"></path></svg></span>
                  </a>
                  <a class="r-social-url" title="instagram" target="_blank" href="https://instagram.com/name"><span class="r-icon r-icon-circle r-social-icon r-social-instagram r-text-palette-1-dark-1 r-icon-6"><svg class="r-svg-link" preserveAspectRatio="xMidYMin slice" viewBox="0 0 512 512" style=""><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-5892"></use></svg><svg class="r-svg-content" viewBox="0 0 512 512" id="svg-5892"><path d="m305 256c0 27.0625-21.9375 49-49 49s-49-21.9375-49-49 21.9375-49 49-49 49 21.9375 49 49zm0 0"></path><path d="m370.59375 169.304688c-2.355469-6.382813-6.113281-12.160157-10.996094-16.902344-4.742187-4.882813-10.515625-8.640625-16.902344-10.996094-5.179687-2.011719-12.960937-4.40625-27.292968-5.058594-15.503906-.707031-20.152344-.859375-59.402344-.859375-39.253906 0-43.902344.148438-59.402344.855469-14.332031.65625-22.117187 3.050781-27.292968 5.0625-6.386719 2.355469-12.164063 6.113281-16.902344 10.996094-4.882813 4.742187-8.640625 10.515625-11 16.902344-2.011719 5.179687-4.40625 12.964843-5.058594 27.296874-.707031 15.5-.859375 20.148438-.859375 59.402344 0 39.25.152344 43.898438.859375 59.402344.652344 14.332031 3.046875 22.113281 5.058594 27.292969 2.359375 6.386719 6.113281 12.160156 10.996094 16.902343 4.742187 4.882813 10.515624 8.640626 16.902343 10.996094 5.179688 2.015625 12.964844 4.410156 27.296875 5.0625 15.5.707032 20.144532.855469 59.398438.855469 39.257812 0 43.90625-.148437 59.402344-.855469 14.332031-.652344 22.117187-3.046875 27.296874-5.0625 12.820313-4.945312 22.953126-15.078125 27.898438-27.898437 2.011719-5.179688 4.40625-12.960938 5.0625-27.292969.707031-15.503906.855469-20.152344.855469-59.402344 0-39.253906-.148438-43.902344-.855469-59.402344-.652344-14.332031-3.046875-22.117187-5.0625-27.296874zm-114.59375 162.179687c-41.691406 0-75.488281-33.792969-75.488281-75.484375s33.796875-75.484375 75.488281-75.484375c41.6875 0 75.484375 33.792969 75.484375 75.484375s-33.796875 75.484375-75.484375 75.484375zm78.46875-136.3125c-9.742188 0-17.640625-7.898437-17.640625-17.640625s7.898437-17.640625 17.640625-17.640625 17.640625 7.898437 17.640625 17.640625c-.003906 9.742188-7.898437 17.640625-17.640625 17.640625zm0 0"></path><path d="m256 0c-141.363281 0-256 114.636719-256 256s114.636719 256 256 256 256-114.636719 256-256-114.636719-256-256-256zm146.113281 316.605469c-.710937 15.648437-3.199219 26.332031-6.832031 35.683593-7.636719 19.746094-23.246094 35.355469-42.992188 42.992188-9.347656 3.632812-20.035156 6.117188-35.679687 6.832031-15.675781.714844-20.683594.886719-60.605469.886719-39.925781 0-44.929687-.171875-60.609375-.886719-15.644531-.714843-26.332031-3.199219-35.679687-6.832031-9.8125-3.691406-18.695313-9.476562-26.039063-16.957031-7.476562-7.339844-13.261719-16.226563-16.953125-26.035157-3.632812-9.347656-6.121094-20.035156-6.832031-35.679687-.722656-15.679687-.890625-20.6875-.890625-60.609375s.167969-44.929688.886719-60.605469c.710937-15.648437 3.195312-26.332031 6.828125-35.683593 3.691406-9.808594 9.480468-18.695313 16.960937-26.035157 7.339844-7.480469 16.226563-13.265625 26.035157-16.957031 9.351562-3.632812 20.035156-6.117188 35.683593-6.832031 15.675781-.714844 20.683594-.886719 60.605469-.886719s44.929688.171875 60.605469.890625c15.648437.710937 26.332031 3.195313 35.683593 6.824219 9.808594 3.691406 18.695313 9.480468 26.039063 16.960937 7.476563 7.34375 13.265625 16.226563 16.953125 26.035157 3.636719 9.351562 6.121094 20.035156 6.835938 35.683593.714843 15.675781.882812 20.683594.882812 60.605469s-.167969 44.929688-.886719 60.605469zm0 0"></path></svg></span>
                  </a>
                  <!-- Ajoutez ici les liens sociaux si disponibles dans userData -->
                </div>
              </div>
            </div>
          </div>
        </div>
        `;

        // Ajouter l'élément de liste à la liste principale
        userList.appendChild(listItem);
      });
    })
    .catch(function(error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
    });
}



// PHOTO



  var fileText = document.getElementById("fileText");
  var fileItem;
  var fileName;
  var img = document.querySelector(".profil_img");

  function getFile(e) {
    // Votre code actuel pour obtenir le fichier
    var fileItem = e.target.files[0];
    var fileName = fileItem.name;
    var fileText = document.getElementById("fileText");
    var img = document.querySelector(".profil_img");
  
    // Affichez le nom du fichier après 3 secondes
    setTimeout(function() {
      fileText.innerHTML = `${fileName}`;
    }, 3000); // 3000 millisecondes équivalent à 3 secondes
  }
  

 // Fonction pour télécharger l'image
 function uploadImage() {
  // Référence au stockage Firebase
  var storageRef = firebase.storage().ref();
  var imagesRef = storageRef.child('images/' + fileName);

  // Uploader le fichier
  imagesRef.put(fileItem).then((snapshot) => {
    console.log('File uploaded!');
    
    // Obtenir l'URL de téléchargement de l'image
    imagesRef.getDownloadURL().then((url) => {
      console.log(url);
      // Enregistrez l'URL dans la base de données Firebase Realtime
      var databaseRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid);
      databaseRef.update({ profileImage: url });


    }).catch((error) => {
      console.error('Error getting download URL:', error);
    });
  });
}