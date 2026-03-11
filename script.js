// Log In
function login(event){

event.preventDefault();

let email = document.getElementById("loginEmail").value;
let password = document.getElementById("loginPassword").value;

if(email === "" || password === ""){
alert("Please fill in all fields.");
return;
}

alert("Login successful!");

}


// Sign Up
function signup(event){

event.preventDefault();

let email = document.getElementById("signupEmail").value;
let password = document.getElementById("signupPassword").value;
let confirm = document.getElementById("confirmPassword").value;
let error = document.getElementById("error-message");

if(password !== confirm){
error.textContent = "Passwords do not match.";
return;
}

if(password.length < 6){
error.textContent = "Password must be at least 6 characters.";
return;
}

error.textContent = "";

alert("Account created successfully!");

}

// Home

document.getElementById("feed").appendChild(newPost);