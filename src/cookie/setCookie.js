import Cookie from "js-cookie";

const setCookie = (cookiename, usrin) => {
    Cookie.set(cookiename, usrin, {
        expires: 1, // one day
        secure: true,
        sameSite: 'strict',
        path: '/login'
    });
};

export default setCookie;