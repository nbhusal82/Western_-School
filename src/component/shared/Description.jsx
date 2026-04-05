import { useState, useRef, useEffect } from "react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
  FaLink,
  FaPalette,
  FaTable,
  FaMinus,
} from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";

const RichTextEditor = ({
  initialContent = "",
  onChange = () => {},
  placeholder = "Start writing...",
  className = "",
  readOnly = false,
}) => {
  const [content, setContent] = useState(initialContent);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [fontSize, setFontSize] = useState("16");
  const editorRef = useRef(null);

  const colors = [
    "#000000",
    "#444444",
    "#666666",
    "#999999",
    "#cccccc",
    "#eeeeee",
    "#f3f3f3",
    "#ffffff",
    "#ff0000",
    "#ff9900",
    "#ffff00",
    "#00ff00",
    "#00ffff",
    "#0000ff",
    "#9900ff",
    "#ff00ff",
    "#f4cccc",
    "#fce5cd",
    "#fff2cc",
    "#d9ead3",
    "#d0e0e3",
    "#c9daf8",
    "#d9d2e9",
    "#ead1dc",
    "#ea9999",
    "#f9cb9c",
    "#ffe599",
    "#b6d7a8",
    "#a2c4c9",
    "#a4c2f4",
    "#b4a7d6",
    "#d5a6bd",
    "#e06666",
    "#f6b26b",
    "#ffd966",
    "#93c47d",
    "#76a5af",
    "#6d9eeb",
    "#8e7cc3",
    "#c27ba0",
    "#cc0000",
    "#e69138",
    "#f1c232",
    "#6aa84f",
    "#45818e",
    "#3c78d8",
    "#674ea7",
    "#a64d79",
  ];

  const fontSizes = [
    "8",
    "10",
    "12",
    "14",
    "16",
    "18",
    "20",
    "24",
    "28",
    "32",
    "36",
    "48",
    "72",
  ];

  const handleContentChange = () => {
    const newContent = editorRef.current.innerHTML;
    setContent(newContent);
    onChange(newContent);
  };

  const formatText = (command, value = null) => {
    editorRef.current.focus();
    document.execCommand(command, false, value);
    handleContentChange();
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) formatText("createLink", url);
  };

  const insertTable = () => {
    const rows = prompt("Number of rows:", "3");
    const cols = prompt("Number of columns:", "3");
    if (rows && cols) {
      let tableHTML =
        '<table border="1" style="border-collapse: collapse; width: 100%; margin: 10px 0;">';
      for (let i = 0; i < parseInt(rows); i++) {
        tableHTML += "<tr>";
        for (let j = 0; j < parseInt(cols); j++) {
          tableHTML +=
            '<td style="padding: 8px; border: 1px solid #ddd;">Cell</td>';
        }
        tableHTML += "</tr>";
      }
      tableHTML += "</table>";
      formatText("insertHTML", tableHTML);
    }
  };

  const applyColor = (color) => {
    setSelectedColor(color);
    formatText("foreColor", color);
    setShowColorPicker(false);
  };

  const applyFontSize = (size) => {
    setFontSize(size);
    editorRef.current.focus();
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (range.collapsed) {
        const span = document.createElement("span");
        span.style.fontSize = size + "px";
        span.innerHTML = "&nbsp;";
        range.insertNode(span);
        range.setStartAfter(span);
        range.setEndAfter(span);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        const selectedText = selection.toString();
        const span = document.createElement("span");
        span.style.fontSize = size + "px";
        span.textContent = selectedText;
        range.deleteContents();
        range.insertNode(span);
      }
      handleContentChange();
    }
    setShowFontSizeDropdown(false);
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialContent || "";
      setContent(initialContent || "");
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setShowColorPicker(false);
      setShowFontSizeDropdown(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const ToolbarButton = ({
    onClick,
    active,
    children,
    title,
    disabled = false,
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || readOnly}
      title={title}
      className={`p-2 rounded-lg border transition-colors duration-200 ${
        active
          ? "bg-blue-100 border-blue-300 text-blue-700"
          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
      } ${
        disabled || readOnly
          ? "opacity-50 cursor-not-allowed"
          : "hover:border-gray-400"
      }`}
    >
      {children}
    </button>
  );

  const Dropdown = ({ isOpen, onToggle, trigger, children }) => (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        disabled={readOnly}
        className="flex items-center gap-1 p-2 rounded-lg border bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {trigger}
        <IoChevronDown size={14} />
      </button>
      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 min-w-max"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`border border-gray-300 rounded-lg overflow-hidden bg-white ${className}`}
    >
      {!readOnly && (
        <div className="border-b border-gray-300 bg-gray-50 p-3">
          <div className="flex flex-wrap items-center gap-2">
            <Dropdown
              isOpen={showFontSizeDropdown}
              onToggle={() => setShowFontSizeDropdown(!showFontSizeDropdown)}
              trigger={<span className="text-sm">{fontSize}px</span>}
            >
              <div className="max-h-48 overflow-y-auto p-1">
                {fontSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => applyFontSize(size)}
                    className="block w-full text-left px-3 py-1 hover:bg-gray-100 rounded text-sm"
                  >
                    {size}px
                  </button>
                ))}
              </div>
            </Dropdown>
            <div className="w-px h-6 bg-gray-300 mx-1" />
            <ToolbarButton onClick={() => formatText("bold")} title="Bold">
              <FaBold size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => formatText("italic")} title="Italic">
              <FaItalic size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => formatText("underline")}
              title="Underline"
            >
              <FaUnderline size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => formatText("strikeThrough")}
              title="Strikethrough"
            >
              <FaStrikethrough size={16} />
            </ToolbarButton>
            <Dropdown
              isOpen={showColorPicker}
              onToggle={() => setShowColorPicker(!showColorPicker)}
              trigger={
                <div className="flex items-center gap-1">
                  <FaPalette size={16} />
                  <div
                    className="w-4 h-4 border border-gray-300 rounded"
                    style={{ backgroundColor: selectedColor }}
                  />
                </div>
              }
            >
              <div className="p-2 grid grid-cols-8 gap-1 max-w-64">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => applyColor(color)}
                    className="w-6 h-6 border border-gray-300 rounded hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </Dropdown>
            <div className="w-px h-6 bg-gray-300 mx-1" />
            <ToolbarButton
              onClick={() => formatText("justifyLeft")}
              title="Align Left"
            >
              <FaAlignLeft size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => formatText("justifyCenter")}
              title="Align Center"
            >
              <FaAlignCenter size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => formatText("justifyRight")}
              title="Align Right"
            >
              <FaAlignRight size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => formatText("justifyFull")}
              title="Justify"
            >
              <FaAlignJustify size={16} />
            </ToolbarButton>
            <div className="w-px h-6 bg-gray-300 mx-1" />
            <ToolbarButton onClick={insertLink} title="Insert Link">
              <FaLink size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={insertTable} title="Insert Table">
              <FaTable size={16} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => formatText("insertHTML", "<hr />")}
              title="Insert Horizontal Line"
            >
              <FaMinus size={16} />
            </ToolbarButton>
          </div>
        </div>
      )}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable={!readOnly}
          onInput={handleContentChange}
          className={`p-4 min-h-96 max-h-96 overflow-y-auto outline-none ${
            readOnly ? "bg-gray-50 cursor-default" : "bg-white"
          }`}
          style={{ fontSize: "16px", lineHeight: "1.6", color: "#374151" }}
          data-placeholder={placeholder}
        />
        {!content && !readOnly && (
          <div
            className="absolute top-4 left-4 text-gray-400 pointer-events-none select-none"
            style={{ fontSize: "16px" }}
          >
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;
