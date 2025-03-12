
export const isAuthenticated = (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/user/login'); // Redirect to login if not logged in
    }
    next(); // Continue if logged in
}