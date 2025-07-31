import { useEffect, useState } from "react";
import { Form, Col, Container, Row } from "react-bootstrap";
import "./RunReport.css";
import BasicButton from "../../components/BasicButton";
import { useAuth } from "../../context/AuthContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { usePDF, Margin } from "react-to-pdf";
import { useAlert } from "../../context/AlertContext";

const RunReport = (params) => {
  const [reportData, setReportData] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);
  const [labelField, setLabelField] = useState("Expense");
  const [valueField, setValueField] = useState("Amount");
  const [color, setColor] = useState("#563d7c");
  const [typeOfReport, setTypeOfReport] = useState("Select");
  const [reportName, setReportName] = useState("");
  const [category, setCategory] = useState("Default");
  const { token } = useAuth();
  const { showAlert } = useAlert();
  const { toPDF, targetRef } = usePDF({ filename: "ReGraph - New Report.pdf" });

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
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
    if (typeOfReport != "Pie" && typeOfReport != "Bar") {
      showAlert("Please select a type of report!", "danger");
      return;
    }

    if (category == null || category == "") {
      showAlert("Please enter a category", "danger");
      return;
    }

    fetchGraphData();
  };

  const saveReport = async () => {
    const response = await fetch(
      "http://localhost:3002/reporting/createNewReport",
      {
        method: "POST",
        headers: {
          authorization: token, // Include the token in the header
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: category,
          reportKey: reportName,
          reportDesc: "Test",
          reportType: typeOfReport,
          filters: [],
        }),
      }
    );

    await response.json();

    if (response.status == 200) showAlert("Report saved", "success");
    else showAlert("Error saving report", "danger");
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
          category: category,
        }),
      }
    );

    await response.json();

    console.log(response);

    const resp = await fetch(
      "http://localhost:3002/data/fetchDataPointsByCategory",
      {
        method: "POST",
        headers: {
          authorization: token, // Include the token in the header
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: category,
        }),
      }
    );

    let dataResp = await resp.json();

    let datapoints = dataResp.dataPoints;
    console.log(datapoints);

    if (!Array.isArray(datapoints) || !datapoints.length) {
      showAlert(
        "No data found for category! Please upload file with this category, or enter in a different category.",
        "danger"
      );
      setDataFetched(false);
      return;
    }

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
    setDataFetched(true);
    setReportData(reportConfiguration);

    console.log(reportData);
  };

  /* useEffect(() => {
    fetchGraphData();
  }, []);*/

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
                <option value="Select">
                  Please select the type of report you want to run
                </option>
                <option value="Pie">Pie Chart</option>
                <option value="Bar">Bar Graph</option>
              </Form.Select>
              <Form.Label htmlFor="reportName">Report name</Form.Label>
              <Form.Control
                id="reportName"
                title="ReportName"
                defaultValue={reportName}
                onChange={(e) => setReportName(e.target.value)}
              />
              <Form.Label htmlFor="color">Choose a colour</Form.Label>
              <Form.Control
                type="color"
                id="color"
                defaultValue={color}
                title="Choose your color"
                onChange={(e) => setColor(e.target.value)}
              />
              <Form.Label htmlFor="category">
                Category (the category you used when uploaded your file)
              </Form.Label>
              <Form.Control
                id="category"
                defaultValue={category}
                title="Category"
                onChange={(e) => setCategory(e.target.value)}
              />
              <Form.Label htmlFor="label">
                Label field (the labels you want to see in your report from your
                data)
              </Form.Label>
              <Form.Control
                id="label"
                defaultValue={labelField}
                title="Label field"
                onChange={(e) => setLabelField(e.target.value)}
              />
              <Form.Label htmlFor="value">
                Value field (the values you want to see in your report from your
                data)
              </Form.Label>
              <Form.Control
                id="value"
                defaultValue={valueField}
                title="Value field"
                onChange={(e) => setValueField(e.target.value)}
              />
              <BasicButton
                btnClass="btnPrimary"
                btnLabel="Run report"
                btnOnClick={runReportNow}
              />
              <BasicButton
                btnClass="btnPrimary"
                btnLabel="Save this report"
                btnOnClick={saveReport}
              />
              <BasicButton
                btnClass="btnPrimary"
                btnLabel="Download as PDF"
                btnOnClick={() => toPDF()}
              />
            </Form>
          </Col>
        </Row>
        <Row>
          <div ref={targetRef} id="chartCanvas" class="mx-auto">
            {dataFetched ? (
              <div>
                <h4 className="reportHeader">Report {reportName} </h4>
                <p>Category: {category}</p>
                <br />
                {typeOfReport == "Bar" ? (
                  <Bar data={reportData} />
                ) : typeOfReport == "Pie" ? (
                  <Pie data={reportData} />
                ) : null}
                <br /> <br />
                <p>Generated by ReGraph - {new Date().toLocaleString()} </p>
              </div>
            ) : null}
          </div>
        </Row>
      </Container>
    </div>
  );
};

export default RunReport;
