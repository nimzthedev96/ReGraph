import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Home.css";
import ReportHistory from "./ReportHistory";
import UploadFile from "./UploadFile";

function Home(params) {
  const { setPage, setReportContext } = params;

  return (
    <div className="wrapper">
      <Container className="home-container">
        <Row>
          <h3 className="page-title">Welcome to ReGraph!</h3>
          <p>
            If you're new here, go ahead and upload a new file to generate your
            first report...
          </p>
          <p>
            Add a category if you would like to use ReGraph for different sets
            of data - and different reports.
          </p>
          <p>
            Otherwise, re-run an existing report. You can also upload a new
            file, and use an existing category to run your report against all
            the data you have uploaded.
          </p>
          <p>It's as easy as that!</p>
        </Row>

        <Row>
          <Col lg={4} xs={12}>
            <UploadFile setPage={setPage} />
          </Col>
          <Col lg={2} xs={0}></Col>
          <Col lg={6} xs={12}>
            <ReportHistory
              setPage={setPage}
              setReportContext={setReportContext}
            />
          </Col>
        </Row>

        <Row></Row>
      </Container>
    </div>
  );
}

export default Home;
