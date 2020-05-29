(function () {
    "use strict";

    window.onload = function () {
        if (!getCookie("token")) {
            alert("Please log in first!")
            window.location.href = "login.html";
        } else {
            initOrders();
        }
    };

    function initOrders() {
        var xhr = getAjax("user/" + getCookie("username") + "/order");
        xhr.onreadystatechange = function () {
            if (xhr.status === 200 && xhr.readyState === 4) {
                var response = JSON.parse(xhr.responseText);
                if (response.code === 20000) {
                    var orders = response.orders;
                    var products = response.products;
                    console.log(orders);
                    console.log(products);
                    var history = document.querySelector(".order_list_heading");
                    var orderList = document.querySelector(".order_list");
                    for (var i = orders.length - 1; i > -1; i--) {
                        orderList.appendChild(createOrderInstance(orders[i], products[i]));
                    }
                } else {
                    alert("Fail to access orders");
                }

            }
        }
    }

    function createOrderInstance(order, products) {
        var orderInstanceContainer = document.createElement("div");
        orderInstanceContainer.classList.add("order_item");
        var orderItemTopContainer = document.createElement("div");
        orderItemTopContainer.classList.add("order_item_top");
        var orderStatement = document.createElement("p");
        orderStatement.classList.add("order_statement");
        orderStatement.innerText = "Received";
        var dateTimeLi = document.createElement("li");

        var createTime = new Date(order['create_time'])
        var dateString =
            createTime.getFullYear() + "/" +
            ("0" + (createTime.getMonth() + 1)).slice(-2) + "/" +
            ("0" + createTime.getDate()).slice(-2) + " " +
            ("0" + createTime.getHours()).slice(-2) + ":" +
            ("0" + createTime.getMinutes()).slice(-2) + ":" +
            ("0" + createTime.getSeconds()).slice(-2);
        dateTimeLi.innerText = dateString;
        var customerLi = document.createElement("li");
        customerLi.innerText = getCookie("username");
        var orderIdLi = document.createElement("li");
        orderIdLi.innerText = "Order: " + order['order_id'];
        var payMethodLi = document.createElement("li");
        payMethodLi.innerText = "Online payment";
        var orderInfoUl = document.createElement("ul");
        orderInfoUl.classList.add("fl");
        orderInfoUl.classList.add("clearfix");
        orderInfoUl.append(dateTimeLi, customerLi, orderIdLi, payMethodLi);

        var total_price = 0.0;
        products.forEach(product => {
            var price = parseFloat(product['price'].substring(1));
            var quantity = product['quantity'];
            total_price += parseFloat(price * quantity.toFixed(2));
        });
        var totalPriceP = document.createElement("p");
        totalPriceP.classList.add("fr");
        totalPriceP.innerHTML = "TOTAL: " + "<span>$" + total_price.toFixed(2) + "</span>"
        var orderInfoContainer = document.createElement("div");
        orderInfoContainer.classList.add("order_info");
        orderInfoContainer.classList.add("clearfix");
        orderInfoContainer.append(orderInfoUl, totalPriceP);
        orderItemTopContainer.append(orderStatement, orderInfoContainer);
        orderInstanceContainer.append(orderItemTopContainer);

        products.forEach(product => {
            orderInstanceContainer.appendChild(createOrderItemInstanceList(product));
        });

        return orderInstanceContainer;
    }

    function createOrderItemInstanceList(product) {
        var orderStuffContainer = document.createElement("div");
        orderStuffContainer.classList.add("order_stuff");
        orderStuffContainer.classList.add("clearfix");
        var productImgA = document.createElement("a");
        productImgA.setAttribute("href", "product.html?id=" + product['productID']);
        productImgA.classList.add("fl")
        var productImg = document.createElement("img");
        productImg.setAttribute("src", imgUrl + product['productID'] + ".jpg");
        productImgA.append(productImg);
        var floatLeftPara = document.createElement("p");
        floatLeftPara.classList.add("fl");
        var productName = document.createElement("a");
        productName.href = "product.html?id=" + product['productID'];
        productName.innerText = product['name'];
        var soldBy = document.createElement("a");
        soldBy.innerText = "Sold by: Sage eShop";
        var priceAndQuantity = document.createElement("a");
        priceAndQuantity.innerHTML = product['price'] + " &times; " + product['quantity'];
        var buyAgain = document.createElement("a");
        buyAgain.innerHTML = "<button>Buy it again</button>";
        floatLeftPara.append(productName, soldBy, priceAndQuantity, buyAgain);
        var floatRightPara = document.createElement("p");
        floatRightPara.classList.add("fr");
        var productReview = document.createElement("a");
        productReview.innerText = "Write a product Review";
        productReview.href = "#";
        var archiveOrder = document.createElement("a");
        archiveOrder.innerText = "Archive order";
        archiveOrder.href = "#"
        floatRightPara.append(productReview, archiveOrder);
        orderStuffContainer.append(productImgA, floatLeftPara, floatRightPara);
        return orderStuffContainer;
    }
})();