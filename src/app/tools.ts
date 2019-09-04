import {environment} from '../environments/environment';

export function api(service: string , param: string="", encode: boolean = true): string  {
  if (encode) { param = encodeURI(param); }
  return(environment.root_api + '/' + service + '?' + param);
}

export function direct_api(service: string , param: string, encode: boolean = true): string  {
  if (encode) { param = encodeURI(param); }
  return(environment.domain + '/' + service + '?' + param);
}

export function hashCode(s) {
  // tslint:disable-next-line:no-bitwise
  return s.split('').reduce((a, b)=> {a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0);
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

export function openGeneral(item, domain)  {
  return new Promise((resolve, reject) => {
      const url = environment.domain + '/api/connectTo?service=' + item + '&domain=' + domain;
      const hwnd: any = window.open(url, 'Login', 'menubar=0,status=0,height=600,titlebar=0,width=400');
      window.addEventListener('message', (event: any) => {
        clearInterval(hTimer);
        resolve(event.data);
      }, false);

      const hTimer = setInterval(() => {
        if (hwnd != null) {
          if (hwnd.location.href != null && hwnd.location.href.indexOf('email') > -1) {
            const pos = hwnd.location.href.indexOf('email=');
            const email = hwnd.location.href.substr(pos + 6, hwnd.location.href.indexOf('&', pos) - pos - 6);
            const password = hwnd.location.href.substr(hwnd.location.href.indexOf('&', pos) + 10);
            hwnd.close();
            clearInterval(hTimer);
            resolve({email, password});
          }
        }
      }, 1000);

      // hwnd.addEventListener("unload",(event)=>{
      //   var obj={email:localStorage.getItem("email"),password:localStorage.getItem("password")};
      // })
  });
}


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

export function reload() {
  document.location.href = environment.domain;
}

export function clear(elt: any, xpath: string) {
  const doc = elt.contentDocument;
  const to_keep = doc.querySelector(xpath);
  to_keep.parentElement.childNodes.forEach((n) => {
    if (n != to_keep) {n.style.display = 'none'; }
  });
}
