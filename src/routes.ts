export const publicRoutes = ["/"];
//@type {string[]}
export const authRoutes = [
  "/signin",
  "/signup",
  "/reset-password",
  "/reset-password/:token*",
  "/error", 
  "/verify-email",
];

// The prefix for the API authentication routes
// @type {string}
export const apiAuthPrefix = "/api/auth";

//@type {string}
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
