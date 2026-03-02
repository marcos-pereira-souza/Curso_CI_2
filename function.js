

//document.cookie = "deployment=green";
import cf from 'cloudfront';

function handler(event) {
    var request = event.request;
        
    var deploymentCookieName = 'deployment';

    // Domínios das origens
    var greenOrigin = 'nf2-mobile-green.s3.us-east-1.amazonaws.com';
    var blueOrigin = 'nf2-mobile-blue.s3.us-east-1.amazonaws.com';
    
    // default (blue)
    cf.updateRequestOrigin({
        "domainName": blueOrigin
    });

    request.headers['origin'] = { value: blueOrigin };

    if (hasValidDeploymentCookie(request.cookies[deploymentCookieName], "green")) {
        cf.updateRequestOrigin({
            "domainName": greenOrigin
        });

        request.headers['origin'] = { value: greenOrigin };
    }

    return request;
}

function hasValidDeploymentCookie(deploymentCookie, deployment) {
    // if the value exists and it matches pathSegment
    return (deploymentCookie && deploymentCookie.value === deployment)
}