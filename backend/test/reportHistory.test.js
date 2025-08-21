const ReportHistoryController = require("../controllers/report-history-controller");
const { createRequest, createResponse } = require("node-mocks-http");
const mockingoose = require("mockingoose");

describe("Report history", () => {
  let req, res;

  beforeEach(() => {
    req = createRequest();
    /* The below would be done via our auth middleware from the JWT token passed in with the request
       But since we are not testing middleware, only the controller functions directly, we mock it */
    req.userData = {
      email: "decodedToken.email",
      userKey: "decodedToken.userKey",
    };

    res = createResponse();
    mockingoose.resetAll();
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("create new report history", async () => {
    const newReportHistory = {
      reportKey: "testNewReportHistory",
    };

    req.body = newReportHistory;

    //Mock mongodb to return specifics for this test.
    mockingoose.Report.toReturn(newReportHistory, "findOne"); //Mock that the report exists
    mockingoose.ReportHistory.toReturn(newReportHistory, "save");

    await ReportHistoryController.addReportHistory(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getData()).toContain("Created new report history record");
  });

  it("create new report history - report does not exist", async () => {
    const newReportHistory = {
      reportKey: "ReportDoesNotExist",
    };

    req.body = newReportHistory;

    //Mock mongodb to return specifics for this test.
    mockingoose.Report.toReturn(null, "findOne"); //Mock that the report does not exist
    mockingoose.ReportHistory.toReturn(newReportHistory, "save");

    await ReportHistoryController.addReportHistory(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getData()).toContain(
      "Invalid report key provided, unable to save report history."
    );
  });

  it("fetch all report history - no data", async () => {
    req.body = { reportKey: "SomeReport" };
    //Mock mongodb to return specifics for this test.
    mockingoose.ReportHistory.toReturn([], "find");

    await ReportHistoryController.fetchAllReportHistory(req, res);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData()).reportHistory).toHaveLength(0);
  });

  it("fetch all report history - data exists", async () => {
    const reportHistory = [
      {
        reportKey: "test1",
        reportRunDate: new Date().toDateString(),
      },
      {
        reportKey: "test1",
        reportRunDate: new Date().toDateString(),
      },
    ];

    //Mock mongodb to return specifics for this test.
    mockingoose.ReportHistory.toReturn(reportHistory, "find");

    await ReportHistoryController.fetchAllReportHistory(req, res);

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res._getData()).reportHistory).toHaveLength(2);
  });
});
