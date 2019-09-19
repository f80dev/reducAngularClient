import {environment} from '../environments/environment';
import {Router, Routes} from '@angular/router';

export function api(service: string , param: string= '', encode: boolean = true): string  {
  if (encode) { param = encodeURI(param); }
  return(environment.root_api + '/' + service + '?' + param);
}

export function direct_api(service: string , param: string, encode: boolean = true): string  {
  if (encode) { param = encodeURI(param); }
  return(environment.root_api+ '/' + service + '?' + param);
}

export function hashCode(s) {
  // tslint:disable-next-line:no-bitwise
  return s.split('').reduce((a, b) => {a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0);
}

export function tirage(max) {
  return Math.trunc(Math.random() * max);
}

export function $$(s: string, obj: any= null) {
  const lg = new Date().getHours() + ':' + new Date().getMinutes() + ' -> ' + s;
  if (obj != null) {
    obj = JSON.stringify(obj);
  } else {
    obj = '';
  }
  console.log(lg + ' ' + obj);
  if (lg.indexOf('!!') > -1) {alert(lg); }
}


export function resizeBase64Img(base64, maxsize,quality,func) {

  if(base64==null || base64==""){
    $$("Probleme d'image vide");
    func();
  }

  var canvas:any = document.createElement("canvas");
  var img=new Image();
  img.onload=function(){
    var ratio=1;
    if(maxsize!=null)ratio=maxsize/Math.max(img.width,img.height);

    if(ratio<=1){
      canvas.width =img.width*ratio;
      canvas.height =img.height*ratio;
      var context = canvas.getContext("2d");
      context.drawImage(img, 0, 0,canvas.width,canvas.height);
      var rc=canvas.toDataURL("image/jpeg", quality);
    }
    else
      rc=base64;

    func(rc);
  };

  img.src=base64;
}

export function cropBase64Img(base64,x,y,width,height,quality=1,func,func_error) {
  try{
    var canvas:any = document.createElement("canvas");
    var img=new Image();
    img.crossOrigin="anonymous";
    img.onload=function(){
      canvas.width=width;
      canvas.height=height;
      var context = canvas.getContext("2d");
      context.drawImage(img, x, y,width,height,0,0,width,height);
      var rc=canvas.toDataURL("image/jpeg", quality);
      func(rc);
    };

    img.src=base64;
  }catch (e){
    if(func_error!=null)func_error(e);
  }
}


export function cropToSquare(base64,quality=1,func) {
  var img=new Image();
  img.onload=function(){
    var i:any=this;
    var l=Math.min(i.width,i.height);
    var x=(i.width-l)/2;
    var y=(i.height-l)/2
    cropBase64Img(base64,x,y,l,l,quality,func,null);
  }
  img.src=base64;
}


export function checkLogin(router: Router, params: any = null) {
  if (!localStorage.getItem('user')) {
    router.navigate(['login'], {queryParams: params});
    return false;
  } else {
    return true;
  }
}
//
// export function openGeneral(item, domain)  {
//   return new Promise((resolve, reject) => {
//       const url = environment.root_api + '/api/connectTo?service=' + item + '&domain=' + domain;
//       const hwnd: any = window.open(url, 'Login', 'menubar=0,status=0,height=600,titlebar=0,width=400');
//       window.addEventListener('message', (event: any) => {
//         clearInterval(hTimer);
//         resolve(event.data);
//       }, false);
//
//       const hTimer = setInterval(() => {
//         if (hwnd != null) {
//           if (hwnd.location.href != null && hwnd.location.href.indexOf('email') > -1) {
//             const pos = hwnd.location.href.indexOf('email=');
//             const email = hwnd.location.href.substr(pos + 6, hwnd.location.href.indexOf('&', pos) - pos - 6);
//             const password = hwnd.location.href.substr(hwnd.location.href.indexOf('&', pos) + 10);
//             hwnd.close();
//             clearInterval(hTimer);
//             resolve({email, password});
//           }
//         }
//       }, 1000);
//
//       // hwnd.addEventListener("unload",(event)=>{
//       //   var obj={email:localStorage.getItem("email"),password:localStorage.getItem("password")};
//       // })
//   });
// }


export function getDelay(dtStart, lang= 'en', label_day= 'jours', serverNow= null) {
  if (dtStart == undefined) {return ''; }
  if (serverNow == null) {serverNow = new Date().getTime(); }
  const delay = Math.abs(dtStart - serverNow);

  if (delay > 24 * 3600 * 1000) {
    const nbJours = Math.trunc(delay / (24 * 3600 * 1000));
    return nbJours + ' ' + label_day;
  }

  if (lang == undefined) {lang = 'fr'; }
  let affichage = new Date(delay).toUTCString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
  if (affichage.indexOf('00:') == 0) {
    affichage = affichage.split(':')[1] + ':' + affichage.split(':')[2];
  } else {
    affichage = affichage.split(':')[0] + 'h' + affichage.split(':')[1];
  }

  return affichage;
}


export function clear(elt: any, xpath: string) {
  const doc = elt.contentDocument;
  const to_keep = doc.querySelector(xpath);
  to_keep.parentElement.childNodes.forEach((n) => {
    if (n != to_keep) {n.style.display = 'none'; }
  });
}
