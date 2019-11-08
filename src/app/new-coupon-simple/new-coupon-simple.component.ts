import { Component, OnInit } from '@angular/core';
import {$$, checkLogin, compute, exportToHTML, showError} from "../tools";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {MatDialog} from "../../../node_modules/@angular/material/dialog";
import {PromptComponent} from "../prompt/prompt.component";
import {ApiService} from "../api.service";
import {ImageSelectorComponent} from "../image-selector/image-selector.component";
import {ConfigService} from "../config.service";

@Component({
  selector: 'app-new-coupon-simple',
  templateUrl: './new-coupon-simple.component.html',
  styleUrls: ['./new-coupon-simple.component.css']
})
export class NewCouponSimpleComponent implements OnInit {

  showOldCoupon=false;
  master_text="";
  augment_text="";
  budget_text="";

  coupon:any={};
  tags="";
  shopname="";
  userid="";

  constructor(public router:Router, public api: ApiService,
              public config:ConfigService,
              public dialog: MatDialog,public route: ActivatedRoute) { }

  ngOnInit() {
    checkLogin(this.router);
    var params: ParamMap = this.route.snapshot.queryParamMap;
    this.tags=params.get("tags") || "";
    var modele = params.get("modele") || "";
    if (modele.length > 0) {
      $$("Demande d'ouverture avec le modele "+modele);
      this.config.values.modeles.forEach((m) => {
        if (m.id == modele) {
          $$("Modèle identifié");
          this.selectOldAsModel(m);
        }
      });
    } else {
      $$("Affichage de la liste des modèles avec filter="+this.tags)
      this.showOldCoupon=true;
    }
  }

  add_event(fields:any){
      for(let elt of fields){
        var field=elt.split("=")[0];

        document.getElementById("id_"+field).addEventListener("click",(event:any)=>{
          var desc="";
          if(elt.indexOf("=")>-1){
            desc = elt.split("=")[1];
            for(var k=0;k<15;k++) {
              desc=desc.replace("_", " ");
            }
          }

          if(event.target.id!=null){
            var field=event.target.id.replace("id_","");
            this.dialog.open(PromptComponent,{width: '80%',data: {title:"Personnaliser",question: desc, result: this.coupon[field],onlyConfirm:false}})
              .afterClosed().subscribe((result) => {
                if(result){
                  this.coupon[field]=result;
                  this.refresh();
                }
            });
          }
        });
      }
  }

  refresh(){
    this.dialog.closeAll();
    this.coupon=compute(this.coupon);
    var color="#c7006e";
    this.master_text=exportToHTML("Votre intro: #label=teaser_de_votre_promotion <br><br>Le @beneficiaire gagne un/une #unity=unité_désignant_ce_que_gagne_le_client représenté(e) " +
      "dans ReducShare par le symbole " +
      "#symbol=Symbole_utilisé_pour_représenter_l'unité " +
      "<br><br> Cette offre est valable #conditions=Conditions_pour_bénéficier_de_la_promotion <br>",this.coupon,(fields)=>{this.add_event(fields);},color);

    this.augment_text=exportToHTML("Le @beneficiaire gagne :<br><ul><li> #direct_bonus=Bonus_attribué_dés_la_récupération_du_coupon @symbol à la récupération du coupon,</li><li> " +
      "puis 1 @symbol de plus chaque fois qu'il le partage #nb_partage=Gain_à_chaque_partage fois.</li><li>Enfin #pay_bonus=Bonus_supplémentaire_à_l'usage_d'un_coupon_distribué @symbol suplémentaire " +
      "lorsqu'un coupon qu'il a distribué est utilisé</li></ul>",this.coupon,(fields)=>{this.add_event(fields);},color);

    this.budget_text=exportToHTML("La promotion ne peut pas dépasser #max=Gain_maximum_par_client @symbol par @beneficiaire <br>" +
      "<br>La promotion se termine au bout de #duration_jours=Durée_de_la_promotion_en_jours jour(s) " +
      "et #duration_hours=Durée_de_la_promotion_en_heures heure(s) ou si #stock @symbol ont été offerts.",this.coupon,(fields)=>{this.add_event(fields);},color);

    //this.reference_text=exportToHTML("Votre promotion sera classée sous le titre #title=Titre_non_visible_du_client_utilisé_pour_retrouver_sa_promotion",this.coupon,(fields)=>{this.add_event(fields);},color);
  }

  selectOldAsModel(coupon: any) {
    if(coupon==null)this.cancel();
    if(coupon.share_bonus>0)coupon.nb_partage=1/coupon.share_bonus;
    this.coupon=compute(coupon);

    var params:ParamMap=this.route.snapshot.queryParamMap;
    this.userid=params.get("userid") || "";
    this.coupon.shop = params.get("shopid") || "";

    if(Number(this.coupon.share_bonus)>0)
      coupon["nb_partage"]=1/coupon.share_bonus;

    this.coupon["shopname"]=params.get("shopname") || "";

    this.showOldCoupon=false;
    this.refresh();
  }

  cancel(){
    this.showOldCoupon=false;
    this.router.navigate(['home'],{queryParams:{message:"création de coupon annulée"}});
  }

  addcoupon(coupon: any) {
    coupon=compute(coupon);
    coupon.owner=this.userid;
    this.api.addCoupon(coupon).subscribe((result: any) => {
      localStorage.setItem("showCoupon",result._id);
      this.router.navigate(['home'],{queryParams:{message:result.message}});
    },(error)=>{showError(this,error);});
  }


  addImage(field:string,width=700,height=300) {
    this.dialog.open(ImageSelectorComponent, {width: '90%', data: {result:this.coupon[field],width:width,height:height}}).afterClosed().subscribe((result) => {
      if(result)
        this.coupon[field]=result;
    });
  }

}
