
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen, faSave, faUsers } from '@fortawesome/free-solid-svg-icons';
import mammoth from 'mammoth'; 
import jsPDF from 'jspdf';
import Quill from 'quill';

import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

import htmlDocx from 'html-docx-js/dist/html-docx';
import { PDFDocument } from 'pdf-lib';


export function Menu({ quill }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isSaveAsOpen, setIsSaveAsOpen] = React.useState(false);


    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        setIsSaveAsOpen(false);
    };

    const toggleSaveAsDropdown = () => {
        setIsSaveAsOpen(!isSaveAsOpen);
    };

    const handleSaveClick = (format) => {
        if (format === 'docx') {
            exportToDocx();
        } else if (format === 'pdf') {
            exportToPdf();
        }
        setIsSaveAsOpen(false); 
    };

    const handleFileInput = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const arrayBuffer = e.target.result;
                    const result = await mammoth.convertToHtml({ arrayBuffer });
                    quill.root.innerHTML = result.value;
                } catch (error) {
                    console.error('Error reading .docx file:', error);
                }
            };
            reader.readAsArrayBuffer(file);
        } else {
            alert('Please select a valid .docx file.');
        }
    };

    const handleOpenClick = () => {
       document.getElementById('file-input').click();
    };


    const exportToDocx = () => {
        const htmlContent = quill.root.innerHTML;

        const docxBlob = htmlDocx.asBlob(htmlContent);

        saveAs(docxBlob, 'document.docx');
    };


    
    const exportToPdf = async () => {
        if (quill) {
            const editorContent = quill.root;

            // Capture the content of the editor using html2canvas
            const canvas = await html2canvas(editorContent, { scrollY: -window.scrollY });
            const imgData = canvas.toDataURL('image/png');

            // Create PDF document
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4', // A4 size (210 x 297 mm)
            });

            // Add image to PDF
            doc.addImage(imgData, 'PNG', 10, 10, 190, 277); // Adjust position and size as needed

            // Save PDF
            doc.save('document.pdf');
        }
    };


  return (
    <div>
       <div id="menu" className="absolute top-8 left-20 w-full flex ">
                <button
                    
                    className="relative w-[60px] h-[50px] bg-gray-50 shadow-lg border-2 border-gray-300 rounded-lg flex items-center justify-center z-20"
                    onClick={toggleDropdown}
                >
                    <div className="space-y-1">
                        <span className="block w-4 h-0.5 bg-black"></span>
                        <span className="block w-4 h-0.5 bg-black"></span>
                        <span className="block w-4 h-0.5 bg-black"></span>
                    </div>
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 mt-1 w-[200px] bg-white shadow-lg border border-gray-300 rounded-lg z-30 text-black text-sm">
                        <ul className="py-2">
                            <li
                                id="open"
                                className="px-4 py-2 flex items-center hover:bg-green-100 cursor-pointer"
                                onClick={handleOpenClick}
                            >
                                <FontAwesomeIcon icon={faFolderOpen} className="mr-2" />
                                Open
                            </li>
                            <li
                                id="save"
                                className="px-4 py-2 flex items-center hover:bg-green-100 cursor-pointer"
                                onClick={toggleSaveAsDropdown}
                            >
                                <FontAwesomeIcon icon={faSave} className="mr-2" />
                                Save As
                                <ul className={`py-1 mt-2 ${isSaveAsOpen ? 'block' : 'hidden'} bg-gray-50 border border-gray-300 rounded-lg`}>
                                    <li
                                        className="px-4 py-2 hover:bg-green-100 cursor-pointer"
                                        onClick={() => handleSaveClick('docx')}
                                    >
                                        Save as DOCX
                                    </li>
                                    <li
                                        className="px-4 py-2 hover:bg-green-100 cursor-pointer"
                                        onClick={() => handleSaveClick('pdf')}
                                    >
                                        Save as PDF
                                    </li>
                                </ul>
                            </li>
                            <li
                                id="collaborate"
                                className="px-4 py-2 flex items-center hover:bg-green-100 cursor-pointer"
                            >
                                <FontAwesomeIcon icon={faUsers} className="mr-2" />
                                Live Collaboration
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            <input
                id="file-input"
                type="file"
                className="hidden"
                onChange={handleFileInput}
            />
      
    </div>
  );
}

export default Menu;
