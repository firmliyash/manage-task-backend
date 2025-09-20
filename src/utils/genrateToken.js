import { JWT } from "./jwt.js";

export const generateTokens = (user = {}) => {
  const accessToken = JWT.createAccessToken({
    userId: user?.id,
    email: user?.email,
    role: user?.role,
  });

  const refreshToken = JWT.createRefreshToken({
    userId: user?.id,
    email: user?.email,
    role: user?.role,
  });

  return { accessToken, refreshToken };
};
