"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DegreesToCompass = exports.Prefix = exports.TextEncodings = void 0;
exports.TextEncodings = {
    graveAccent: "\u0060",
    whiteSpace: "\u200b"
};
exports.Prefix = "!bb";
function DegreesToCompass(num) {
    const val = Math.floor((num / 22.5) + 0.5);
    const arr = ["Noord", "Noord NO", "Noord oost", "Oost NO", "Oost", "Oost ZO", "Zuid oost", "Zuid SO", "Zuid", "Zuid ZW", "Zuid west", "West ZW", "West", "West NW", "Noord west", "Noord NW"];
    return arr[(val % 16)];
}
exports.DegreesToCompass = DegreesToCompass;
