import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfViewer = forwardRef(({ file }, ref) => {
  const [visiblePages, setVisiblePages] = useState([1]);
  const [numPages, setNumPages] = useState(null);
  const [fileData, setFileData] = useState(null);
  const containerRef = useRef(null);
  const pageRefs = useRef({});

  // Convert File object to ArrayBuffer
  useEffect(() => {
    if (!file) {
      setFileData(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFileData(reader.result);
    };
    reader.readAsArrayBuffer(file);
  }, [file]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // Lazy loading
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver((entries) => {
      const lastEntry = entries[0];
      if (lastEntry.isIntersecting) {
        setVisiblePages((prev) => {
          if (prev.length < numPages) {
            return [...prev, prev.length + 1];
          }
          return prev;
        });
      }
    });

    const lastPageDiv = document.createElement("div");
    lastPageDiv.style.height = "10px";
    container.appendChild(lastPageDiv);
    observer.observe(lastPageDiv);

    return () => observer.disconnect();
  }, [numPages]);

  // Function exposed via ref
  const goToPage = (pageNum) => {
    const pageElement = pageRefs.current[pageNum];
    if (pageElement) {
      pageElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 👇 Make sure this comes AFTER `forwardRef`
  useImperativeHandle(ref, () => ({
    goToPage,
  }));

  if (!fileData) return <p>Loading PDF...</p>;

  return (
    <div
      ref={containerRef}
      style={{
        height: "80vh",
        overflowY: "auto",
        border: "1px solid #ccc",
        padding: "1rem",
      }}
    >
      <Document file={fileData} onLoadSuccess={onDocumentLoadSuccess}>
        {visiblePages.map((pageNum) => (
          <div key={pageNum} ref={(el) => (pageRefs.current[pageNum] = el)}>
            <Page
              pageNumber={pageNum}
              width={600}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </div>
        ))}
      </Document>
    </div>
  );
});

export default PdfViewer;
