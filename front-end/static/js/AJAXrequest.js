baseUrl = "http://101.37.34.56:3000/"
imgUrl = "../static/img/products/"

function getCookie(cookieName) {
    var allcookies = document.cookie;
    //索引长度，开始索引的位置
    var cookiePos = allcookies.indexOf(cookieName);

    // 如果找到了索引，就代表cookie存在,否则不存在
    if (cookiePos !== -1) {
        // 把cookiePos放在值的开始，只要给值加1即可
        //计算取cookie值得开始索引，加的1为“=”
        cookiePos = cookiePos + cookieName.length + 1;
        //计算取cookie值得结束索引
        var cookie_end = allcookies.indexOf(";", cookiePos);

        if (cookie_end === -1) {
            cookie_end = allcookies.length;
        }
        //得到想要的cookie的值
        var value = unescape(allcookies.substring(cookiePos, cookie_end));
    }
    return value;
}

function setCookie(cookieName, value, expires) {
    if (expires) {
        var date = new Date();
        date.setDate(date.getDate() + expires);
        document.cookie = cookieName + "=" + value + ";expires=" + date.toUTCString();
    } else {
        document.cookie = cookieName + "=" + value;
    }
}

function clearCookie(cookieName) {
    if (document.cookie.length > 0) {
        if (document.cookie.indexOf((cookieName + "=")) !== -1) {
            var date = new Date();
            date.setDate(date.getDate() - 1);
            document.cookie = cookieName + "=" + getCookie(cookieName) + ";expires=" + date.toUTCString();
        }
    }
}
function getAjax(url) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", baseUrl + url);
    xhr.withCredentials = true;
    xhr.setRequestHeader("Content-type", "application/json;charset-UTF-8");
    console.log("user token");
    var token = getCookie("token");
    if (token) {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
    }
    xhr.send(null);
    return xhr;
}
function postAjax(url, data) {
    var xhr = new XMLHttpRequest();
    xhr.open("post", baseUrl + url);
    xhr.withCredentials = true;
    xhr.setRequestHeader("Content-type", "application/json;charset-UTF-8");
    console.log("user token");
    var token = getCookie("token");
    if (token) {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
    }
    xhr.send(JSON.stringify(data));
    return xhr;
}
function putAjax(url, data) {
    var xhr = new XMLHttpRequest();
    xhr.open("put", baseUrl + url);
    xhr.withCredentials = true;
    xhr.setRequestHeader("Content-type", "application/json;charset-UTF-8");
    console.log("user token");
    var token = getCookie("token");
    if (token) {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
    }
    xhr.send(JSON.stringify(data));
    return xhr;
}
function deleteAjax(url, data) {
    var xhr = new XMLHttpRequest();
    xhr.open("delete", baseUrl + url);
    xhr.withCredentials = true;
    xhr.setRequestHeader("Content-type", "application/json;charset-UTF-8");
    console.log("user token");
    var token = getCookie("token");
    if (token) {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
    }
    xhr.send(JSON.stringify(data));
    return xhr;
}