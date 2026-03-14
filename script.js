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
//=====================================================
// LOGIN
function login(event){

event.preventDefault();

let email = document.getElementById("loginEmail").value;
let password = document.getElementById("loginPassword").value;

/* get saved account */
let savedUser = JSON.parse(localStorage.getItem("userAccount"));

if(!savedUser){
alert("No account found. Please sign up first.");
return;
}

if(email === savedUser.email && password === savedUser.password){

alert("Login successful!");

/* go to home page */
window.location.href = "home.html";

}else{

alert("Invalid email or password.");

}

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

/* save account */
let user = {
email: email,
password: password
};

localStorage.setItem("userAccount", JSON.stringify(user));

alert("Account created successfully!");

/* redirect AFTER alert */
setTimeout(function(){
window.location.href = "index.html";
}, 500);

}


//=====================================================
// PROFILE MODAL
function openProfile(){
document.getElementById("profileModal").style.display = "flex";
document.body.classList.add("no-scroll");
}

function closeProfile(){
document.getElementById("profileModal").style.display = "none";
}


//=====================================================
// SETTINGS MODAL
function openSettings(){
document.getElementById("settingsModal").style.display = "flex";
document.body.classList.add("no-scroll");
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

let params = new URLSearchParams(window.location.search);

if(params.get("payment") === "success"){

document.getElementById("donationSuccessModal").style.display = "flex";

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

setupPaymentOTPInputs();

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
document.body.classList.add("no-scroll");
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

if(uploadBox && imageInput){

uploadBox.addEventListener("click", function(){
imageInput.click();
});

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

}

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

if(editingPostIndex !== null){

let posts = JSON.parse(localStorage.getItem("posts")) || [];

/* keep original time */
post.time = posts[editingPostIndex].time;

/* keep other data */
post.likes = posts[editingPostIndex].likes;
post.liked = posts[editingPostIndex].liked;
post.comments = posts[editingPostIndex].comments;
post.donations = posts[editingPostIndex].donations;

/* update post */
posts[editingPostIndex] = post;

localStorage.setItem("posts", JSON.stringify(posts));

editingPostIndex = null;

renderPosts();
closePost();
return;

}

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

let imageHTML = post.image 
? `<img src="${post.image}" class="post-image" onclick="openCommentModal(${index})">`
: "";

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

let avatar = c.avatar
? `<img src="${c.avatar}">`
: c.name.charAt(0);

return `
<div class="comment-item">

<div class="comment-avatar">
${avatar}
</div>

<div class="comment-bubble">

<strong>${c.name}</strong>

<div class="comment-text">${c.text}</div>

<div class="comment-meta">

<span class="comment-time">
${timeAgo(c.time)}
${c.edited ? " · Edited" : ""}
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

/* open modal */
openPost();

/* fill fields */
document.getElementById("postTitle").value = post.title;
document.getElementById("postDescription").value = post.description;
document.getElementById("postCategory").value = post.category;
document.getElementById("selectedCategory").textContent = post.category;

/* load image */
if(post.image){

let preview = document.getElementById("imagePreview");
let uploadText = document.getElementById("uploadText");
let removeBtn = document.getElementById("removeImageBtn");

preview.src = post.image;
preview.style.display = "block";

uploadText.style.display = "none";
removeBtn.style.display = "block";

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

<div class="comment-text" id="comment-text-${index}-${i}">
${c.text}
</div>

<div class="comment-meta">

<span class="comment-time">
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

<div onclick="editComment(${index},${i})">
<i data-lucide="edit-3"></i>
<span>Edit Comment</span>
</div>

<div onclick="deleteComment(${index},${i})">
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

function editComment(postIndex, commentIndex){

let posts = JSON.parse(localStorage.getItem("posts")) || [];

let comment = posts[postIndex].comments[commentIndex];

let textElement = document.getElementById(`comment-text-${postIndex}-${commentIndex}`);

if(!textElement) return;

let originalText = comment.text;

/* replace comment with input */
textElement.innerHTML = `
<input 
type="text" 
class="edit-comment-input"
value="${originalText}"
id="editInput-${postIndex}-${commentIndex}"
>
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
"deleteCommentModal"
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

document.getElementById("donateAmount").value = "";

document.getElementById("donateModal").style.display = "flex";

}

function closeDonate(){

document.getElementById("donateModal").style.display = "none";

}

function goPayment(){

let amount = document.getElementById("donateAmount").value;

if(!amount || amount <= 0){
return;
}

document.getElementById("donateModal").style.display = "none";

document.getElementById("paymentModal").style.display = "flex";

}

function closePayment(){

document.getElementById("paymentModal").style.display = "none";

}

function openGCash(){

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

document.getElementById("gcashModal").style.display="none";

/* reset everything */
document.getElementById("gcashPhone").value="";
document.getElementById("paymentOtpSection").style.display="none";
document.getElementById("gcashCancelInitial").style.display="block";
document.querySelectorAll(".payment-otp-input").forEach(i=>i.value="");

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

document.getElementById("paymentModal").style.display="none";
document.getElementById("bankModal").style.display="flex";

/* reset cancel button */
document.getElementById("bankCancelBtn").style.display="inline-block";

/* hide OTP section again */
document.getElementById("bankOtpSection").style.display="none";

}

function openQR(){

document.getElementById("paymentModal").style.display = "none";
document.getElementById("qrModal").style.display = "flex";

/* reset QR state */
document.getElementById("processingModal").style.display = "none";
document.getElementById("donationSuccessModal").style.display = "none";

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

/* simulate payment delay */
setTimeout(function(){

confirmDonation();

/* hide processing */
document.getElementById("processingModal").style.display="none";

/* show success modal */
document.getElementById("donationSuccessModal").style.display="flex";

},2000);

}else{

alert("Invalid OTP");

}

}

function closeDonationSuccess(){

document.getElementById("donationSuccessModal").style.display="none";

}

function confirmDonation(){

if(!paymentVerified) return;

let amount = parseInt(document.getElementById("donateAmount").value);

let posts = JSON.parse(localStorage.getItem("posts")) || [];

posts[donatePostIndex].donations += amount;

localStorage.setItem("posts", JSON.stringify(posts));

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

setTimeout(function(){

confirmDonation();

document.getElementById("processingModal").style.display="none";

document.getElementById("donationSuccessModal").style.display="flex";

},2000);

}else{

alert("Invalid OTP");

}

}

function closeBank(){

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

setupBankOTPInputs();

function closeQR(){

document.getElementById("qrModal").style.display = "none";

}
//============================================================================================

document.addEventListener("click", function(e){

/* check if click is NOT inside post menu */
if(!e.target.closest(".post-menu")){

document.querySelectorAll(".post-dropdown").forEach(menu=>{
menu.style.display = "none";
});

}

});

document.addEventListener("click", function(e){

if(e.target.classList.contains("profile-modal")){
closeTopModal();
}

if(e.target.classList.contains("comment-modal")){
closeTopModal();
}

if(e.target.classList.contains("delete-comment-modal")){
closeTopModal();
}

});

document.addEventListener("keydown", function(e){

if(e.key === "Escape"){
closeTopModal();
}

});