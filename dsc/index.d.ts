import Snoowrap, { SnoowrapOptions } from "snoowrap";
declare class CheatWrap {
    queue: Snoowrap[];
    constructor(creds: SnoowrapOptions[]);
    private static init;
    static limitMessage: string;
    private getInstance;
    run(method: (instance: Snoowrap) => any, retries?: {
        current: number;
        max: number;
    }, identifier?: keyof Snoowrap, identifierResult?: any): Promise<any>;
    private static runner;
}
export default CheatWrap;
//# sourceMappingURL=index.d.ts.map