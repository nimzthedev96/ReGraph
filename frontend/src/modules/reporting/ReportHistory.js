import { useEffect, useState } from "react";
import BasicButton from "../../components/BasicButton";
import Table from "react-bootstrap/Table";
import { useAuth } from "../../context/AuthContext";

function ReportHistory(params) {
  const { setPage, setReportContext } = params;
  const [reportHistory, setReportHistory] = useState([]);
  const { token } = useAuth();

  const fetchReportHistory = async () => {
    const resp = await fetch(
      "http://localhost:3002/reporting/fetchAllReports",
      {
        method: "GET",
        headers: {
          authorization: token, // Include the token in the header
          "Content-Type": "application/json",
        },
      }
    );

    let dataResp = await resp.json();
    console.log(dataResp);

    setReportHistory(dataResp.reports);
    console.log(reportHistory);
  };

  const runReport = async (reportKey) => {
    setReportContext(reportKey);
    setPage("report");
  };

  useEffect(() => {
    fetchReportHistory();
  }, []);

  return (
    <div className="wrapper">
      <div className="home-container">
        <h4>Existing Reports</h4>
        <Table striped borderless variant="light" hover>
          <thead>
            <tr>
              <th>Report</th>
              <th>Description</th>
              <th>Category</th>
              <th>Created date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {reportHistory.length > 0 ? (
              reportHistory.map((item, index) => (
                <tr>
                  <td>{item.reportKey}</td>
                  <td>{item.reportDescription}</td>
                  <td>{item.category}</td>
                  <td>{item.createdDate}</td>
                  <td>
                    <BasicButton
                      btnClass="btnPrimary"
                      btnLabel="Run now"
                      btnOnClick={() => runReport(item.reportKey)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>
                  No existing reports found, create a new report
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <BasicButton
          btnClass="btnPrimary"
          btnLabel="Create a new report"
          btnOnClick={() => setPage("report")}
        />
      </div>
    </div>
  );
}

export default ReportHistory;
