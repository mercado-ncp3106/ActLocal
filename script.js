let generatedOTP = "";
let phoneVerified = false;
let otpTimer;
let otpSeconds = 60;
let currentPostIndex = null;
let editingPostIndex = null;
let paymentVerified = false;
let donatePostIndex = null;
let paymentOTP = "";
let paymentOtpTimer;
let paymentOtpSeconds = 60;
let bankOTP = "";
let bankOtpTimer;
let bankOtpSeconds = 60;
let zoomLevel = 1;
let isDragging = false;
let startX, startY;
let translateX = 0;
let translateY = 0;
let currentCategory = "All";
let helpedPosts = JSON.parse(localStorage.getItem("helpedPosts")) || [];
let donateFromModal = false;
let signupOTP = "";
let tempSignupUser = null;
let signupOtpTimer;
let signupOtpSeconds = 60;
let loginOTP = "";
let loginOtpTimer;
let loginOtpSeconds = 60;
//=====================================================
// LOGIN
function login(event){

event.preventDefault();

let email = document.getElementById("loginEmail").value;
let password = document.getElementById("loginPassword").value;

let savedUser = JSON.parse(localStorage.getItem("userAccount"));

if(!savedUser){
alert("No account found. Please sign up first.");
return;
}

if(email === savedUser.email && password === savedUser.password){

/* ✅ GET VERIFIED PHONE FROM SIGNUP */
let phone = localStorage.getItem("verifiedPhone");

if(!phone){
alert("No verified phone found. Please verify your number first.");
return;
}

/* ✅ GENERATE OTP */
loginOTP = Math.floor(100000 + Math.random()*900000).toString();

alert("2FA OTP sent to " + phone + "\nCode: " + loginOTP);

/* ✅ SHOW 2FA MODAL */
let modal = document.getElementById("loginOtpModal");
modal.style.display = "flex";
document.body.classList.add("no-scroll");

/* display phone in UI */
document.getElementById("loginOtpPhone").textContent = phone;

/* reset inputs */
document.querySelectorAll(".login-otp-input").forEach(i => i.value = "");
let inputs = document.querySelectorAll(".login-otp-input");

inputs.forEach(i => i.value = "");

if(inputs.length > 0){
    inputs[0].focus();
}

/* start timer */
startLoginOTPTimer();

}else{

alert("Invalid email or password.");

}

}

function verifyLoginOTP(){

let inputs = document.querySelectorAll(".login-otp-input");

let userOTP = "";
inputs.forEach(i => userOTP += i.value);

if(userOTP === ""){
alert("Enter OTP");
return;
}

if(loginOTP === ""){
alert("OTP expired. Request again.");
return;
}

if(userOTP !== loginOTP){
alert("Invalid OTP");
return;
}

/* ✅ SUCCESS LOGIN */
alert("Login successful!");

loginOTP = "";

/* redirect */
if(!localStorage.getItem("profileName")){
    window.location.href = "home.html?newUser=true";
} else {
    window.location.href = "home.html";
}

}

function startLoginOTPTimer(){

clearInterval(loginOtpTimer);

loginOtpSeconds = 60;

let timer = document.getElementById("loginOtpTimer");

loginOtpTimer = setInterval(function(){

if(!timer) return;

timer.textContent = "OTP expires in " + loginOtpSeconds + " seconds";

loginOtpSeconds--;

if(loginOtpSeconds < 0){

clearInterval(loginOtpTimer);

timer.textContent = "OTP expired.";

loginOTP = "";

/* ✅ SHOW RESEND BUTTON */
document.getElementById("resendLoginBtn").style.display = "inline-block";

}

},1000);

}

function setupLoginOTPInputs(){

let inputs = document.querySelectorAll(".login-otp-input");

inputs.forEach((input, index)=>{

input.addEventListener("input", function(){

this.value = this.value.replace(/[^0-9]/g,"");

if(this.value.length === 1 && index < inputs.length - 1){
inputs[index+1].focus();
}

/* auto verify */
let otp = "";
inputs.forEach(i => otp += i.value);

if(otp.length === inputs.length){
verifyLoginOTP();
}

});

input.addEventListener("keydown", function(e){

if(e.key === "Backspace" && this.value === "" && index > 0){
inputs[index-1].focus();
}

});

});

}

function closeLoginOTP(){
    document.getElementById("loginOtpModal").style.display = "none";
    document.body.classList.remove("no-scroll");
}

function resendLoginOTP(){

/* prevent spam */
if(loginOtpSeconds > 0 && loginOTP !== ""){
    alert("Please wait before requesting a new OTP.");
    return;
}

/* get phone again */
let phone = localStorage.getItem("verifiedPhone");

if(!phone){
    alert("No verified phone found.");
    return;
}

/* generate new OTP */
loginOTP = Math.floor(100000 + Math.random()*900000).toString();

alert("New OTP sent to " + phone + "\nCode: " + loginOTP);

/* reset inputs */
document.querySelectorAll(".login-otp-input").forEach(i => i.value = "");
document.querySelectorAll(".login-otp-input")[0].focus();

/* hide resend button again */
document.getElementById("resendLoginBtn").style.display = "none";

/* restart timer */
startLoginOTPTimer();
}
//=====================================================
// SIGNUP

window.onerror = function(msg, url, line){
    console.error("JS ERROR:", msg, "at line:", line);
};

function signup(event){

event.preventDefault();

let email = document.getElementById("signupEmail").value;
let password = document.getElementById("signupPassword").value;
let confirm = document.getElementById("confirmPassword").value;
let error = document.getElementById("error-message");
let phone = document.getElementById("signupPhone").value;

if(password !== confirm){
error.textContent = "Passwords do not match.";
return;
}

if(password.length < 6){
error.textContent = "Password must be at least 6 characters.";
return;
}

error.textContent = "";

/* SAVE TEMP USER */
tempSignupUser = {
email: email,
password: password,
phone: phone
};

/* 🔥 CHECK IF OTP STILL ACTIVE */
if(signupOTP !== "" && signupOtpSeconds > 0){

    // ✅ JUST REOPEN MODAL (NO NEW OTP)
    document.getElementById("signupOtpModal").style.display = "flex";

    return;
}

/* ✅ GENERATE NEW OTP ONLY IF NONE OR EXPIRED */
signupOTP = Math.floor(100000 + Math.random()*900000).toString();

alert("OTP sent to " + phone + "\nCode: " + signupOTP);

/* show modal */
document.getElementById("signupOtpModal").style.display = "flex";
setupSignupOTPInputs();
startSignupOTPTimer();
}


//=====================================================
// PROFILE MODAL
function isNewUser(){
return !localStorage.getItem("profileName");
}

function openProfile(){

document.getElementById("profileName").value =
localStorage.getItem("profileName") || "";

document.getElementById("profileEmail").value =
localStorage.getItem("profileEmail") || "";

let bioInput = document.getElementById("profileBio");
bioInput.value = localStorage.getItem("profileBio") || "";

/* update counter */
let length = bioInput.value.length;

document.getElementById("bioCounter").textContent =
length + " / 150 characters";

if(length >= 140){
document.getElementById("bioCounter").classList.add("limit");
}else{
document.getElementById("bioCounter").classList.remove("limit");
}

document.getElementById("profileModal").style.display = "flex";
document.body.classList.add("no-scroll");

}

function closeProfile(){
if(isNewUser()){
alert("Please complete your profile before exiting.");
return;
}

document.getElementById("profileName").value =
localStorage.getItem("profileName") || "";

document.getElementById("profileEmail").value =
localStorage.getItem("profileEmail") || "";

document.getElementById("profileBio").value =
localStorage.getItem("profileBio") || "";

document.getElementById("profileModal").style.display = "none";
document.body.classList.remove("no-scroll");

}


//=====================================================
// SETTINGS MODAL
function openSettings(){


let savedTheme = localStorage.getItem("theme");

/* set toggle state */
let toggle = document.getElementById("themeToggle");

if(savedTheme === "dark"){
toggle.checked = true;
}else{
toggle.checked = false;
}

let verifiedStatus = localStorage.getItem("phoneVerified");

let phoneInput = document.getElementById("userPhone");

if(verifiedStatus === "true"){
    phoneInput.value = localStorage.getItem("verifiedPhone") || "";
    phoneInput.disabled = true;

    document.getElementById("phoneVerifiedBadge").style.display = "block";
    document.getElementById("changeNumberBtn").style.display = "inline-block";
    document.getElementById("otpSection").style.display = "none";

}else{
    phoneInput.disabled = false;
}

document.getElementById("houseNumber").value =
localStorage.getItem("house") || "";

document.getElementById("streetName").value =
localStorage.getItem("street") || "";

document.getElementById("cityName").value =
localStorage.getItem("city") || "";

document.getElementById("provinceName").value =
localStorage.getItem("province") || "";

document.getElementById("settingsModal").style.display = "flex";
document.body.classList.add("no-scroll");

}

function closeSettings(){

let house = document.getElementById("houseNumber").value.trim();
let street = document.getElementById("streetName").value.trim();
let city = document.getElementById("cityName").value.trim();
let province = document.getElementById("provinceName").value.trim();
let phone = document.getElementById("userPhone").value.trim();

/* require all fields */
if(!house || !street || !city || !province || !phone){
alert("Please complete all settings fields before closing.");
return;
}

/* require phone verification */
let savedVerified = localStorage.getItem("phoneVerified");

if(savedVerified !== "true"){
alert("Please verify your cellphone number before closing settings.");
return;
}

/* close modal */
document.getElementById("settingsModal").style.display = "none";
document.body.classList.remove("no-scroll");

}
//=====================================================
// SAVE PROFILE
function saveProfile(event){

event.preventDefault();

let name = document.getElementById("profileName").value;
let email = document.getElementById("profileEmail").value;
let bio = document.getElementById("profileBio").value;

localStorage.setItem("profileName", name);
localStorage.setItem("profileEmail", email);
localStorage.setItem("profileBio", bio);

let bioWords = bio.trim().split(/\s+/);

if(bioWords.length > 150){
alert("Bio must be 150 words only.");
return;
}

/* save image only when profile is saved */
let img = document.getElementById("profileImage");

if(img.dataset.tempImage){
localStorage.setItem("profileImage", img.dataset.tempImage);
}

updateAvatar();

renderPosts();

let btn = document.getElementById("saveBtn");

btn.textContent = "✔ Saved";
btn.classList.add("saved");

setTimeout(function(){

btn.classList.remove("saved");
btn.textContent = "Save Profile";

},1500);

}


//=====================================================
// UPDATE AVATAR INITIALS
function updateAvatar(){

let name = document.getElementById("profileName").value;

if(!name) return;

let initials = name.split(" ").map(n => n[0]).join("").toUpperCase();

document.getElementById("profileAvatar").textContent = initials;

}


//=====================================================
// IMAGE UPLOAD
function setupImageUpload(){

let upload = document.getElementById("imageUpload");

if(!upload) return;

upload.addEventListener("change", function(){

let file = this.files[0];

if(!file) return;

let reader = new FileReader();

reader.onload = function(e){

let img = document.getElementById("profileImage");
let avatar = document.getElementById("profileAvatar");

img.src = e.target.result;
img.style.display = "block";
avatar.style.display = "none";

/* temporarily store image until Save Profile */
img.dataset.tempImage = e.target.result;

};

reader.readAsDataURL(file);

});

}


//=====================================================
// SAVE SETTINGS
function saveSettings(event){

event.preventDefault();

let themeToggle = document.getElementById("themeToggle");
let theme = themeToggle.checked ? "dark" : "light";
if(theme === "dark"){
document.body.classList.add("dark");
}else{
document.body.classList.remove("dark");
}

localStorage.setItem("theme", theme);
let house = document.getElementById("houseNumber").value.trim();
let street = document.getElementById("streetName").value.trim();
let city = document.getElementById("cityName").value.trim();
let province = document.getElementById("provinceName").value.trim();
let phone = document.getElementById("userPhone").value.trim();

/* phone validation */
let phonePattern = /^09\d{9}$/;

if(phone !== "" && !phonePattern.test(phone)){
document.getElementById("userPhone").setCustomValidity(
"Cellphone number must start with 09 and contain 11 digits (example: 09123456789)"
);
document.getElementById("userPhone").reportValidity();
return;
}else{
document.getElementById("userPhone").setCustomValidity("");
}

/* require verification only if OTP section is visible */
/* require phone verification before saving */
let savedVerified = localStorage.getItem("phoneVerified");

if(savedVerified !== "true"){
alert("Please verify your cellphone number before saving settings.");
return;
}

/* save settings */
localStorage.setItem("theme", theme);
localStorage.setItem("house", house);
localStorage.setItem("street", street);
localStorage.setItem("city", city);
localStorage.setItem("province", province);
localStorage.setItem("phone", phone);

/* success animation */
let btn = document.getElementById("settingsSaveBtn");
let text = btn.querySelector("span");

text.textContent = "✔ Saved";
btn.classList.add("saved");

setTimeout(function(){

btn.classList.remove("saved");
text.textContent = "Save Settings";

},1500);

}


//=====================================================
// PAGE LOAD
window.onload = function(){

    if(document.querySelector(".login-otp-input")){
    setupLoginOTPInputs();
}

    /* APPLY SAVED THEME ONLY ON HOME PAGE */
if(window.location.pathname.includes("home.html")){

let savedTheme = localStorage.getItem("theme");

if(savedTheme === "dark"){
document.body.classList.add("dark");
}
let phoneInputField = document.getElementById("userPhone");

if(phoneInputField){

phoneInputField.addEventListener("input", function(){

let verifiedPhone = localStorage.getItem("verifiedPhone");

/* only reset if number really changed */
if(verifiedPhone && this.value !== verifiedPhone){

phoneVerified = false;

localStorage.removeItem("phoneVerified");
localStorage.removeItem("verifiedPhone");

document.getElementById("phoneVerifiedBadge").style.display = "none";
document.getElementById("changeNumberBtn").style.display = "none";

document.getElementById("otpSection").style.display = "block";

}



});

}
};


renderPosts();

let bioInput = document.getElementById("profileBio");

if(bioInput){

bioInput.addEventListener("input", function(){

let length = this.value.length;

document.getElementById("bioCounter").textContent =
length + " / 150 characters";

if(length >= 140){
document.getElementById("bioCounter").classList.add("limit");
}else{
document.getElementById("bioCounter").classList.remove("limit");
}

updatePostsHelped();

});

}

let sendBtn = document.getElementById("sendCommentBtn");

if(sendBtn){
sendBtn.addEventListener("click", function(){

let input = document.getElementById("modalCommentInput");

addComment(currentPostIndex,input);

});
}


/* PROFILE IMAGE */
let savedImage = localStorage.getItem("profileImage");

if(savedImage){
let img = document.getElementById("profileImage");
let avatar = document.getElementById("profileAvatar");

img.src = savedImage;
img.style.display = "block";
avatar.style.display = "none";
}

/* PROFILE DATA */
let name = localStorage.getItem("profileName");
let email = localStorage.getItem("profileEmail");
let bio = localStorage.getItem("profileBio");

if(name && document.getElementById("profileName")){
document.getElementById("profileName").value = name;
}

if(email && document.getElementById("profileEmail")){
document.getElementById("profileEmail").value = email;
}

if(document.getElementById("profileBio")){

let bioInput = document.getElementById("profileBio");

bioInput.value = bio || "";

let length = bioInput.value.length;

document.getElementById("bioCounter").textContent =
length + " / 150 characters";

if(length >= 140){
document.getElementById("bioCounter").classList.add("limit");
}else{
document.getElementById("bioCounter").classList.remove("limit");
}

}

updateAvatar();

/* SETTINGS DATA */
let theme = localStorage.getItem("theme");

if(theme === "dark"){
document.body.classList.add("dark");
document.getElementById("themeToggle").checked = true;
}

let house = localStorage.getItem("house");
let street = localStorage.getItem("street");
let city = localStorage.getItem("city");
let province = localStorage.getItem("province");
let phone = localStorage.getItem("phone");

if(house) document.getElementById("houseNumber").value = house;
if(street) document.getElementById("streetName").value = street;
if(city) document.getElementById("cityName").value = city;
if(province) document.getElementById("provinceName").value = province;

if(phone && document.getElementById("userPhone")){
document.getElementById("userPhone").value = phone;
}

let verifiedStatus = localStorage.getItem("phoneVerified");

let phoneInput = document.getElementById("userPhone");

if(verifiedStatus === "true" && phoneInput){

phoneVerified = true;

/* restore verified number */
phoneInput.value = localStorage.getItem("verifiedPhone") || "";

document.getElementById("phoneVerifiedBadge").style.display = "block";

phoneInput.disabled = true;

/* hide OTP section */
document.getElementById("otpSection").style.display = "none";

/* hide verify button */
document.querySelector(".verify-btn").style.display = "none";

/* show change number */
document.getElementById("changeNumberBtn").style.display = "inline-block";

}

/* POST COUNT */
let posts = JSON.parse(localStorage.getItem("posts")) || [];

let helped = JSON.parse(localStorage.getItem("helpedPosts")) || [];

let helpedDisplay = document.getElementById("helpedCount");

if(helpedDisplay){
helpedDisplay.textContent = helped.length;
}

if(document.getElementById("postCount")){
document.getElementById("postCount").textContent = posts.length;
}

let totalReceived = 0;

let currentUser = localStorage.getItem("profileName");

posts.forEach(post=>{
    if(post.name === currentUser){
        totalReceived += post.donations || 0;
    }
});

let donationDisplay = document.getElementById("donationTotal");

let totalDonations = 0;

posts.forEach(post=>{
    totalDonations += post.donations || 0;
});

if(donationDisplay){
    donationDisplay.textContent = "₱" + totalReceived.toLocaleString();
}

/* AVATAR CLICK → FILE PICKER */
let avatarBox = document.querySelector(".profile-avatar");

if(avatarBox){
avatarBox.onclick = function(){
document.getElementById("imageUpload").click();
};
}

let params = new URLSearchParams(window.location.search);

if(params.get("payment") === "success"){

setTimeout(function(){

donatePostIndex = parseInt(localStorage.getItem("donatePostIndex"));
let savedAmount = localStorage.getItem("donateAmount");

if(savedAmount){
document.getElementById("donateAmount").value = savedAmount;
}

/* show processing */
let processing = document.getElementById("processingModal");

if(processing){
processing.style.display = "flex";
document.body.classList.add("no-scroll");
}

setTimeout(function(){

paymentVerified = true;

confirmDonation();

/* hide processing */
processing.style.display = "none";

/* show success */
document.getElementById("donationSuccessModal").style.display = "flex";
document.body.classList.add("no-scroll");

donateFromModal = localStorage.getItem("donateFromModal") === "true";

if(donateFromModal){
openCommentModal(donatePostIndex);
}

localStorage.removeItem("donateFromModal");
/* remove URL parameter */
window.history.replaceState({}, document.title, "home.html");

},2000);


},300);

}


setupImageUpload();
setInterval(updateTimes,10000);

};

let params = new URLSearchParams(window.location.search);

if(params.get("newUser") === "true"){
    setTimeout(() => {
        openProfile();
    }, 300);
}

function updatePostsHelped(){

let helped = JSON.parse(localStorage.getItem("helpedPosts")) || [];

let helpedDisplay = document.getElementById("helpedCount");

if(helpedDisplay){
helpedDisplay.textContent = helped.length;
}

}

// OTP
function generateOTP(){

let phone = document.getElementById("userPhone").value.trim();
let verifyBtn = document.querySelector(".verify-btn");

let phonePattern = /^09\d{9}$/;

if(phone !== "" && !phonePattern.test(phone)){
alert("Enter valid phone number like 09123456789");
return;
}

/* prevent generating new OTP if timer still active */
if(otpSeconds > 0 && generatedOTP !== ""){
alert("OTP already sent. Please wait for it to expire.");
return;
}

generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

alert("OTP sent to " + phone + "\n\nCode: " + generatedOTP);

document.getElementById("otpSection").style.display = "block";

/* NEW: show timer again */
document.getElementById("otpTimer").style.display = "block";

/* NEW: reset timer text */
document.getElementById("otpTimer").textContent = "OTP expires in 60 seconds";

/* focus first OTP box */
let inputs = document.querySelectorAll(".otp-input");
inputs.forEach(input => input.value = "");
inputs[0].focus();

/* disable verify button */
verifyBtn.disabled = true;

startOTPTimer();

}

function filterPosts(category){

currentCategory = category;

/* highlight active nav item */
let items = document.querySelectorAll(".nav-item");
items.forEach(i => i.classList.remove("active"));

event.currentTarget.classList.add("active");

/* scroll to top */
window.scrollTo({
top:0,
behavior:"smooth"
});

/* render posts */
renderPosts();

}

function setupOTPInputs(){

let inputs = document.querySelectorAll(".otp-input");

inputs.forEach((input,index)=>{

input.addEventListener("input",function(){

this.value = this.value.replace(/[^0-9]/g,"");

if(this.value.length === 1 && index < inputs.length - 1){
inputs[index + 1].focus();
}

});

input.addEventListener("keydown",function(e){

if(e.key === "Backspace" && this.value === "" && index > 0){
inputs[index - 1].focus();
}

});

});

}
if(document.querySelector(".otp-input")){
    setupOTPInputs();
}

function setupPaymentOTPInputs(){

let inputs = document.querySelectorAll(".payment-otp-input");

inputs.forEach((input,index)=>{

input.addEventListener("input",function(){

this.value = this.value.replace(/[^0-9]/g,"");

if(this.value.length === 1 && index < inputs.length - 1){
inputs[index + 1].focus();
}

});

input.addEventListener("keydown",function(e){

if(e.key === "Backspace" && this.value === "" && index > 0){
inputs[index - 1].focus();
}

});

});

}

if(document.querySelector(".payment-otp-input")){
    setupPaymentOTPInputs();
}

function verifyOTP(){

document.querySelector(".verify-btn").style.display = "none";

let inputs = document.querySelectorAll(".otp-input");

let userOTP = "";

inputs.forEach(input=>{
userOTP += input.value;
});

if(userOTP === generatedOTP){

phoneVerified = true;

/* save verification status */
localStorage.setItem("phoneVerified", "true");

/* save verified phone */
let phone = document.getElementById("userPhone").value.trim();
localStorage.setItem("verifiedPhone", phone);

/* hide OTP section */
document.getElementById("otpSection").style.display = "none";

/* show verified badge */
document.getElementById("phoneVerifiedBadge").style.display = "block";
document.getElementById("changeNumberBtn").style.display = "inline-block";

document.getElementById("settingsSaveBtn").disabled = false;

/* lock phone input */
document.getElementById("userPhone").disabled = true;

alert("Phone verified successfully!");

}else{

alert("Invalid OTP");

}

}

function changePhoneNumber(){

let phoneInput = document.getElementById("userPhone");
let verifyBtn = document.querySelector(".verify-btn");

/* unlock phone input */
phoneInput.disabled = false;

/* clear phone number */
phoneInput.value = "";

/* show verify button again */
verifyBtn.style.display = "inline-block";
verifyBtn.disabled = false;

/* hide verified badge */
document.getElementById("phoneVerifiedBadge").style.display = "none";

/* hide change number button */
document.getElementById("changeNumberBtn").style.display = "none";

/* show OTP section again */
document.getElementById("otpSection").style.display = "block";

/* reset verification */
phoneVerified = false;
generatedOTP = "";

/* remove saved verification */
localStorage.removeItem("phoneVerified");
localStorage.removeItem("verifiedPhone");

/* reset timer */
clearInterval(otpTimer);
otpSeconds = 60;

let timer = document.getElementById("otpTimer");
if(timer){
timer.textContent = "";
}

/* focus input */
phoneInput.focus();
}

function startOTPTimer(){

clearInterval(otpTimer);

otpSeconds = 60;

let timerElement = document.getElementById("otpTimer");

otpTimer = setInterval(function(){

if(!timerElement) return;

/* update countdown text */
timerElement.textContent = "OTP expires in " + otpSeconds + " seconds";

/* decrease time */
otpSeconds--;

/* when expired */
if(otpSeconds < 0){

clearInterval(otpTimer);

timerElement.textContent = "OTP expired. Click resend.";

generatedOTP = "";

}

},1000);

}

// Post
function openPost(){

/* reset edit mode */
if(editingPostIndex === null){

document.getElementById("postTitle").value="";
document.getElementById("postDescription").value="";
document.getElementById("postCategory").value="";
document.getElementById("selectedCategory").textContent="Select Category";

removeImage();

}

document.getElementById("postModal").style.display="flex";
document.body.classList.add("no-scroll");

}

function closePost(){
document.getElementById("postModal").style.display="none";
document.body.classList.remove("no-scroll");
}

function toggleCategory(){

let menu = document.getElementById("categoryOptions");

menu.classList.toggle("active");

}

function selectCategory(value){

document.getElementById("selectedCategory").textContent=value;

document.getElementById("postCategory").value=value;

document.getElementById("categoryOptions").classList.remove("active");

/* remove error border */
document.querySelector(".select-btn").style.borderColor="#ddd";

}

let uploadBox = document.getElementById("uploadBox");
let mediaInput = document.getElementById("postMedia");
let preview = document.getElementById("imagePreview");
let uploadText = document.getElementById("uploadText");
let removeBtn = document.getElementById("removeImageBtn");

let mediaType = "";

if(uploadBox && mediaInput){

uploadBox.addEventListener("click", function(){
mediaInput.click();
});

mediaInput.addEventListener("change", function(){

let file = this.files[0];
if(!file) return;

/* ✅ allow bigger files */
if(file.size > 10 * 1024 * 1024){
alert("File must be less than 10MB.");
this.value = "";
return;
}

let reader = new FileReader();

reader.onload = function(e){

if(file.type.startsWith("image")){
mediaType = "image";

preview.src = e.target.result;
preview.style.display = "block";

/* mark as image */
preview.dataset.type = "image";

uploadText.style.display = "none";
removeBtn.style.display = "block";
}

if(file.type.startsWith("video")){
    mediaType = "video";

    preview.style.display = "none"; // hide image preview

    /* REMOVE OLD VIDEO IF EXISTS */
    let oldVideo = document.getElementById("videoPreview");
    if(oldVideo) oldVideo.remove();

    /* CREATE VIDEO PREVIEW */
    let video = document.createElement("video");
    video.id = "videoPreview";
    video.src = e.target.result;
    preview.dataset.video = e.target.result;
    video.style.width = "100%";
    video.style.borderRadius = "8px";
    video.style.maxHeight = "300px";
    video.style.objectFit = "cover";

    uploadBox.appendChild(video);

    uploadText.style.display = "none";
    removeBtn.style.display = "block";
}

};

reader.readAsDataURL(file);

});

}



/* remove image */
function removeImage(event){
    if(event) event.stopPropagation();

    let preview = document.getElementById("imagePreview");
    let uploadText = document.getElementById("uploadText");
    let removeBtn = document.getElementById("removeImageBtn");
    let video = document.getElementById("videoPreview");
    let input = document.getElementById("postMedia");

    if(video) video.remove();

    preview.src = "";
    preview.style.display = "none";

    // ✅ IMPORTANT FIXES
    preview.dataset.type = "";
    preview.dataset.video = "";   // <-- ADD THIS
    input.value = "";             // <-- ADD THIS

    uploadText.style.display = "block";
    removeBtn.style.display = "none";
}

// Feed
function createPost(event){

event.preventDefault();

let title = document.getElementById("postTitle").value;
let category = document.getElementById("postCategory").value;
let description = document.getElementById("postDescription").value;

let media = "";
let mediaTypeSaved = "";

/* get preview safely */


let videoElement = document.querySelector("#uploadBox video");
let previewElement = document.getElementById("imagePreview");
if(previewElement){

    /* IMAGE */
    if(previewElement.dataset.type === "image" && previewElement.src){
        media = previewElement.src;
        mediaTypeSaved = "image";
    }

    /* VIDEO */
    if(previewElement.dataset.video){
        media = previewElement.dataset.video;
        mediaTypeSaved = "video";
    }

}

/* require image upload */
if(!media){
uploadBox.classList.add("upload-error");
setTimeout(function(){
uploadBox.classList.remove("upload-error");
},1000);
return;
}

let userEmail = localStorage.getItem("profileEmail");
let profileImage = localStorage.getItem("profileImage") || "";

if(category === ""){
document.querySelector(".select-btn").style.borderColor="red";
return;
}

let goal = parseInt(document.getElementById("postGoal").value);

let name = localStorage.getItem("profileName") || "User";

let post = {
name,
userEmail,
profileImage,
title,
category,
description,
media,
mediaType: mediaTypeSaved,
likes:0,
liked:false,
comments:[],
donations:0,
goal: goal,
completed: false,
time: Date.now()
};

/* EDIT POST */
if(editingPostIndex !== null){

let posts = JSON.parse(localStorage.getItem("posts")) || [];

post.time = posts[editingPostIndex].time;
post.likes = posts[editingPostIndex].likes;
post.liked = posts[editingPostIndex].liked;
post.comments = posts[editingPostIndex].comments;
post.donations = posts[editingPostIndex].donations;

posts[editingPostIndex] = post;

localStorage.setItem("posts", JSON.stringify(posts));

let editedIndex = editingPostIndex;

editingPostIndex = null;

renderPosts();
closePost();

/* refresh modal post if it was open */
let modal = document.getElementById("commentModal");

if(modal && modal.style.display === "flex"){
openCommentModal(editedIndex);
}

return;

}

/* NEW POST */
let posts = JSON.parse(localStorage.getItem("posts")) || [];

posts.unshift(post);

try{
localStorage.setItem("posts", JSON.stringify(posts));
}catch(e){
alert("Storage full. Please delete some posts or remove images.");
return;
}

renderPosts();

/* RESET FORM */
document.getElementById("postTitle").value="";
document.getElementById("postDescription").value="";
document.getElementById("postCategory").value="";
document.getElementById("selectedCategory").textContent="Select Category";
document.getElementById("postGoal").value = "";

if(previewElement){
previewElement.src="";
previewElement.style.display="none";
}

uploadText.style.display="block";
removeBtn.style.display="none";

let imageInput = document.getElementById("postMedia");

if(mediaInput){
    mediaInput.value = "";
}
closePost();

}

function renderPosts(){

let feed = document.getElementById("feed");

let posts = JSON.parse(localStorage.getItem("posts")) || [];

/* update post counter */
let postCount = document.getElementById("postCount");
if(postCount){
postCount.textContent = posts.length;
}

feed.innerHTML="";

if(posts.length === 0){
feed.innerHTML='<p class="empty-feed">No posts yet.</p>';
return;
}

posts.forEach((post,index)=>{

/* COMPLETED FILTER */
if(currentCategory === "Completed"){
    if(!post.completed) return;
}else{
    if(post.completed) return;
    if(currentCategory !== "All" && post.category !== currentCategory){
        return;
    }
}



let currentName = localStorage.getItem("profileName") || post.name;
let currentImage = localStorage.getItem("profileImage");

let profile = currentImage
? `<img src="${currentImage}" class="profile-avatar-small">`
: `<div class="profile-avatar-small">${currentName.charAt(0)}</div>`;

let mediaHTML = "";

if(post.mediaType === "image"){
    mediaHTML = `<img src="${post.media}" class="post-image" onclick="openCommentModal(${index})">`;
}

if(post.mediaType === "video"){
    mediaHTML = `
    <video class="post-video" onclick="openCommentModal(${index})">
        <source src="${post.media}">
    </video>
    `;
}

let progress = post.goal ? Math.min((post.donations / post.goal) * 100, 100) : 0;

let goalHTML = post.goal ? `
<div class="donation-progress">
    <div class="progress-bar">
        <div class="progress-fill" style="width:${progress}%"></div>
    </div>
    <small>₱${post.donations} / ₱${post.goal}</small>
</div>
` : "";

let postHTML = `
<div class="post">

<div class="post-header">

<div style="display:flex;align-items:center;gap:10px;">
${profile}
<div>
<strong class="post-name">${localStorage.getItem("profileName") || post.name}</strong><br>
<span class="time" data-time="${post.time}">${timeAgo(post.time)}</span>
</div>
</div>

<span class="tag ${post.completed ? 'completed' : post.category.replace(/[^a-z]/gi,'').toLowerCase()}">
${post.completed ? 'Completed' : post.category}
</span>

</div>

<h3>${post.title}</h3>

<p>${post.description}</p>

${mediaHTML}
${goalHTML}

<div class="post-stats">

<span>${post.likes} likes</span>
<span class="comment-count" onclick="openCommentModal(${index})">
${post.comments.length} comments
</span>
<span class="donate-total">₱${post.donations}</span>

</div>

${post.completed ? "" : `
<div class="post-actions">

<button onclick="likePost(${index})" class="like-btn ${post.liked ? 'liked' : ''}">
<i data-lucide="heart"></i>
<span>Like</span>
</button>

<button onclick="openCommentModal(${index})">
<i data-lucide="message-circle"></i> Comment
</button>

<button onclick="openDonate(${index})" class="donate-btn">
<i data-lucide="banknote"></i> Donate
</button>

<div class="post-menu">

<span class="post-dots" onclick="togglePostMenu(this)">
<i data-lucide="more-horizontal"></i>
</span>

<div class="post-dropdown">

<div onclick="editPost(${index}); closePostMenu(this)">
<i data-lucide="edit-3"></i>
<span>Edit Post</span>
</div>

<div onclick="deletePost(${index}); closePostMenu(this)">
<i data-lucide="trash-2"></i>
<span>Delete Post</span>
</div>

</div>

</div>

</div>
`}

<div class="comment-section">

<div class="comment-list">

${post.comments.slice(-2).map((c,i,arr) => {

let realIndex = post.comments.length - arr.length + i;

if(typeof c === "string"){
c = {
name: post.name,
text: c,
time: Date.now(),
likes:0,
liked:false
};
}

let currentImage = localStorage.getItem("profileImage");
let currentName = localStorage.getItem("profileName") || c.name;

let avatar = currentImage
? `<img src="${currentImage}">`
: currentName.charAt(0);

return `
<div class="comment-item">

<div class="comment-avatar">
${avatar}
</div>

<div class="comment-bubble">

<strong>${currentName}</strong>

<div class="comment-text">${c.text}</div>

<div class="comment-meta">

<span 
class="comment-time" 
data-time="${c.time}" 
data-edited="${c.edited ? c.editedTime : ""}"
>
${timeAgo(c.time)}
${c.edited ? ` · Edited (${timeAgo(c.editedTime)})` : ""}
</span>

<span class="comment-heart ${c.liked ? "comment-liked" : ""}" 
onclick="likeComment(${index},${realIndex})">
<i data-lucide="heart"></i>
</span>

<span class="comment-like-count">
${c.likes > 0 ? c.likes : ""}
</span>

</div>

</div>

</div>
`;

}).join("")}

</div>

${post.comments.length > 2 ? `
<div class="view-more-comments" onclick="openCommentModal(${index})">
View all ${post.comments.length} comments
</div>
` : ""}

</div>

</div>
`;

feed.insertAdjacentHTML("beforeend",postHTML);

});

lucide.createIcons();
}

function updateTimes(){

document.querySelectorAll("[data-time]").forEach(el=>{

let timestamp = parseInt(el.getAttribute("data-time"));
let edited = el.getAttribute("data-edited");

if(!timestamp) return;

let text = timeAgo(timestamp);

if(edited){
text += " · Edited (" + timeAgo(parseInt(edited)) + ")";
}

el.textContent = text;

});

}

function closePostMenu(el){

let menu = el.closest(".post-dropdown");

if(menu){
menu.style.display = "none";
}

}

function togglePostMenu(el){

let menu = el.parentElement.querySelector(".post-dropdown");

/* close other menus */
document.querySelectorAll(".post-dropdown").forEach(m=>{
if(m !== menu) m.style.display="none";
});

/* toggle this menu */
menu.style.display = menu.style.display === "block" ? "none" : "block";

}

function editPost(index){

let posts = JSON.parse(localStorage.getItem("posts")) || [];

let post = posts[index];

editingPostIndex = index;

/* open edit modal without closing post modal */
openPost();

/* fill fields */
document.getElementById("postTitle").value = post.title;
document.getElementById("postDescription").value = post.description;
document.getElementById("postCategory").value = post.category;
document.getElementById("selectedCategory").textContent = post.category;

/* load image */
if(post.media){

let preview = document.getElementById("imagePreview");
let uploadText = document.getElementById("uploadText");
let removeBtn = document.getElementById("removeImageBtn");

if(post.mediaType === "image"){
    preview.src = post.media;
    preview.style.display = "block";
    uploadText.style.display = "none";
    removeBtn.style.display = "block";
}

if(post.mediaType === "video"){
    uploadBox.innerHTML = `
    <video controls style="width:100%;border-radius:8px;">
        <source src="${post.media}">
    </video>
    <button type="button" id="removeImageBtn" onclick="removeImage(event)">✕</button>
    `;
}
}

}
function toggleComments(index){

let section = document.getElementById("comments-"+index);

if(section.style.display === "none"){
section.style.display = "block";
}else{
section.style.display = "none";
}

}


function openCommentModal(index){


document.body.classList.add("no-scroll");

currentPostIndex = index;

let posts = JSON.parse(localStorage.getItem("posts")) || [];

let post = posts[index];

/* modal title */
document.getElementById("modalPostTitle").textContent =
(localStorage.getItem("profileName") || post.name) + "'s Post";

/* post avatar */
let currentImage = localStorage.getItem("profileImage");
let currentName = localStorage.getItem("profileName") || post.name;

let profile = currentImage
? `<img src="${currentImage}" class="modal-avatar">`
: `<div class="modal-avatar">${currentName.charAt(0)}</div>`;

/* post media */
let mediaHTML = "";

if(post.mediaType === "image"){
    mediaHTML = `<img src="${post.media}" class="modal-post-image" onclick="openImageViewer('${post.media}')">`;
}

if(post.mediaType === "video"){
    mediaHTML = `
    <video controls class="modal-post-video">
        <source src="${post.media}">
    </video>
    `;
}

/* render comments */
let commentsHTML = post.comments.map((c,i)=>{

/* support old text comments */
if(typeof c === "string"){
c = {
name: post.name,
avatar: post.profileImage,
text: c,
time: Date.now(),
likes:0,
liked:false
};
}

let currentImage = localStorage.getItem("profileImage");
let currentName = localStorage.getItem("profileName") || c.name;

let avatar = currentImage
? `<img src="${currentImage}" class="comment-avatar">`
: `<div class="comment-avatar">${currentName.charAt(0)}</div>`;

let likeClass = c.liked ? "comment-liked" : "";

return `

<div class="comment-row">

${avatar}

<div class="comment-bubble">

<strong>${currentName}</strong>

<div class="comment-text" id="comment-text-${index}-${i}">
${c.text}
</div>

<div class="comment-meta">

<span 
class="comment-time" 
data-time="${c.time}" 
data-edited="${c.edited ? c.editedTime : ""}"
>
${timeAgo(c.time)}
${c.edited ? ` · Edited (${timeAgo(c.editedTime)})` : ""}
</span>

<span class="comment-heart ${likeClass}" onclick="likeComment(${index},${i})">
<i data-lucide="heart"></i>
</span>

<span class="comment-like-count">${c.likes > 0 ? c.likes : ""}</span>

<div class="comment-menu">

<span class="comment-dots" onclick="toggleCommentMenu(this)">
<i data-lucide="more-horizontal"></i>
</span>

<div class="comment-dropdown">

<div onclick="editComment(${index},${i}); closeCommentMenu(this)">
<i data-lucide="edit-3"></i>
<span>Edit Comment</span>
</div>

<div onclick="deleteComment(${index},${i}); closeCommentMenu(this)">
<i data-lucide="trash-2"></i>
<span>Delete Comment</span>
</div>

</div>

</div>

</div>

</div>

</div>

`;

}).join("");

/* modal content */
document.getElementById("modalPostContent").innerHTML = `



<div class="modal-post-header">

<div style="display:flex;align-items:center;gap:10px;">
${profile}

<div class="modal-post-user">
<strong>${localStorage.getItem("profileName") || post.name}</strong>
<span class="time" data-time="${post.time}">${timeAgo(post.time)}</span>
</div>
</div>

<span class="tag ${post.category.replace(/[^a-z]/gi,'').toLowerCase()}">
${post.category}
</span>

</div>

<h3 class="modal-post-title">${post.title}</h3>

<p>${post.description}</p>

${mediaHTML}

<div class="post-stats">

<span>${post.likes} likes</span>
<span>${post.comments.length} comments</span>
<span class="donate-total">₱${post.donations}</span>

</div>

${post.completed ? "" : `
<div class="post-actions">

<button onclick="likePost(${index})" class="like-btn ${post.liked ? 'liked' : ''}">
<i data-lucide="heart"></i>
<span>Like</span>
</button>

<button onclick="openDonate(${index})" class="donate-btn">
<i data-lucide="banknote"></i> Donate
</button>

<div class="post-menu">

<span class="post-dots" onclick="togglePostMenu(this)">
<i data-lucide="more-horizontal"></i>
</span>

<div class="post-dropdown">

<div onclick="editPost(${index}); closePostMenu(this)">
<i data-lucide="edit-3"></i>
<span>Edit Post</span>
</div>

<div onclick="deletePost(${index}); closePostMenu(this)">
<i data-lucide="trash-2"></i>
<span>Delete Post</span>
</div>

</div>

</div>

</div>
`}

<div class="comment-section">

${commentsHTML}

</div>

`;

/* show user avatar beside comment input */

let userName = localStorage.getItem("profileName") || "User";
let userImage = localStorage.getItem("profileImage");

let avatarHTML = userImage
? `<img src="${userImage}">`
: userName.charAt(0);

document.getElementById("commentUserAvatar").innerHTML = avatarHTML;

/* open modal */

document.getElementById("commentModal").style.display="flex";

if(post.completed){
    let input = document.getElementById("modalCommentInput");
    let btn = document.getElementById("sendCommentBtn");

    if(input){
        input.disabled = true;
        input.placeholder = "This post is already completed";
    }

    if(btn){
        btn.disabled = true;
    }
}

lucide.createIcons();

}

function openImageViewer(src){

let viewer = document.getElementById("imageViewer");
let img = document.getElementById("fullImage");

viewer.style.display = "flex";
img.src = src;

zoomLevel = 1;
translateX = 0;
translateY = 0;

img.style.transform = "scale(1) translate(0px,0px)";

document.body.classList.add("no-scroll");

}
let fullImage = document.getElementById("fullImage");

if(fullImage){

/* ZOOM */
fullImage.addEventListener("wheel", function(e){

e.preventDefault();

if(e.deltaY < 0){
zoomLevel += 0.1;
}else{
zoomLevel -= 0.1;
}

zoomLevel = Math.min(Math.max(1, zoomLevel), 4);

updateTransform();

});

/* HOLD MOUSE TO PAN */
fullImage.addEventListener("mousedown", function(e){

if(zoomLevel <= 1) return;

isDragging = true;

startX = e.clientX - translateX;
startY = e.clientY - translateY;

this.style.cursor = "grabbing";

});

}

fullImage.addEventListener("mousedown", function(e){

if(zoomLevel <= 1) return;

isDragging = true;

startX = e.clientX - translateX;
startY = e.clientY - translateY;

this.style.cursor = "grabbing";

});
document.addEventListener("mousemove", function(e){

if(!isDragging) return;

translateX = e.clientX - startX;
translateY = e.clientY - startY;

updateTransform();

});

document.addEventListener("mouseup", function(){

isDragging = false;

let img = document.getElementById("fullImage");
if(img) img.style.cursor = "grab";

});

function updateTransform(){

let img = document.getElementById("fullImage");

img.style.transform =
`translate(${translateX}px, ${translateY}px) scale(${zoomLevel})`;

}



function closeImageViewer(){
document.getElementById("imageViewer").style.display = "none";
document.body.classList.remove("no-scroll");
}

function editComment(postIndex, commentIndex){

let posts = JSON.parse(localStorage.getItem("posts")) || [];

let comment = posts[postIndex].comments[commentIndex];

let textElement = document.getElementById(`comment-text-${postIndex}-${commentIndex}`);

if(!textElement) return;

let originalText = comment.text;

/* replace comment with input */
textElement.innerHTML = `
<div class="edit-comment-container">

<input 
type="text"
class="edit-comment-input"
value="${originalText}"
id="editInput-${postIndex}-${commentIndex}"
>

<div class="edit-actions">
<button onclick="saveEditedComment(${postIndex},${commentIndex})">Save</button>
<button onclick="cancelEditComment(${postIndex},${commentIndex},'${originalText}')">Cancel</button>
</div>

</div>
`;

let input = document.getElementById(`editInput-${postIndex}-${commentIndex}`);

input.focus();
input.select();

/* save on ENTER */
input.addEventListener("keypress", function(e){

if(e.key === "Enter"){

let newText = this.value.trim();

if(newText === "") return;

posts[postIndex].comments[commentIndex].text = newText;
posts[postIndex].comments[commentIndex].edited = true;
posts[postIndex].comments[commentIndex].editedTime = Date.now();

localStorage.setItem("posts", JSON.stringify(posts));

renderPosts();
openCommentModal(postIndex);

}

});

/* cancel on ESC */
input.addEventListener("keydown", function(e){

if(e.key === "Escape"){

textElement.innerHTML = originalText;

}

});

}

function saveEditedComment(postIndex,commentIndex){

let posts = JSON.parse(localStorage.getItem("posts")) || [];

let input = document.getElementById(`editInput-${postIndex}-${commentIndex}`);

let newText = input.value.trim();

if(!newText) return;

posts[postIndex].comments[commentIndex].text = newText;
posts[postIndex].comments[commentIndex].edited = true;
posts[postIndex].comments[commentIndex].editedTime = Date.now();

localStorage.setItem("posts", JSON.stringify(posts));

renderPosts();
openCommentModal(postIndex);

}

function cancelEditComment(postIndex,commentIndex,originalText){

let textElement = document.getElementById(`comment-text-${postIndex}-${commentIndex}`);

textElement.innerHTML = originalText;

}

function closeCommentMenu(el){

let menu = el.closest(".comment-dropdown");

if(menu){
menu.style.display = "none";
}

}

function toggleCommentMenu(el){

let menu = el.parentElement.querySelector(".comment-dropdown");

/* close other menus */
document.querySelectorAll(".comment-dropdown").forEach(m=>{
if(m !== menu) m.style.display="none";
});

/* toggle this menu */
menu.style.display = menu.style.display === "block" ? "none" : "block";

}

function likeComment(postIndex,commentIndex){

let posts = JSON.parse(localStorage.getItem("posts")) || [];

let comment = posts[postIndex].comments[commentIndex];

if(comment.liked){
comment.likes = Math.max(0, comment.likes-1);
comment.liked = false;
}else{
comment.likes++;
comment.liked = true;
}

localStorage.setItem("posts", JSON.stringify(posts));

/* update feed */
renderPosts();

/* update modal only if open */
let modal = document.getElementById("commentModal");

if(modal && modal.style.display === "flex"){
openCommentModal(postIndex);
}

}


let deletePostIndex = null;
let deleteCommentIndex = null;

function deleteComment(postIndex,commentIndex){

deletePostIndex = postIndex;
deleteCommentIndex = commentIndex;

document.getElementById("deleteCommentModal").style.display="flex";

}

function closeDeleteModal(){

document.getElementById("deleteCommentModal").style.display="none";

}

function confirmDeleteComment(){

let posts = JSON.parse(localStorage.getItem("posts")) || [];

posts[deletePostIndex].comments.splice(deleteCommentIndex,1);

localStorage.setItem("posts", JSON.stringify(posts));

closeDeleteModal();

renderPosts();

openCommentModal(deletePostIndex);

}

function closeCommentModal(){

document.getElementById("commentModal").style.display="none";
document.body.classList.remove("no-scroll");
}

function deletePost(index){

deletePostIndex = index;

document.getElementById("deletePostModal").style.display = "flex";
document.body.classList.add("no-scroll");

}

function closeDeletePostModal(){

document.getElementById("deletePostModal").style.display = "none";
document.body.classList.remove("no-scroll");

}
function confirmDeletePost(){

let posts = JSON.parse(localStorage.getItem("posts")) || [];

posts.splice(deletePostIndex,1);

localStorage.setItem("posts", JSON.stringify(posts));

closeDeletePostModal();

/* close the post modal if open */
closeCommentModal();

document.body.classList.remove("no-scroll");

renderPosts();

}

function likePost(index){

let posts = JSON.parse(localStorage.getItem("posts")) || [];

if(posts[index].liked){

posts[index].likes = Math.max(0, posts[index].likes-1);
posts[index].liked = false;

}else{

posts[index].likes++;
posts[index].liked = true;

}

localStorage.setItem("posts", JSON.stringify(posts));

renderPosts();

/* refresh modal if open */
let modal = document.getElementById("commentModal");

if(modal && modal.style.display === "flex"){
openCommentModal(index);
}

}

function addComment(index,input){

let text = input.value.trim();

if(!text) return;

let posts = JSON.parse(localStorage.getItem("posts")) || [];

let userName = localStorage.getItem("profileName") || "User";
let userImage = localStorage.getItem("profileImage") || "";

let comment = {
name:userName,
avatar:userImage,
text:text,
time:Date.now(),
likes:0,
liked:false
};

posts[index].comments.push(comment);

localStorage.setItem("posts", JSON.stringify(posts));

input.value="";

renderPosts();

openCommentModal(index); // refresh modal so new comment appears


}

function timeAgo(timestamp){

let seconds = Math.floor((Date.now()-timestamp)/1000);

if(seconds < 60) return "Just now";

let minutes = Math.floor(seconds/60);

if(minutes < 60) return minutes+" minutes ago";

let hours = Math.floor(minutes/60);

if(hours < 24) return hours+" hours ago";

let days = Math.floor(hours/24);

return days+" days ago";

}

function closeAllModals(){

let modals = [
"profileModal",
"settingsModal",
"postModal",
"commentModal",
"deleteCommentModal",
"deletePostModal"
];

modals.forEach(id => {

let modal = document.getElementById(id);

if(modal){
modal.style.display = "none";
}

});

document.body.classList.remove("no-scroll");

}

function closeTopModal(){

let settings = document.getElementById("settingsModal");
let comment = document.getElementById("commentModal");
let post = document.getElementById("postModal");
let deleteComment = document.getElementById("deleteCommentModal");
let profile = document.getElementById("profileModal");

/* close highest modal first */

if(settings && settings.style.display === "flex"){
settings.style.display = "none";
return;
}

if(deleteComment && deleteComment.style.display === "flex"){
deleteComment.style.display = "none";
return;
}

if(comment && comment.style.display === "flex"){
comment.style.display = "none";
document.body.classList.remove("no-scroll");
return;
}

if(post && post.style.display === "flex"){
post.style.display = "none";
document.body.classList.remove("no-scroll");
return;
}

if(profile && profile.style.display === "flex"){
profile.style.display = "none";
document.body.classList.remove("no-scroll");
return;
}

}

//================================DONATION====================================================
let cardNumber = document.getElementById("cardNumber");

if(cardNumber){
cardNumber.addEventListener("input", function(e){

let value = e.target.value.replace(/\D/g,"");
value = value.substring(0,16);
value = value.replace(/(.{4})/g,"$1 ").trim();

e.target.value = value;

});
}

let cardExpiry = document.getElementById("cardExpiry");

if(cardExpiry){
cardExpiry.addEventListener("input", function(e){

let value = e.target.value.replace(/\D/g,"");

if(value.length > 4){
value = value.substring(0,4);
}

if(value.length >= 3){
value = value.substring(0,2) + "/" + value.substring(2);
}

e.target.value = value;

});
}

let cardCVC = document.getElementById("cardCVC");

if(cardCVC){
cardCVC.addEventListener("input", function(e){

let value = e.target.value.replace(/\D/g,"");
value = value.substring(0,3);

e.target.value = value;

});
}

function openDonate(index){

donatePostIndex = index;

/* check if modal post is open */
let modal = document.getElementById("commentModal");

donateFromModal = modal && modal.style.display === "flex";

/* save state so it survives page change */
localStorage.setItem("donateFromModal", donateFromModal);

document.getElementById("donateAmount").value = "";

document.getElementById("donateModal").style.display = "flex";

document.body.classList.add("no-scroll");

}

function closeDonate(){
document.getElementById("donateModal").style.display = "none";
document.body.classList.remove("no-scroll");
}

function goPayment(){

let amount = parseInt(document.getElementById("donateAmount").value);

if(!amount || amount <= 0){
    alert("Enter a valid donation amount.");
    return;
}

let posts = JSON.parse(localStorage.getItem("posts")) || [];
let post = posts[donatePostIndex];

/* 🔥 CHECK REMAINING AMOUNT */
let remaining = post.goal - post.donations;

if(amount > remaining){
    alert("Donation exceeds goal. Remaining amount is ₱" + remaining);
    return;
}

/* proceed */
document.getElementById("donateModal").style.display = "none";
document.getElementById("paymentModal").style.display = "flex";

}

function closePayment(){

document.getElementById("paymentModal").style.display = "none";
document.body.classList.remove("no-scroll");

}

function openGCash(){
document.body.classList.add("no-scroll");
document.getElementById("paymentModal").style.display="none";
document.getElementById("gcashModal").style.display="flex";

/* reset phone */
document.getElementById("gcashPhone").value="";

/* hide OTP section */
document.getElementById("paymentOtpSection").style.display="none";

/* reset OTP boxes */
document.querySelectorAll(".payment-otp-input").forEach(i=>i.value="");

/* reset timer */
clearInterval(paymentOtpTimer);
paymentOtpSeconds = 60;
paymentOTP = "";
paymentVerified = false;

}

function closeGCash(){
document.body.classList.remove("no-scroll");
document.getElementById("gcashModal").style.display="none";

/* reset everything */
document.getElementById("gcashPhone").value="";
document.getElementById("paymentOtpSection").style.display="none";
document.getElementById("gcashCancelInitial").style.display="block";
document.querySelectorAll(".payment-otp-input").forEach(i=>i.value="");
document.body.classList.remove("no-scroll");

clearInterval(paymentOtpTimer);

paymentOTP="";
paymentVerified=false;
paymentOtpSeconds=60;

}

function openMaya(){

openGCash();

document.querySelector("#gcashModal h2").textContent = "Maya Payment";

}

function openBank(){

document.body.classList.add("no-scroll");

document.getElementById("paymentModal").style.display="none";
document.getElementById("bankModal").style.display="flex";

/* reset cancel button */
document.getElementById("bankCancelBtn").style.display="inline-block";

/* hide OTP section again */
document.getElementById("bankOtpSection").style.display="none";

}

function openQR(){
document.body.classList.add("no-scroll");
document.getElementById("paymentModal").style.display = "none";
document.getElementById("qrModal").style.display = "flex";

/* reset QR state */
document.getElementById("processingModal").style.display = "none";
document.getElementById("donationSuccessModal").style.display = "none";

}

function goQR(){

/* save donation info before leaving page */
localStorage.setItem("donatePostIndex", donatePostIndex);
localStorage.setItem("donateAmount", document.getElementById("donateAmount").value);

window.location.href = "qrpay.html";

}

function generatePaymentOTP(){

let phone = document.getElementById("gcashPhone").value.trim();

let phonePattern = /^09\d{9}$/;

if(!phonePattern.test(phone)){
alert("Enter valid phone number like 09123456789");
return;
}

/* prevent resend before timer expires */
if(paymentOtpSeconds > 0 && paymentOTP !== ""){
alert("OTP already sent. Please wait for it to expire.");
return;
}

paymentOTP = Math.floor(100000 + Math.random()*900000).toString();

alert("OTP sent to " + phone + "\nCode: " + paymentOTP);

document.getElementById("paymentOtpSection").style.display="block";

document.getElementById("gcashCancelInitial").style.display="none";

/* clear OTP boxes */
let inputs = document.querySelectorAll(".payment-otp-input");

inputs.forEach(i => i.value="");

inputs[0].focus();

startPaymentOTPTimer();

}

function startPaymentOTPTimer(){

clearInterval(paymentOtpTimer);

paymentOtpSeconds = 60;

let timer = document.getElementById("paymentOtpTimer");

paymentOtpTimer = setInterval(function(){

timer.textContent = "OTP expires in " + paymentOtpSeconds + " seconds";

paymentOtpSeconds--;

if(paymentOtpSeconds < 0){

clearInterval(paymentOtpTimer);

timer.textContent = "OTP expired. Click resend.";

paymentOTP = "";

}

},1000);

}

function verifyPaymentOTP(){

let inputs = document.querySelectorAll(".payment-otp-input");

let userOTP = "";

inputs.forEach(input=>{
userOTP += input.value;
});

if(userOTP === paymentOTP){

paymentVerified = true;

/* hide gcash modal */
document.getElementById("gcashModal").style.display="none";

/* show processing */
document.getElementById("processingModal").style.display="flex";
document.body.classList.add("no-scroll");

/* simulate payment delay */
setTimeout(function(){

confirmDonation();

/* hide processing */
document.getElementById("processingModal").style.display="none";

/* show success modal */
document.getElementById("donationSuccessModal").style.display="flex";
document.body.classList.add("no-scroll");

},2000);

}else{

alert("Invalid OTP");

}

}

function closeDonationSuccess(){

document.getElementById("donationSuccessModal").style.display="none";
document.body.classList.remove("no-scroll");
}

function confirmDonation(){

if(!paymentVerified) return;

let amount = parseInt(document.getElementById("donateAmount").value);

let posts = JSON.parse(localStorage.getItem("posts")) || [];

let post = posts[donatePostIndex];

/* 🔥 CALCULATE REMAINING */
let remaining = post.goal - post.donations;

/* ❌ BLOCK OVER-DONATION */
if(amount > remaining){
    alert("Donation exceeds remaining goal. Max allowed is ₱" + remaining);
    return;
}

/* ✅ APPLY DONATION */
post.donations += amount;

/* ✅ CHECK IF GOAL REACHED EXACTLY */
if(post.donations >= post.goal){
    post.donations = post.goal;   // clamp to goal
    post.completed = true;
}

/* track helped posts */
if(!helpedPosts.includes(donatePostIndex)){
    helpedPosts.push(donatePostIndex);
    localStorage.setItem("helpedPosts", JSON.stringify(helpedPosts));
}

localStorage.setItem("posts", JSON.stringify(posts));

updatePostsHelped();
updateDonationTotal();
updateReceivedTotal();

/* close modals */
document.getElementById("gcashModal").style.display="none";
document.getElementById("bankModal").style.display="none";
document.getElementById("qrModal").style.display="none";

/* reset bank fields */
document.getElementById("cardNumber").value="";
document.getElementById("cardExpiry").value="";
document.getElementById("cardCVC").value="";
document.getElementById("bankOtpSection").style.display="none";

document.querySelectorAll(".otp-input").forEach(i=>i.value="");

clearInterval(bankOtpTimer);
bankOTP="";
bankOtpSeconds=60;

/* update feed */
renderPosts();

/* reset state */
paymentVerified = false;

/* reset gcash too */
closeGCash();

document.getElementById("paymentModal").style.display="none";

}

function generateBankOTP(){

if(bankOtpSeconds > 0 && bankOTP !== ""){
alert("OTP already sent. Please wait for it to expire.");
return;
}

bankOTP = Math.floor(100000 + Math.random()*900000).toString();

alert("Bank OTP: " + bankOTP);

/* show OTP section */
document.getElementById("bankOtpSection").style.display = "block";

/* hide cancel button only */
document.getElementById("bankCancelBtn").style.display = "none";

let inputs = document.querySelectorAll(".otp-input");

inputs.forEach(i => i.value = "");

inputs[0].focus();

startBankOTPTimer();

updateDonationTotal();

}

function updateDonationTotal(){

let posts = JSON.parse(localStorage.getItem("posts")) || [];

let total = 0;

posts.forEach(post=>{
total += post.donations || 0;
});

let donationDisplay = document.getElementById("donationTotal");

if(donationDisplay){
donationDisplay.textContent = "₱" + total.toLocaleString();
}

}

function startBankOTPTimer(){

clearInterval(bankOtpTimer);

bankOtpSeconds = 60;

let timer = document.getElementById("bankOtpTimer");

bankOtpTimer = setInterval(function(){

timer.textContent = "OTP expires in " + bankOtpSeconds + " seconds";

bankOtpSeconds--;

if(bankOtpSeconds < 0){

clearInterval(bankOtpTimer);

timer.textContent = "OTP expired. Click resend.";

bankOTP="";

}

},1000);

}

function verifyBankOTP(){

let inputs = document.querySelectorAll(".otp-input");

let userOTP="";

inputs.forEach(input=>{
userOTP+=input.value;
});

if(userOTP === bankOTP){

paymentVerified = true;

document.getElementById("bankModal").style.display="none";

document.getElementById("processingModal").style.display="flex";
document.body.classList.add("no-scroll");

setTimeout(function(){

confirmDonation();

document.getElementById("processingModal").style.display="none";

document.getElementById("donationSuccessModal").style.display="flex";
document.body.classList.add("no-scroll");

},2000);

}else{

alert("Invalid OTP");

}

}

function closeBank(){
document.body.classList.remove("no-scroll");
/* close modal */
document.getElementById("bankModal").style.display = "none";

/* reset card fields */
document.getElementById("cardNumber").value = "";
document.getElementById("cardExpiry").value = "";
document.getElementById("cardCVC").value = "";

document.getElementById("bankCancelBtn").style.display = "inline-block";

/* hide OTP section */
document.getElementById("bankOtpSection").style.display = "none";

/* clear OTP boxes */
document.querySelectorAll(".otp-input").forEach(input=>{
input.value = "";
});

/* reset timer */
clearInterval(bankOtpTimer);

bankOTP = "";
bankOtpSeconds = 60;

/* reset timer text */
let timer = document.getElementById("bankOtpTimer");
if(timer){
timer.textContent = "";
}

}

function setupBankOTPInputs(){

let inputs = document.querySelectorAll(".otp-input");

inputs.forEach((input,index)=>{

input.addEventListener("input",function(){

this.value = this.value.replace(/[^0-9]/g,"");

if(this.value.length === 1 && index < inputs.length - 1){
inputs[index+1].focus();
}

});

input.addEventListener("keydown",function(e){

if(e.key==="Backspace" && this.value==="" && index>0){
inputs[index-1].focus();
}

});

});

}

if(document.querySelector(".otp-input")){
    setupBankOTPInputs();
}

function closeQR(){

document.getElementById("qrModal").style.display = "none";
document.body.classList.remove("no-scroll");

}

function verifySignupOTP(){

let inputs = document.querySelectorAll(".signup-otp-input");

let input = "";
inputs.forEach(i => input += i.value);

/* ❌ BLOCK EMPTY INPUT */
if(input === ""){
alert("Please enter the OTP.");
return;
}

/* ❌ BLOCK EXPIRED OTP */
if(signupOTP === ""){
alert("OTP has expired. Please request a new one.");
return;
}

/* ❌ BLOCK WRONG OTP */
if(input !== signupOTP){
alert("Invalid OTP");
return;
}

/* ✅ SUCCESS */
localStorage.setItem("userAccount", JSON.stringify(tempSignupUser));
localStorage.setItem("profileEmail", tempSignupUser.email);
localStorage.setItem("phone", tempSignupUser.phone);

/* ✅ MARK AS VERIFIED */
localStorage.setItem("phoneVerified", "true");
localStorage.setItem("verifiedPhone", tempSignupUser.phone);

alert("Account created successfully!");

/* clear session */
tempSignupUser = null;
signupOTP = "";

/* redirect */
window.location.href = "index.html";
}

function setupSignupOTPInputs(){

let inputs = document.querySelectorAll(".signup-otp-input");

inputs.forEach((input, index) => {

input.addEventListener("input", function(){

this.value = this.value.replace(/[^0-9]/g,"");

/* move to next box */
if(this.value.length === 1 && index < inputs.length - 1){
inputs[index + 1].focus();
}

/* ✅ AUTO VERIFY WHEN ALL FILLED */
let otp = "";
inputs.forEach(i => otp += i.value);

if(otp.length === inputs.length){
verifySignupOTP();
}

});

input.addEventListener("keydown", function(e){

/* backspace navigation */
if(e.key === "Backspace" && this.value === "" && index > 0){
inputs[index - 1].focus();
}

});

});

}

function closeSignupOTP(){

    document.getElementById("signupOtpModal").style.display = "none";

    document.querySelectorAll(".signup-otp-input").forEach(i => i.value = "");
}

function logoutUser(){

let confirmLogout = confirm("Are you sure you want to logout?");

if(!confirmLogout) return;

/* keep theme so it stays after login */

/* redirect to login page */
window.location.href = "index.html";

}

function startSignupOTPTimer(){

clearInterval(signupOtpTimer);

signupOtpSeconds = 60;

let timer = document.getElementById("signupOtpTimer");

signupOtpTimer = setInterval(function(){

if(!timer) return;

timer.textContent = "OTP expires in " + signupOtpSeconds + " seconds";

signupOtpSeconds--;

if(signupOtpSeconds < 0){

clearInterval(signupOtpTimer);

timer.textContent = "OTP expired. Click resend.";

signupOTP = "";

}

},1000);

}

function resendSignupOTP(){

/* block spam */
if(signupOtpSeconds > 0 && signupOTP !== ""){
alert("Please wait before requesting a new OTP.");
return;
}

let phone = tempSignupUser.phone;

/* generate new OTP */
signupOTP = Math.floor(100000 + Math.random()*900000).toString();

alert("New OTP sent to " + phone + "\nCode: " + signupOTP);

/* restart timer */
startSignupOTPTimer();

/* clear input */
document.querySelectorAll(".signup-otp-input").forEach(i => i.value = "");

}

function updateReceivedTotal(){

    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    let totalReceived = 0;

    let currentUser = localStorage.getItem("profileName");

    posts.forEach(post=>{
        if(post.name === currentUser){
            totalReceived += post.donations || 0;
        }
    });

    let receivedDisplay = document.getElementById("receivedTotal");

    if(receivedDisplay){
        receivedDisplay.textContent = "₱" + totalReceived.toLocaleString();
    }

}

//============================================================================================

document.addEventListener("click", function(e){

/* close post menus */
if(!e.target.closest(".post-menu")){
document.querySelectorAll(".post-dropdown").forEach(menu=>{
menu.style.display = "none";
});
}

/* close comment menus */
if(!e.target.closest(".comment-menu")){
document.querySelectorAll(".comment-dropdown").forEach(menu=>{
menu.style.display = "none";
});
}

});

document.addEventListener("click", function(e){

/* allow outside click close ONLY for comment modal */
if(e.target.classList.contains("comment-modal")){
closeTopModal();
}

/* allow outside click close ONLY for delete comment modal */
if(e.target.classList.contains("delete-comment-modal")){
closeTopModal();
}

});

document.addEventListener("keydown", function(e){

if(e.key === "Escape"){

let profile = document.getElementById("profileModal");

if(profile.style.display === "flex" && isNewUser()){
alert("Please complete your profile first.");
return;
}

closeTopModal();

}

});