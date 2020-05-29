(function () {
    "use strict";

    var error_name = false;
    var error_password = false;

    window.onload = function () {
        this.document.getElementById("user_name").onblur = validateUserName;
        this.document.getElementById("pwd").onblur = validatePwd;
        this.document.getElementById("login_submit").onclick = login;
    }

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

    function login() {
        validateUserName();
        validatePwd();

        var username = document.getElementById("user_name").value;
        var password = document.getElementById("pwd").value;

        if (!error_name && !error_password) {
            var xhr = postAjax("user/login", { "username": username, "password": password });
            xhr.onreadystatechange = function () {
                if (xhr.status === 200 && xhr.readyState === 4) {
                    var response = JSON.parse(xhr.responseText);
                    var data = response.data;
                    if (response.code === 20000) {
                        setCookie("token", data.token);
                        setCookie("username", data.username);
                        window.location.href = "index.html";
                    } else {
                        alert(response.message);
                    }
                }
            }
        }
    }
})();