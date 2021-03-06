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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchControl = void 0;
var config = require('../config');
var joi_1 = __importDefault(require("@hapi/joi"));
var lodash_1 = require("lodash");
var control_1 = require("../models/control");
var utils_1 = require("../utils");
var fetchControl = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error, MenuParams, data, controls;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                error = validate(req.params).error;
                if (error)
                    return [2 /*return*/, res.status(400).send(error.details[0].message)];
                MenuParams = req.params.menuParams;
                console.log('');
                console.log('===============================================================================================================');
                console.log('Control SQL => ' + MenuParams);
                if (req.body.tabParams) {
                    MenuParams = req.params.menuParams + req.body.tabParams;
                }
                return [4 /*yield*/, control_1.getControls(config.user.CLIENT_CODE, config.user.MODULE_CODE, MenuParams)];
            case 1:
                data = _a.sent();
                if (!data) return [3 /*break*/, 4];
                return [4 /*yield*/, data.map(function (dt) { return __awaiter(void 0, void 0, void 0, function () {
                        var placeholders, sql, records;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    dt.ControlName ? dt.ControlName = dt.ControlName.trim() : null;
                                    if (!(dt.ControlName && dt.ControlSQL)) return [3 /*break*/, 2];
                                    placeholders = lodash_1.pick(dt, ['ClientCode', 'ModuleCode', 'GCode', 'GLevel', 'AType', 'ADType', 'TType', 'TDType', 'VDType', 'VType', 'ACode', 'UIType', 'ALevel', 'PCode', 'LCode']);
                                    sql = utils_1.formatSql(dt.ControlSQL, placeholders);
                                    dt.ControlSQL = sql;
                                    return [4 /*yield*/, control_1.getSubControls(dt.ControlName, sql, placeholders)];
                                case 1:
                                    records = _a.sent();
                                    if (records) {
                                        dt.ControlSQL = records[0];
                                        dt.Params = records[1];
                                    }
                                    _a.label = 2;
                                case 2: return [2 /*return*/, dt];
                            }
                        });
                    }); })];
            case 2:
                controls = _a.sent();
                return [4 /*yield*/, Promise.all(controls)];
            case 3:
                data = _a.sent();
                console.log('');
                console.log('===============================================================================================================');
                console.log('');
                console.log('');
                console.log('');
                res.status(200).json(data);
                return [3 /*break*/, 5];
            case 4:
                console.log("Cant retrieve data of Menuparams: " + req.params.menuParams);
                console.log('===============================================================================================================');
                console.log('');
                console.log('');
                console.log('');
                res.status(404).send("Cant retrieve data of Menuparams: " + req.params.menuParams);
                _a.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.fetchControl = fetchControl;
function validate(input) {
    var schema = joi_1.default.object({
        menuParams: joi_1.default.string().min(2).pattern(/^[aA-zZ]+$/).required()
    });
    return schema.validate(input);
}
