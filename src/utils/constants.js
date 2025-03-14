import { getApiUrl, getBaseUrl } from "../services/config";

export const USER_SESSION_KEY = "dhbusr"

export const USER_STORAGE_KEY = "presentease_ur";
export const BASE_URL = "http://localhost:4000/"

export const IMAGE_BASE_URL = `${await getBaseUrl()}resources/`;

export const FILE_BASE_URL = `${await getBaseUrl()}resources/`;

export const Currency = "₹"

export const Seperate_packing_code = "232"

export const KOT_TYEPES = {takeAway:"TE",dineIn:"DI",driveThrough:"DT",homeDelivery :"HD"}


export const userPrivileges = {
    kot : "KOT",
    cashCounter : "C-CNTR",
    Inward : "INWARD",
    Acnts : "ACNTS",
    Admin : "Admin",
    creditSale:"CR-SL",
    delete_kot : "KOT-DEL",
    reprint_kot :"Re-PNT"
}