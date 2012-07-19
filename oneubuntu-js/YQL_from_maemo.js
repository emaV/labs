// u1.js
// https://garage.maemo.org/plugins/ggit/browse.php/?p=ubi;a=blob;f=qml/ubi/u1.js.autosave;h=237b2f64761801df06e4ed5280d0c2a0654e9a94;hb=9258f43ecdca38297659820679a07b3f21fe6ffd

// Include the OAuth libraries from oauth.net
y.include("http://oauth.googlecode.com/svn/code/javascript/oauth.js");
y.include("http://oauth.googlecode.com/svn/code/javascript/sha1.js");

function getToken(user, pass) {
  var token_name = "Ubuntu One @test";
  var url = "https://login.ubuntu.com/api/1.0/authentications";
  var uri = url + "?ws.op=authenticate&token_name=" + encodeURIComponent(token_name);
  var header_auth = 'Basic ' + base64_encode(email + ':' + pwd);

  // Get authentication
  var resp = y.rest(uri).header('Accept', 'application/xml').header('Authorization', header_auth).get().response;

  var secrets = {
    consumerKey: resp.consumer_key,
    consumerSecret: resp.consumer_secret,
    token: resp.token,
    tokenSecret: resp.secret
  };

  registerToken(secrets, user);
}

function registerToken(secrets, user) {
  var url = "https://one.ubuntu.com/oauth/sso-finished-so-get-tokens/" + user;
  return oAuthRequest(url,secrets);
/*
    var xhr = oAuthRequest(url,secrets);
    xhr.onreadystatechange = function() {
                if(xhr.readyState===4) {
                    if(xhr.status>=400) {
                        //console.log(xhr.responseText);
                        root.onErr(xhr.status);
                    } else {
                        //root.onResp(secrets);
                        //console.log(xhr.responseText);
                        getAccount(secrets,root);
                    }
                }
            }
    xhr.send();
*/
}

function oAuthRequest(url, secrets, method, range) {

  var accessor = {
      consumerKey: secrets.consumer_key,
      consumerSecret: secrets.consumer_secret,
      token: secrets.token,
      tokenSecret: secrets.secret
  };
  if(!method) method = "GET";
  var message = {
      action: url,
      method: method,
      parameters: [
          ["oauth_consumer_key", accessor.consumerKey],
          ["oauth_token", accessor.token],
          ["oauth_version", "1.0"]
      ]
  };

  OAuth.setTimestampAndNonce(message);
  OAuth.SignatureMethod.sign(message, accessor);
  var auth = OAuth.getAuthorizationHeader("", message.parameters);
/*
  var xhr = new XMLHttpRequest();
  xhr.open(method,url,true);
  xhr.setRequestHeader("Authorization",auth);
  if(range) xhr.setRequestHeader("Range",range);
  return xhr;
*/
  var resp = y.rest(url).header('Authorization', auth).get().response;

  return resp;


}

function oAuthHeader(url,secrets,method)
{
    var accessor = {
        consumerKey: secrets.consumer_key,
        consumerSecret: secrets.consumer_secret,
        token: secrets.token,
        tokenSecret: secrets.secret
    };
    if(!method) method = "GET";
    var message = {
        action: url,
        method: method,
        parameters: [
            ["oauth_consumer_key",accessor.consumerKey],
            ["oauth_token",accessor.token],
            ["oauth_version","1.0"]
        ]
    };
    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message,accessor);
    return OAuth.getAuthorizationHeader("",message.parameters);
}

function getAccount(secrets,root)
{
    var url = "https://one.ubuntu.com/api/account/";
    var xhr = oAuthRequest(url,secrets);
    //console.log("getAccount");
    xhr.onreadystatechange = function() {
                if(xhr.readyState===4) {
                    if(xhr.status>=400||xhr.status===0) {
                        //console.log(xhr.status);
                        //console.log(xhr.responseText);
                        //console.log("getAccount: err");
                        root.onErr(xhr.status);
                    } else {
                        //console.log(xhr.responseText);
                        //console.log("getAccount: ok");
                        var account = eval('('+xhr.responseText+')');
                        root.onResp(secrets,account);
                    }
                }
            }
    xhr.send();
}

function getFiles(secrets,rootNode,root)
{
    var url = "https://one.ubuntu.com/api/file_storage/v1"
            +encodeURI(rootNode)+"/?include_children=true";
    //console.log("url: "+url);
    var xhr = oAuthRequest(url,secrets);
    xhr.onreadystatechange = function() {
                if(xhr.readyState===4) {
                    if(xhr.status>=400||xhr.status===0) {
                        root.onErr(xhr.status);
                    } else {
                        //console.log(xhr.responseText);
                        //console.log("");
                        //console.log(xhr.getAllResponseHeaders());
                        var resp = eval('('+xhr.responseText+')');
                        var nodes = resp.children;
                        root.onResp(nodes);
                    }
                }
            }
    xhr.send();
}

function getRootNode(secrets,root)
{
    var url = "https://one.ubuntu.com/api/file_storage/v1";
    var xhr = oAuthRequest(url,secrets);
    xhr.onreadystatechange = function() {
                if(xhr.readyState===4) {
                    if(xhr.status>=400||xhr.status===0) {
                        //console.log(xhr.status);
                        root.onErr(xhr.status);
                    } else {
                        //console.log(xhr.responseText);
                        var resp = eval('('+xhr.responseText+')');
                        root.onRespRootNode(resp);
                    }
                }
            }
    xhr.send();
}

function getFileTree(secrets,root)
{
    var url = "https://one.ubuntu.com/api/file_storage/v1";
    var xhr = oAuthRequest(url,secrets);
    xhr.onreadystatechange = function() {
                if(xhr.readyState===4) {
                    if(xhr.status>=400||xhr.status===0) {
                        //console.log(xhr.status);
                        root.onErr(xhr.status);
                    } else {
                        //console.log(xhr.responseText);
                        var resp = eval('('+xhr.responseText+')');
                        var rootNode = resp.root_node_path;
                        getFiles(secrets,rootNode,root);
                    }
                }
            }
    xhr.send();
}

function renameFile(secrets,resourcePath,targetPath,root)
{
    var url = "https://one.ubuntu.com/api/file_storage/v1"+encodeURI(resourcePath);
    //console.log("url: "+url);
    //console.log("target: "+encodeURI(targetPath));
    //console.log("target: "+targetPath);
    var xhr = oAuthRequest(url,secrets,"PUT");
    xhr.setRequestHeader("Content-Type","application/json");
    //var body = '{"path":"'+encodeURI(targetPath)+'"}';
    var body = '{"path":"'+targetPath+'"}';
    //console.log("body: "+body);
    xhr.onreadystatechange = function() {
                if(xhr.readyState===4) {
                    if(xhr.status>=400||xhr.status===0) {
                        console.log("status: "+xhr.status);
                        //console.log(xhr.responseText);
                        root.onErrRename(xhr.status);
                    } else {
                        //console.log("status: "+xhr.status);
                        //console.log(xhr.responseText);
                        var resp = eval('('+xhr.responseText+')');
                        //console.log(resp);
                        root.onRespRename(resp);
                    }
                }
            }

    xhr.send(body);
}

function stopPublishing(secrets,resourcePath,root)
{
    var url = "https://one.ubuntu.com/api/file_storage/v1"+encodeURI(resourcePath);
    var xhr = oAuthRequest(url,secrets,"PUT");
    xhr.setRequestHeader("Content-Type","application/json");
    var body = '{"is_public":false}';
    xhr.onreadystatechange = function() {
                if(xhr.readyState===4) {
                    if(xhr.status>=400||xhr.status===0) {
                        //console.log("status: "+xhr.status);
                        //console.log(xhr.responseText);
                        root.onErrStopPublishing(xhr.status);
                    } else {
                        //console.log("status: "+xhr.status);
                        //console.log(xhr.responseText);
                        var resp = eval('('+xhr.responseText+')');
                        //console.log(resp);
                        root.onRespStopPublishing(resp);
                    }
                }
            }
    xhr.send(body);
}

function startPublishing(secrets,resourcePath,root)
{
    var url = "https://one.ubuntu.com/api/file_storage/v1"+encodeURI(resourcePath);
    var xhr = oAuthRequest(url,secrets,"PUT");
    xhr.setRequestHeader("Content-Type","application/json");
    var body = '{"is_public":true}';
    xhr.onreadystatechange = function() {
                if(xhr.readyState===4) {
                    if(xhr.status>=400||xhr.status===0) {
                        //console.log("status: "+xhr.status);
                        //console.log(xhr.responseText);
                        root.onErrStartPublishing(xhr.status);
                    } else {
                        //console.log("status: "+xhr.status);
                        //console.log(xhr.responseText);
                        var resp = eval('('+xhr.responseText+')');
                        //console.log(resp);
                        root.onRespStartPublishing(resp);
                    }
                }
            }
    xhr.send(body);
}

function newFolder(secrets,resourcePath,root)
{
    var url = "https://one.ubuntu.com/api/file_storage/v1"+encodeURI(resourcePath);
    //console.log("url: "+url);
    var xhr = oAuthRequest(url,secrets,"PUT");
    xhr.setRequestHeader("Content-Type","application/json");
    var body = '{"kind": "directory"}';
    //console.log("body: "+body);
    xhr.onreadystatechange = function() {
                if(xhr.readyState===4) {
                    if(xhr.status>=400||xhr.status===0) {
                        //console.log("status: "+xhr.status);
                        //console.log(xhr.responseText);
                        root.onErrNew(xhr.status);
                    } else {
                        //console.log("status: "+xhr.status);
                        //console.log(xhr.responseText);
                        root.onRespNew();
                    }
                }
            }

    xhr.send(body);
}

function deleteFile(secrets,resourcePath,root,utils)
{
    var urlA = "https://one.ubuntu.com/api/file_storage/v1"+encodeURI(resourcePath);
    var url = "https://one.ubuntu.com/api/file_storage/v1"+resourcePath;
    //console.log("u1.js:delete url="+url);
    var auth = oAuthHeader(urlA,secrets,"DELETE");
    utils.deleteFile(url,auth);
}

function getFileContentType(secrets,root,path)
{
    //var url = "https://one.ubuntu.com/api/file_storage/v1"+encodeURI(path);
    var url = "https://files.one.ubuntu.com"+encodeURI(path);
    //console.log("url: "+url);
    var xhr = oAuthRequest(url,secrets,"GET","bytes=0-10");
    xhr.onreadystatechange = function() {
                console.log("readyState: "+xhr.readyState);
                if(xhr.readyState===4) {
                    if(xhr.status>=400||xhr.status===0) {
                    } else {
                        var filename;
                        var ind = path.lastIndexOf("/");
                        if(ind>=0) {
                            filename = path.substr(ind+1);
                        }  else {
                            filename = path;
                        }
                        var type = xhr.getResponseHeader("content-type");
                        //console.log("filename: "+filename+" type: "+type);
                        root.setContentType(type);
                    }
                }
            }
    xhr.send();
}

function fixFilename(path) {
    path = path.toString();
    //console.log(path);
    var ind = path.lastIndexOf("/");
    if(ind>=0) {
        path = path.substr(ind+1);
    }
    if(path=="") path = "/";

    return path;
}

function fixFolder(path) {
    path = path.toString();
    //console.log(path);
    var ind = path.lastIndexOf("file://");
    if(ind>=0) {
        path = path.substr(ind+7);
    }
    if(path=="") path = "/";

    return path;
}

function getFileContent(secrets,root,path,folder,size,utils)
{
    //var url = "https://one.ubuntu.com/api/file_storage/v1"+encodeURI(path);

    var url = "https://files.one.ubuntu.com"+path;
    var urlA = "https://files.one.ubuntu.com"+encodeURI(path);

    var filename = fixFilename(path);
    var ffolder = fixFolder(folder);
    //console.log("url: "+url);
    //console.log("ffolder: "+ffolder);
    var auth = oAuthHeader(urlA,secrets,"GET");
    //console.log("auth: "+auth);
    utils.downloadFile(ffolder,filename,url,size,auth);
}

function uploadFile(secrets,root,path,filename,folder,utils)
{
    //var url = "https://one.ubuntu.com/api/file_storage/v1"+encodeURI(path);
    //var url = "https://files.one.ubuntu.com"+path;

    var url = "https://files.one.ubuntu.com"+path;
    var urlA = "https://files.one.ubuntu.com"+encodeURI(path);

    //console.log("u1.js:uploadFile path=" + path);
    //console.log("u1.js:uploadFile url=" + url);

    var ffolder = fixFolder(folder);
    var auth = oAuthHeader(urlA,secrets,"PUT");
    utils.uploadFile(ffolder,filename,url,auth);
}


function base64_encode (data) {
    // Encodes string using MIME base64 algorithm 
    // http://phpjs.org/functions/base64_encode:358
    // 
    // version: 1109.2015
    // discuss at: http://phpjs.org/functions/base64_encode
    // +   original by: Tyler Akins (http://rumkin.com)
    // +   improved by: Bayron Guevara
    // +   improved by: Thunder.m
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Pellentesque Malesuada
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Rafał Kukawski (http://kukawski.pl)
    // -    depends on: utf8_encode
    // *     example 1: base64_encode('Kevin van Zonneveld');
    // *     returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
    // mozilla has this native
    // - but breaks in 2.0.0.12!
    //if (typeof this.window['atob'] == 'function') {
    //    return atob(data);
    //}
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
        ac = 0,
        enc = "",
        tmp_arr = [];
 
    if (!data) {
        return data;     
    }
 
    data = this.utf8_encode(data + '');
 
    do { // pack three octets into four hexets
        o1 = data.charCodeAt(i++);
        o2 = data.charCodeAt(i++);
        o3 = data.charCodeAt(i++);
 
        bits = o1 << 16 | o2 << 8 | o3;
 
        h1 = bits >> 18 & 0x3f;
        h2 = bits >> 12 & 0x3f;
        h3 = bits >> 6 & 0x3f;
        h4 = bits & 0x3f;
 
        // use hexets to index into b64, and append result to encoded string
        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);
 
    enc = tmp_arr.join('');
    
    var r = data.length % 3;
    
    return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
}            

function utf8_encode (argString) {
    // Encodes an ISO-8859-1 string to UTF-8  
    // 
    // version: 1109.2015
    // discuss at: http://phpjs.org/functions/utf8_encode
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: sowberry
    // +    tweaked by: Jack
    // +   bugfixed by: Onno Marsman
    // +   improved by: Yves Sucaet
    // +   bugfixed by: Onno Marsman
    // +   bugfixed by: Ulrich
    // +   bugfixed by: Rafal Kukawski
    // *     example 1: utf8_encode('Kevin van Zonneveld');
    // *     returns 1: 'Kevin van Zonneveld'
    if (argString === null || typeof argString === "undefined") {
        return "";
    }
 
    var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    var utftext = "",
        start, end, stringl = 0;
 
    start = end = 0;
    stringl = string.length;
    for (var n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;
 
        if (c1 < 128) {
            end++;
        } else if (c1 > 127 && c1 < 2048) {
            enc = String.fromCharCode((c1 >> 6) | 192) + String.fromCharCode((c1 & 63) | 128);
        } else {
            enc = String.fromCharCode((c1 >> 12) | 224) + String.fromCharCode(((c1 >> 6) & 63) | 128) + String.fromCharCode((c1 & 63) | 128);
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.slice(start, end);
            }
            utftext += enc;
            start = end = n + 1;
        }
    }
 
    if (end > start) {
        utftext += string.slice(start, stringl);
    }
 
    return utftext;
}  

