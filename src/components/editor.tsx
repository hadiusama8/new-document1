"use client";
import React, { useEffect, useState } from "react";
import { Share } from "./share-button";
import Menu from "./menu";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import Quill from "quill";
import { io, Socket } from "socket.io-client";
import {
  FaUndo,
  FaRedo,
  FaEllipsisV,
  FaLink,
  FaAlignCenter,
  FaAlignLeft,
  FaAlignRight,
  FaAlignJustify,
  FaListOl,
  FaListUl,
  FaImage,
  FaFilm,
  FaCut,
  FaCopy,
  FaPaste,
  FaBold,
  FaItalic,
  FaUnderline,
  FaFont,
  FaPalette,
  FaListUl as FaBulletList,
  FaListOl as FaNumberList,
  FaAlignLeft as FaTextLeft,
  FaAlignCenter as FaTextCenter,
  FaAlignRight as FaTextRight,
  FaAlignJustify as FaTextJustify,
  FaStrikethrough,
} from "react-icons/fa";

interface EditorProps {
  documentId: string;
}

interface User {
  userName: string;
  name: string;
}

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
}

interface ContextMenuItem {
  label: string;
  action: string;
  icon?: React.ReactNode;
  divider?: boolean;
  color?: string;
}

export default function Editor({ documentId }: EditorProps) {
  const [socket, setSocket] = useState<Socket>();
  const [quill, setQuill] = useState<Quill>();

  const fontSizeArr = [
    "8px", "9px", "10px", "12px", "14px", "16px", "20px",
    "24px", "32px", "42px", "54px", "68px", "84px", "98px"
  ];

  const colorOptions = [
    "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00",
    "#FF00FF", "#00FFFF", "#808080", "#800000", "#808000"
  ];

  const contextMenuItems: ContextMenuItem[] = [
    { label: "Cut", action: "cut", icon: <FaCut className="w-4 h-4" /> },
    { label: "Copy", action: "copy", icon: <FaCopy className="w-4 h-4" /> },
    { label: "Paste", action: "paste", icon: <FaPaste className="w-4 h-4" /> },
    { label: "Select All", action: "selectAll", divider: true },
    { label: "Bold", action: "bold", icon: <FaBold className="w-4 h-4" /> },
    { label: "Italic", action: "italic", icon: <FaItalic className="w-4 h-4" /> },
    { label: "Underline", action: "underline", icon: <FaUnderline className="w-4 h-4" />, divider: true },
    { label: "Strike Through", action: "strike", icon: <FaStrikethrough className="w-4 h-4" />, divider: true },
    { label: "Align Left", action: "alignLeft", icon: <FaTextLeft className="w-4 h-4" /> },
    { label: "Center", action: "alignCenter", icon: <FaTextCenter className="w-4 h-4" /> },
    { label: "Align Right", action: "alignRight", icon: <FaTextRight className="w-4 h-4" /> },
    { label: "Justify", action: "alignJustify", icon: <FaTextJustify className="w-4 h-4" />, divider: true },
    { label: "Bullet List", action: "bulletList", icon: <FaBulletList className="w-4 h-4" /> },
    { label: "Number List", action: "numberList", icon: <FaNumberList className="w-4 h-4" />, divider: true },
    { label: "Insert Image", action: "image", icon: <FaImage className="w-4 h-4" /> },
    { label: "Upload Image", action: "uploadImage", icon: <FaImage className="w-4 h-4" /> },
    { label: "Insert Video", action: "video", icon: <FaFilm className="w-4 h-4" /> },
    { label: "Upload Video", action: "uploadVideo", icon: <FaFilm className="w-4 h-4" /> },
  ];

  const modules = {
    toolbar: {
      container: "#toolbar",
      handlers: {
        image: function() {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.click();

          input.onchange = () => {
            const file = input.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                const range = this.quill.getSelection(true);
                this.quill.insertEmbed(range.index, 'image', e.target?.result);
              };
              reader.readAsDataURL(file);
            }
          };
        },
        video: function() {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'video/*');
          input.click();

          input.onchange = () => {
            const file = input.files?.[0];
            if (file) {
              const videoUrl = URL.createObjectURL(file);
              const range = this.quill.getSelection(true);
              this.quill.insertEmbed(range.index, 'video', videoUrl);
            }
          };
        }
      }
    }
  };

  // Register font size options
  const Size = Quill.import("attributors/style/size") as any;
  Size.whitelist = fontSizeArr;
  Quill.register(Size, true);

  const { quill: quillInstance, quillRef } = useQuill({
    theme: "snow",
    modules,
  });

  const [userName, setUserName] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isJoined, setIsJoined] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isSliderVisible, setIsSliderVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isExtraOpen, setIsExtraOpen] = useState(false);

  useEffect(() => {
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

  useEffect(() => {
    if (quill && socket) {
      const handleTextChange = (delta: any, oldDelta: any, source: string) => {
        if (source === "user") {
          const content = quill.getContents();
          socket.emit("send-changes", delta, content);
          socket.emit("db-changes", content);
        }
      };

      quill.on("text-change", handleTextChange);
      return () => {
        quill.off("text-change", handleTextChange);
      };
    }
  }, [quill, socket]);

  useEffect(() => {
    if (quill && socket) {
      const handleTextChange = (delta: any) => {
        quill.updateContents(delta);
      };

      socket.on("receive-changes", handleTextChange);
      return () => {
        socket.off("receive-changes", handleTextChange);
      };
    }
  }, [quill, socket]);

  useEffect(() => {
    if (!socket || !quill) return;

    const name = prompt("Enter your name to join the document:");
    if (name) {
      setUserName(name);
      socket.emit("get-document", documentId, name);
    }

    socket.on("user-list", (users: User[]) => {
      setUsers(users);
    });

    socket.once("load-document", (document: any) => {
      quill.setContents(document);
      quill.enable();
    });

    return () => {
      socket.off("user-list");
      socket.off("load-document");
    };
  }, [socket, quill, documentId]);

  const handleZoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    setZoomLevel(value);
  };

  const handleToggleSlider = () => {
    setIsSliderVisible((prev) => !prev);
  };

  useEffect(() => {
    if (quill) {
      const editorContent = quill.root;
      const scale = zoomLevel / 100;
      editorContent.style.transform = `scale(${scale})`;
      editorContent.style.transformOrigin = "top left";
    }
  }, [zoomLevel, quill]);

  const dynamicWidth = 800 * (zoomLevel / 100);
  const dynamicHeight = 1000 * (zoomLevel / 100);

  const handleShareClick = () => {
    setModalVisible(!isModalVisible);
  };

  const handleCopyLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

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
  ];

  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };

  const extraDropdown = () => {
    setIsExtraOpen(!isExtraOpen);
  };

  // Context menu functionality
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0
  });

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu({
      ...contextMenu,
      visible: false
    });
  };

  const handleImageUpload = (file: File) => {
    if (!quill) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, 'image', e.target?.result);
    };
    reader.readAsDataURL(file);
  };

  const handleVideoUpload = (file: File) => {
    if (!quill) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const range = quill.getSelection(true);
        // Create a video blob URL
        const videoUrl = URL.createObjectURL(file);
        quill.insertEmbed(range.index, 'video', videoUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleContextMenuAction = (action: string) => {
    if (!quill) return;
    
    switch(action) {
      case 'cut':
        document.execCommand('cut');
        break;
      case 'copy':
        document.execCommand('copy');
        break;
      case 'paste':
        document.execCommand('paste');
        break;
      case 'selectAll':
        quill.setSelection(0, quill.getLength());
        break;
      case 'bold':
        quill.format('bold', !quill.getFormat().bold);
        break;
      case 'italic':
        quill.format('italic', !quill.getFormat().italic);
        break;
      case 'underline':
        quill.format('underline', !quill.getFormat().underline);
        break;
      case 'strike':
        quill.format('strike', !quill.getFormat().strike);
        break;
      case 'alignLeft':
        quill.format('align', 'left');
        break;
      case 'alignCenter':
        quill.format('align', 'center');
        break;
      case 'alignRight':
        quill.format('align', 'right');
        break;
      case 'alignJustify':
        quill.format('align', 'justify');
        break;
      case 'bulletList':
        quill.format('list', 'bullet');
        break;
      case 'numberList':
        quill.format('list', 'ordered');
        break;
      case 'image':
        const imageUrl = prompt('Enter image URL:');
        if (imageUrl) {
          quill.focus();
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, 'image', imageUrl);
        }
        break;
      case 'video':
        const videoUrl = prompt('Enter video URL:');
        if (videoUrl) {
          quill.focus();
          const range = quill.getSelection(true);
          quill.insertEmbed(range.index, 'video', videoUrl);
        }
        break;
      case 'uploadImage': {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                handleImageUpload(file);
            }
        };
        input.click();
        break;
      }
      case 'uploadVideo': {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                handleVideoUpload(file);
            }
        };
        input.click();
        break;
      }
    }
    handleCloseContextMenu();
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) {
        handleCloseContextMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenu.visible]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center mt-8">
      <div
        id="mainTool"
        className="w-full sm:flex sm:flex-row sm:flex-wrap flex flex-col flex-wrap items-center justify-between sm:items-center sm:justify-between mb-8"
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
            <select id="toolbar-header" className="ql-header">
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
          <button className="ql-strike"></button>

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
            <button
              className="ml-2 text-sm"
              id="wrap-extra-icon"
              onClick={extraDropdown}
            >
              <FaEllipsisV />
            </button>
            {isExtraOpen && (
              <div className="absolute h-auto w-[50px] left-5 top-[40px] bg-white shadow-lg border border-gray-300 rounded-lg z-30 text-black text-sm">
                <ul className="py-2 flex flex-col">
                  <li><button className="ql-link"></button></li>
                  <li><button className="ql-align" value="center"></button></li>
                  <li><button className="ql-align" value="left"></button></li>
                  <li><button className="ql-align" value="right"></button></li>
                  <li><button className="ql-list" value="ordered"></button></li>
                  <li><button className="ql-list" value="bullet"></button></li>
                  <li><button className="ql-image"></button></li>
                  <li><button className="ql-video"></button></li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div id="share" onClick={handleShareClick} className="sm:mr-8">
          <Share />
          {isModalVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg shadow-lg w-[300px] sm:w-[400px] flex flex-col items-center space-y-4">
                <h2 className="text-lg font-semibold">Invite via Email</h2>
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
                <button
                  onClick={handleCopyLink}
                  className="bg-green-500 text-white w-full py-2 rounded-lg"
                >
                  Copy Link
                </button>
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
          <div id="editor" className="flex">
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
        </div>
      </footer>

      <div
        id="editor-div"
        className="relative w-[90%] bg-white text-black overflow-scroll px-8 pt-8"
        ref={quillRef}
        onContextMenu={handleContextMenu}
        style={{
          height: `${dynamicHeight}px`,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {contextMenu.visible && (
          <div
            className="fixed bg-white shadow-lg border border-gray-200 rounded-lg z-50 min-w-[200px] max-h-[400px] flex flex-col"
            style={{
              left: `${contextMenu.x}px`,
              top: `${contextMenu.y}px`,
            }}
          >
            <div className="py-2 overflow-y-auto">
              {contextMenuItems.map((item, index) => (
                <React.Fragment key={index}>
                  <button
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 whitespace-nowrap"
                    onClick={() => handleContextMenuAction(item.action)}
                  >
                    {item.icon}
                    <span className={item.color ? `text-${item.color}` : ''}>
                      {item.label}
                    </span>
                  </button>
                  {item.divider && <hr className="my-1 border-gray-200" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
