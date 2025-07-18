import { useState } from "react";
import { ChevronUp, Plus, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import { StyleCard, ColorPicker, Slider } from "../components/design-system";
import { Hero211 } from "../components/hero/Hero211";
import { useResponsive } from "../hooks/useResponsive";

// Style selection data for generative styles
const STYLE_DATA = [
  {
    id: "realistic",
    title: "Realistic",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/cc6e61333f0d33e8e5784e930a352e6387da68a5?width=368",
  },
  {
    id: "cartoon",
    title: "Cartoon",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/5351a140da3fe436dbf8b18c27bd5e812d99214c?width=368",
  },
  {
    id: "minimalist",
    title: "Minimalist",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/cc6e61333f0d33e8e5784e930a352e6387da68a5?width=368",
  },
  {
    id: "cyberpunk",
    title: "Cyberpunk",
    image:
      "https://api.builder.io/api/v1/image/assets/TEMP/5351a140da3fe436dbf8b18c27bd5e812d99214c?width=368",
  },
];

export default function Index() {
  const { isMobile, isTablet, width, height } = useResponsive();
  const [isStyleSelectionExpanded, setIsStyleSelectionExpanded] =
    useState(true);
  const [isCustomColorsExpanded, setIsCustomColorsExpanded] = useState(true);
  const [selectedStyleId, setSelectedStyleId] = useState<string>("realistic");
  const [customColors, setCustomColors] = useState([
    { id: 1, hex: "#34C759", opacity: 100 },
  ]);
  const [editingColorId, setEditingColorId] = useState<number | null>(null);
  const [editingHex, setEditingHex] = useState<string>("");
  const [promptText, setPromptText] = useState<string>("");
  const [isPromptFocused, setIsPromptFocused] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [charCount, setCharCount] = useState<number>(0);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [imageProcessed, setImageProcessed] = useState<boolean>(false);
  const [processedImageData, setProcessedImageData] = useState(null);

  const handleGenerate = async () => {
    if (promptText.trim().length === 0 || isGenerating) return;

    setIsGenerating(true);
    // Simulate generation
    setTimeout(() => {
      setIsGenerating(false);
      setImageProcessed(true); // Switch to processed view after generation
      console.log("Generating 3D object:", promptText);
    }, 3000);
  };

  return (
    <div
      className="responsive-container overflow-hidden-all"
      style={{
        background: "var(--Shade-2-100, #F8F7F7)",
        height: '100%',
        maxHeight: '100%'
      }}
    >
      <div className={`${isMobile ? 'layout-vertical' : 'layout-horizontal'} gap-4 h-full`}>
        {/* Left Sidebar */}
        <div
          className={`layout-sidebar flex flex-col justify-between items-center rounded-[20px] border border-[var(--Stroke-01)] bg-[var(--Surface-01)] overflow-y-auto-safe ${isMobile ? 'order-2 max-h-[40vh]' : ''}`}
          style={{
            borderColor: "var(--Stroke-01, #ECECEC)",
            backgroundColor: "var(--Surface-01, #FCFCFC)",
          }}
        >
          {/* Top Section */}
          <div className="flex flex-col items-start self-stretch rounded-[20px]">
            {/* Project Header */}
            <div
              className="flex p-3 px-2.5 flex-col justify-start gap-2 self-stretch sticky top-0 z-10 bg-[var(--Surface-01,#FCFCFC)] rounded-t-[20px]"
              style={{
                backgroundColor: "var(--Surface-01, #FCFCFC)",
              }}
            >
              <div className="flex py-1 px-1.5 justify-between items-center self-stretch">
                {/* Logo */}
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_6005_53455)">
                    <path
                      d="M15.457 6.1709L15.2695 6.06055L12.0488 4.17188L8.49414 6.24414L11.6172 8.30957L13.0928 7.31641L13.1572 7.27246L13.2256 7.31152L15.584 8.6875L15.7568 8.78906L15.5898 8.89941L11.7217 11.4746L11.6533 11.5195L11.584 11.4756L7.17383 8.63477L7.1709 10.7432V10.8096L7.11621 10.8467L3.58301 13.2393V18.5518L5.875 20.1035L8.11914 18.5859V17.3359L4.88672 15.123L4.73242 15.0176L4.88867 14.915L6.99219 13.5371L7.06055 13.4932L7.12891 13.5371L9.3623 14.9902L12.3076 13.0205L12.502 12.8906V16.0352L12.4473 16.0723L10.8271 17.1826V18.8828L12.1279 19.9023L14.7461 18.4287L14.7539 12.1855V12.1162L14.8135 12.0791L18.6504 9.72461V6.16602L18.8457 6.2998L21.3037 7.98145L21.3584 8.01855V9.88379L22.7432 10.8955L24.8262 9.48438L24.8232 7.21582L20.1201 4.12012L20.0645 4.08398V0.768555L20.2578 0.895508L27.4727 5.61133L27.5293 5.64844V5.71582L27.5342 9.55859L31.0703 11.9541L31.125 11.9912V20.2188L31.0703 20.2568L27.5342 22.6504L27.5293 26.4961V26.5684L27.4678 26.6045L20.0107 30.9502L19.9473 30.9863L19.8848 30.9492L16.6045 29.0264L16.543 28.9902V25.8311L16.7305 25.9414L19.9512 27.8291L23.5049 25.7568L20.3809 23.6904L18.9062 24.666L18.8418 24.709L18.7744 24.6699L16.416 23.2959L16.2422 23.1943L16.4102 23.083L20.2793 20.5254L20.3467 20.4805L20.416 20.5244L24.8252 23.3662L24.8291 21.2588V21.1924L24.8838 21.1553L28.417 18.7617V13.4492L26.124 11.8975L23.8809 13.415V14.6631L27.1133 16.8789L27.2676 16.9844L27.1113 17.0869L25.0078 18.4648L24.9395 18.5088L24.8711 18.4648L22.6367 17.0107L19.6924 18.9814L19.498 19.1113V15.9668L19.5527 15.9297L21.1729 14.8184V13.1172L19.8721 12.0996L17.3447 13.5723L17.3018 19.8164L17.3008 19.8867L17.2412 19.9229L13.3496 22.2773V25.8359L13.1543 25.7021L10.6963 24.0205L10.6416 23.9834V22.1172L9.25586 21.1055L7.17285 22.5166L7.17578 24.7852L11.8799 27.8809L11.9355 27.918V31.2314L11.7422 31.1045L4.52734 26.3906L4.4707 26.3535V26.2861L4.46484 22.4404L0.929688 20.0459L0.875 20.0088V11.7822L0.929688 11.7451L4.46484 9.34961L4.4707 5.50586V5.43359L4.53223 5.39746..."
                      fill="#121212"
                      stroke="#121212"
                      strokeWidth="0.25"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_6005_53455">
                      <rect width="32" height="32" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>

              {/* Project Details */}
              <div className="flex flex-col items-start self-stretch">
                <div className="flex items-center self-stretch rounded-md">
                  <div className="flex px-1.5 items-center">
                    <div
                      className="text-xs font-normal leading-4 tracking-[-0.1px] max-w-[174px] overflow-hidden text-ellipsis"
                      style={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 1,
                        color: "var(--Text-Primary, #121212)",
                        fontFamily: "Inter",
                      }}
                    >
                      <span className="text-[15px] font-bold">Madar </span>
                      <span className="text-[10px] font-normal">Beta</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Upload Area */}
            <motion.div
              className="flex-1 p-4 border-t"
              style={{
                borderTopColor: "var(--Stroke-01, #ECECEC)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            >
              <motion.div
                className={`relative w-full h-[280px] rounded-3xl border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center gap-4 cursor-pointer overflow-hidden ${
                  isDragOver
                    ? "border-[#9013FE] bg-gradient-to-br from-purple-50 to-blue-50"
                    : uploadedFiles.length > 0
                      ? "border-green-400 bg-gradient-to-br from-green-50 to-emerald-50"
                      : "border-gray-300 hover:border-purple-400 hover:bg-gradient-to-br hover:from-purple-25 hover:to-blue-25"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setIsDragOver(false);
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  const files = Array.from(e.dataTransfer.files).filter(
                    (file) => file.type.startsWith("image/"),
                  );
                  if (uploadedFiles.length + files.length <= 3) {
                    setUploadedFiles([...uploadedFiles, ...files]);
                  }
                }}
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.multiple = true;
                  input.onchange = (e) => {
                    const files = Array.from(
                      (e.target as HTMLInputElement).files || [],
                    );
                    if (uploadedFiles.length + files.length <= 3) {
                      setUploadedFiles([...uploadedFiles, ...files]);
                    }
                  };
                  input.click();
                }}
                whileHover={{
                  scale: 1.002,
                  rotateY: isDragOver ? 0 : 1,
                  rotateX: isDragOver ? 0 : 1,
                }}
                whileTap={{ scale: 0.998 }}
                animate={{
                  borderColor: isDragOver
                    ? "#9013FE"
                    : uploadedFiles.length > 0
                      ? "#10B981"
                      : "#D1D5DB",
                }}
                transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
              >
                {/* Animated Background Particles */}
                {isDragOver && (
                  <motion.div className="absolute inset-0 pointer-events-none">
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-purple-400 rounded-full"
                        initial={{
                          x: Math.random() * 400,
                          y: Math.random() * 300,
                          scale: 0,
                          opacity: 0,
                        }}
                        animate={{
                          x: Math.random() * 400,
                          y: Math.random() * 300,
                          scale: [0, 1, 0],
                          opacity: [0, 0.6, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.1,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </motion.div>
                )}

                {/* Main Upload Content */}
                {uploadedFiles.length === 0 ? (
                  <motion.div
                    className="flex flex-col items-center justify-center gap-6 text-center"
                    animate={{
                      y: isDragOver ? -10 : 0,
                      scale: isDragOver ? 1.05 : 1,
                    }}
                    transition={{
                      duration: 0.3,
                      type: "spring",
                      stiffness: 200,
                    }}
                  >
                    {/* Animated Upload Icon */}
                    <motion.div
                      className={`relative w-20 h-20 rounded-full flex items-center justify-center ${
                        isDragOver
                          ? "bg-gradient-to-br from-purple-200 to-blue-200"
                          : "bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-purple-100 group-hover:to-blue-100"
                      }`}
                      animate={{
                        rotate: isDragOver ? [0, 5, -5, 0] : 0,
                        scale: isDragOver ? [1, 1.1, 1] : 1,
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: isDragOver ? Infinity : 0,
                        ease: "easeInOut",
                      }}
                    >
                      <motion.svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        animate={{
                          y: isDragOver ? [-2, 2, -2] : [0, -3, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <path
                          d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 8L12 3M12 3L7 8M12 3V15"
                          stroke={isDragOver ? "#9013FE" : "#6B7280"}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </motion.svg>

                      {/* Pulse Ring */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-purple-300"
                        animate={{
                          scale: isDragOver ? [1, 1.4, 1] : 1,
                          opacity: isDragOver ? [0.8, 0, 0.8] : 0,
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: isDragOver ? Infinity : 0,
                          ease: "easeOut",
                        }}
                      />
                    </motion.div>

                    {/* Upload Text */}
                    <motion.div
                      className="space-y-2"
                      animate={{
                        y: isDragOver ? -5 : 0,
                        scale: isDragOver ? 1.02 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        className="text-lg font-semibold"
                        style={{
                          color: isDragOver
                            ? "#9013FE"
                            : "var(--Text-Primary, #121212)",
                          fontFamily: "Inter",
                        }}
                        animate={{
                          color: isDragOver ? "#9013FE" : "#121212",
                        }}
                      >
                        {isDragOver
                          ? "✨ Drop your magic here ✨"
                          : "Upload Reference Images"}
                      </motion.div>
                      <motion.div
                        className="text-sm opacity-75"
                        style={{
                          color: "var(--Text-Secondary, #7B7B7B)",
                          fontFamily: "Inter",
                        }}
                      >
                        Drag & drop or click to browse • PNG, JPG, WebP • Max 3
                        files
                      </motion.div>
                    </motion.div>
                  </motion.div>
                ) : (
                  /* Uploaded Files Display */
                  <motion.div
                    className="w-full h-full p-6 flex flex-col gap-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.4,
                      type: "spring",
                      stiffness: 150,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <motion.div
                        className="text-sm font-semibold text-green-600"
                        style={{ fontFamily: "Inter" }}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        ✅ {uploadedFiles.length} file
                        {uploadedFiles.length > 1 ? "s" : ""} uploaded
                      </motion.div>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedFiles([]);
                        }}
                        className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded-md hover:bg-red-50 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Clear All
                      </motion.button>
                    </div>

                    <div className="grid grid-cols-1 gap-3 flex-1 overflow-y-auto">
                      {uploadedFiles.map((file, index) => (
                        <motion.div
                          key={`${file.name}-${index}`}
                          className="flex items-center gap-4 p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-green-200 group hover:border-green-300 hover:shadow-md transition-all"
                          initial={{ opacity: 0, y: 20, rotateX: -10 }}
                          animate={{ opacity: 1, y: 0, rotateX: 0 }}
                          exit={{ opacity: 0, y: -20, rotateX: 10 }}
                          transition={{
                            duration: 0.4,
                            delay: index * 0.1,
                            type: "spring",
                            stiffness: 200,
                          }}
                          whileHover={{
                            scale: 1.02,
                            y: -2,
                          }}
                        >
                          {/* Enhanced File Preview */}
                          <motion.div
                            className="relative w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
                            whileHover={{ scale: 1.1, rotate: 2 }}
                            transition={{ duration: 0.2 }}
                          >
                            {file.type.startsWith("image/") ? (
                              <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <path
                                  d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                                  stroke="#10B981"
                                  strokeWidth="2"
                                />
                                <path
                                  d="M14 2V8H20"
                                  stroke="#10B981"
                                  strokeWidth="2"
                                />
                              </svg>
                            )}
                          </motion.div>

                          {/* Enhanced File Info */}
                          <div className="flex-1 min-w-0 space-y-1">
                            <motion.div
                              className="text-xs font-medium truncate"
                              style={{
                                color: "var(--Text-Primary, #121212)",
                                fontFamily: "Inter",
                              }}
                            >
                              {file.name}
                            </motion.div>
                            <motion.div
                              className="text-xs text-green-600 font-medium"
                              style={{ fontFamily: "Inter" }}
                            >
                              {(file.size / 1024 / 1024).toFixed(1)}MB
                            </motion.div>
                          </div>

                          {/* Enhanced Remove Button */}
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              setUploadedFiles(
                                uploadedFiles.filter((_, i) => i !== index),
                              );
                            }}
                            className="w-6 h-6 rounded-full bg-red-100 text-red-500 hover:bg-red-200 hover:text-red-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                            whileHover={{ scale: 1.2, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            ×
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>

                    {/* Add More Files Button */}
                    {uploadedFiles.length < 3 && (
                      <motion.div
                        className="flex items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: uploadedFiles.length * 0.1 + 0.3 }}
                      >
                        <span className="text-xs text-gray-500 font-medium">
                          + Add more files ({3 - uploadedFiles.length}{" "}
                          remaining)
                        </span>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Super Drag Overlay */}
                {isDragOver && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-3xl border-2 border-[#9013FE] border-dashed flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className="text-center"
                      animate={{
                        y: [-5, 5, -5],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <div className="text-2xl font-bold text-purple-600 mb-2">
                        🎯 Drop Zone Active!
                      </div>
                      <div className="text-purple-500 font-medium">
                        Release to upload your images
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>

            {/* Style Selection Section */}
            <div className="flex flex-col items-start self-stretch">
              <div
                className="flex h-12 py-3 px-4 justify-between items-center self-stretch border-t cursor-pointer"
                style={{
                  borderTopColor: "var(--Stroke-01, #ECECEC)",
                }}
                onClick={() =>
                  setIsStyleSelectionExpanded(!isStyleSelectionExpanded)
                }
              >
                <div
                  className="text-xs font-semibold leading-4 tracking-[-0.12px]"
                  style={{
                    color: "var(--Text-Primary, #121212)",
                    fontFamily: "Inter",
                  }}
                >
                  Generative Style
                </div>
                <div className="flex p-1 justify-center items-center gap-2 rounded-md">
                  <ChevronUp
                    className="w-4 h-4"
                    style={{ color: "var(--Text-Secondary, #7B7B7B)" }}
                  />
                </div>
              </div>

              {/* Style Selection Grid */}
              {isStyleSelectionExpanded && (
                <motion.div
                  className="flex py-0 px-4 pb-4 items-start content-start gap-2 self-stretch flex-wrap"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {STYLE_DATA.map((style, index) => (
                    <motion.div
                      key={style.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      <StyleCard
                        id={style.id}
                        title={style.title}
                        image={style.image}
                        isSelected={selectedStyleId === style.id}
                        onClick={() => setSelectedStyleId(style.id)}
                        className="w-[184px] h-[180px]"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Custom Colors Section */}
            <div className="flex flex-col items-start self-stretch">
              <div
                className="flex h-12 py-3 px-4 justify-between items-center self-stretch border-t cursor-pointer"
                style={{
                  borderTopColor: "var(--Stroke-01, #ECECEC)",
                }}
                onClick={() =>
                  setIsCustomColorsExpanded(!isCustomColorsExpanded)
                }
              >
                <div
                  className="text-xs font-semibold leading-4 tracking-[-0.12px]"
                  style={{
                    color: "var(--Text-Primary, #121212)",
                    fontFamily: "Inter",
                  }}
                >
                  Use Custom Colors ({customColors.length}/2)
                </div>
                <div
                  className={`flex p-1 justify-center items-center gap-2 rounded-md transition-colors ${
                    customColors.length >= 2
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer hover:bg-gray-100"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (customColors.length < 2) {
                      const newColor = {
                        id: Date.now(),
                        hex: `#${Math.floor(Math.random() * 16777215)
                          .toString(16)
                          .padStart(6, "0")}`,
                        opacity: 100,
                      };
                      setCustomColors([...customColors, newColor]);
                    }
                  }}
                  title={
                    customColors.length >= 2
                      ? "Maximum 2 colors allowed"
                      : "Add color"
                  }
                >
                  <Plus
                    className="w-4 h-4"
                    style={{ color: "var(--Text-Secondary, #7B7B7B)" }}
                  />
                </div>
              </div>

              {/* Color Picker */}
              {isCustomColorsExpanded && (
                <div className="flex py-0 px-4 pb-4 flex-col items-start gap-2 self-stretch">
                  {customColors.map((color) => (
                    <div
                      key={color.id}
                      className="flex p-1 items-center self-stretch rounded-[10px] border group hover:border-gray-300 transition-colors"
                      style={{
                        borderColor: "var(--Stroke-01, #ECECEC)",
                        backgroundColor: "var(--Surface-03, #F1F1F1)",
                      }}
                    >
                      <div className="flex items-center gap-3 flex-1 border-r border-[rgba(50,50,50,0.10)]">
                        <ColorPicker
                          color={color.hex}
                          onChange={(newHex) => {
                            setCustomColors(
                              customColors.map((c) =>
                                c.id === color.id ? { ...c, hex: newHex } : c,
                              ),
                            );
                          }}
                        >
                          <div
                            className="w-7 h-7 rounded-md border cursor-pointer hover:scale-105 transition-transform"
                            style={{
                              borderColor: "rgba(50, 50, 50, 0.10)",
                              backgroundColor: color.hex,
                            }}
                          ></div>
                        </ColorPicker>
                        {editingColorId === color.id ? (
                          <input
                            type="text"
                            value={editingHex}
                            onChange={(e) => setEditingHex(e.target.value)}
                            onBlur={() => {
                              const isValidHex = /^#[0-9A-Fa-f]{6}$/.test(
                                editingHex,
                              );
                              if (isValidHex) {
                                setCustomColors(
                                  customColors.map((c) =>
                                    c.id === color.id
                                      ? { ...c, hex: editingHex.toUpperCase() }
                                      : c,
                                  ),
                                );
                              } else {
                                setEditingHex(color.hex.toUpperCase());
                              }
                              setEditingColorId(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.currentTarget.blur();
                              } else if (e.key === "Escape") {
                                setEditingHex(color.hex.toUpperCase());
                                setEditingColorId(null);
                              }
                            }}
                            className="text-xs font-medium leading-4 tracking-[-0.12px] bg-transparent border-none outline-none focus:outline-none w-16 text-center px-1 py-0.5 rounded hover:bg-gray-50 focus:bg-gray-50"
                            style={{
                              color: "var(--Text-Primary, #121212)",
                              fontFamily: "Inter",
                            }}
                            autoFocus
                          />
                        ) : (
                          <div
                            className="text-xs font-medium leading-4 tracking-[-0.12px] cursor-pointer px-1 py-0.5 rounded hover:bg-gray-50 transition-colors"
                            style={{
                              color: "var(--Text-Primary, #121212)",
                              fontFamily: "Inter",
                            }}
                            onClick={() => {
                              setEditingColorId(color.id);
                              setEditingHex(color.hex.toUpperCase());
                            }}
                          >
                            {color.hex.toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex py-0 px-3 justify-center items-center gap-2">
                        <button
                          onClick={() =>
                            setCustomColors(
                              customColors.filter((c) => c.id !== color.id),
                            )
                          }
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Interactive Prompt Input */}
          <motion.div
            className="flex p-3 flex-col items-start gap-6 self-stretch rounded-3xl border backdrop-blur-md shadow-[0px_18px_24px_-20px_rgba(0,0,0,0.13),0px_2px_0px_0px_#FFF_inset,0px_8px_16px_-12px_rgba(0,0,0,0.08)] mx-3 mb-3"
            style={{
              borderColor: isPromptFocused
                ? "rgba(144, 19, 254, 0.3)"
                : "var(--Stroke-01, #ECECEC)",
              backgroundColor: "var(--Surface-01, #FCFCFC)",
            }}
            animate={{
              scale: isPromptFocused ? 1.01 : 1,
              borderColor: isPromptFocused
                ? "rgba(144, 19, 254, 0.3)"
                : "var(--Stroke-01, #ECECEC)",
            }}
            transition={{ duration: 0.2 }}
          >
            {/* Textarea Container */}
            <div className="flex p-2 items-start gap-2 self-stretch relative">
              <textarea
                value={promptText}
                onChange={(e) => {
                  setPromptText(e.target.value);
                  setCharCount(e.target.value.length);
                  // Auto-resize
                  e.target.style.height = "auto";
                  e.target.style.height =
                    Math.min(e.target.scrollHeight, 200) + "px";
                }}
                onFocus={() => setIsPromptFocused(true)}
                onBlur={() => setIsPromptFocused(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
                placeholder="Describe your 3D object or scene in detail... (Cmd+Enter to generate)"
                className="text-[15px] font-normal leading-6 tracking-[-0.3px] flex-1 resize-none border-none outline-none bg-transparent min-h-[120px] max-h-[200px] transition-all duration-200"
                style={{
                  color: promptText
                    ? "var(--Text-Primary, #121212)"
                    : "var(--Text-Secondary, #7B7B7B)",
                  fontFamily: "Inter",
                  height: promptText ? "auto" : "120px",
                }}
                maxLength={500}
              />

              {/* Character Count */}
              <motion.div
                className="absolute bottom-2 right-2 text-xs"
                style={{
                  color:
                    charCount > 450
                      ? "#ef4444"
                      : "var(--Text-Secondary, #7B7B7B)",
                  fontFamily: "Inter",
                }}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: isPromptFocused || charCount > 0 ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                {charCount}/500
              </motion.div>
            </div>

            {/* Actions Row */}
            <motion.div
              className="flex justify-between items-center self-stretch pt-2"
              style={{
                borderTop: isPromptFocused
                  ? "1px solid rgba(144, 19, 254, 0.2)"
                  : "1px solid transparent",
              }}
              animate={{
                borderTopColor: isPromptFocused
                  ? "rgba(144, 19, 254, 0.2)"
                  : "transparent",
              }}
              transition={{ duration: 0.2 }}
            >
              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                {promptText.length > 0 && !isGenerating && (
                  <motion.div
                    className="flex items-center gap-1 px-2 py-1 rounded-md"
                    style={{ backgroundColor: "rgba(144, 19, 254, 0.1)" }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <motion.div
                      className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: "#9013FE" }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                    <span
                      className="text-xs font-medium"
                      style={{
                        color: "#9013FE",
                        fontFamily: "Inter",
                      }}
                    >
                      Ready to generate
                    </span>
                  </motion.div>
                )}

                {isGenerating && (
                  <motion.div
                    className="flex items-center gap-2 px-2 py-1 rounded-md"
                    style={{ backgroundColor: "rgba(144, 19, 254, 0.1)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="w-3 h-3 border-2 border-purple-500 border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <span
                      className="text-xs font-medium"
                      style={{
                        color: "#9013FE",
                        fontFamily: "Inter",
                      }}
                    >
                      Generating...
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                className="flex w-10 h-10 py-3 px-8 justify-center items-center gap-2 rounded-xl cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  background: isGenerating
                    ? "linear-gradient(180deg, #9013FE 0%, #7c3aed 100%)"
                    : promptText.trim().length > 0
                      ? "linear-gradient(180deg, #9013FE 0%, #7c3aed 100%)"
                      : "linear-gradient(180deg, #E5E5E5 0%, #E2E2E2 100%)",
                  boxShadow:
                    promptText.trim().length > 0 || isGenerating
                      ? "0px 3px 4px -1px rgba(144, 19, 254, 0.3), 0px 1px 0px 0px rgba(255, 255, 255, 0.33) inset, 0px 0px 0px 1px rgba(144, 19, 254, 0.5)"
                      : "0px 3px 4px -1px rgba(0, 0, 0, 0.15), 0px 1px 0px 0px rgba(255, 255, 255, 0.33) inset, 0px 0px 0px 1px #D4D4D4",
                }}
                whileHover={{
                  scale: promptText.trim().length > 0 ? 1.05 : 1,
                  y: promptText.trim().length > 0 ? -1 : 0,
                }}
                whileTap={{ scale: 0.95 }}
                disabled={promptText.trim().length === 0 || isGenerating}
                onClick={handleGenerate}
              >
                {isGenerating ? (
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                ) : (
                  <ArrowUp
                    className="w-5 h-5 flex-shrink-0"
                    style={{
                      color:
                        promptText.trim().length > 0
                          ? "white"
                          : "var(--Text-Primary, #121212)",
                    }}
                  />
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Sidebar - Canvas/Preview Area */}
        <div
          className={`layout-main flex flex-col items-center justify-center rounded-[20px] border overflow-hidden ${isMobile ? 'order-1 min-h-[60vh]' : ''}`}
          style={{
            borderColor: "var(--Stroke-01, #ECECEC)",
            backgroundColor: "var(--Surface-01, #FCFCFC)",
          }}
        >
          {!imageProcessed ? (
            <div className="hero-wrapper w-full h-full">
              <Hero211 />
            </div>
          ) : (
            <div className="processed-image-container w-full h-full flex flex-col items-center justify-center gap-4 p-8">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="#7B7B7B"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="#7B7B7B"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="#7B7B7B"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="text-center">
                <div
                  className="text-lg font-medium mb-2"
                  style={{
                    color: "var(--Text-Primary, #121212)",
                    fontFamily: "Inter",
                  }}
                >
                  Processed Image
                </div>
                <div
                  className="text-sm"
                  style={{
                    color: "var(--Text-Secondary, #7B7B7B)",
                    fontFamily: "Inter",
                  }}
                >
                  Your processed 3D objects will appear here
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
