'use client';
import React from 'react';
import { Share } from './share-button';
import Menu from './menu';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css'; 
import Quill from 'quill';


export default function Editor() {
    const fontSizeArr = ['8px', '9px', '10px', '12px', '14px', '16px', '20px', '24px', '32px', '42px', '54px', '68px', '84px', '98px'];

    const modules = {
        toolbar: '#toolbar', 
    };

    const Size = Quill.import('attributors/style/size');
    Size.whitelist = fontSizeArr;
    Quill.register(Size, true);

    const { quill, quillRef } = useQuill({
        theme: 'snow',
        modules,
    });

    const [zoomLevel, setZoomLevel] = React.useState(100);

    const [isSliderVisible, setIsSliderVisible] = React.useState(false); // Slider visibility state


    const handleZoomChange = (event) => {
        const value = parseFloat(event.target.value);
        setZoomLevel(value);
    };

    const handleToggleSlider = () => {
        setIsSliderVisible((prev) => !prev); // Toggle slider visibility
    };

    // Apply zoom effect when zoom level changes
    React.useEffect(() => {
        if (quill) {
            const editorContent = quill.root;
            const scale = zoomLevel / 100; // Convert percentage to scale factor
            editorContent.style.transform = `scale(${scale})`;
            editorContent.style.transformOrigin = 'top left';
        }
    }, [zoomLevel, quill]);

    const dynamicWidth = 800 * (zoomLevel / 100);
    const dynamicHeight = 1000 * (zoomLevel / 100);



    return (
        <div className="w-full h-screen flex flex-col items-center justify-center mt-8">
            <div id="mainTool" className="sm:h-1/8 h-1/8 flex flex-wrap items-center justify-center mb-8" >
                <Share />
                <Menu quill={quill} />

                <div
                    id="toolbar"
                    className="absolute top-8 sm:w-[800px] bg-white shadow-lg rounded-lg flex flex-wrap items-center justify-center"
                >
                
                     <button
                        onClick={handleToggleSlider}
                        className="bg-blue-500 text-black mr-5 rounded relative mb-2"
                    >
                        {zoomLevel}%
                    </button>

                    
                    {/* Dropdown Slider */}
                    {isSliderVisible && (
                        <div className="mb-4 ml-10 absolute left-10 mt-20  z-10">
                            <input
                                type="range"
                                min="10"
                                max="300"
                                step="10"
                                value={zoomLevel}
                                onChange={handleZoomChange}
                                className="slider w-[150px] h-1 bg-gray-200 rounded-lg cursor-pointer accent-green-800"
                            />
                            {/* <span className="block mt-2 text-center">{zoomLevel}%</span> */}
                        </div>
                    )}

                <select className="ql-header">
                    <option value="">Normal</option>
                    <option value="1">Heading 1</option>
                    <option value="2">Heading 2</option>
                    <option value="3">Heading 3</option>
                    <option value="4">Heading 4</option>
                    <option value="5">Heading 5</option>
                    <option value="6">Heading 6</option>
                </select>


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

                    <div >
                        <select className="ql-size">
                            {fontSizeArr.map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>

                   
                </div>
                <div className="h-10"></div>
            
                
            </div>

          
           
                <div
                    id="editor-div"
                    className="relative p-20 bg-white text-black overflow-scroll"
                    ref={quillRef}
                    style={{
                        maxWidth: '100%', // Responsive width, adjusts with the screen
                        width: `${dynamicWidth}px`,
                        height: `${dynamicHeight}px`,
                        marginLeft: 'auto', // Center the editor
                        marginRight: 'auto', // Center the editor
                    }}
                ></div>
            

                {/* <div id="editor-div " className="m-10 sm:h-6/8 h-6/8 h-[800px] shadow-lg bg-white text-black overflow-scroll "
                    ref={quillRef}
                    style={{
                        width: `${dynamicWidth}px`,
                        height: `${dynamicHeight}px`,
                        
                    }}
                   
                    
                ></div> */}
            
        </div>
    );
}
