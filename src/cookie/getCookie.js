import Cookies from "js-cookie";

const authToken = Cookies.get('authToken');
console.log(authToken);


export default authToken;