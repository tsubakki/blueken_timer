const signin_button = document.getElementById("signin_button");
const email = document.getElementById('email');
const password = document.getElementById('password');

signin_button.addEventListener('click', function() {
    Signin();
}, false);

const Signin = function(){
    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
      .then(function(result) {
        location.href="../html/admin_timer.html";
      }).catch(function(error) {
        console.log("ログイン失敗")
      });
};

  