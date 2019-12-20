import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'literal'
})
export class LiteralPipe implements PipeTransform {

  transform(value: number,decimal:number=2,lang: string="fr"): string {
    let rc="";



    //for(let k=2;k<=10;k++)if(value==1/k)rc="1 "+k+"ème";
    if(rc=="" && Math.trunc(value*100)==33)rc="un tiers d'1";
    if(rc=="" && value>0.75)rc="presque 1";
    if(rc=="" && value<0.5)rc="presque la moitié d'1"
    if(value==0.5)rc="la moitié d'1";
    if(rc=="" && value>0.5 && value<1)rc="plus de la moitié d'1"

    // if(rc.length==0 && value<1) {
    //   if (value * 10 == Math.trunc(value * 10))
    //     rc = value * 100 + "% d'1";
    // }

    if(rc.length>0)
      return(rc);
    else {
      if(Math.trunc(value)==value)decimal=0;
      return value.toFixed(decimal);
    }

  }

}
