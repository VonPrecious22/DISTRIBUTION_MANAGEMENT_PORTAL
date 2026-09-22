const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.session.user) return res.redirect("/auth/login");

    if(req.session.user.role !== role){
        return res.status(403).send("access denied");
    }
    next();
  }; 
};

module.exports = requireRole;
