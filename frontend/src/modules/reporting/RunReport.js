import { useEffect, useState } from "react";
import { Form, Col, Container, Row } from "react-bootstrap";
import BasicButton from "../../components/BasicButton";
import { useAuth } from "../../context/AuthContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

const RunReport = (params) => {
  const [reportData, setReportData] = useState(null);
  const [reportOptions, setReportOptions] = useState({});
  const [labelField, setLabelField] = useState("Expense");
  const [valueField, setValueField] = useState("Amount");
  const [color, setColor] = useState("#563d7c");
  const [typeOfReport, setTypeOfReport] = useState("Pie");
  const [reportName, setReportName] = useState("");
  const { token } = useAuth();

  const { page, setPage, reportContext, setReportContext } = params;
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const runReportNow = async () => {
    console.log("runReportNow called");
    fetchGraphData();
  };

  const saveReport = async () => {
    console.log("saveReport called");
  };

  const downloadReportAsPDF = async () => {
    console.log("downloadReportAsPDFReport called");
  };

  const fetchGraphData = async () => {
    const response = await fetch(
      "http://localhost:3002/data/getDataPointFields",
      {
        method: "POST",
        headers: {
          authorization: token, // Include the token in the header
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: "test",
        }),
      }
    );

    await response.json();

    console.log(response);

    //fetchDataPointsByCategory

    const resp = await fetch(
      "http://localhost:3002/data/fetchDataPointsByCategory",
      {
        method: "POST",
        headers: {
          authorization: token, // Include the token in the header
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: "test",
        }),
      }
    );

    let dataResp = await resp.json();

    let datapoints = dataResp.dataPoints;
    console.log(datapoints);

    /* Now we got to work some magic to get our various datasets */

    let labels = [];
    let datasets = [];
    datapoints.forEach((element) => {
      console.log(element);
      labels.push(element.data[labelField]);
      datasets.push(element.data[valueField]);
    });

    console.log(labels);
    console.log(datasets);

    let reportConfiguration = {};
    reportConfiguration["labels"] = labels;
    console.log(reportConfiguration);
    let ds = [];
    let ds1 = {};
    ds1["label"] = "data";
    ds1["data"] = datasets;
    ds1["backgroundColor"] = color;
    ds.push(ds1);

    reportConfiguration["datasets"] = ds;

    setReportData(reportConfiguration);

    console.log(reportData);
  };

  useEffect(() => {
    fetchGraphData();
  }, []);

  return (
    <div className="wrapper">
      <Container className="report-container">
        <h3 className="title">Run Report</h3>
        <Row>
          <Col>
            <Form>
              <Form.Label htmlFor="typeOfReport">Type of report</Form.Label>
              <Form.Select
                id="typeOfReport"
                value={typeOfReport}
                onChange={(e) => {
                  setTypeOfReport(e.target.value);
                  console.log(e.target.value);
                }}
              >
                <option value="Pie">Pie Chart</option>
                <option value="Bar">Bar Graph</option>
              </Form.Select>
              <Form.Label htmlFor="color">Choose a colour</Form.Label>
              <Form.Control
                type="color"
                id="color"
                defaultValue={color}
                title="Choose your color"
                onChange={(e) => setColor(e.value)}
              />
              <BasicButton
                btnClass="btnPrimary"
                btnLabel="Run report"
                btnOnClick={runReportNow}
              />
            </Form>
          </Col>
          <Col></Col>
          <Col>
            <Form>
              <Form.Label htmlFor="reportName">Report name</Form.Label>
              <Form.Control id="reportName" title="ReportName" />
              <BasicButton
                btnClass="btnPrimary"
                btnLabel="Save this report"
                btnOnClick={saveReport}
              />
              <BasicButton
                btnClass="btnPrimary"
                btnLabel="Download as PDF"
                btnOnClick={downloadReportAsPDF}
              />
            </Form>
          </Col>
        </Row>
        <Row>{typeOfReport == "Bar" ? <Bar data={reportData} /> : null};</Row>
        {};
      </Container>
    </div>
  );
};

export default RunReport;
