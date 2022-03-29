export const TextEncodings = {
    graveAccent: "\u0060",
    whiteSpace: "\u200b"
}
export const Prefix: string = "!bb"; 



export interface CommandExecution {
    Execute: Function
}

/**
 * Uses the given angle to return the right compass value.
 * @param num {number}
 */
export function DegreesToCompass(angle: number): string {

    const val = Math.floor((angle / 22.5) + 0.5);

    const arr = ["Noord", "Noord NO", "Noord oost", "Oost NO", "Oost", "Oost ZO", "Zuid oost", "Zuid SO", "Zuid", "Zuid ZW", "Zuid west", "West ZW", "West", "West NW", "Noord west", "Noord NW"];

    return arr[(val % 16)];
}