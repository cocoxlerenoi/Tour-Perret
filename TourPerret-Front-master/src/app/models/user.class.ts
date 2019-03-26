export class User {

    constructor(
        public id: number = 0,
        public mail: string = null,
        public password: string = null,
        public nom: string = null,
        public type: string = 'base',
        public date: string = null
    ) { }
}
