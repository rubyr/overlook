import chai from 'chai';
import LoginManager from '../src/login-manager';
const expect = chai.expect;
import spies from 'chai-spies';
chai.use(spies);

describe('LoginManager', function() {
  let loginUser;
  let loginAdmin;
  let loginInvalidUserName;
  let loginInvalidUserPass;
  this.beforeEach(function() {
    loginUser = new LoginManager('customer23', 'overlook2019');
    loginAdmin = new LoginManager('manager', 'overlook2019');
    loginInvalidUserName = new LoginManager('jeff', 'flamingmonkeys231');
    loginInvalidUserPass = new LoginManager('jeff', 'flamingmonkeys231');
    chai.spy.on(global, 'fetch');
  });

  this.afterEach(function() {
    chai.spy.restore();
  });

  it('should be a function', function() {
    expect(LoginManager).to.be.a('function');
  });

  it('should instantiate a new LoginManager', function() {
    expect(loginUser).to.be.an.instanceof(LoginManager);
  });

  describe('getId', function() {
    it('should return the ID of the user logging in', function() {
      expect(loginUser.getId()).to.equal(23);
    });

    it('should return \'manager\' if a manager logs in', function() {
      expect(loginAdmin.getId()).to.equal('manager');
    });

    it('should return null if an invalid username is passed', function() {
      expect(loginInvalidUserName.getId()).to.equal(null);
    });

    it('should return null if an invalid password is passed', function() {
      expect(loginInvalidUserPass.getId()).to.be.equal(null);
    });
  });

  describe('validate', function() {
    it('should return true if both username and password are accepted for a user', function() {
      expect(loginUser.validate()).to.equal(true);
    });

    it('should return true if both username and password are accepted for a manager', function() {
      expect(loginAdmin.validate()).to.equal(true);
    });

    it('should return false if an invalid username is passed', function() {
      expect(loginInvalidUserName.validate()).to.equal(false);
    });

    it('should return false if an invalid password is passed', function() {
      expect(loginInvalidUserPass.validate()).to.equal(false);
    });
  });

  describe('validatePass', function() {
    it('should accept a correct password', function() {
      expect(loginUser.validatePass('overlook2019').to.equal(false));
    });

    it('should reject an incorrect password', function() {
      expect(loginUser.validatePass('asdbadsgr').to.equal(false));
    });
  });
});
