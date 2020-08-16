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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const snoowrap_1 = __importDefault(require("snoowrap"));
const console_1 = require("console");
class CheatWrap {
    constructor(creds) {
        this.queue = CheatWrap.init(creds);
        console.log("Initialization completed");
    }
    static init(creds) {
        return creds.map((cred) => {
            return new snoowrap_1.default(cred);
        });
    }
    getInstance(identifier, identifierResult) {
        if (identifier && identifierResult) {
            for (const instance of this.queue) {
                if (instance[identifier] === identifierResult) {
                    return instance;
                }
            }
        }
        this.queue.sort((a, b) => {
            if (b.ratelimitRemaining === 0 && a.ratelimitRemaining === 0) {
                return 0;
            }
            if (b.ratelimitRemaining === 0) {
                return 1;
            }
            if (a.ratelimitRemaining === 0) {
                return -1;
            }
            return b.ratelimitExpiration - a.ratelimitExpiration;
        });
        const result = this.queue[0];
        console.log("Instance chosen from ");
        console.log(this.queue);
        return result.ratelimitRemaining > 0 || result.ratelimitRemaining == null
            ? result
            : console_1.error("All instances are exhausted, remaining time: " +
                result.ratelimitExpiration);
    }
    run(method, retries = { current: 0, max: 1 }, identifier, identifierResult) {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = this.getInstance(identifier, identifierResult);
            if (instance) {
                return CheatWrap.runner(method, retries, instance);
            }
        });
    }
    static runner(method, { current, max }, instance) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Running method for the " + current + " of maximum " + max + " allowed");
            let result;
            try {
                result = yield method(instance);
            }
            catch ({ message }) {
                if (message === CheatWrap.limitMessage) {
                    console.log("Limit Reached - changning accounts");
                    return yield CheatWrap.runner(method(instance), {
                        current: current,
                        max,
                    }, instance);
                }
                if (current < max) {
                    console.log("error accours, retrying");
                    return yield CheatWrap.runner(method, { current: current + 1, max: max }, instance);
                }
                return console_1.error("Taks failed");
            }
            console.log("Method sucessfully completed");
            return result;
        });
    }
}
CheatWrap.limitMessage = "snoowrap refused to continue because reddit's ratelimit was exceeded. For more information about reddit's ratelimit, please consult reddit's API rules at https://github.com/reddit/reddit/wiki/API.";
exports.default = CheatWrap;
//# sourceMappingURL=index.js.map