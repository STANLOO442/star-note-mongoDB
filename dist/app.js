"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// app.ts
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_ejs_layouts_1 = __importDefault(require("express-ejs-layouts"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_2 = __importDefault(require("morgan"));
const db_1 = __importDefault(require("./server/config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, db_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// view engine setup
app.use(express_ejs_layouts_1.default);
app.set('views', path_1.default.join(__dirname, "../", 'views'));
app.set('layout', 'layouts/main');
app.set('view engine', 'ejs');
app.use(express_1.default.static(path_1.default.join(__dirname, '../', 'public')));
app.use('/', authRoutes_1.default);
app.use('/auth', authRoutes_1.default);
// ...
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, morgan_2.default)('combined'));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
exports.default = app;
