class CookieManager {
  // Get a cookie by name
  static getCookie(name) {
    const regex = new RegExp(
      `(?:(?:^|.*;\\s*)${name}\\s*\\=\\s*([^;]*).*$)|^.*$`
    );
    const cookieValue = document.cookie.replace(regex, "$1");
    return cookieValue !== "" ? decodeURIComponent(cookieValue) : null;
  }

  // Set a cookie
  static setCookie(name, value, options = {}) {
    const cookieOptions = Object.assign({ path: "/" }, options);
    const cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    const { expires, maxAge, domain, path, secure } = cookieOptions;

    if (expires) {
      cookieOptions.expires = new Date(
        Date.now() + expires * 1000
      ).toUTCString();
    } else if (maxAge) {
      cookieOptions.expires = new Date(
        Date.now() + maxAge * 1000
      ).toUTCString();
    }

    if (domain) {
      cookieOptions.domain = domain;
    }

    if (path) {
      cookieOptions.path = path;
    }

    if (secure) {
      cookieOptions.secure = secure;
    }

    document.cookie = Object.entries(cookieOptions)
      .map(([key, value]) => `${key}=${value}`)
      .concat(cookie)
      .join("; ");
  }

  // Remove a cookie by name
  static removeCookie(name, options = {}) {
    CookieManager.setCookie(name, "", Object.assign({ expires: -1 }, options));
  }
}

export const cookies = CookieManager;
