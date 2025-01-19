import "./resume.css";

export default function ResumePage() {
  return (
    <div className="resume-page">
      <object
        data="/pdf/Tobie_Rathbun_Resume_January_2025.pdf"
        type="application/pdf"
        width="100%"
        height="800px"
      >
        <p>
          Your browser does not support viewing PDFs.{" "}
          <a href="/pdf/Tobie Rathbun Resume January 2025.pdf">Download the resume</a>.
        </p>
      </object>
    </div>
  );
}
