import Axios from "axios";
import { AlertContext } from "../../components/Context/AlertDetails";
import { useContext, useState } from "react";
import "./Report.css";
import { FilterList } from "@mui/icons-material";
import { LoadingContext } from "../../components/Context/Loading";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title as ChartTitle, Tooltip, Legend } from "chart.js";
import { Bar } from 'react-chartjs-2';
import Title from "../../components/Title";
ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, Tooltip, Legend);

interface Report {
    facName: string;
    subcode: string;
    subname: string;
    sec: string;
    sem: number;
    percentile: number;
    batch: number;
}

interface ReportResponse {
    details: { sem: number, batch: number, sec: string }[];
    done: boolean;
}


export default function Report() {
    const alert = useContext(AlertContext);
    const loading = useContext(LoadingContext);
    const [report, setReport] = useState<Report[]>([]);
    const [sems, setSems] = useState<number[]>([]);
    const [secs, setSecs] = useState<string[]>([]);
    const [batches, setBatches] = useState<number[]>([]);
    const [selectedBatch, setSelectedBatch] = useState<number | null>(null);
    const [selectedSem, setSelectedSem] = useState<number | null>(null);
    const [selectedSec, setSelectedSec] = useState<string>("");
    const [show, setShow] = useState<boolean>(true);
    const [term, setTerm] = useState<number>(0);
    const [showReport, setShowReport] = useState<boolean>(false);
    const [filterLowPercentile, setFilterLowPercentile] = useState<boolean>(false);
    const [filterClicked, setFilterClicked] = useState<boolean>(false);

    async function generateReport1() {
        try {
            const response = await Axios.get<ReportResponse>(`api/report1`);
            const data = response.data;
            if (data.done) {
                setTerm(1);
                const uniqueBatches = [...new Set(data.details.map(item => item.batch))];
                const sortedBatches = uniqueBatches.sort((a, b) => a - b);
                setBatches(sortedBatches);
                const uniqueSems = [...new Set(data.details.map(item => item.sem))];
                const sortedSems = uniqueSems.sort((a, b) => a - b);
                setSems(sortedSems);
                const uniqueSecs = [...new Set(data.details.map(item => item.sec))];
                const sortedSecs = uniqueSecs.sort((a, b) => a.localeCompare(b));
                setSecs(sortedSecs);
                setShow(false);
                alert?.showAlert("Report-1 generated successfully", "success");
            } else {
                alert?.showAlert("Report-1 is empty", "warning");
            }
        } catch (err) {
            console.error("Error fetching report:", err);
            alert?.showAlert("Error fetching report", "error");
        }
    }

    async function generateReport2() {
        try {
            const response = await Axios.get<ReportResponse>(`api/report2`);
            const data = response.data;
            if (data.done) {
                setTerm(2);
                const uniqueBatches = [...new Set(data.details.map(item => item.batch))];
                const sortedBatches = uniqueBatches.sort((a, b) => a - b);
                setBatches(sortedBatches);
                const uniqueSems = [...new Set(data.details.map(item => item.sem))];
                const sortedSems = uniqueSems.sort((a, b) => a - b);
                setSems(sortedSems);
                const uniqueSecs = [...new Set(data.details.map(item => item.sec))];
                const sortedSecs = uniqueSecs.sort((a, b) => a.localeCompare(b));
                setSecs(sortedSecs);
                setShow(false);
                alert?.showAlert("Report-2 generated successfully", "success");
            } else {
                alert?.showAlert("Report-2 is empty", "warning");
            }
        } catch (err) {
            console.error("Error fetching report:", err);
            alert?.showAlert("Error fetching report", "error");
        }
    }

    function handleBatchClick(batch: number) {
        setSelectedBatch(batch);
        setSelectedSem(null);
        setSelectedSec("");
        setShowReport(false);
        setFilterLowPercentile(false);
        setFilterClicked(false);
    }

    function handleSemClick(sem: number) {
        setSelectedSem(sem);
        setSelectedSec("");
        setFilterLowPercentile(false);
        setFilterClicked(false);
        setShowReport(false);
    }

    function handleSecClick(sec: string) {
        setSelectedSec(sec);
        setFilterLowPercentile(false);
        setFilterClicked(false);
        if (selectedBatch !== null && selectedSem !== null) {
            Axios.get<{ report: Report[] }>(`api/fetchreport${term}?batch=${selectedBatch}&sem=${selectedSem}&sec=${sec}`)
                .then(({ data }) => {
                    const sortedReport = data.report.sort((a, b) => a.sec.localeCompare(b.sec));
                    setReport(sortedReport);
                    setShowReport(true);
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            console.error("Batch or Semester is not selected");
        }
    }

    const handleDownload = async () => {
        loading?.showLoading(true, "Downloading file...");

        try {
            const response = await Axios.get(
                `/api/download/downloadreport`, {
                params: {
                    sem: selectedSem,
                    sec: selectedSec,
                    batch: selectedBatch,
                    count: term,
                },
                responseType: "blob"
            }
            );

            if (response.data) {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;

                const contentDisposition = response.headers["content-disposition"];
                let fileName = "downloaded_file.docx";
                if (contentDisposition) {
                    const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
                    if (fileNameMatch && fileNameMatch.length > 1) {
                        fileName = fileNameMatch[1];
                    }
                }

                link.setAttribute("download", fileName);
                document.body.appendChild(link);
                link.click();
                window.URL.revokeObjectURL(url);

                alert?.showAlert("File downloaded successfully", "success");
            } else {
                alert?.showAlert("No data found", "warning");
            }
        } catch (error) {
            alert?.showAlert("Error while downloading file", "error");
        } finally {
            loading?.showLoading(false);
        }
    };


    // const data = {
    //     labels: report.map(r => r.subname),
    //     datasets: [
    //         {
    //             label: "Percentile",
    //             data: report.map(r => r.percentile), 
    //             backgroundColor: report.map(r => (r.percentile > 70 ? '#3CB371' : "red" )),
    //         },
    //     ],
    // };

    // const options = {
    //     scales: {
    //         y: {
    //             ticks: {
    //                 stepSize: 20,
    //             },
    //             min: 20,
    //             max: 100,
    //         },
    //     },
    // };


    const data = {
        labels: report.map(r => r.subname),
        datasets: [
            {
                label: 'Percentile',
                data: report.map(r => r.percentile),
                backgroundColor: (context: { dataset: { data: { [x: string]: any; }; }; dataIndex: string | number; }) => {
                    const value = context.dataset.data[context.dataIndex];
                    return value >= 70 ? '#3CB371' : 'red';
                },
                barThickness: 35,
            },
        ],
    };

    const options = {
        indexAxis: 'y' as const,
        scales: {
            x: {
                ticks: {
                    stepSize: 20,
                },
                min: 0,
                max: 100,
            },
            y: {
                ticks: {
                    font: {
                        weight: 'bold' as const,
                        size: 15,
                    },
                },
            },
        },
    };



    return (
        <>
            <Title title="Report" />
            {show ? (
                <div className="center-button">
                    <button
                        type="button"
                        className="green-button-filled col-span-1 flex items-center gap-2"
                        onClick={generateReport1}
                    >
                        Generate Report 1
                    </button>
                    <button
                        type="button"
                        className="green-button-filled col-span-1 flex items-center gap-2"
                        onClick={generateReport2}
                    >
                        Generate Report 2
                    </button>
                </div>
            ) : (
                <>
                    <div className="filter-buttons no-print">
                        {batches.map((batch, index) => (
                            <button
                                key={index}
                                className={`filter-button ${selectedBatch === batch ? 'selected' : ''}`}
                                onClick={() => handleBatchClick(batch)}
                            >
                                Batch {batch}
                            </button>
                        ))}
                    </div>
                    {selectedBatch !== null && (
                        <div className="filter-buttons no-print">
                            {sems.map((sem, index) => (
                                <button
                                    key={index}
                                    className={`filter-button ${selectedSem === sem ? 'selected' : ''}`}
                                    onClick={() => handleSemClick(sem)}
                                >
                                    Semester {sem}
                                </button>
                            ))}
                        </div>
                    )}
                    {selectedSem !== null && (
                        <div className="filter-buttons no-print">
                            {secs.map((sec, index) => (
                                <button
                                    key={index}
                                    className={`filter-button ${selectedSec === sec ? 'selected' : ''}`}
                                    onClick={() => handleSecClick(sec)}
                                >
                                    Section {sec}
                                </button>
                            ))}
                            <button
                                className={`filter-button ${filterLowPercentile ? 'selected' : ''}`}
                                onClick={() => {
                                    setFilterLowPercentile(!filterLowPercentile);
                                    setFilterClicked(!filterClicked);
                                }}
                            >
                                <FilterList /> &lt;= 70
                            </button>
                        </div>
                    )}
                    {showReport && (
                        <>
                            {report.length > 0 ? (
                                <>
                                    <div className="report-container">
                                        {report
                                            .filter(item => (selectedBatch === null || item.batch === selectedBatch) &&
                                                (selectedSem === null || item.sem === selectedSem) &&
                                                (selectedSec === "" || item.sec === selectedSec) &&
                                                (!filterLowPercentile || item.percentile <= 70)
                                            )
                                            .map((item, index) => (
                                                <div key={index} className={`report-item ${item.percentile <= 70 ? 'low-percentile-item' : ''}`}>
                                                    <p><strong>Faculty Name:</strong> {item.facName}</p>
                                                    <p><strong>Subject Code:</strong> {item.subcode}</p>
                                                    <p><strong>Subject Name:</strong> {item.subname}</p>
                                                    <p><strong>Section:</strong> {item.sec}</p>
                                                    <p><strong>Semester:</strong> {item.sem}</p>
                                                    <p><strong>Batch:</strong> {item.batch}</p>
                                                    <p><strong>Percentile:</strong> {item.percentile}</p>
                                                </div>
                                            ))}
                                    </div>
                                    {filterClicked && report.filter(item => filterLowPercentile && item.percentile <= 70).length === 0 ? (
                                        <div className="no-report-message">
                                            <p>No members found with percentile less than or equal to 70.</p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* <div className="chart-wrapper"> */}
                                            <Bar data={data} options={options} />
                                            {/* </div> */}
                                            <div className="download-button-container no-print">
                                                <button className="download-button" onClick={handleDownload}>
                                                    Download Report
                                                </button>
                                            </div>
                                        </>
                                    )}

                                </>
                            ) : (
                                <div className="no-report-message">
                                    <p>No report available for the selected criteria.</p>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </>
    );
}
