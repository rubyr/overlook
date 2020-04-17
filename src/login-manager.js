class LoginManager {
  constructor() {
    this.id = null;
    this.valid = false;
    this.userData = null;
  }

  login(username, allUserData) {
    if (username.substr(0, 8) === "customer") {
      this.id = parseInt(username.match(/(\d+)/g)[0]);
      const userData = allUserData.find(user => user.id === this.id);
      if (userData) {
        this.valid = true;
        this.userData = userData;
      }
    } else if (username === "manager") {
      this.id = "manager";
      this.valid = true;
      this.userData = allUserData;
    }
  }

  getData(username) {
    return fetch('https://fe-apps.herokuapp.com/api/v1/overlook/1904/users/users')
      .then(request => request.json())
      .then(data => this.login(username, data.users))
  }

  validatePass(password) {
    return password === "overlook2019";
  }

  getId() {
    return this.id;
  }

  validate() {
    return this.valid;
  }
}

export default LoginManager;