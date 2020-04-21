import chai from 'chai';
import LoginManager from '../src/login-manager';
const expect = chai.expect;

describe('LoginManager', function() {
  let login;
  let loginAdmin;
  let loginInvalid;
  let userData;
  this.beforeEach(function() {
    userData = [{
      id: 1,
      name: "Leatha Ullrich"
    },
    {
      id: 2,
      name: "Rocio Schuster"
    },
    {
      id: 3,
      name: "Kelvin Schiller"
    }];

    login = new LoginManager();
    login.login('customer2', userData)

    loginAdmin = new LoginManager;
    loginAdmin.login('manager', userData);

    loginInvalid = new LoginManager;
    loginInvalid.login('abchello', userData);
  });

  it('should be a function', function() {
    expect(LoginManager).to.be.a('function');
  });

  it('should instantiate a new LoginManager', function() {
    expect(login).to.be.an.instanceof(LoginManager);
  });

  describe('login', function() {
    it('should accept a valid username and password', function() {
      expect(login.valid).to.equal(true);
    });
    
    it('should load user data', function() {
      expect(login.userData).to.deep.equal({
        id: 2,
        name: "Rocio Schuster"
      });
    });

    it('should load user id', function() {
      expect(login.id).to.equal(2);
    });

    it('should load all user data if manager logs in', function() {
      expect(loginAdmin.userData).to.equal(userData);
    });

    it('should load manager as id when manager logs in', function() {
      expect(loginAdmin.id).to.equal('manager');
    });

    it('should not log in an invalid user', function() {
      expect(loginInvalid.valid).to.equal(false);
    });
  });

  describe('validate', function() {
    it('should return true if the user login is valid', function() {
      expect(login.validate()).to.equal(true);
    });

    it('should return true if the manager login is valid', function() {
      expect(loginAdmin.validate()).to.equal(true);
    });

    it('should return false if the user login is invalid', function() {
      expect(loginInvalid.validate()).to.equal(false);
    });
  });

  describe('validatePass', function() {
    it('should accept a correct password', function() {
      expect(login.validatePass('overlook2019')).to.equal(true);
    });

    it('should reject an incorrect password', function() {
      expect(login.validatePass('asdbadsgr')).to.equal(false);
    });
  });

  describe('getId', function() {
    describe('validate', function() {
      it('should return a user id', function() {
        expect(login.getId()).to.equal(2);
      });
  
      it('should return a manager id', function() {
        expect(loginAdmin.getId()).to.equal('manager');
      });
  
      it('should return null if the user login is invalid', function() {
        expect(loginInvalid.getId()).to.equal(null);
      });
    });
  })
});
