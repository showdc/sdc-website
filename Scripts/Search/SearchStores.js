function onSuccess(response) {
    $("#SearchResult").html(response);
};

function onErrorCall() {
    console.log("An error occurred while searching for stores!");
};

function SearchStores(params) {
    var url = "/Rendering/Directory/SearchShops";
    $.ajax({
        type: "POST",
        url: url,
        contentType: "application/json",
        data: JSON.stringify(params),
        success: onSuccess,
        error: onErrorCall
    });
};

//function SearchStores(params) {
//    var url = "/Rendering/Directory/Index";
//    $.ajax({
//        type: "POST",
//        url: url,
//        contentType: "application/json",
//        data: JSON.stringify(params),
//        success: onSuccess,
//        error: onErrorCall
//    });
//};

function GetUrlParams() {
    var urlParams = [], hash;
    var q = document.URL.split('?')[1];
    if (q != undefined) {
        q = q.split('&');
        for (var i = 0; i < q.length; i++) {
            hash = q[i].split('=');
            urlParams.push(hash[1]);
            urlParams[hash[0]] = hash[1];
        }
    }
    return urlParams;
};
