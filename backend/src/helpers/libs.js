const libs = {};
import bcrypt from "bcryptjs";

libs.randomNumber = () => {
  const possible = `qwertyuiopasdfghjklñzxcvbnm1234567890`;
  let randomNumber = 0;
  for (let i = 0; i < 6; i++) {
    randomNumber += possible.charAt(
      Math.floor(Math.random() * possible.length)
    );
  }
  return randomNumber;
};

libs.encrypPassword = async (pass) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = await bcrypt.hash(pass, salt);
  return hash;
};

libs.mathPassword = async (pass, savePass) => {
  try {
    // bcrypt.compare(pass,savePass, (err, data) => {
    //     //if error than throw error
    //     if (err) throw err

    //     //if both match than you can do anything
    //     if (data) {

    //         value = {
    //             message:"is logged",
    //             success:true
    //         }
    //     } else {
    //         value = {
    //             message:"Incorrect password",
    //             success:false
    //         }
    //     }
    // });
    const value = await bcrypt.compare(pass, savePass);
    return value;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = libs;