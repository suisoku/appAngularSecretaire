import { Component, OnInit } from '@angular/core';

import {noUndefined} from "@angular/compiler/src/util";

import {Http} from '@angular/http';
import {CabinetInterface} from '../dataInterface/cabinet';
import {CabinetMedicalService} from '../cabinet-medical.service';
import {PatientInterface} from '../dataInterface/patient';
import {sexeEnum} from '../dataInterface/sexe';
import {Adresse} from '../dataInterface/adress';

@Component({
  selector: 'app-secretary',
  templateUrl: './secretary.component.html',
  styleUrls: ['./secretary.component.css']
})
export class SecretaryComponent implements OnInit {

  private cabinet: CabinetInterface = {
    infirmiers: [],
    patientsNonAffectes: [],
    adresse: null
  };

  constructor(private cabinetService: CabinetMedicalService, private http: Http) {
    cabinetService.getData("/data/cabinetInfirmier.xml").then(data => this.cabinet = data);
  }

  ngOnInit() {
    this.cabinetService.getEmitPat()
      .subscribe(item => this.update_ajouter(item));

    this.cabinetService.getEmitAff()
      .subscribe(aff => this.update_aff(aff));

    this.cabinetService.getEmitDesaff()
      .subscribe(patdes => this.update_desaff(patdes));
  }

  getInfirmiers() {
    return this.cabinet.infirmiers;
  }

  getPatients() {
    return this.cabinet.patientsNonAffectes;

  }

  service_ajouter(nom: string, prenom: string, numSec: string, sexe: string, date: string, etage: string, numero: string, rue: string, codePostal: number, ville: string){
    this.cabinetService.ajouter_patient(nom, prenom, numSec, sexe, date, etage, numero, rue, codePostal, ville);
  }

  update_ajouter(item){
    console.log("coucou");
    this.cabinet.patientsNonAffectes.push(item);
  }

  update_aff(item) {
    console.log("affecter");
    this.cabinet.patientsNonAffectes =
      this.cabinet.patientsNonAffectes.filter(p => p.numeroSecuriteSociale !== item.p.numeroSecuriteSociale);

    this.cabinet.infirmiers[this.cabinet.infirmiers.findIndex(e => e.id === item.id)].patients.push(item.p);
    console.log(item.id);
  }

  update_desaff(item){
    console.log("desaffecter");
    const i = this.cabinet.infirmiers.findIndex(e => e.id === item.id);
    this.cabinet.infirmiers[i].patients = this.cabinet.infirmiers[i].patients.filter(e => e.numeroSecuriteSociale !== item.p.numeroSecuriteSociale);
    this.cabinet.patientsNonAffectes.push(item.p);
  }

}


