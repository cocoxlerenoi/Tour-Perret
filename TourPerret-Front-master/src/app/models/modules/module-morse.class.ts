import { HashMap, Module } from './module.class';
import { Sequence } from '../sequence.class';
import { CouleurRGB, Utils } from '../../services/utils.class';
import { InputText } from './inputs/input-text.class';
import { InputNumber } from './inputs/input-number';
import { InputColor } from './inputs/input-color.class';
import { Scenario } from '../scenario.class';

const MORSE_LETTERS: HashMap = {
    'a': '.-',    'b': '-...',  'c': '-.-.', 'd': '-..',
    'e': '.',     'f': '..-.',  'g': '--.',  'h': '....',
    'i': '..',    'j': '.---',  'k': '-.-',  'l': '.-..',
    'm': '--',    'n': '-.',    'o': '---',  'p': '.--.',
    'q': '--.-',  'r': '.-.',   's': '...',  't': '-',
    'u': '..-',   'v': '...-',  'w': '.--',  'x': '-..-',
    'y': '-.--',  'z': '--..',  ' ': ' ',
    '1': '.----', '2': '..---', '3': '...--', '4': '....-',
    '5': '.....', '6': '-....', '7': '--...', '8': '---..',
    '9': '----.', '0': '-----',
};

export class ModuleMorse extends Module {

    public static readonly NOM: string = 'Code Morse';
    public static readonly DESCRIPTION: string = 'Ecrit en morse';
    public static readonly ICONE: string = 'morse';
    public static readonly INPUTS = {
        texte: new InputText('Texte', null, ['Le texte à transformer en morse'], ['grenoble']),
        couleurs: new InputColor('Couleur', null, [], ['#6d4c41']),
        dureeSymbole: new InputNumber('Durée d\'un symbole', null, [], [250], true, 50, 50, Scenario.getMaxScenarioTime())
    };

    public constructor() {
        super(ModuleMorse.NOM, ModuleMorse.DESCRIPTION, ModuleMorse.ICONE, ModuleMorse.INPUTS);
    }

    protected process() {
        this.duree = 0;
        this.inputs['dureeSymbole'].checkValue();
        this.inputs['texte'].checkValue();
        this.inputs['texte'].value[0] = Utils.removeAccent(this.inputs['texte'].getFirst().toLowerCase());

        const dureeTiret: number = 3 * this.inputs['dureeSymbole'].getFirst();
        const dureeSpaceBetweenSymboles = this.inputs['dureeSymbole'].getFirst();
        const dureeSpaceBetweenLetters: number = 3 * this.inputs['dureeSymbole'].getFirst();
        const dureeSpaceBetweenWords: number = 7 * this.inputs['dureeSymbole'].getFirst();

        const cNoirRGB: CouleurRGB = Utils.convertColorHexToRGB('#000');
        const c0RGB: CouleurRGB = Utils.convertColorHexToRGB(this.inputs['couleurs'].getFirst());

        for (const c of Array.from(this.inputs['texte'].getFirst())) {
            const code: string = MORSE_LETTERS[<string>c];
            if (code != null) {
                if (code !== ' ') {
                    const morseC: any = Array.from(code);
                    for (const ci in morseC) {
                        const cm = morseC[ci];

                        if (cm === '.') {
                            this.sequences.push(new Sequence(c0RGB, this.inputs['dureeSymbole'].getFirst()));
                            this.duree += this.inputs['dureeSymbole'].getFirst();
                        } else {
                            this.sequences.push(new Sequence(c0RGB, dureeTiret));
                            this.duree += dureeTiret;
                        }

                        if (ci < morseC.length) {
                            this.sequences.push(new Sequence(cNoirRGB, dureeSpaceBetweenSymboles));
                            this.duree += dureeSpaceBetweenSymboles;
                        }
                    }
                    this.sequences.push(new Sequence(cNoirRGB, dureeSpaceBetweenLetters));
                    this.duree += dureeSpaceBetweenLetters;
                } else {
                    this.sequences.push(new Sequence(cNoirRGB, dureeSpaceBetweenWords));
                    this.duree += dureeSpaceBetweenWords;
                }
            }
        }
    }

    public setDuration(value: number): void {
        let nbPointDuree: number = 0;

        for (const c of Array.from(this.inputs['texte'].getFirst())) {
            const code: string = MORSE_LETTERS[<string>c];
            if (code != null) {
                if (code !== ' ') {
                    const morseC: any = Array.from(code);
                    for (const ci in morseC) {
                        const cm = morseC[ci];

                        if (cm === '.') {
                            nbPointDuree++;
                        } else {
                            nbPointDuree += 3;
                        }

                        if (ci < morseC.length) {
                            nbPointDuree++;
                        }
                    }
                    nbPointDuree += 3;
                } else {
                    nbPointDuree += 7;
                }
            }
        }

        this.inputs['dureeSymbole'].value[0] = Math.round(value / nbPointDuree);
        this.inputs['dureeSymbole'].checkValue();
    }
}
