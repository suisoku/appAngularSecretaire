import {sexeEnum} from "./sexe";
import {Adresse} from "./adress";

export interface PatientInterface {
 prenom: string;
 nom: string;
 sexe: sexeEnum;
 naissance: string;
 numeroSecuriteSociale : string;
 adresse: Adresse;
}
