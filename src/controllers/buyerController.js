const User = require("../models/user");
const dashboard = (req, res) => {
  res.render("buyer/dashboard", { user: req.session.user });
};


const userDetails = async (req, res) => {
 try{
 const userId = req.session.user.id;
 const buyer = await User.findById({ userId });
 if (!buyer) {
   return res.status(404).redirect("error/404", {
     error: "Unable to fetch Data, Please try again.",
   });
 }
 return res.status(200).render("buyer/details", { buyer });
 } catch(err){
    console.error(err);
    return res.status(500).render("error/500", {error: "Something went wrong. please try again."})
 }
};

module.exports = { dashboard, userDetails };
