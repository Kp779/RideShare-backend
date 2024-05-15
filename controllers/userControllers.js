const users = require("../models/userSchema");
const userotp = require("../models/userOtp");
const nodemailer = require("nodemailer");
const Rides = require("../models/newRides");
const crypto = require('crypto');
const { start } = require("repl");

// email config
const tarnsporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})


exports.userregister = async (req, res) => {
    const { fname, email, password } = req.body;

    if (!fname || !email || !password) {
        res.status(400).json({ error: "Please Enter All Input Data" })
    }

    try {
        const presuer = await users.findOne({ email: email });

        if (presuer) {
            res.status(400).json({ error: "This User Allready exist in our db" })
        } else {
            const userregister = new users({
                fname, email, password
            });

            // here password hasing

            const storeData = await userregister.save();
            res.status(200).json(storeData);
        }
    } catch (error) {
        res.status(400).json({ error: "Invalid Details", error })
    }

};

//get user api
exports.getRegisteredUsers=async (req, res) => {
    try {
      const user = await users.find();
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };



// user send otp
exports.userOtpSend = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        res.status(400).json({ error: "Please Enter Your Email" })
    }


    try {
        const presuer = await users.findOne({ email: email });

        if (presuer) {
            const OTP = Math.floor(100000 + Math.random() * 900000);

            const existEmail = await userotp.findOne({ email: email });


            if (existEmail) {
                const updateData = await userotp.findByIdAndUpdate({ _id: existEmail._id }, {
                    otp: OTP
                }, { new: true }
                );
                await updateData.save();

                const mailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: "Sending Email For Otp Validation",
                    text: `OTP:- ${OTP}`
                }


                tarnsporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log("error", error);
                        res.status(400).json({ error: "email not send" })
                    } else {
                        console.log("Email sent", info.response);
                        res.status(200).json({ message: "Email sent Successfully" })
                    }
                })

            } else {

                const saveOtpData = new userotp({
                    email, otp: OTP
                });

                await saveOtpData.save();
                const mailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: "Sending Email For Otp Validation",
                    text: `OTP:- ${OTP}`
                }

                tarnsporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log("error", error);
                        res.status(400).json({ error: "email not send" })
                    } else {
                        console.log("Email sent", info.response);
                        res.status(200).json({ message: "Email sent Successfully" })
                    }
                })
            }
        } else {
            res.status(400).json({ error: "This User Not Exist In our Db" })
        }
    } catch (error) {
        res.status(400).json({ error: "Invalid Details", error })
    }
};


exports.userLogin = async(req,res)=>{
    const {email,otp} = req.body;

    if(!otp || !email){
        res.status(400).json({ error: "Please Enter Your OTP and email" })
    }

    try {
        const otpverification = await userotp.findOne({email:email});

        if(otpverification.otp === otp){
            const preuser = await users.findOne({email:email});

            // token generate
            const token = await preuser.generateAuthtoken();
            console.log("jwt token is this:",token);
           res.status(200).json({message:"Login Succesfully Done. Taking you to the dashboard",userToken:token,
            loggedUser:preuser
           });

        }else{
            res.status(400).json({error:"Invalid Otp"})
        }
    } catch (error) {
        res.status(400).json({ error: "Invalid Details", error })
    }
}

exports.newRideCreation=async (req, res) => {
    try {
      const Ride = await Rides.find();
      res.json(Ride);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.newRide = async (req, res) => {
    const { name, start, destination, route, startTime } = req.body;
  
    const newRide = new Rides({ name, start, destination, route, startTime });
  
    try {
      const savedRide = await newRide.save();
      res.json(savedRide);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.editRide=async (req, res) => {
    const { name, start, destination, route, startTime } = req.body;
  
    try {
      const updateRide = await Rides.findByIdAndUpdate(
        req.params.id,
        { name,start, destination, route, startTime },
        { new: true }
      );
      res.json(updatedRide);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.deleteRide = async (req, res) => {
    try {
      const deletedRide = await Rides.findByIdAndDelete(req.params.id);
      res.json(deletedRide);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.deleteUser = async (req, res) => {
    try {
      const deletedUser = await users.findByIdAndDelete(req.params.id);
      res.json(deletedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.getUserByID = async (req,res) =>{
        const id = req.params.id;
        users.findById({_id:id})
        .then(userFound => res.json(userFound))
        .catch(err => res.json(err));
  }

  exports.updateUser = async(req,res) =>{
    const id = req.params.id;
    users.findByIdAndUpdate({_id:id},{
        fname:req.body.fname , 
        email: req.body.email , 
        role: req.body.role})
    .then(users => res.json(users))
    .catch(err => res.json(err));
  };

 exports.requestRide = async(req,res) => {
  const {fname} =req.body;
  // console.log(fname)
  try{
    const ride = await Rides.findOne({ name: fname });
    // console.log(ride)
    if(ride){
      const authorName = ride.name;
      console.log("author name is:",authorName);
      const authorUser = await users.findOne({ fname: authorName });
      // console.log("author user is:",authorUser);

      if (authorUser) {
        // Retrieve the email of the user
        const authorUserEmail = authorUser.email;
        console.log("ride request is to be sent on email:", authorUserEmail);
        
        const randomToken = crypto.randomBytes(10).toString('hex');
        const link = `http://localhost:3000/confirm-ride/${randomToken}`;
      
          // Continue with sending email
          const mailOptions = {
            from: process.env.EMAIL,
            to: authorUserEmail,
            subject: "Sending Email For Ride RequesT",
            text: `
            Do you approve of this ride request??
            if you do please go ahead with email confirmation 
            else reject.
  
            Click the given link to comfirn/reject a ride request: 
            ${link}
            
            I hope you found your desired pool partner.
            Enjoy ride!
            
            Regards,
            RideShare Team`
        }
  
        tarnsporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.log("error", error);
              res.status(400).json({ error: "email not send" })
          } else {
              console.log("Email sent", info.response);
              res.status(200).json({ message: "Email sent Successfully", randomToken: randomToken  })
          }
      })
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } else {
      res.status(404).json({ error: "Ride not found" });
    }
   
    
  } catch(error){

  }
 }

 exports.getRideByID = async (req,res) =>{
  const id = req.params.id;
  // console.log("ride id: ",id)
        Rides.findById({_id:id})
        .then(rideFound => res.json(rideFound))
        .catch(err => res.json(err));
 }

 exports.editRide = async (req,res) =>{
  const id = req.params.id;
    Rides.findByIdAndUpdate({_id:id},{
        name:req.body.name , 
        start: req.body.start,
        destination: req.body.destination,
        route: req.body.route,
        startTime: req.body.time
      })
    .then(updatedride => res.json(updatedride))
    .catch(err => res.json(err));
 }