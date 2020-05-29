window.onload = function () {
    initHeader();

    var xhr = new this.XMLHttpRequest();
    xhr.open("get", baseUrl + "product/info");
    xhr.send(null);
    xhr.onreadystatechange = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            var response = JSON.parse(xhr.responseText);
            var data = response.data;
            var i = 0;
            document.querySelectorAll(".product").forEach(product => {
                product.setAttribute("href", "product.html?id=" + data[i].productID);
                product.getElementsByTagName("img")[0].setAttribute("src", "../static/img/products/" + data[i].image);
                product.getElementsByTagName("dd")[0].innerText = data[i].name;
                product.getElementsByTagName("dd")[1].innerText = data[i++].price;
            });
        }
    }
}