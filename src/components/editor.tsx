'use client';
import React from 'react';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css'; // Import Quill styles
import Quill from 'quill';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen, faSave, faUsers } from '@fortawesome/free-solid-svg-icons';
import mammoth from 'mammoth'; // Import mammoth
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import htmlDocx from 'html-docx-js/dist/html-docx';
import { PDFDocument } from 'pdf-lib';


export default function Editor() {
    const fontSizeArr = ['8px', '9px', '10px', '12px', '14px', '16px', '20px', '24px', '32px', '42px', '54px', '68px', '84px', '98px'];

    const modules = {
        toolbar: '#toolbar', // Link the toolbar to this ID
    };

    // Register custom font sizes
    const Size = Quill.import('attributors/style/size');
    Size.whitelist = fontSizeArr;
    Quill.register(Size, true);

    const { quill, quillRef } = useQuill({
        theme: 'snow',
        modules,
    });

    const [isOpen, setIsOpen] = React.useState(false);
    const [isSaveAsOpen, setIsSaveAsOpen] = React.useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        setIsSaveAsOpen(false); // Close Save As menu when opening main menu
    };

    const toggleSaveAsDropdown = () => {
        setIsSaveAsOpen(!isSaveAsOpen);
    };

    const handleFileInput = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const arrayBuffer = e.target.result;
                    const result = await mammoth.convertToHtml({ arrayBuffer });
                    quill.root.innerHTML = result.value; // Set the HTML content to Quill editor
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
        const htmlContent = quill.root.innerHTML; // Get HTML content from Quill editor

        // Convert HTML to DOCX Blob
        const docxBlob = htmlDocx.asBlob(htmlContent);

        // Save as file
        saveAs(docxBlob, 'document.docx');
    };


    
    const exportToPdf = async () => {
        // Convert HTML content to canvas
        const canvas = await html2canvas(quill.root);
        const imgData = canvas.toDataURL('image/png');
    
        // Create a PDF document
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([canvas.width, canvas.height]);
    
        // Draw the image onto the PDF page
        const jpgImage = await pdfDoc.embedPng(imgData);
        page.drawImage(jpgImage, {
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height,
        });
    
        // Save the PDF
        const pdfBytes = await pdfDoc.save();
        saveAs(new Blob([pdfBytes]), 'document.pdf');
    };
    

    const handleSaveClick = (format) => {
        if (format === 'docx') {
            exportToDocx();
        } else if (format === 'pdf') {
            exportToPdf();
        }
        setIsSaveAsOpen(false); // Close Save As menu after saving
    };

    return (
        <div id="mainTool" className=" w-full h-screen flex flex-col items-center justify-center mt-8">
            {/* Dropdown Button and Menu */}
            <button
                    
                    className="absolute top-8 right-20 w-[80px] h-[40px] bg-green-800 shadow-lg border-2 border-green-800 rounded-lg flex items-center justify-center"
                    
                >
                 +  Share
                </button>   
            <div id="menu" className="w-full flex ">
                <button
                    
                    className="absolute left-20 w-[60px] h-[50px] bg-gray-50 shadow-lg border-2 border-gray-300 rounded-lg flex items-center justify-center z-20"
                    onClick={toggleDropdown}
                >
                    <div className="space-y-1">
                        <span className="block w-4 h-0.5 bg-black"></span>
                        <span className="block w-4 h-0.5 bg-black"></span>
                        <span className="block w-4 h-0.5 bg-black"></span>
                    </div>
                </button>

                {isOpen && (
                    <div className="absolute left-20 top-14 w-[200px] bg-white shadow-lg border border-gray-300 rounded-lg z-30 text-black text-sm">
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

            {/* Hidden File Input */}
            <input
                id="file-input"
                type="file"
                className="hidden"
                onChange={handleFileInput}
            />

            {/* Toolbar */}
            <div
                id="toolbar"
                className="w-[800px] bg-gray-100 shadow-lg rounded-lg flex items-center justify-center "
            >
                <select className="ql-font">
                    <option value="sans-serif" selected>Sans Serif</option>
                    <option value="serif">Serif</option>
                    <option value="monospace">Monospace</option>
                    {/* Add custom fonts */}
                    <option value="times-new-roman">Times New Roman</option>
                    <option value="arial">Arial</option>
                    <option value="courier-new">Courier New</option>
                </select>

                <button className="ql-bold"></button>
                <button className="ql-italic"></button>
                <button className="ql-underline"></button>

                <button className="ql-list" value="ordered"></button>
                <button className="ql-list" value="bullet"></button>
                <select className="ql-align text-black">
                    <option></option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                    <option value="justify">Justify</option>
                </select>
                <button className="ql-link"></button>
                <button className="ql-image"></button>
                <button className="ql-video"></button>

                <select className="ql-color">
                    <option value="#000000">Black</option>
                    <option value="#FF0000">Red</option>
                    <option value="#00FF00">Green</option>
                    <option value="#0000FF">Blue</option>
                    <option value="#FFFF00">Yellow</option>
                    <option value="#FF00FF">Magenta</option>
                    <option value="#00FFFF">Cyan</option>
                    <option value="#808080">Gray</option>
                    <option value="#800000">Maroon</option>
                    <option value="#008000">Dark Green</option>
                    <option value="#000080">Navy</option>
                    <option value="#808000">Olive</option>
                    <option value="#800080">Purple</option>
                    <option value="#008080">Teal</option>
                    <option value="#C0C0C0">Silver</option>
                    <option value="#FFFFFF">White</option>
                </select>

                <select className="ql-size">
                    {fontSizeArr.map(size => (
                        <option key={size} value={size}>{size}</option>
                    ))}
                </select>
            </div>

            
                    
            <div className="h-[10px]"></div>

            {/* Quill Editor */}
            <div
                ref={quillRef}
                className="m-8 w-[800px] h-[300px] border-2 border-gray-600 bg-white text-black"
            ></div>
        </div>
    );
}
