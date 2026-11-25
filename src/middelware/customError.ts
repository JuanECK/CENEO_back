export class CustomError extends Error {
    constructor(
        public readonly codeError: number | null,
        public readonly code:string,
        public readonly message: string,
    ){
        super(message);
        this.codeError = codeError;
        this.code = code;
        this.message = message;
    }
}