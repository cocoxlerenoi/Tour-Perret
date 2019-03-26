export class Utils {

    public static clone(obj: any, onlyData: boolean = true): any {
        let rtr: any = null;
        if (onlyData || obj == null) {
            let cache: Array<any> = [];
            rtr = JSON.parse(JSON.stringify(obj, function (key, value) {
                if (typeof value === 'object' && value !== null) {
                    if (cache.indexOf(value) !== -1) {
                        return;
                    }
                    cache.push(value);
                }
                return value;
            }));
            cache = null;
        } else {
            rtr = new (<any>obj.constructor)();
            for (const attribut in obj) {
                if (typeof obj[attribut] === 'object') {
                    rtr[attribut] = Utils.clone(obj[attribut], false);
                } else {
                    rtr[attribut] = obj[attribut];
                }
            }
        }

        return rtr;
    }

    public static removeAccent(strInput: String): String {
        const accents    = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
        const accentsOut = 'AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz';
        const str = strInput.split('');
        let x;

        for (let i = 0; i < str.length; i++) {
            if ((x = accents.indexOf(str[i])) !== -1) {
                str[i] = accentsOut[x];
            }
        }

        return str.join('');
    }

    public static getColorFromNumber(color: number): number[] {
        return [
            (color & (255 << 16)) >> 16,
            (color & (255 << 8)) >> 8,
            color & 255,
            0
        ];
    }

    public static convertColorRGBToNumber(color: CouleurRGB): number {
        return (color.R << 16) + (color.V << 8) + color.B;
    }

    public static convertColorHexToRGB(hex: any): CouleurRGB {
        if (hex.length == 7) {
            const hexString: string = hex.substr(1).toString();

            return {
                R: parseInt(hexString.substr(0, 2), 16),
                V: parseInt(hexString.substr(2, 2), 16),
                B: parseInt(hexString.substr(4, 2), 16),
                Ic: 100,
                Ib: 100
            };
        } else {
            const hexString: string = hex.substr(1).toString();

            return {
                R: parseInt(hexString.substr(0, 1) + hexString.substr(0, 1), 16),
                V: parseInt(hexString.substr(1, 1) + hexString.substr(1, 1), 16),
                B: parseInt(hexString.substr(2, 1) + hexString.substr(2, 1), 16),
                Ic: 100,
                Ib: 100
            };
        }
    }

    public static getOnlyDate(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    public static isDateEqual(date: Date, dateOther: Date, day: boolean = false): boolean {
        let result: boolean = date != null && dateOther != null &&
            date.getFullYear() == dateOther.getFullYear() && date.getMonth() == dateOther.getMonth();

        if (day && dateOther != null) {
            result = result && date.getDate() == dateOther.getDate();
        }

        return result;
    }

    public static isDateInf(date: Date, dateOther: Date): boolean {
        return date != null && dateOther != null && date < dateOther;
    }

    public static isDateSup(date: Date, dateOther: Date): boolean {
        return date != null && dateOther != null && date > dateOther;
    }

    public static isDateBetween(dateDebut: Date, dateFin: Date, dateDebut2: Date, dateFin2: Date): boolean {
        return dateDebut2 <= dateFin && dateFin2 >= dateDebut;
    }
}

export interface CouleurRGB {
    R: number;   // 0 <->255
    V: number;   // 0 <->255
    B: number;   // 0 <->255
    Ic: number;  // 0 <-> 100
    Ib: number;   // 0 <-> 100
}
