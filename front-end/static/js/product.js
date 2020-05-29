var productID;

window.onload = function () {
    initHeader();
    this.document.querySelector(".sub").onclick = this.onSubClick;
    this.document.querySelector(".add").onclick = this.onAddClick;
    this.document.querySelector(".buy").parentNode.onclick = buyNow;
    this.document.querySelector(".cart").parentNode.onclick = addToCart;

    this.productID = UrlParm().parm("id");
    var xhr = new this.XMLHttpRequest();
    xhr.open("get", baseUrl + "product/" + productID);
    xhr.send(null);
    xhr.onreadystatechange = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            var response = JSON.parse(xhr.responseText);
            var data = response.data;
            document.getElementById("product_image").setAttribute("src", imgUrl + data.image);
            document.querySelector(".title h2").innerText = data.name;
            document.querySelector(".title span").innerText = data.price;
            document.querySelector(".title p").innerText = data.description;
        }
    }
}

function onSubClick() {
    // var num = parseInt(this.nextElementSibling.innerHTML);
    var quantity = document.getElementById("quantity");
    var num = quantity.innerText;
    if (num <= 1) {
        this.setAttribute("disabled", "disabled");
    } else {
        quantity.innerText = --num;
    }
}

function onAddClick() {
    // var num = parseInt(this.previousElementSibling.innerHTML);
    var quantity = document.getElementById("quantity");
    var num = quantity.innerText;
    if (num >= 5) {
        alert("The number of the goods is limited to 5 per purchase");
    } else {
        quantity.innerText = ++num;
    }
}

function buyNow() {
    if (getCookie("token")) {
        var quantity = parseInt(document.querySelector(".num span").innerText);
        var price = parseFloat(document.querySelector(".title span").innerText.substring(1));
        var data = {
            "productID": productID,
            "quantity": quantity,
        }
        var xhr = new XMLHttpRequest();
        xhr.open("post", baseUrl + "user/" + getCookie("username") + "/cart");
        xhr.withCredentials = true;
        xhr.setRequestHeader("Content-type", "application/json;charset-UTF-8");
        xhr.setRequestHeader("Authorization", "Bearer " + getCookie("token"));
        xhr.send(JSON.stringify(data));
        xhr.onreadystatechange = function () {
            if (xhr.status === 200 && xhr.readyState === 4) {
                var response = JSON.parse(xhr.responseText);
                window.location.href = "cart.html";
            }
        }
    } else {
        if (confirm("Please log into your account first")) {
            window.location.href = "login.html";
        }
    }
}

function addToCart() {
    if (getCookie("token")) {
        var quantity = parseInt(document.querySelector(".num span").innerText);
        var price = parseFloat(document.querySelector(".title span").innerText.substring(1));
        var data = {
            "productID": productID,
            "quantity": quantity,
        }
        var xhr = new XMLHttpRequest();
        xhr.open("post", baseUrl + "user/" + getCookie("username") + "/cart");
        xhr.withCredentials = true;
        xhr.setRequestHeader("Content-type", "application/json;charset-UTF-8");
        xhr.setRequestHeader("Authorization", "Bearer " + getCookie("token"));
        xhr.send(JSON.stringify(data));
        xhr.onreadystatechange = function () {
            if (xhr.status === 200 && xhr.readyState === 4) {
                var response = JSON.parse(xhr.responseText);
                alert(response.message);
            }
        }
    } else {
        if (confirm("Please log into your account first")) {
            window.location.href = "login.html";
        }
    }
}