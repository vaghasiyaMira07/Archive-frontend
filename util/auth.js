
const loggedIn = () => {
    return !!localStorage.getItem('ApiToken');
}

export default loggedIn;