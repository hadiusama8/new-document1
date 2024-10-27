
import React from "react";
import Quill from "quill";

export default function Toolbar({quill}) {
  const [isSliderVisible, setIsSliderVisible] = React.useState(false); // Slider visibility state

  const [zoomLevel, setZoomLevel] = React.useState(100);

  const fontSizeArr = ['8px', '9px', '10px', '12px', '14px', '16px', '20px', '24px', '32px', '42px', '54px', '68px', '84px', '98px'];

  const Size = Quill.import('attributors/style/size');
  Size.whitelist = fontSizeArr;
  Quill.register(Size, true);
  React.useEffect(() => {
        if (quill) {
            const editorContent = quill.root;
            const scale = zoomLevel / 100; // Convert percentage to scale factor
            editorContent.style.transform = `scale(${scale})`;
            editorContent.style.transformOrigin = 'top left';
        }
    }, [zoomLevel, quill]);

   

    const handleZoomChange = (event) => {
        const value = parseFloat(event.target.value);
        setZoomLevel(value);
    };

    const handleToggleSlider = () => {
        setIsSliderVisible((prev) => !prev); // Toggle slider visibility
    };

  return (
    <div
    id="toolbar"
    className="absolute top-8 sm:w-[800px] bg-white shadow-lg rounded-lg flex flex-wrap items-center justify-center"
style={{ border: "none" }}

>
     
     <button
        onClick={handleToggleSlider}
        className="bg-blue-500 text-black mr-5 rounded relative"
    >
        {zoomLevel}%
    </button>

    {/* Dropdown Slider */}
    {isSliderVisible && (
        <div className="absolute left-10 mt-20  z-10">
            <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={zoomLevel}
                onChange={handleZoomChange}
                className="slider w-[150px] h-1 bg-gray-200 rounded-lg cursor-pointer accent-green-800"
            />
            {/* <span className="block mt-2 text-center">{zoomLevel}%</span> */}
        </div>
    )}

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
  );
}


