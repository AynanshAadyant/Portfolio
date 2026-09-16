import { AuthService } from './services/AuthService.js';
import { requireAdmin } from './middlewares/authMiddleware.js';

export const login = AuthService.login;
export { requireAdmin };
export default { login, requireAdmin };
