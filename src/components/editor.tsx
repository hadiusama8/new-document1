"use client";
import React from "react";
import { Share } from "./share-button";
import Menu from "./menu";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import Quill from "quill";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { FaUndo, FaRedo } from "react-icons/fa";
import { FaEllipsisV } from "react-icons/fa";
import {
  FaLink,
  FaAlignCenter,
  FaAlignLeft,
  FaAlignRight,
  FaAlignJustify,
  FaListOl,
  FaListUl,
  FaImage,
  FaFilm,
} from "react-icons/fa";

export default function Editor({ documentId }) {
  const [socket, setSocket] = React.useState();
  const [quill, setQuill] = React.useState();

  const fontSizeArr = [
    "8px",
    "9px",
    "10px",
    "12px",
    "14px",
    "16px",
    "20px",
    "24px",
    "32px",
    "42px",
    "54px",
    "68px",
    "84px",
    "98px",
  ];

  const modules = {
    toolbar: "#toolbar",
  };

  const Size = Quill.import("attributors/style/size");
  Size.whitelist = fontSizeArr;
  Quill.register(Size, true);

  const { quill: quillInstance, quillRef } = useQuill({
    theme: "snow",
    modules,
  });

  const [userName, setUserName] = useState("");
  const [users, setUsers] = useState([]);
  const [isJoined, setIsJoined] = useState(false);

  React.useEffect(() => {
    if (quillInstance) {
      quillInstance?.disable();
      quillInstance?.setText("Loading...");
      setQuill(quillInstance);
    }

    const s = io("http://localhost:3001");
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [quillInstance]);

  React.useEffect(() => {
    if (quill && socket) {
      const handleTextChange = (delta, oldDelta, source) => {
        if (source === "user") {
          const content = quill.getContents(); // Get the full content
          socket.emit("send-changes", delta, content); // Send the full content to the server
          socket.emit("db-changes", content); // save to db
        }
      };

      quill.on("text-change", handleTextChange);
      return () => {
        quill.off("text-change", handleTextChange);
      };
    }
  }, [quill, socket]);

  React.useEffect(() => {
    if (quill && socket) {
      const handleTextChange = (delta) => {
        quill.updateContents(delta);
      };

      socket.on("receive-changes", handleTextChange);
      return () => {
        socket.off("receive-changes", handleTextChange);
      };
    }
  }, [quill, socket]);

  React.useEffect(() => {
    if (socket == null || quill == null) return;

    // Prompt user for their name when they join
    const name = prompt("Enter your name to join the document:");

    if (name) {
      setUserName(name);

      // Emit the event to join the document with the user's name and documentId
      socket.emit("get-document", documentId, name);
    }

    // Listen for the user list updates from the server
    socket.on("user-list", (users) => {
      setUsers(users); // Update the state with the list of users
    });

    // Listen for the loaded document content from the server
    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });

    // Emit the initial request to join and load the document only if name is provided
    // if (name) {
    //   socket.emit("get-document", documentId);
    // }

    // Clean up the event listeners when the component unmounts
    return () => {
      socket.off("user-list");
      socket.off("load-document");
    };
  }, [socket, quill, documentId]);

  const [zoomLevel, setZoomLevel] = React.useState(100);
  const [isSliderVisible, setIsSliderVisible] = React.useState(false);

  const handleZoomChange = (event) => {
    const value = parseFloat(event.target.value);
    setZoomLevel(value);
  };

  const handleToggleSlider = () => {
    setIsSliderVisible((prev) => !prev);
  };

  React.useEffect(() => {
    if (quill) {
      const editorContent = quill.root;
      const scale = zoomLevel / 100;
      editorContent.style.transform = `scale(${scale})`;
      editorContent.style.transformOrigin = "top left";
    }
  }, [zoomLevel, quill]);

  const dynamicWidth = 800 * (zoomLevel / 100);
  const dynamicHeight = 1000 * (zoomLevel / 100);

  const [isModalVisible, setModalVisible] = React.useState(false);
  const [email, setEmail] = React.useState("");

  // Function to handle opening/closing the modal
  const handleShareClick = () => {
    setModalVisible(!isModalVisible); // Toggle the modal visibility
  };

  // Function to copy the current URL to the clipboard
  const handleCopyLink = () => {
    const currentUrl = window.location.href; // Get current page URL

    // Copy the URL to the clipboard using the Clipboard API
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  // Function to handle email input changes
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Function to handle inviting via email (could be extended for backend integration)
  const handleInvite = () => {
    alert(`Invitation sent to ${email}`);
  };

  const images = [
    "animal-logo.png",
    "dog-icon.png",
    "cow-icon.png",
    "dog2-icon.png",
    "ele-icon.png",
    "panda-icon.webp",
    "pig-icon.webp",
    // Add more images as needed
  ];

  // Function to get a random image
  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * images.length);
    console.log(images[randomIndex]);
    return images[randomIndex];
  };

  const [isExtraOpen, setIsExtraOpen] = React.useState(false);
  const extraDropdown = () => {
    console.log("dropdown clicked");
    setIsExtraOpen(!isExtraOpen);
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center mt-8">
      {/* <h2>Users in this document:</h2> */}

      {/* <div className="flex flex-wrap">
  {users.map((user, index) => (
    <div key={index} className="flex items-center mr-4 mb-4">
      <img
        src={`/images/${getRandomImage()}`} // Use the relative path to the images
        alt={user.name}
        className="user-image w-10 h-8 rounded-full mr-2"
      />
      <span className="user-name text-xl">{user.userName}</span>
    </div>
  ))}
</div> */}

      <div
        id="mainTool"
        className=" w-full sm:flex sm:flex-row sm:flex-wrap flex flex-col flex-wrap items-center justify-between sm:items-center sm:justify-between mb-8 "
      >
        <div id="menu" className="sm:ml-8">
          <Menu quill={quill} />
        </div>
        <div
          id="toolbar"
          className="relative left-3 sm:w-[800px] w-[500px] sm:flex sm:flex-wrap bg-white shadow-lg rounded-xl flex flex-wrap items-center justify-center"
        >
          <button
            onClick={handleToggleSlider}
            className="bg-blue-500 text-black mr-5 rounded relative mb-2"
          >
            {zoomLevel}%
          </button>
          {isSliderVisible && (
            <div className="absolute left-10 mt-20 z-10">
              <input
                type="range"
                min="10"
                max="300"
                step="10"
                value={zoomLevel}
                onChange={handleZoomChange}
                className="slider w-[150px] h-1 bg-gray-200 rounded-lg cursor-pointer accent-green-800"
              />
            </div>
          )}
          <div id="toolbar-header-font">
              <select id="toolbar-header"
              className="ql-header">
                <option value="">Normal</option>
                <option value="1">Heading 1</option>
                <option value="2">Heading 2</option>
              </select>

              <select className="ql-font">
                <option value="sans-serif">Sans Serif</option>
                <option value="serif">Serif</option>
                <option value="monospace">Monospace</option>
              </select>
          </div>
         

          <select className="ql-color">
            <option value="#000000">Black</option>
            <option value="#FF0000">Red</option>
          </select>
          <button className="ql-bold"></button>
          <button className="ql-italic"></button>
          <button className="ql-underline"></button>

          <div>
            <select className="ql-size">
              {fontSizeArr.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div id="extra-icons-menu">
            <button className="ql-list" value="ordered"></button>
            <button className="ql-list" value="bullet"></button>
            <select className="ql-align">
              <option></option>
              <option value="center">Center</option>
              <option value="right">Right</option>
              <option value="justify">Justify</option>
            </select>
            <button className="ql-link"></button>
            <button className="ql-image"></button>
            <button className="ql-video"></button>
          </div>

          <div id="extra-dropdown" className="relative">
            {" "}
            {/* Make parent relative */}
            <button
              className="ml-2 text-sm"
              id="wrap-extra-icon"
              onClick={extraDropdown}
            >
              <FaEllipsisV />
            </button>
            {isExtraOpen && (
  <div  className="absolute h-auto w-[50px] left-5 top-[40px] bg-white shadow-lg border border-gray-300 rounded-lg z-30 text-black text-sm">
    <ul className="py-2 flex flex-col">
      <li>
        <button id="editor"  className="ql-link">
         
        </button>
      </li>

      <li>
        <button className="ql-align" value="center">
         
        </button>
      </li>

      <li>
        <button className="ql-align" value="left">
         
        </button>
      </li>

      <li>
        <button className="ql-align" value="right">
          
        </button>
      </li>

      <li>
        <button className="ql-list" value="ordered">
          
        </button>
      </li>

      <li>
        <button className="ql-list" value="bullet">
          
        </button>
      </li>

      <li>
        <button className="ql-image">
         
        </button>
      </li>

      <li>
        <button className="ql-video">
         
        </button>
      </li>
    </ul>
  </div>
)}

          </div>

          {/* Mobile menu dropdown */}
         
        
        </div>

        

        {/* <div className='w-[800px] shadow-lg rounded-lg'>hello</div> */}

        <div id="share" onClick={handleShareClick} className="sm:mr-8 ">
          <Share />

          {/* Modal (Popup) */}
          {isModalVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg shadow-lg w-[300px] sm:w-[400px] flex flex-col items-center space-y-4">
                <h2 className="text-lg font-semibold">Invite via Email</h2>

                {/* Email Input */}
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={handleEmailChange}
                  className="border border-gray-300 p-2 rounded w-full"
                />

                <button
                  onClick={handleInvite}
                  className="bg-blue-500 text-white w-full py-2 rounded-lg mt-2"
                >
                  Send Invite
                </button>

                <hr className="w-full border-gray-200" />

                {/* Copy Link Button */}
                <button
                  onClick={handleCopyLink}
                  className="bg-green-500 text-white w-full py-2 rounded-lg"
                >
                  Copy Link
                </button>

                {/* Close Button */}
                <button
                  onClick={handleShareClick}
                  className="text-red-500 w-full py-2 rounded-lg mt-2"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <footer>
  <div
    id="footer-menu"
    className="h-[50px] flex flex-wrap justify-between shadow-lg rounded-lg"
  >
    <div id="editor" className="flex ">
      <select id="toolbar-header" className="ql-header m-4">
        <option value="">Normal</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
      </select>

      <select className="ql-font m-4">
        <option value="sans-serif">Sans Serif</option>
        <option value="serif">Serif</option>
        <option value="monospace">Monospace</option>
      </select>
    </div>

    {/* Other buttons can be added here */}
  </div>
</footer>

      <div
        id="editor-div"
        className="relative px-20 pt-20 bg-white text-black overflow-scroll"
        ref={quillRef}
        style={{
          maxWidth: "100%",
          width: `${dynamicWidth}px`,
          height: `${dynamicHeight}px`,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      ></div>
    </div>
  );
}
