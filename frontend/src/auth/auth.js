import { tokenSign } from "./generate_token";

const plainLoginCtrl = async (user) => {
  try {
    const sessionToken = await tokenSign(user);

    return sessionToken;
  } catch (e) {
    console.log(e);
  }
};

export default plainLoginCtrl;
