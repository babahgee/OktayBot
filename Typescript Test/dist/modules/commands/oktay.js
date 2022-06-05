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
const canvas_1 = require("../essentials/canvas");
function GetHelp() {
    const dict = {
        command: "oktay",
        description: "Oktay?!?!??!!??"
    };
    return dict;
}
exports.GetHelp = GetHelp;
function createNoAttachmentsEmbedMessage() {
    const message = new discord_js_1.MessageEmbed();
    message.setTitle("Nigard");
    message.setDescription(`Er zijn geen bijlagen toegevoegd. Om deze opdracht uit te voeren.`);
    message.setTimestamp();
    message.setColor("RANDOM");
    message.setThumbnail("https://www.expoxl.nl/wp-content/uploads/sex-bel-ring-for-sex.jpg");
    return message;
}
function Execute(message, commandArguments, client, player) {
    return __awaiter(this, void 0, void 0, function* () {
        if (message.attachments.size === 0)
            return message.reply({ embeds: [createNoAttachmentsEmbedMessage()] });
        //@ts-expect-error
        const attachment = message.attachments.first();
        const oktay = yield (0, canvas_1.createOktay)(attachment.url);
        const customAttachment = new discord_js_1.MessageAttachment(oktay, "oktay.png");
        const embedMessage = new discord_js_1.MessageEmbed();
        embedMessage.setThumbnail("attachment://oktay.png");
        message.channel.send({ files: [customAttachment] });
        message.delete();
    });
}
exports.Execute = Execute;
