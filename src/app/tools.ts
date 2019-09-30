import {environment} from '../environments/environment';
import {Router, Routes} from '@angular/router';
import {
  NgxSocialButtonModule,
  SocialServiceConfig
} from "ngx-social-button";

export function api(service: string , param: string= '', encode: boolean = true): string  {
  if (encode) { param = encodeURI(param); }
  if(param.length==0)
    return(environment.root_api + '/' + service);
  else
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

export function selectFile(event:any,maxsize:number,func:Function){
  if(event.target.files && event.target.files.length > 0) {
    var reader = new FileReader();
    reader.onload = ()=>{
      var dataURL = reader.result;
      resizeBase64Img(dataURL,maxsize,0.5,(result=>{
        cropToSquare(result,0.5,(result_square)=>{
          func(result_square);
        })
      }))

    };
    reader.readAsDataURL(event.target.files[0]);
  }
}

//On cherche a produire une reference au terminal de l'utilisateur
export function unique_id(){
  var rc="";
  rc=rc+navigator.userAgent; // User Agent
  rc=rc+navigator.platform; // nom du système d'exploitation
  rc=rc+navigator.product;
  rc=rc+navigator.cookieEnabled; // si les cookies sont activés ou non
  rc=rc+navigator.appName; // nom complet du navigateur
  rc=rc+navigator.appCodeName; // nom de code du navigateur
  rc=rc+screen.height;// hauteur de l'écran (en pixels)
  rc=rc+screen.width; // largeur de l'écran (en pixels)
  rc=rc+screen.colorDepth; // profondeur de couleur.
  return rc;
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


/**
 * Creation d'une carte
 */

declare var ol: any;

export function createMap(center:any,
                          icon="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/google/223/man_1f468.png",
                          zoom=18,
                          func_move=null){
  var vectorSource = new ol.source.Vector({
    features: [
      createMarker(center.lng,center.lat,icon)
    ]
  });

  var vectorLayer=new ol.layer.Vector({source: vectorSource});

  var rc=new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      }),
      vectorLayer,
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([center.lng, center.lat]),
      zoom: zoom
    })
  });

  if(func_move!=null){
    rc.on("moveend",func_move);
  }
  return rc;
}

export function getMarkerLayer(map:any):any {
  var rc=null;
  map.getLayers().forEach((layer) => {
    if (layer instanceof ol.layer.Vector) {
      rc=layer;
    }
  });
  return rc;
}


export function createMarker(lon,lat,icon,coupon={}){
  var iconStyle = new ol.style.Style({
    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
      anchor: [0.5, 0.5],
      scale:0.2,
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      src: icon,
      opacity:0.8
    }))
  });

  var marker = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([lon, lat])),
    //TODO: propriétés à insérer
    //label:coupon.label,
    //direct_bonus: coupon.direct_bonus
  });
  marker.setStyle(iconStyle);
  return marker;
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

export function getAuthServiceConfigs() {
  let config = new SocialServiceConfig()
    .addFacebook("908733539486004");
    //.addGoogle("AIzaSyDrpC_HIxM4TmDJExcbhjMleGCkdHa4dFw");
  return config;
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
