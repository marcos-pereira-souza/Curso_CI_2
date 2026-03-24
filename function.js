function handler(event) {
    var request = event.request;
    
    const deploymentCookieName = 'deployment';

    const baseUrlBlue = "https://mobilepf-blue.cloud.itau.com.br";
    const baseUrlGreen = "https://mobilepf-green.cloud.itau.com.br";

    let redirectUrl = hasCookieValue(request.cookies[deploymentCookieName], 'green') ? baseUrlGreen : baseUrlBlue;

    redirectUrl += replacePrefixRolloutService(request.uri);

    if (Object.keys(request.querystring).length) {
        let qs = [];
        for (let key in request.querystring) {
            if (request.querystring[key].multiValue) {
                request.querystring[key].multiValue.forEach(mv => qs.push(key + "=" + mv.value));
            } else {
                qs.push(key + "=" + request.querystring[key].value);
            }
        }
    
        redirectUrl += '?' + qs.join('&');
    }  
         
    return {
        statusCode: 302,
        statusDescription: 'Found',
        headers:  {
            "location": { "value": redirectUrl } 
        }
    };
}

function hasCookieValue(cookie, expectedValue) {
    return cookie && cookie.value === expectedValue;
}

function replacePrefixRolloutService(uri) {
    return uri.replace('/webview/rs/', '/webview/');
}