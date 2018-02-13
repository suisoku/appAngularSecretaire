import {Component, Inject, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {PatientInterface} from '../dataInterface/patient';
import {sexeEnum} from '../dataInterface/sexe';
import {InfirmierInterface} from '../dataInterface/nurse';
import {Http} from '@angular/http';




@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PatientComponent {


  @Input() patient: PatientInterface;
  @Input() infirmiers;
  @Input() cabinetService;
  private enumM = sexeEnum.M; //test du enum dans le template html

  constructor(private http: Http) {
  }

  getNom() {
    return this.patient.nom;
  }

  getPrenom() {
    return this.patient.prenom;
  }

  getSexe() {
    return this.patient.sexe;
  }

  getNum() {
    return this.patient.numeroSecuriteSociale;
  }

  getAdresse() {
    return this.patient.adresse.numero + " " + this.patient.adresse.rue + " " + this.patient.adresse.ville + " " + this.patient.adresse.codePostal;
  }

  getNaissance() {
    return this.patient.naissance;
  }




  service_affecter(id: string){
    this.cabinetService.affecter_patient(id, this.patient);
  }

}
