import React from "react";
import { ReactTinyLink } from "react-tiny-link";
import styled from "styled-components";
import pptx from "../../shared/assets/images/pptx.png";
import docx from "../../shared/assets/images/docx.png";
import pdf from "../../shared/assets/images/pdf.png";

function FilePreview({ file }) {
  var image = null;
  var name = file.name.split(".");
  name = name[name.length - 1];

  if (name === "docx") image = docx;
  else if (name === "pptx") image = pptx;
  else if (name === "pdf") image = pdf;

  return (
    <div>
      {image === null ? (
        <ReactTinyLink cardSize="small" header={file.name} url={file.URL} />
      ) : (
        <FilePreviewWrapper>
          <span>
            <img src={image} alt={file.URL} width="125px" />
            <div className="file-preview-info">
              <p>{file.name}</p>
              <a href={file.URL} target="_blank" rel="noreferrer">
                {file.URL.substring(0, 55)}
              </a>
            </div>
          </span>
        </FilePreviewWrapper>
      )}
    </div>
  );
}
export default FilePreview;

const FilePreviewWrapper = styled.div`
  background-color: #f9f9f9;
  color: black;
  height: 125px;

  span {
    display: inline-flex;
    overflow: hidden;
  }
  p {
    font-weight: bold;
  }

  .file-preview-info {
    color: black;
  }
`;
