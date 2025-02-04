export default class Aircraft{
    
    private model!: string;
    private engine!: string;
    private certification!: string;
    //private speedAdctive!: number;
    private weight!: number;
    private flap!: number;
    private reverserAmount!: number

    constructor(model: string, engine: string, certification: string, peso: number, flap: number, reverserAmount: number){
        this.model = model;
        this.engine = engine;
        this.certification = certification;
        //this.speedAdctive = speedAdctive;
        this.weight = peso;
        this.flap = flap;
        this.reverserAmount = reverserAmount;
    }

    set setModel(model: string){
        this.model = model;
    }

    set setEngine(engine: string) {
        this.engine = engine;
    }

    set setCertification(certification: string){
        this.certification = certification;
    }

    // set setSpeedAdctive(speed: number){
    //     this.speedAdctive = speed;
    // }

    set setWeight(weight: number){
        this.weight = weight;
    }


    set setFlapValue(value: number){
        this.flap = value;
    }


    set setReverserAmount(value: number){
        this.reverserAmount = value;
    }

    get getModel(): string { return this.model; }

    get getEngine(): string { return this.engine; }

    get getCertification(): string { return this.certification; }

    // get getSpeedAdctive(): number { return this.speedAdctive; }

    get getFlapValue(): number { return this.flap; }

    get getReverserAmount(): number { return this.reverserAmount; }

    get getWeight(): number { return this.weight; }

}