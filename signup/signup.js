document.getElementById('signInBtn').addEventListener('click', function() {
    document.getElementById('signInForm').classList.add('active');
    document.getElementById('signUpForm').classList.remove('active');
    document.getElementById('signInBtn').classList.add('active');
    document.getElementById('signUpBtn').classList.remove('active');
});

document.getElementById('signUpBtn').addEventListener('click', function() {
    document.getElementById('signInForm').classList.remove('active');
    document.getElementById('signUpForm').classList.add('active');
    document.getElementById('signInBtn').classList.remove('active');
    document.getElementById('signUpBtn').classList.add('active');
});
