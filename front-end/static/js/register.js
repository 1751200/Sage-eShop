(function () {
    "use strict";

    var error_name = false;
    var error_password = false;
    var error_check_password = false;
    var error_email = false;
    var error_agreement = false;

    window.onload = function () {
        this.document.getElementById("user_name").onblur = validateUserName;
        this.document.getElementById("email").onblur = validateEmail;
        this.document.getElementById("pwd").onblur = validatePwd;
        this.document.getElementById("cpwd").onblur = validateCpwd;
        this.document.getElementById("allow").onclick = checkAgreement;
        this.document.getElementById("register_submit").onclick = register;
    };

    function validateUserName() {
        var userName = document.getElementById("user_name");
        var len = userName.value.length;
        if (len < 5 || len > 20) {
            userName.nextElementSibling.innerHTML = "Username is restricted to 5-20 characters";
            userName.nextElementSibling.style.display = "block";
            error_name = true;
        } else {
            userName.nextElementSibling.style.display = "none";
            error_name = false;
        }
    }

    function validateEmail() {
        var re = /^[a-z0-9][\w\.\-]*@[a-z0-9\-]+(\.[a-z]{2,5}){1,2}$/;
        var email = document.getElementById("email");
        if (!re.test(email.value)) {
            email.nextElementSibling.innerHTML = "Incorrect email address";
            email.nextElementSibling.style.display = "block";
            error_email = true;
        } else {
            email.nextElementSibling.style.display = "none";
            error_email = false;
        }
    }

    function validatePwd() {
        var password = document.getElementById("pwd");
        var len = password.value.length;
        if (len < 8 || len > 20) {
            password.nextElementSibling.innerHTML = "Password is restricted to 8-20 characters";
            password.nextElementSibling.style.display = "block";
            error_password = true;
        } else {
            password.nextElementSibling.style.display = "none";
            error_password = false;
        }
    }

    function validateCpwd() {
        var password = document.getElementById("pwd").value;
        var checkPassword = document.getElementById("cpwd");
        var cpassword = checkPassword.value;

        if (password != cpassword) {
            checkPassword.nextElementSibling.innerHTML("The two passwords are inconsistent");
            checkPassword.nextElementSibling.style.display = "block";
            error_check_password = true;
        } else {
            checkPassword.nextElementSibling.style.display = "none";
            error_check_password = false;
        }
    }

    function checkAgreement() {
        var agreement = document.getElementById("allow");
        if (agreement.checked === false) {            
            agreement.parentNode.getElementsByTagName('span')[0].innerHTML = "Please check agreement";
            agreement.parentNode.getElementsByTagName('span')[0].style.display = "block";
            error_agreement = true;
        } else {
            agreement.parentNode.getElementsByTagName('span')[0].style.display = "none";
            error_agreement = false;
        }
    }

    function register() {
        validateUserName();
        validateEmail();
        validatePwd();
        validateCpwd();
        checkAgreement();

        var userName = document.getElementById("user_name").value;
        var email = document.getElementById("email").value;
        var password = document.getElementById("pwd").value;

        if (!error_name && !error_email && !error_password && !error_check_password && !error_agreement) {
            var xhr = postAjax("user/register", { "username": userName, "password": password, "email": email });
            xhr.onreadystatechange = function () {
                if (xhr.status === 200 && xhr.readyState === 4) {
                    var response = JSON.parse(xhr.responseText);
                    if (response.code === 20000) {
                        window.location.href = "login.html";
                        alert("Registration completed successfully.");
                    } else {
                        alert(response.message);
                    }
                }
            }
        }
    }
})();