function setCookie(name, value, expires) {
  var cookie = name + "=" + escape(value) + ";";
  if (expires) {
    if(expires instanceof Date) {
      if (isNaN(expires.getTime()))
       expires = new Date();
    }
    else expires = new Date(new Date().getTime() + parseInt(expires) * 1000 * 60 * 60 * 24);
    cookie += "expires=" + expires.toGMTString() + ";";
  }
  document.cookie = cookie;
}

function deleteCookie(name) {
  setCookie(name, "", -1);
}