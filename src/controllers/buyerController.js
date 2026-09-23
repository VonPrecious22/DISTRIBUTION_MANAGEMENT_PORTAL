
const dashboard = (req, res) => {
  res.render("buyer/dashboard", { user: req.session.user });
};

module.exports = { dashboard };
