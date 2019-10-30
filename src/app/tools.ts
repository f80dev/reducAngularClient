import {environment} from '../environments/environment';
import {Router} from '@angular/router';
import {
  SocialServiceConfig
} from "ngx-social-button";
import {WebcamUtil} from "ngx-webcam";
import {LoginComponent} from "./login/login.component";

export const ADMIN_PASSWORD="hh4271";

export function showError(vm:any,err:any){
  $$("!Error ",err);
  if(vm.toast!=null)
    vm.toast.open("L'application est en cours de maintenance, Merci de réessayer l'opération dans quelques instants","",{duration:2000});

}

export function api(service: string , param: string= '', encode: boolean = true): string  {
  service=service.replace("//","/");
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

export function selectFile(event:any,maxsize:number,quality:number,square:boolean=true,func:Function=null){
  if(event.target.files && event.target.files.length > 0) {
    var reader = new FileReader();
    reader.onload = ()=>{
      var dataURL = reader.result;
      resizeBase64Img(dataURL,maxsize,quality,(result=>{
        autoRotate(result,quality,(res)=>{
          if(square){
            cropToSquare(res,quality,(result_square)=>{
              func(result_square);
            });
          }
          else
            func(result);
        })
      }));
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

export function sendToPrint(section="print-section"){
  const printContent:any = document.getElementById(section);
  const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
  WindowPrt.document.write(printContent.innerHTML);
  WindowPrt.document.close();
  WindowPrt.focus();
  WindowPrt.print();
}

export function $$(s: string, obj: any= null) {
  if(s!=null && s.startsWith("!")){
    debugger;
  }
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
                          zoom=18,scale=0.2,
                          func_move=null,func_sel=null,func_click=null){
  var vectorSource = new ol.source.Vector({
    features: [
      createMarker(center.lng,center.lat,icon,null,scale)
    ]
  });

  var vectorLayer=new ol.layer.Vector({source: vectorSource});
  //var olSource=new ol.layer.Tile({source: new ol.source.OSM()});
  //Info sur la source : https://www.bingmapsportal.com/Application
  var olSource=new ol.layer.Tile({source: new ol.source.BingMaps({
      imagerySet: 'Road',
      key: 'Am04xtfIsPy43By5-20LAeD2uxvrX9Yfe3DVunnWQoCeT3Kzks9J7-9DU63EzEaf'
    })});

  var rc=new ol.Map({
    target: 'map',
    layers: [
      olSource,
      vectorLayer,
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([center.lng, center.lat]),
      zoom: zoom
    })
  });

  if(func_sel){
    rc.on("dblclick", function(e) {
      rc.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
        func_sel(feature);
      })
    });
  }

  if(func_click){
    rc.on("click", function(e) {
      func_click(e);
    });
  }

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

export function showMessage(vm:any,s:string="",duration=20000){
  if(s==null || s.length==0)return false;
  s=s+"";
  $$("Affichage du message :",s)
  if(s.startsWith("#")){
    s=s.substr(1);
    if(s.length>0)
      setTimeout(()=>{vm.showMessage=true;},500);
  }

  vm.user.message=s;
  setTimeout(()=>{vm.user.message=""},duration);
}

export function isLocal(){
  return location.href.indexOf("localhost") > -1;

}

export function loginWithEmail(vm:any,user:any,func:Function=null,func_error:Function=null) {
  if(!vm.dialog)$$("La fenetre ne dispose pas de 'dialog'");
  var _width="250px";
  if(screen.width>600){_width="400px";}
  vm.dialog.open(LoginComponent,{width:_width,data: {facebook:true,google:true,email:true,user:user}}).afterClosed().subscribe((result:any) => {
    if(result) {
      $$("Récupération correct des coordonnées du compte ",result);
      if (func) func(result);
    }
     else {
       $$("Probleme de récupération du user");
      if(func_error)func_error();
    }
  });
}

export function traitement_coupon(coupons:any[],showCoupon:string) : any {
  var rc=[];
  if(coupons==null)return rc;

  coupons.forEach((coupon:any)=>{
    if(coupon._id==showCoupon)coupon.visible=true;
    coupon["visible"]=false;
    coupon["message"]="Je recommande cette promotion. "+buildTeaser(coupon,coupon.shopname);
    rc.push(coupon);
  });
  return rc;
}


/**
 * Mise en forme du teaser de la promotion
 * @param c
 * @param lieu
 *
 *
 */
export function buildTeaser(coupon:any,lieu:string){
  var rc=coupon.label;
  var prefixe="à";

  if(lieu==null)lieu="";
  if(lieu.toLowerCase().startsWith("chez"))prefixe="";
  if(lieu.toLowerCase().startsWith("au ") || lieu.toLowerCase().startsWith("à ") || lieu.toLowerCase().startsWith("a "))prefixe="";
  rc=rc+" "+prefixe+" '"+lieu+"'";

  var pluriel="s";
  var firstWord=coupon.unity.split(" ")[0];
  if(firstWord.endsWith("x") || firstWord.endsWith("%") || firstWord.endsWith("s"))pluriel="";
  if(coupon.max<=1)pluriel="";

  if(coupon.max>0){
    if(!rc.toLowerCase().startsWith("gagne"))rc=rc+". Gagnez";
    rc=rc+", jusqu'a "+coupon.max+" "+coupon.unity.replace(firstWord,firstWord+pluriel)+" ("+coupon.symbol+")";
  }

  var prefixe_conditions="pour ";
  if(coupon.conditions.toLowerCase().startsWith("pour") || coupon.conditions.toLowerCase().startsWith("sur"))prefixe_conditions="";
  rc=rc+", "+prefixe_conditions+coupon.conditions;

  for (var i=0;i<10;i++)
    rc=rc.replace("..",".").replace("!.","!").replace("  "," ");

  return rc;
}




export function createMarker(lon,lat,icon,coupon=null,scale=0.2,func_sel=null){
  if(!icon)icon="";

  var iconStyle:any;

  if(icon){
    iconStyle = new ol.style.Style({
      image: new ol.style.Icon(({
        anchor: [0.6, 1.0],
        scale:scale,
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: icon,
        opacity:1.0,
      })),
    });
  } else {
    iconStyle = new ol.style.Style({
      image: new ol.style.Circle({
        radius: 15,
        fill: new ol.style.Fill({color: 'white'})
      })
    });
  }


  if(coupon!=null){
    iconStyle.setText(new ol.style.Text({
      text: coupon.max+coupon.symbol,
      textAlign:"center",
      font:"18px sans-serif",
      stroke: new ol.style.Stroke({color: 'white', width: 2}),
      padding:[2,2,2,2]
    }));
  }

  var marker = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([lon, lat])),
  });
  marker.coupon=coupon;

  //TODO a rétablir
  // if(func_sel!=null){
  //   marker.on("featureclick",func_sel(this.coupon));
  // }

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
    .addFacebook("696168110875713")
    .addGoogle("794055474370-pgpk3pggejpv59ioss798a744sup3pll.apps.googleusercontent.com")
    .addLinkedIn("86cnm1fo8cffax")

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
  };
  img.src=base64;
}

export function compute(coupon:any){
  coupon["conditions"]=coupon["conditions"] || "";
  if(coupon.visual==null)coupon.visual=coupon.picture;

  if(!coupon.conditions.startsWith("pour ") && !coupon.conditions.startsWith("sur "))coupon.conditions="pour "+coupon.conditions;
  coupon.conditions=coupon.conditions.replace("offre valable pour","").replace("valable pour","");

  coupon.dtStart=new Date().getTime();
  
  if(coupon.duration_jours==null)coupon.duration_jours=0;
  if(coupon.duration_hours==null)coupon.duration_hours=0;

  coupon.durationInSec=coupon.duration_jours*24*3600+coupon.duration_hours*3600;
  coupon.delay=0;

  coupon.share_bonus=Number(coupon.share_bonus);
  coupon.pay_bonus=Number(coupon.pay_bonus);
  coupon.direct_bonus=Number(coupon.direct_bonus);
  coupon.final_bonus=Number(coupon.final_bonus);
  coupon.max=Number(coupon.max);
  coupon.stock=Number(coupon.stock);

  if(coupon.nb_partage>0)
    coupon.share_bonus=1/coupon.nb_partage;
  else
    coupon.share_bonus=0;

  if(coupon.pluriel && coupon.unity.endsWith("s"))coupon.unity=coupon.unity.substr(0,coupon.unity.length-1);
  coupon.unity=coupon.unity.toLowerCase();
  return coupon;
}

export function exportToHTML(src:string,coupon:any,func:Function,color="darkred"){
  var code="";
  var fields=[];
  for (let word of src.split(" ")){
    var field=word.replace("#","").replace("@","");

    if(word.startsWith("#")){
      fields.push(field);
      field=field.split("=")[0]
      code=code+"<span id='id_"+field+"' style='color:"+color+";cursor: pointer;'>"+coupon[field]+"</span> ";
    }

    if(word.startsWith("@"))code=code+coupon[field]+" ";
    if(!word.startsWith("@") && !word.startsWith("#"))code=code+word+" ";
  }
  setTimeout(()=>{func(fields)},10);
  return code;
}

export function checkLogin(router: Router, params: any = null) {
  if (!localStorage.getItem('user')) {
    router.navigate(['login'], {queryParams: params});
    return false;
  } else {
    return true;
  }
}

export function openGraphForShop(idshop:string){
  var domain_server="https://server.f80.fr";
  //domain_server="http://localhost";

  var graph_url=domain_server+":5500/api/getgraph/"+idshop+"/hh4271/gpickle";
  var url=domain_server+":5000/graph/b64="+btoa(graph_url)+"/fr?algo_comm=NOTREATMENT&dir=public&notext=True&nometrics=True&add_property=False&autorotate=True&limit=5000&pca=1&processors=2"
  $$("url=",url);
  window.open(url,"_blank");
}

export function initAvailableCameras(func){
  WebcamUtil.getAvailableVideoInputs()
    .then((mediaDevices: MediaDeviceInfo[]) => {
      if(mediaDevices==null)
        func(0)
      else
        func(mediaDevices.length);
    });
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


export function normeString(s){
  if(s==null)return "";
  return s;
}

export function clear(elt: any, xpath: string) {
  const doc = elt.contentDocument;
  const to_keep = doc.querySelector(xpath);
  to_keep.parentElement.childNodes.forEach((n) => {
    if (n != to_keep) {n.style.display = 'none'; }
  });
}

declare var EXIF: any;

export function extractEXIF(src:string,func){
  var image = new Image();
  image.onload =  function() {
    EXIF.getData(this, function () {
      var model = EXIF.getTag(this, 'Model');
      var tags = EXIF.getAllTags(this);
      if (Object.keys(tags).length == 0) {
        tags["width"] = image.width;
        tags["height"] = image.height;
      }
      func(tags);
    });
  };
  image.src=src;
}

export function autoRotate(src: string, quality: number, func) {
  //var blob=atob(src.split("base64,")[1]);
  extractEXIF(src,(data)=> {
    if (data.exif != null) {
      var orientation = data.exif.get('Orientation');
      var angle = 0;
      switch (orientation) {
        case 8:
          angle = -90;
          break;
        case 3:
          angle = 180;
          break;
        case 6:
          angle = 90;
          break;
      }
      rotate(src, angle, quality, func);
    } else{
      var angle=0;
      // if(data.width>data.height)angle=0;
      // if(data.width==data.height)angle=90;
      rotate(src, angle, quality, func);
    }

  });

    //   }else{
    //     debugger;
    //     rotate(src, -90, quality, func);
    //   }
    //
    // });
}

// export function autoRotate(src: string, quality: number, func) {
//   var image = new Image();
//   image.onload =  () => {
//     EXIF.getData(image,  function() {
//       var orientation= EXIF.getTag(this,"Orientation");
//       var angle = 0;
//       switch (orientation) {
//         case 8:
//           angle = -90;
//           break;
//         case 3:
//           angle = 180;
//           break;
//         case 6:
//           angle = 90;
//           break;
//       }
//       rotate(src, angle, quality, func);
//     });
//   };
//   image.src = src;
// }

/**
 *
 * @param src
 * @param angle
 * @param quality
 * @param func
 */
export function rotate(src: string, angle: number, quality: number, func) {
  if (angle == 0)
    func(src);
  else {
    var img = new Image();
    img.onload = function() {
      var canvas:any = document.createElement('canvas');
      canvas.width = img.height;
      canvas.height = img.width;
      drawRotated(canvas, this, angle);
      var rc = canvas.toDataURL("image/jpeg", quality);
      func(rc);
    };
    img.src = src;
  }
}


function drawRotated(canvas, image, degrees) {
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(degrees * Math.PI / 180);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);
  ctx.restore();
}
