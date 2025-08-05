const ReportController = require("../controllers/report-controller");
const { createRequest, createResponse } = require("node-mocks-http");
const mockingoose = require("mockingoose");

describe("Report", () => {
  let req, res;

  beforeEach(() => {
    req = createRequest();
    res = createResponse();
    mockingoose.resetAll();
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("Create new report", async () => {
    const newReport = {
      reportKey: "test",
      reportDesc: "test",
      reportType: "Pie",
      filters: "",
      category: "test",
    };

    req.body = newReport;
    // The below would be done via our auth middleware from the JWT token
    // But since we are not testing middleware, only the controller functions
    // directly, we mock it
    req.userData = {
      email: "decodedToken.email",
      userKey: "decodedToken.userKey",
    };

    //Mock mongodb to return specifics for this test.
    mockingoose.Report.toReturn(newReport, "save");

    await ReportController.createNewReport(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getData()).toContain("Created new report");
  });

  it("Fetch reports - data does not exist", async () => {
    // The below would be done via our auth middleware from the JWT token
    // But since we are not testing middleware, only the controller functions
    // directly, we mock it
    req.userData = {
      email: "decodedToken.email",
      userKey: "decodedToken.userKey",
    };

    //Mock mongodb to return specifics for this test.
    mockingoose.Report.toReturn([], "find");

    await ReportController.fetchReports(req, res);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData()).reports).toHaveLength(0);
  });

  it("Fetch reports - data does exist", async () => {
    const reports = [
      {
        reportKey: "test 1",
        reportDesc: "test 1 ",
        reportType: "Pie",
        filters: [],
        category: "test",
      },
      {
        reportKey: "test 2",
        reportDesc: "test 2 ",
        reportType: "Bar",
        filters: [],
        category: "test",
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
    mockingoose.Report.toReturn(reports, "find");

    await ReportController.fetchReports(req, res);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData()).reports).toHaveLength(2);
  });
});
