"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadImage = exports.UniqueID = exports.DegreesToCompass = exports.Prefix = exports.TextEncodings = void 0;
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
// ================= Constant variables =================
exports.TextEncodings = {
    graveAccent: "\u0060",
    whiteSpace: "\u200b"
};
exports.Prefix = "!bb";
// ================= Public functions =================
/**
 * Uses the given angle to return the right compass value.
 * @param num {number}
 */
function DegreesToCompass(angle) {
    const val = Math.floor((angle / 22.5) + 0.5);
    const arr = ["Noord", "Noord NO", "Noord oost", "Oost NO", "Oost", "Oost ZO", "Zuid oost", "Zuid SO", "Zuid", "Zuid ZW", "Zuid west", "West ZW", "West", "West NW", "Noord west", "Noord NW"];
    return arr[(val % 16)];
}
exports.DegreesToCompass = DegreesToCompass;
function UniqueID(len) {
    const chars = "abdefghhijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ134567890";
    let id = "", i = 0;
    while (i < len) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
        i += 1;
    }
    return id;
}
exports.UniqueID = UniqueID;
function downloadImage(url, filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            const out = fs_1.default.createWriteStream(filePath);
            https_1.default.get(url, function (res) {
                if (res.statusCode === 200) {
                    res.pipe(out);
                    res.on("error", reject);
                    res.once("close", function () {
                        resolve(filePath);
                    });
                }
                else {
                    res.resume();
                    reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
                }
            });
        });
    });
}
exports.downloadImage = downloadImage;
