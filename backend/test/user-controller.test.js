const userModel = require("../models/user");
const userController = require("../controllers/user-controller");

describe("User controller test cases", () => {
  test("Register user function", async () => {
    const mockUser = { _id: "123", name: "Test User" };

    jest.spyOn(userModel, "save()").mockResolvedValue(mockUser);
    jest.spyOn(userModel, "findOne").mockResolvedValue({});
    const result = await registerUser("123");
    expect(result).toEqual(mockUser);
    expect(User.findById).toHaveBeenCalledWith("123");
  });
});
