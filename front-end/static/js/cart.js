(function () {
    "use strict";

    window.onload = function () {
        initItems();

        if (!getCookie("token")) {
            alert("Please log in first!");
            window.location.href = "login.html";
        }

        this.document.querySelectorAll(".sub").forEach(s => {
            s.onclick = onSubClick;
        });
        this.document.querySelectorAll(".add").forEach(a => {
            a.onclick = onAddClick;
        });
        this.document.querySelectorAll("input[type='checkbox']").forEach(c => {
            c.onclick = onCheckClick;
        });
        this.document.querySelector(".del").onclick = deleteItems;
        this.document.getElementById("checkout").onclick = onCheckOutClick;
    };

    function initItems() {
        var xhr = getAjax("user/" + getCookie("username") + "/cart");
        xhr.onreadystatechange = function () {
            if (xhr.status === 200 && xhr.readyState === 4) {
                var response = JSON.parse(xhr.responseText);
                var data = response.data;
                console.log(data)
                data.forEach(item => {
                    let cartItem = document.getElementById(item.productID);
                    cartItem.classList.remove("hide");
                    cartItem.querySelector(".cart_item_name a").innerText = item.name;
                    cartItem.querySelector(".product_quantity span").innerText = item.quantity;
                    cartItem.querySelector('.cart_item_price').innerText = item.price;
                    cartItem.querySelector('.cart_item_total').innerText = "$" + (parseFloat(item.price.substring(1)) * parseInt(item.quantity)).toFixed(2);
                });
                if (document.querySelectorAll(".cart_item.hide").length == document.querySelectorAll(".cart_item").length) {
                    document.querySelector(".goOn").style.display = "block";
                }
            } 
        }
    }

    function onSubClick() {
        var num = parseInt(this.nextElementSibling.innerHTML);
        if (num <= 1) {
            this.setAttribute("disabled", "disabled");
        } else {
            this.nextElementSibling.innerHTML = --num;
            var data = {
                "productID": this.parentNode.parentNode.parentNode.parentNode.id,
                "quantity": num
            }
            var xhr = putAjax("user/" + getCookie('username') + "/cart", data);
            var price = this.parentNode.parentNode.parentNode.previousElementSibling.innerHTML.substring(1);
            this.parentNode.parentNode.parentNode.nextElementSibling.innerHTML = "$" + (num * price).toFixed(2);
            calculateTotal();
            countNum();
        }
    }

    function onAddClick() {
        var num = parseInt(this.previousElementSibling.innerHTML);
        this.previousElementSibling.innerHTML = ++num;
        var data = {
            "productID": this.parentNode.parentNode.parentNode.parentNode.id,
            "quantity": num
        }
        var xhr = putAjax("user/" + getCookie('username') + "/cart", data);
        var price = this.parentNode.parentNode.parentNode.previousElementSibling.innerHTML.substring(1);
        this.parentNode.parentNode.parentNode.nextElementSibling.innerHTML = "$" + (num * price).toFixed(2);
        calculateTotal();
        countNum();
    }

    function calculateTotal() {
        var total = 0;
        var checkedItems = document.querySelectorAll(".cart_item input[type='checkbox']:checked");
        var len = checkedItems.length;
        if (len == 0) {
            document.getElementById("total").innerHTML = "$" + parseFloat(0).toFixed(2);
        } else {
            checkedItems.forEach(element => {
                total += parseFloat(element.parentNode.parentNode.parentNode.querySelector(".cart_item_total").innerHTML.substring(1));
            });
            document.getElementById("total").innerHTML = "$" + total.toFixed(2);
        }
    }

    function countNum() {
        var total = 0;
        var checkedItems = document.querySelectorAll(".cart_item input[type='checkbox']:checked");
        var len = checkedItems.length;
        if (len == 0) {
            document.getElementById("total_item").innerHTML = 0;
            document.getElementById("checkout").style.background = "#8e8e8e";
        } else {
            checkedItems.forEach(element => {
                total += parseInt(element.parentNode.parentNode.parentNode.querySelector(".product_quantity span").innerText);
            });
            document.getElementById("total_item").innerHTML = total;
            document.getElementById("checkout").style.background = "#c10000";
        }
    }

    function onCheckClick() {
        if (this.checked) {
            if (this.classList.contains("checkAll")) {
                document.querySelectorAll("input[type='checkbox']").forEach(cbx => {
                    if (!cbx.parentNode.parentNode.parentNode.classList.contains("hide")) {
                        cbx.checked = true;
                    }
                });
            } else {
                var len_checked = document.querySelectorAll("input[type='checkbox']:checked").length;                
                var len_total = document.querySelectorAll("input[type='checkbox']").length - document.querySelectorAll(".cart_item.hide").length - 1;
                console.log(len_checked, len_total);
                if (len_checked == len_total) {
                    document.querySelector(".checkAll").checked = true;
                }
            }
        } else {
            if (this.classList.contains("checkAll")) {
                document.querySelectorAll("input[type='checkbox']").forEach(cbx => {
                    cbx.checked = false;
                });
            } else {
                document.querySelector(".checkAll").checked = false;
            }
        }
        calculateTotal();
        countNum();
    }

    function deleteItems() {
        var checkedItems = document.querySelectorAll(".cart_item input[type='checkbox']:checked");
        if (checkedItems.length == 0) {
            window.alert("Nothing to delete.")
        } else {
            if (confirm("Want to delete all the selected items?")) {
                checkedItems.forEach(item => {
                    // TODO: backend
                    let productID = item.parentNode.parentNode.parentNode.id;
                    var xhr = deleteAjax("user/" + getCookie('username') + "/cart", {'productID': productID});
                    xhr.onreadystatechange = function () {
                        if (xhr.status === 200 && xhr.readyState === 4) {
                            var response = JSON.parse(xhr.responseText);
                            item.checked = false;
                            calculateTotal();
                            countNum();
                            item.parentNode.parentNode.parentNode.classList.add("hide");
                            if (document.querySelectorAll(".cart_item.hide").length == document.querySelectorAll(".cart_item").length) {
                                document.querySelector(".goOn").style.display = "block";
                            }
                            alert(response.message);
                        }
                    };
                });
            }
        }
    }

    function onCheckOutClick() {
        var productIDs = [];
        var checkedItems = document.querySelectorAll(".cart_item input[type='checkbox']:checked");
        if (checkedItems.length == 0) {
            window.alert("Nothing to check out.")
        } else {
            console.log("start to checkout")
            checkedItems.forEach(item => {
                productIDs.push(item.parentNode.parentNode.parentNode.id);
            });
            var xhr = postAjax("user/" + getCookie('username') + "/order", productIDs);
            xhr.onreadystatechange = function () {
                if (xhr.status === 200 && xhr.readyState === 4) {
                    var response = JSON.parse(xhr.responseText);
                    if (response.code === 20000) {
                        window.location.href = "order.html";
                    } else {
                        alert(response.message);
                    }
                }
            };
            // productIDs.forEach(productID => {
            //     deleteAjax("user/" + getCookie('username') + "/cart", { 'productID': productID });
            // });
        }
    }
})();