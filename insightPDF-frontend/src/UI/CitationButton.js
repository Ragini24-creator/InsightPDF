

export default function CitationButton({ page, onClick }){
return (
    <button
      className="citation-btn"
      onClick={() => onClick(page)}
      style={{ marginLeft: 8 }}
    >
      p.{page}
    </button>
  );
}
