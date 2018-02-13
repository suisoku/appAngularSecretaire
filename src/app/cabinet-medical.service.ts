import {EventEmitter, Injectable, Output} from '@angular/core';
import {Http, Response} from '@angular/http';
import {isUndefined} from "util";

import {CabinetInterface} from './dataInterface/cabinet';
import {PatientInterface} from './dataInterface/patient';
import {sexeEnum} from './dataInterface/sexe';
import {InfirmierInterface} from './dataInterface/nurse';
import {Adresse} from './dataInterface/adress';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class CabinetMedicalService {
  update_pat = new EventEmitter<any>();
  update_aff = new EventEmitter<any>();
  update_desaff = new EventEmitter<any>();

  constructor(private http: Http) { }
  getData(url: string) : Promise<CabinetInterface> {
    return this.http.get(url).toPromise().then(
      (response: Response) => {
        const text = response.text();
        /*console.log(text);*/
        const parser: DOMParser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/xml');
        /*console.log(doc);*/
        if (doc) {
          const cabinet: CabinetInterface = {
            infirmiers: [],
            patientsNonAffectes: [],
            adresse: this.getAdresseFrom(doc.querySelector('cabinet')),
          };
          const infirmiersXML = Array.from(
            doc.querySelectorAll('infirmiers > infirmier'));
          cabinet.infirmiers = infirmiersXML.map(
            infXML => ( {
              id: infXML.getAttribute("id"),
              prenom: infXML.querySelector("prénom").textContent,
              nom: infXML.querySelector("nom").textContent,
              photo: infXML.querySelector("photo").textContent,
              patients: [],
              adresse: this.getAdresseFrom(infXML),
            })
          )

          const patientsXML = Array.from(
            doc.querySelectorAll("patients > patient"));
          const patients: PatientInterface [] = patientsXML.map(
            patXML => ( {
              prenom: patXML.querySelector("prénom").textContent,
              nom: patXML.querySelector("nom").textContent,
              sexe: patXML.querySelector("sexe").textContent === "M" ? sexeEnum.M : sexeEnum.F,
              naissance: patXML.querySelector("naissance").textContent,
              numeroSecuriteSociale : patXML.querySelector("numéro").textContent,
              adresse: this.getAdresseFrom(patXML)
            })
          )

          const affectations = patientsXML.map (
            ( patXML, i) =>  {
              const visiteXML = patXML.querySelector("visite[intervenant]");
              let infirmier : InfirmierInterface = null;

              if(visiteXML != null) {
                infirmier = cabinet.infirmiers.find (I =>
                  I.id === visiteXML.getAttribute("intervenant"));
              }
              return {patient: patients [i],infirmier: infirmier}
            });
          affectations.forEach(({patient :P , infirmier : I }) => {
            if(I!= null) I.patients.push (P);
            else cabinet.patientsNonAffectes.push(P);
          });
          return cabinet;
        }
        return null;
      });
  }

  getAdresseFrom (Root: Element) :Adresse {
    let node: Element;
    return {
      ville : (node= Root.querySelector("adresse > ville"))? node.textContent:"",
      codePostal:(node=Root.querySelector("adresse > codePostal"))? parseInt(node.textContent,10):0,
      rue :(node=Root.querySelector("adresse > rue"))? node.textContent:"",
      etage:(node=Root.querySelector("adresse > étage"))? node.textContent:"",
      numero:(node=Root.querySelector("adresse > numéro"))?node.textContent:"",
      lat:0,
      lng:0,
    };
  }

  getEmitPat(){
    return this.update_pat;
  }
  getEmitAff(){
  return this.update_aff;
  }
  getEmitDesaff(){
    return this.update_desaff;
  }


  ajouter_patient(nom: string, prenom: string, numSec: string, sexe: string, date: string, etage: string, numero: string, rue: string, codePostal: number, ville: string) {

    const current_adresse: Adresse = {
      etage : etage,
      numero : numero,
      rue : rue,
      codePostal : codePostal,
      ville : ville,
      lat: 0,
      lng: 0
    }

    const current_pat: PatientInterface = {
      prenom: prenom,
      nom: nom,
      sexe:  sexe === 'H' ? sexeEnum.M : sexeEnum.F,
      naissance: date,
      numeroSecuriteSociale: numSec,
      adresse: current_adresse
    }


    this.http.post("/addPatient", {
      patientName: nom,
      patientForname: prenom,
      patientNumber: numSec,
      patientSex: sexe === 'H' ? sexeEnum.M : sexeEnum.F,
      patientBirthday: date,
      patientFloor: etage,
      patientStreetNumber: numero,
      patientStreet: rue,
      patientPostalCode: codePostal,
      patientCity: ville
    }).subscribe( response => {if (response.ok) { this.update_pat.emit(current_pat); }});

  }

  affecter_patient(id: string, pat: PatientInterface) {
    console.log(id);
    console.log(pat.numeroSecuriteSociale);
    this.http.post("/affectation", {
      infirmier: id,
      patient: pat.numeroSecuriteSociale
    }).subscribe( response => {if (response.ok) { this.update_aff.emit({p: pat, id: id} ); }} );
  }

  desaffecter_patient(pat: PatientInterface, id){
    console.log(pat.numeroSecuriteSociale);
    this.http.post("/affectation", {
      infirmier:"none",
      patient: pat.numeroSecuriteSociale
    }).subscribe( response => {if (response.ok) { this.update_desaff.emit({p: pat, id: id}) ; }} );

  }
}






