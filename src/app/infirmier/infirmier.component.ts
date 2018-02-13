import {Component, Input, OnInit} from '@angular/core';
import {InfirmierInterface} from '../dataInterface/nurse';
import {PatientInterface} from '../dataInterface/patient';




@Component({
  selector: 'app-infirmier',
  templateUrl: './infirmier.component.html',
  styleUrls: ['./infirmier.component.css']

})
export class InfirmierComponent implements OnInit {
    @Input() infirmier: InfirmierInterface;
    @Input() cabinetService;

  constructor() { }

  getNom () {
    return this.infirmier.nom;
  }
  getPrenom () {
    return this.infirmier.prenom;
  }
  getPhotoURL() {
    return "data/"+this.infirmier.photo;
  }
  getAdresse () {
    return  this.infirmier.adresse.numero+" "+this.infirmier.adresse.rue+" "+this.infirmier.adresse.ville+" "+this.infirmier.adresse.codePostal;
  }
  getId(){
    return this.infirmier.id;
  }

  getPatients(){
   return this.infirmier.patients;
  }
  getPresenter(pat: PatientInterface) {
    return pat.prenom + " " + pat.nom;
  }
  service_desaffecter(pat: PatientInterface){
      this.cabinetService.desaffecter_patient(pat, this.infirmier.id);
  }
    ngOnInit() {
  }

}
