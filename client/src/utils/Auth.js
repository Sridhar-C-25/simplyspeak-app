import { toast } from "react-toastify";
import { ApiStatus } from "../Enums/ApiStatus";
import { cookiekeys } from "../Enums/cookies";
import { cookies } from "../middleware/Stroage/Cookies.";
import { newRequest } from "../services/newRequest";
import { emitter } from "../middleware/Emitter";

// * check user authenticate or not using (cookies)
// * cookies.getCookie(cookiekeys.token) return 'undefined' also check you want

export function isAuthenticated() {
  // alert(cookies.getCookie(cookiekeys.token));
  if (
    cookies.getCookie(cookiekeys.token) &&
    cookies.getCookie(cookiekeys.token) !== "undefined"
  ) {
    return true;
  }
  return false;
}

// * logout function
export function logout() {
  newRequest("/auth/logout", {
    method: "PUT",
  })
    .then((res) => {
      if (res?.data?.status === ApiStatus.success) {
        window.location.reload();
        toast.success(res.data?.message);
        return;
      }
      // invaild key clear in client side api failed after
      cookies.removeCookie(cookiekeys.token);
    })
    .catch((err) => {
      toast.error("something went wrong!");
      console.log(err);
    });
}

export function getCurrentUserID() {
  if (isAuthenticated()) {
    const token = cookies.getCookie(cookiekeys.token);
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const userId = decodedToken.id;
    return userId;
  } else {
    return undefined;
  }
}
