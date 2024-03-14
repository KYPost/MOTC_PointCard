//#region - PARAMETER -
var cookieKey = "UserData";
var parameterKey = ["Collection", "Prize"];
var dataKeyArray = [["1", "2", "3", "4"], ["prize"]];
//#endregion

//#region - USER STATUS -
var UserStatus = {
    FirstVisit: 0,
    Collect: 1,
    Exchange: 2,
}
//#endregion

//#region - DATA -
var Data = {
    status: UserStatus.FirstVisit,
    collections: new Array(dataKeyArray[0].length).fill(false),
    newCollectedIndex: -1,
    prizes: new Array(dataKeyArray[1].length).fill(false),
    newExchangedIndex: -1,
}
//#endregion

//#region - WEBSITE URL -
var WebsiteURL = "https://motcnetzerocityexpo.tw/";
//#endregion

// get data
var data = GetCookie(cookieKey);
console.log("data => " + DataToString(data));
// update collection data
var collectionParameter = GetURLParameter(parameterKey[0]);
for (var i = 0; i < dataKeyArray[0].length; i++) {
    if (collectionParameter == dataKeyArray[0][i]) {
        if (!data.collections[i]) {
            data.newCollectedIndex = i;
            data.collections[i] = true;
        }
        break;
    }
}
// update prize data
if (data.status == UserStatus.Exchange) {
    var prizeParameter = GetURLParameter(parameterKey[1]);
    for (var i = 0; i < dataKeyArray[1].length; i++) {
        if (prizeParameter == dataKeyArray[1][i]) {
            if (!data.prizes[i]) {
                data.newExchangedIndex = i;
                data.prizes[i] = true;
            }            
            break;
        }
    }
}

console.log("updated data => " + DataToString(data));
// save data
var dataString = JSON.stringify(data);
console.log("updated cookie => " + dataString);
SetCookie(cookieKey, dataString);
// load website
EntryTargetWebsite(WebsiteURL);

function GetCookie(key) {
    var data = Data;
    var decodedCookie = decodeURIComponent(document.cookie);

    console.log("Cookie => " + decodedCookie);

    var cookies = decodedCookie.split('; ');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].split("=");
        // cookie[0] = cookieKey, cookie[1] = cookieValue
        if (cookie[0] = key && cookie[1] != null) {
            var cookieData = JSON.parse(cookie[1]);
            data.status = cookieData.status;

            for (var i = 0; i < data.collections.length; i++){
                data.collections[i] = cookieData.collections[i];
            }
            for (var i = 0; i < data.prizes.length; i++) {
                data.prizes[i] = cookieData.prizes[i];
            }
        }
    }
    return data;
}

function GetURLParameter(key) {
    var url = document.URL;
    var index = url.indexOf("?");
    if (index != -1) {
        var decodedParameter = url.split("?")[1];
        var parameters = decodedParameter.split("&");
        for (var i = 0; i < parameters.length; i++) {
            var parameter = parameters[i].split("=");
            if (parameter[0] = key) {
                return parameter[1];
            }
        }
    }
    return "Null";
}

function SetCookie(key, value) {
    var cookie = key + "=" + value;
    var date = new Date();
    date.setTime(date.getTime() + (3 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + date.toUTCString();
    document.cookie = cookie + "; " + expires + "; path=/";
}

function DataToString(data)
{
    var str ="{\n"+
            "status: " + data.status + "\n" +
            "collection: " + data.collections + "\n" +
            "isNewCollected: " + data.isNewCollected + "\n" +
            "prize: " + data.prizes + "\n"+
            "}";
    return str;
}

function EntryTargetWebsite(url) {
    if (url != "")
        window.location.replace(url);
}