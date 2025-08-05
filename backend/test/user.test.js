const UserController = require("../controllers/user-controller");
const { createRequest, createResponse } = require("node-mocks-http");
const mockingoose = require("mockingoose");

describe("User", () => {
  let req, res;

  beforeEach(() => {
    req = createRequest();
    res = createResponse();
    mockingoose.resetAll();
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("register a new user - no errors", async () => {
    const mockUser = {
      _id: "123",
      firstName: "Test",
      lastName: "Test",
      email: "test@test.com",
      password: "Test123!",
    };

    req.body = mockUser;

    //Mock mongodb to return specifics for this test.
    mockingoose.User.toReturn(mockUser, "save");
    mockingoose.User.toReturn(null, "findOne");

    await UserController.registerUser(req, res);

    expect(res.statusCode).toBe(201);
    expect(res._getData()).toContain("userEmail");
    expect(res._getData()).toContain("userKey");
  });
});
