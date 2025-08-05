const DataPointController = require("../controllers/datapoint-controller");
const { createRequest, createResponse } = require("node-mocks-http");
const mockingoose = require("mockingoose");

describe("Data points", () => {
  let req, res;

  beforeEach(() => {
    req = createRequest();
    res = createResponse();
    mockingoose.resetAll();
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("Get data point fields", async () => {
    const dp = [
      {
        data: {
          Field: "Some arbitrary value",
          AnotherField: "Another arbitrary value",
        },
      },
    ];
    req.body = {
      category: "test",
    };
    // The below would be done via our auth middleware from the JWT token
    // But since we are not testing middleware, only the controller functions
    // directly, we mock it
    req.userData = {
      email: "decodedToken.email",
      userKey: "decodedToken.userKey",
    };

    //Mock mongodb to return specifics for this test.
    mockingoose.DataPoint.toReturn(dp, "find");

    await DataPointController.getDataPointFields(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getData()).toContain("Datapoint keys retrieved");
    expect(res._getData()).toContain("Field");
    expect(res._getData()).toContain("AnotherField");
  });

  it("Fetch all data points", async () => {
    const dps = [
      {
        category: "test",
        source: "test",
        data: {
          Expense: "Utilities",
          Amount: 100,
        },
      },
      {
        category: "test",
        source: "test",
        data: {
          Expense: "Rent",
          Amount: 500,
        },
      },
      {
        category: "test",
        source: "test",
        data: {
          Expense: "Car",
          Amount: 175,
        },
      },
    ];

    // The below would be done via our auth middleware from the JWT token
    // But since we are not testing middleware, only the controller functions
    // directly, we mock it
    req.userData = {
      email: "decodedToken.email",
      userKey: "decodedToken.userKey",
    };

    //Mock mongodb to return specifics for this test.
    mockingoose.DataPoint.toReturn(dps, "find");

    await DataPointController.fetchAllDataPoints(req, res);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData()).dataPoints).toHaveLength(3);
  });
});
