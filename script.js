let generatedOTP = "";
let phoneVerified = false;
let otpTimer;
let otpSeconds = 60;
let currentPostIndex = null;
//=====================================================
// LOGIN
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


//=====================================================
// SIGNUP
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


//=====================================================
// PROFILE MODAL
function openProfile(){
document.getElementById("profileModal").style.display = "flex";
}

function closeProfile(){
document.getElementById("profileModal").style.display = "none";
}


//=====================================================
// SETTINGS MODAL
function openSettings(){
document.getElementById("settingsModal").style.display = "flex";
}

function closeSettings(){
document.getElementById("settingsModal").style.display = "none";
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

updateAvatar();

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

localStorage.setItem("profileImage", e.target.result);

};

reader.readAsDataURL(file);

});

}


//=====================================================
// SAVE SETTINGS
function saveSettings(event){

event.preventDefault();

let theme = document.getElementById("themeSelect").value;
let house = document.getElementById("houseNumber").value.trim();
let street = document.getElementById("streetName").value.trim();
let city = document.getElementById("cityName").value.trim();
let province = document.getElementById("provinceName").value.trim();
let phone = document.getElementById("userPhone").value.trim();

/* phone validation */
let phonePattern = /^09\d{9}$/;

if(!phonePattern.test(phone)){
document.getElementById("userPhone").setCustomValidity(
"Cellphone number must start with 09 and contain 11 digits (example: 09123456789)"
);
document.getElementById("userPhone").reportValidity();
return;
}else{
document.getElementById("userPhone").setCustomValidity("");
}

/* check verification */
if(!phoneVerified){

alert("Please verify your phone number first.");

return;

}else{
document.getElementById("userPhone").setCustomValidity("");
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

btn.textContent = "✔ Saved";
btn.classList.add("saved");

setTimeout(function(){

btn.classList.remove("saved");
btn.textContent = "Save Settings";

},1500);

}

//=====================================================
// PAGE LOAD
window.onload = function(){

renderPosts();

let modalInput = document.getElementById("modalCommentInput");

if(modalInput){
modalInput.addEventListener("keypress", function(e){
if(e.key === "Enter"){
addComment(currentPostIndex,this);
}
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

if(bio && document.getElementById("profileBio")){
document.getElementById("profileBio").value = bio;
}

updateAvatar();

/* SETTINGS DATA */
let theme = localStorage.getItem("theme");
let house = localStorage.getItem("house");
let street = localStorage.getItem("street");
let city = localStorage.getItem("city");
let province = localStorage.getItem("province");
let phone = localStorage.getItem("phone");

if(theme && document.getElementById("themeSelect")){
document.getElementById("themeSelect").value = theme;
}

if(house) document.getElementById("houseNumber").value = house;
if(street) document.getElementById("streetName").value = street;
if(city) document.getElementById("cityName").value = city;
if(province) document.getElementById("provinceName").value = province;

if(phone && document.getElementById("userPhone")){
document.getElementById("userPhone").value = phone;
}

/* POST COUNT */
let posts = JSON.parse(localStorage.getItem("posts")) || [];

if(document.getElementById("postCount")){
document.getElementById("postCount").textContent = posts.length;
}

/* AVATAR CLICK → FILE PICKER */
let avatarBox = document.querySelector(".profile-avatar");

if(avatarBox){
avatarBox.onclick = function(){
document.getElementById("imageUpload").click();
};
}

setupImageUpload();

};

// OTP
function generateOTP(){

let phone = document.getElementById("userPhone").value.trim();
let verifyBtn = document.querySelector(".verify-btn");

let phonePattern = /^09\d{9}$/;

if(!phonePattern.test(phone)){
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
setupOTPInputs();

function verifyOTP(){

let inputs = document.querySelectorAll(".otp-input");

let userOTP = "";

inputs.forEach(input=>{
userOTP += input.value;
});

if(userOTP === generatedOTP){

phoneVerified = true;

/* hide OTP section */
document.querySelector(".otp-boxes").style.display = "none";
document.querySelector(".otp-actions").style.display = "none";
document.getElementById("otpTimer").style.display = "none";

/* show verified badge */
document.getElementById("phoneVerifiedBadge").style.display = "block";

/* lock phone input */
document.getElementById("userPhone").disabled = true;

alert("Phone verified successfully!");

}else{

alert("Invalid OTP");

}

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
document.getElementById("postModal").style.display="flex";
}

function closePost(){
document.getElementById("postModal").style.display="none";
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
let imageInput = document.getElementById("postImage");
let preview = document.getElementById("imagePreview");
let uploadText = document.getElementById("uploadText");
let removeBtn = document.getElementById("removeImageBtn");

/* click upload box */
uploadBox.addEventListener("click", function(){
imageInput.click();
});

/* image selected */
imageInput.addEventListener("change", function(){

let file = this.files[0];
if(!file) return;

let reader = new FileReader();

reader.onload = function(e){

preview.src = e.target.result;
preview.style.display = "block";

uploadText.style.display = "none";

removeBtn.style.display = "block";

};

reader.readAsDataURL(file);

});

/* remove image */
function removeImage(event){

/* stop upload box click */
if(event) event.stopPropagation();

let imageInput = document.getElementById("postImage");
let preview = document.getElementById("imagePreview");
let uploadText = document.getElementById("uploadText");
let removeBtn = document.getElementById("removeImageBtn");

imageInput.value = "";

preview.src = "";
preview.style.display = "none";

uploadText.style.display = "block";
removeBtn.style.display = "none";

}

// Feed
function createPost(event){

event.preventDefault();

document.getElementById("selectedCategory").textContent="Select Category";
let title = document.getElementById("postTitle").value;
let category = document.getElementById("postCategory").value;
let description = document.getElementById("postDescription").value;
let image = document.getElementById("imagePreview").src;

let name = localStorage.getItem("profileName") || "Anonymous";
let profileImage = localStorage.getItem("profileImage") || "";

if(category === ""){
document.querySelector(".select-btn").style.borderColor="red";
return;
}

let post = {
name,
profileImage,
title,
category,
description,
image,
likes:0,
liked:false,
comments:[],
donations:0,
time: Date.now()
};

let posts = JSON.parse(localStorage.getItem("posts")) || [];

posts.unshift(post);

localStorage.setItem("posts", JSON.stringify(posts));

/* update post counter */

renderPosts();

/* reset form */
document.getElementById("postTitle").value="";
document.getElementById("postDescription").value="";
document.getElementById("postCategory").value="";
document.getElementById("selectedCategory").textContent="Select Category";

let preview = document.getElementById("imagePreview");
let uploadText = document.getElementById("uploadText");
let removeBtn = document.getElementById("removeImageBtn");
let imageInput = document.getElementById("postImage");

preview.src="";
preview.style.display="none";

uploadText.style.display="block";
removeBtn.style.display="none";
imageInput.value="";

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

let profile = post.profileImage
? `<img src="${post.profileImage}" class="profile-avatar-small">`
: `<div class="profile-avatar-small">${post.name.charAt(0)}</div>`;

let imageHTML = post.image ? `<img src="${post.image}">` : "";

let postHTML = `
<div class="post">

<div class="post-header">

<div style="display:flex;align-items:center;gap:10px;">
${profile}
<div>
<strong>${post.name}</strong><br>
<span class="time">${timeAgo(post.time)}</span>
</div>
</div>

<span class="tag">${post.category}</span>

</div>

<h3>${post.title}</h3>

<p>${post.description}</p>

${imageHTML}

<div class="post-stats">

<span>${post.likes} likes</span>
<span class="comment-count" onclick="openCommentModal(${index})">
${post.comments.length} comments
</span>
<span class="donate-total">₱${post.donations}</span>

</div>

<div class="post-actions">

<button onclick="likePost(${index})" class="like-btn ${post.liked ? 'liked' : ''}">
<i data-lucide="heart"></i>
<span>Like</span>
</button>

<button onclick="toggleComments(${index})">
<i data-lucide="message-circle"></i> Comment
</button>

<button onclick="donatePost(${index})" class="donate-btn">
<i data-lucide="banknote"></i> Donate
</button>

<button onclick="deletePost(${index})" class="delete-btn">
<i data-lucide="trash-2"></i> Delete
</button>

</div>

<div class="comment-section" id="comments-${index}" style="display:none;">

<div class="comment-list">
${post.comments.map(c => `<div class="comment-item">${typeof c === "string" ? c : c.text}</div>`).join("")}
</div>

<div class="comment-input-box">

<input 
type="text" 
placeholder="Write a comment..." 
onkeypress="if(event.key==='Enter'){addComment(${index}, this)}"
/>

<button onclick="addComment(${index}, this.previousElementSibling)">
<i data-lucide="send"></i>
</button>

</div>

</div>

</div>
`;

feed.insertAdjacentHTML("beforeend",postHTML);

});

lucide.createIcons();
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

currentPostIndex = index;

let posts = JSON.parse(localStorage.getItem("posts")) || [];

let post = posts[index];

/* modal title */
document.getElementById("modalPostTitle").textContent = post.name + "'s Post";

/* post avatar */
let profile = post.profileImage
? `<img src="${post.profileImage}" class="modal-avatar">`
: `<div class="modal-avatar">${post.name.charAt(0)}</div>`;

/* post image */
let imageHTML = post.image
? `<img src="${post.image}" class="modal-post-image">`
: "";

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

let avatar = c.avatar
? `<img src="${c.avatar}" class="comment-avatar">`
: `<div class="comment-avatar">${c.name.charAt(0)}</div>`;

let likeClass = c.liked ? "comment-liked" : "";

return `

<div class="comment-row">

${avatar}

<div class="comment-bubble">

<strong>${c.name}</strong>

<div class="comment-text">${c.text}</div>

<div class="comment-meta">

<span class="comment-time">${timeAgo(c.time)}</span>

<span class="comment-heart ${likeClass}" onclick="likeComment(${index},${i})">
<i data-lucide="heart"></i>
</span>

<span class="comment-like-count">${c.likes > 0 ? c.likes : ""}</span>

</div>

</div>

</div>

`;

}).join("");

/* modal content */
document.getElementById("modalPostContent").innerHTML = `

<div class="modal-post-header">

${profile}

<div class="modal-post-user">
<strong>${post.name}</strong>
<span class="time">${timeAgo(post.time)}</span>
</div>

</div>

<h3 class="modal-post-title">${post.title}</h3>

<p>${post.description}</p>

${imageHTML}

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

lucide.createIcons();

}

function likeComment(postIndex,commentIndex){

let posts = JSON.parse(localStorage.getItem("posts")) || [];

let comment = posts[postIndex].comments[commentIndex];

if(comment.liked){
comment.likes = Math.max(0, comment.likes-1);
comment.liked=false;
}else{
comment.likes++;
comment.liked=true;
}

localStorage.setItem("posts", JSON.stringify(posts));

openCommentModal(postIndex);

}

function closeCommentModal(){

document.getElementById("commentModal").style.display="none";

}

function deletePost(index){

let confirmDelete = confirm("Are you sure you want to delete this post?");

if(!confirmDelete) return;

let posts = JSON.parse(localStorage.getItem("posts")) || [];

posts.splice(index,1); // remove post

localStorage.setItem("posts", JSON.stringify(posts));

renderPosts(); // refresh feed

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

openCommentModal(index); // refresh modal so new comment appears

}

function donatePost(index){

let amount = prompt("Enter donation amount (₱)");

if(!amount) return;

let posts = JSON.parse(localStorage.getItem("posts"));

posts[index].donations += parseInt(amount);

localStorage.setItem("posts", JSON.stringify(posts));

renderPosts();

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