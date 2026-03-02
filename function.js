
//Exemplo (Set Cookie Javascript): document.cookie = "deployment=green";
import cf from 'cloudfront';

function handler(event) {
    var request = event.request;
        
    // Nome do cookie que define a origem
    var deploymentCookieName = 'deployment';
    // Domínios das origens
    var greenOrigin = 'nf2-mobile-green.s3.us-east-1.amazonaws.com';
    var blueOrigin = 'nf2-mobile-blue.s3.us-east-1.amazonaws.com';
    
    // default (blue)
    cf.updateRequestOrigin({
        "domainName": blueOrigin
    });

    request.headers['origin'] = { value: "https://" + blueOrigin };

    if (hasValidDeploymentCookie(request.cookies[deploymentCookieName], "green")) {
        cf.updateRequestOrigin({
            "domainName": greenOrigin
        });

        request.headers['origin'] = { value: "https://" + greenOrigin };
    }

    return request;
}

function hasValidDeploymentCookie(deploymentCookie, deployment) {
    return (deploymentCookie && deploymentCookie.value === deployment)
}