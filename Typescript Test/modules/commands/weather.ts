import { Player } from "discord-player";
import { Client, Message, MessageEmbed } from "discord.js";
import { DegreesToCompass, HelpDictionary, Prefix, TextEncodings } from "../utils";

const weather = require("openweather-apis"),
    googleImages = require("google-images");

const googleClient = new googleImages(process.env.GOOGLE_SE_ID, process.env.GOOGLE_SE_TOKEN);

export function GetHelp(): HelpDictionary {

    const dictionary: HelpDictionary = {
        command: "weather",
        description: "Als jij wilt weten hoe warm het is waar jij woont, kan je dat hiermee doen.",
        keyword: "plaatsnaam"
    }

    return dictionary;
}

export function Execute(message: Message, commandArguments: Array<string>, client: Client, player: Player) {

    let place: string = commandArguments[0];

    if (place === "") {

        message.channel.send("Er is geen locatie opgegeven.");

        return;
    }

    for (let i = 0; i < place.length; i++) {

        if (place.charAt(i) == " ") place = place.replace(" ", ""); 
    }


    weather.setLang("en");
    weather.setCity(place);
    weather.setUnits("metric");
    weather.setAPPID(process.env.WEATHER_API_TOKEN);

    weather.getAllWeather(async function (err: any, data: any) {

        if (data === null) {

            message.channel.send(`Geen weer gerelateerde informatie gevonden over ${place}.`);

            console.log(err);

            return;
        }

        const image = await googleClient.search(data.name);

        const msgEmbed: MessageEmbed = new MessageEmbed();

        msgEmbed.setColor("#ff9696");
        msgEmbed.setTitle(data.name);
        msgEmbed.setAuthor({ name: message.author.username });
        msgEmbed.setDescription(`Huidige weer status voor ${new Date()}`);
        msgEmbed.setImage(image.url);

        msgEmbed.addFields(
            {
                name: "Temperatuur",
                value: data.main.temp + " C"
            },
            {
                name: "Gevoelstemperatuur",
                value: data.main.feels_like + " C"
            },
            {
                name: "Minimum temperatuur",
                value: data.main.temp_min + " C"
            },
            {
                name: "Maximum temperatuur",
                value: data.main.temp_max + " C"
            },
            {
                name: TextEncodings.whiteSpace,
                value: "-"
            },
            {
                name: "Luchtdruk",
                value: data.main.pressure.toString()
            },
            {
                name: "Vochtigheid",
                value: data.main.humidity + "%"
            },
            {
                name: TextEncodings.whiteSpace,
                value: "-"
            },
            {
                name: "Wind richting",
                value: DegreesToCompass(data.wind.deg)
            },
            {
                name: "Snelheid",
                value: data.wind.speed.toString()
            }
        );

        message.channel.send({ embeds: [msgEmbed] });
    });
}