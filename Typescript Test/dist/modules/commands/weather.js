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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Execute = exports.GetHelp = void 0;
const discord_js_1 = require("discord.js");
const utils_1 = require("../utils");
const weather = require("openweather-apis"), googleImages = require("google-images");
const googleClient = new googleImages(process.env.GOOGLE_SE_ID, process.env.GOOGLE_SE_TOKEN);
function GetHelp() {
    const dictionary = {
        command: "weather",
        description: "Als jij wilt weten hoe warm het is waar jij woont, kan je dat hiermee doen.",
        keyword: "plaatsnaam"
    };
    return dictionary;
}
exports.GetHelp = GetHelp;
function Execute(message, commandArguments, client, player) {
    let place = commandArguments[0];
    if (place === "") {
        message.channel.send("Er is geen locatie opgegeven.");
        return;
    }
    for (let i = 0; i < place.length; i++) {
        if (place.charAt(i) == " ")
            place = place.replace(" ", "");
    }
    weather.setLang("en");
    weather.setCity(place);
    weather.setUnits("metric");
    weather.setAPPID(process.env.WEATHER_API_TOKEN);
    weather.getAllWeather(function (err, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data === null) {
                message.channel.send(`Geen weer gerelateerde informatie gevonden over ${place}.`);
                console.log(err);
                return;
            }
            const image = yield googleClient.search(data.name);
            const msgEmbed = new discord_js_1.MessageEmbed();
            msgEmbed.setColor("#ff9696");
            msgEmbed.setTitle(data.name);
            msgEmbed.setAuthor({ name: message.author.username });
            msgEmbed.setDescription(`Huidige weer status voor ${new Date()}`);
            msgEmbed.setImage(image.url);
            msgEmbed.addFields({
                name: "Temperatuur",
                value: data.main.temp + " C"
            }, {
                name: "Gevoelstemperatuur",
                value: data.main.feels_like + " C"
            }, {
                name: "Minimum temperatuur",
                value: data.main.temp_min + " C"
            }, {
                name: "Maximum temperatuur",
                value: data.main.temp_max + " C"
            }, {
                name: utils_1.TextEncodings.whiteSpace,
                value: "-"
            }, {
                name: "Luchtdruk",
                value: data.main.pressure.toString()
            }, {
                name: "Vochtigheid",
                value: data.main.humidity + "%"
            }, {
                name: utils_1.TextEncodings.whiteSpace,
                value: "-"
            }, {
                name: "Wind richting",
                value: (0, utils_1.DegreesToCompass)(data.wind.deg)
            }, {
                name: "Snelheid",
                value: data.wind.speed.toString()
            });
            message.channel.send({ embeds: [msgEmbed] });
        });
    });
}
exports.Execute = Execute;
