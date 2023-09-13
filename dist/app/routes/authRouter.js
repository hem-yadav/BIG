"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticationMiddleware_1 = __importDefault(require("../middleware/authenticationMiddleware"));
const router = express_1.default.Router();
router.get('/login', authenticationMiddleware_1.default.authenticate('azuread-openidconnect'));
router.post('/auth/callback', authenticationMiddleware_1.default.authenticate('azuread-openidconnect', {
    failureRedirect: '/',
}), (req, res) => {
    res.redirect('/dashboard');
});
exports.default = router;
