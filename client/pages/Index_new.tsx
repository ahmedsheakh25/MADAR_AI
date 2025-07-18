import { useState } from "react";
import { ChevronUp, Plus, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import { StyleCard, ColorPicker, Slider } from "../components/design-system";

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

  const handleGenerate = async () => {
    if (promptText.trim().length === 0 || isGenerating) return;

    setIsGenerating(true);
    // Simulate generation
    setTimeout(() => {
      setIsGenerating(false);
      console.log("Generating 3D object:", promptText);
    }, 3000);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-white font-inter"
      style={{
        background: "var(--Shade-2-100, #F8F7F7)",
      }}
    >
      <div className="w-full max-w-[1440px] h-[1024px] flex items-center gap-8 p-8">
        {/* Left Sidebar */}
        <div
          className="w-[442px] flex flex-col justify-end items-center gap-8 h-full rounded-[20px] border border-[var(--Stroke-01)] bg-[var(--Surface-01)]"
          style={{
            borderColor: "var(--Stroke-01, #ECECEC)",
            backgroundColor: "var(--Surface-01, #FCFCFC)",
          }}
        >
          {/* Project Info */}
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
                      d="M15.457 6.1709L15.2695 6.06055L12.0488 4.17188L8.49414 6.24414L11.6172 8.30957L13.0928 7.31641L13.1572 7.27246L13.2256 7.31152L15.584 8.6875L15.7568 8.78906L15.5898 8.89941L11.7217 11.4746L11.6533 11.5195L11.584 11.4756L7.17383 8.63477L7.1709 10.7432V10.8096L7.11621 10.8467L3.58301 13.2393V18.5518L5.875 20.1035L8.11914 18.5859V17.3359L4.88672 15.123L4.73242 15.0176L4.88867 14.915L6.99219 13.5371L7.06055 13.4932L7.12891 13.5371L9.3623 14.9902L12.3076 13.0205L12.502 12.8906V16.0352L12.4473 16.0723L10.8271 17.1826V18.8828L12.1279 19.9023L14.7461 18.4287L14.7539 12.1855V12.1162L14.8135 12.0791L18.6504 9.72461V6.16602L18.8457 6.2998L21.3037 7.98145L21.3584 8.01855V9.88379L22.7432 10.8955L24.8262 9.48438L24.8232 7.21582L20.1201 4.12012L20.0645 4.08398V0.768555L20.2578 0.895508L27.4727 5.61133L27.5293 5.64844V5.71582L27.5342 9.55859L31.0703 11.9541L31.125 11.9912V20.2188L31.0703 20.2568L27.5342 22.6504L27.5293 26.4961V26.5684L27.4678 26.6045L20.0107 30.9502L19.9473 30.9863L19.8848 30.9492L16.6045 29.0264L16.543 28.9902V25.8311L16.7305 25.9414L19.9512 27.8291L23.5049 25.7568L20.3809 23.6904L18.9062 24.666L18.8418 24.709L18.7744 24.6699L16.416 23.2959L16.2422 23.1943L16.4102 23.083L20.2793 20.5254L20.3467 20.4805L20.416 20.5244L24.8252 23.3662L24.8291 21.2588V21.1924L24.8838 21.1553L28.417 18.7617V13.4492L26.124 11.8975L23.8809 13.415V14.6631L27.1133 16.8789L27.2676 16.9844L27.1113 17.0869L25.0078 18.4648L24.9395 18.5088L24.8711 18.4648L22.6367 17.0107L19.6924 18.9814L19.498 19.1113V15.9668L19.5527 15.9297L21.1729 14.8184V13.1172L19.8721 12.0996L17.3447 13.5723L17.3018 19.8164L17.3008 19.8867L17.2412 19.9229L13.3496 22.2773V25.8359L13.1543 25.7021L10.6963 24.0205L10.6416 23.9834V22.1172L9.25586 21.1055L7.17285 22.5166L7.17578 24.7852L11.8799 27.8809L11.9355 27.918V31.2314L11.7422 31.1045L4.52734 26.3906L4.4707 26.3535V26.2861L4.46484 22.4404L0.929688 20.0459L0.875 20.0088V11.7822L0.929688 11.7451L4.46484 9.34961L4.4707 5.50586V5.43359L4.53223 5.39746L11.7695 4.85547L11.8301 4.85059V8.15625L11.6348 8.02344L9.17676 6.34375L9.12207 6.30664V4.44336L10.5068 3.43164L12.5898 4.84277L12.5928 7.11133L16.1289 4.71582L16.1855 4.67969V0.732422L15.9922 0.859375L8.77734 5.57617L8.7207 5.61328V5.6875L8.7168 9.52734L5.18066 11.9219L5.125 11.959V20.1953L5.18066 20.2324L8.7168 22.627L8.7207 26.4688V26.543L8.78223 26.5791L16.2393 30.9248L16.3027 30.9609L16.3652 30.9238L19.6455 29.001L19.707 28.9648V25.8105L19.5146 25.9414L16.291 27.8291L12.7373 25.7568L15.8613 23.6904L17.3359 24.666L17.4004 24.709L17.4678 24.6699L19.8262 23.2959L19.998 23.1943L19.8301 23.083L15.9609 20.5254L15.8936 20.4805L15.8242 20.5244L11.415 23.3662L11.4121 21.2588V21.1924L11.3574 21.1553L7.82422 18.7617V13.4492L10.1172 11.8975L12.3604 13.415V14.6631L9.12793 16.8789L8.97363 16.9844L9.12988 17.0869L11.2334 18.4648L11.3018 18.5088L11.3701 18.4648L15.7803 17.0107L19.2246 18.9814L19.4189 19.1113V15.9668L19.3643 15.9297L17.7441 14.8184V13.1172L19.0449 12.0996L21.5723 13.5723L21.6152 19.8164L21.6162 19.8867L21.6758 19.9229L25.5674 22.2773V25.8359L25.7627 25.7021L28.2207 24.0205L28.2754 23.9834V22.1172L29.6611 21.1055L31.7441 22.5166L31.7412 24.7852L27.0371 27.8809L26.9814 27.918V31.2314L27.1748 31.1045L34.3896 26.3906L34.4463 26.3535V26.2861L34.4521 22.4404L37.9863 20.0459L38.041 20.0088V11.7822L37.9863 11.7451L34.4521 9.34961L34.4463 5.50586V5.43359L34.3848 5.39746L27.147 4.85547L27.0864 4.85059V8.15625L27.2822 8.02344L29.7393 6.34375L29.7939 6.30664V4.44336L28.4092 3.43164L26.3262 4.84277L26.3232 7.11133L22.7871 4.71582L22.7305 4.67969V0.732422L22.9238 0.859375L30.1387 5.57617L30.1953 5.61328V5.6875L30.1992 9.52734L33.7354 11.9219L33.791 11.959V20.1953L33.7354 20.2324L30.1992 22.627L30.1953 26.4688V26.543L30.1338 26.5791L22.6768 30.9248L22.6133 30.9609L22.5508 30.9238L19.2705 29.001L19.209 28.9648V25.8105L19.4014 25.9414L22.625 27.8291L26.1787 25.7568L23.0547 23.6904L21.5801 24.666L21.5156 24.709L21.4482 24.6699L19.0898 23.2959L18.918 23.1943L19.0859 23.083L22.9551 20.5254L23.0225 20.4805L23.0918 20.5244L27.501 23.3662L27.5039 21.2588V21.1924L27.5586 21.1553L31.0918 18.7617V13.4492L28.7988 11.8975L26.5557 13.415V14.6631L29.7881 16.8789L29.9424 16.9844L29.7861 17.0869L27.6826 18.4648L27.6143 18.5088L27.5459 18.4648L23.1357 17.0107L19.6914 18.9814L19.4971 19.1113V15.9668L19.5518 15.9297L21.1719 14.8184V13.1172L19.8711 12.0996L17.3438 13.5723L17.3008 19.8164L17.2998 19.8867L17.2402 19.9229L13.3486 22.2773V25.8359L13.1533 25.7021L10.6953 24.0205L10.6406 23.9834V22.1172L9.25488 21.1055L7.17188 22.5166L7.17481 24.7852L11.8789 27.8809L11.9345 27.918V31.2314L11.7412 31.1045L4.52638 26.3906L4.46972 26.3535V26.2861L4.46387 22.4404L0.929721 20.0459L0.875034 20.0088V11.7822L0.929721 11.7451L4.46387 9.34961L4.46972 5.50586V5.43359L4.53125 5.39746L11.7686 4.85547L11.8291 4.85059V8.15625L11.6338 8.02344L9.17578 6.34375L9.12109 6.30664V4.44336L10.5058 3.43164L12.5888 4.84277L12.5918 7.11133L16.1279 4.71582L16.1845 4.67969V0.732422L15.9912 0.859375L8.77634 5.57617L8.71968 5.61328V5.6875L8.71581 9.52734L5.17969 11.9219L5.12402 11.959V20.1953L5.17969 20.2324L8.71581 22.627L8.71968 26.4688V26.543L8.78125 26.5791L16.2383 30.9248L16.3018 30.9609L16.3643 30.9238L19.6445 29.001L19.706 28.9648V25.8105L19.5137 25.9414L16.29 27.8291L12.7363 25.7568L15.8604 23.6904L17.335 24.666L17.3994 24.709L17.4668 24.6699L19.8252 23.2959L19.997 23.1943L19.8291 23.083L15.96 20.5254L15.8926 20.4805L15.8232 20.5244L11.414 23.3662L11.4111 21.2588V21.1924L11.3564 21.1553L7.82324 18.7617V13.4492L10.1162 11.8975L12.3594 13.415V14.6631L9.12695 16.8789L8.97266 16.9844L9.12891 17.0869L11.2324 18.4648L11.3008 18.5088L11.3691 18.4648L15.7793 17.0107L19.2236 18.9814L19.418 19.1113V15.9668L19.3633 15.9297L17.7432 14.8184V13.1172L19.0439 12.0996L21.5713 13.5723L21.6143 19.8164L21.6152 19.8867L21.6748 19.9229L25.5664 22.2773V25.8359L25.7617 25.7021L28.2197 24.0205L28.2744 23.9834V22.1172L29.6602 21.1055L31.7432 22.5166L31.7402 24.7852L27.0361 27.8809L26.9805 27.918V31.2314L27.1738 31.1045L34.3887 26.3906L34.4453 26.3535V26.2861L34.4512 22.4404L37.9854 20.0459L38.04 20.0088V11.7822L37.9854 11.7451L34.4512 9.34961L34.4453 5.50586V5.43359L34.3838 5.39746L27.146 4.85547L27.0854 4.85059V8.15625L27.2812 8.02344L29.7383 6.34375L29.793 6.30664V4.44336L28.4082 3.43164L26.3252 4.84277L26.3223 7.11133L22.7861 4.71582L22.7295 4.67969V0.732422L22.9229 0.859375L30.1377 5.57617L30.1943 5.61328V5.6875L30.1982 9.52734L33.7344 11.9219L33.79 11.959V20.1953L33.7344 20.2324L30.1982 22.627L30.1943 26.4688V26.543L30.1328 26.5791L22.6758 30.9248L22.6123 30.9609L22.5498 30.9238L19.2695 29.001L19.208 28.9648V25.8105L19.4004 25.9414L22.624 27.8291L26.1777 25.7568L23.0537 23.6904L21.5791 24.666L21.5146 24.709L21.4473 24.6699L19.0889 23.2959L18.917 23.1943L19.085 23.083L22.9541 20.5254L23.0215 20.4805L23.0908 20.5244L27.5 23.3662L27.5029 21.2588V21.1924L27.5576 21.1553L31.0908 18.7617V13.4492L28.7979 11.8975L26.5547 13.415V14.6631L29.7871 16.8789L29.9414 16.9844L29.7852 17.0869L27.6816 18.4648L27.6133 18.5088L27.5449 18.4648L23.1348 17.0107L19.6904 18.9814L19.4961 19.1113V15.9668L19.5508 15.9297L21.1709 14.8184V13.1172L19.8701 12.0996L17.3428 13.5723L17.2998 19.8164L17.2988 19.8867L17.2393 19.9229L13.3477 22.2773V25.8359L13.1523 25.7021L10.6943 24.0205L10.6396 23.9834V22.1172L9.25391 21.1055L7.17090 22.5166L7.17383 24.7852L11.8779 27.8809L11.9336 27.918V31.2314L11.7402 31.1045L4.52539 26.3906L4.46875 26.3535V26.2861L4.46289 22.4404L0.928740 20.0459L0.874053 20.0088V11.7822L0.928740 11.7451L4.46289 9.34961L4.46875 5.50586V5.43359L4.53028 5.39746L11.7676 4.85547L11.8281 4.85059V8.15625L11.6328 8.02344L9.17480 6.34375L9.12012 6.30664V4.44336L10.5049 3.43164L12.5879 4.84277L12.5908 7.11133L16.127 4.71582L16.1836 4.67969V0.732422L15.9902 0.859375L8.77539 5.57617L8.71875 5.61328V5.6875L8.71484 9.52734L5.17871 11.9219L5.12305 11.959V20.1953L5.17871 20.2324L8.71484 22.627L8.71875 26.4688V26.543L8.78027 26.5791L16.2373 30.9248L16.3008 30.9609L16.3633 30.9238L19.6436 29.001L19.7051 28.9648V25.8105L19.5127 25.9414L16.2891 27.8291L12.7354 25.7568L15.8594 23.6904L17.334 24.666L17.3984 24.709L17.4658 24.6699L19.8242 23.2959L19.996 23.1943L19.8281 23.083L15.959 20.5254L15.8916 20.4805L15.8223 20.5244L11.4131 23.3662L11.4102 21.2588V21.1924L11.3555 21.1553L7.82227 18.7617V13.4492L10.1152 11.8975L12.3584 13.415V14.6631L9.12598 16.8789L8.97168 16.9844L9.12793 17.0869L11.2314 18.4648L11.2998 18.5088L11.3682 18.4648L15.7783 17.0107L19.2227 18.9814L19.417 19.1113V15.9668L19.3623 15.9297L17.7422 14.8184V13.1172L19.043 12.0996L21.5703 13.5723L21.6133 19.8164L21.6143 19.8867L21.6738 19.9229L25.5654 22.2773V25.8359L25.7607 25.7021L28.2188 24.0205L28.2734 23.9834V22.1172L29.6592 21.1055L31.7422 22.5166L31.7393 24.7852L27.0352 27.8809L26.9795 27.918V31.2314L27.1729 31.1045L34.3877 26.3906L34.4443 26.3535V26.2861L34.4502 22.4404L37.9844 20.0459L38.0391 20.0088V11.7822L37.9844 11.7451L34.4502 9.34961L34.4443 5.50586V5.43359L34.3828 5.39746L27.145 4.85547L27.0845 4.85059V8.15625L27.2803 8.02344L29.7373 6.34375L29.792 6.30664V4.44336L28.4072 3.43164L26.3242 4.84277L26.3213 7.11133L22.7852 4.71582L22.7285 4.67969V0.732422L22.9219 0.859375L30.1367 5.57617L30.1934 5.61328V5.6875L30.1973 9.52734L33.7334 11.9219L33.789 11.959V20.1953L33.7334 20.2324L30.1973 22.627L30.1934 26.4688V26.543L30.1318 26.5791L22.6748 30.9248L22.6113 30.9609L22.5488 30.9238L19.2686 29.001L19.207 28.9648V25.8105L19.3994 25.9414L22.623 27.8291L26.1768 25.7568L23.0527 23.6904L21.5781 24.666L21.5137 24.709L21.4463 24.6699L19.0879 23.2959L18.916 23.1943L19.084 23.083L22.9531 20.5254L23.0205 20.4805L23.0898 20.5244L27.499 23.3662L27.502 21.2588V21.1924L27.5566 21.1553L31.0898 18.7617V13.4492L28.7969 11.8975L26.5537 13.415V14.6631L29.7861 16.8789L29.9404 16.9844L29.7842 17.0869L27.6807 18.4648L27.6123 18.5088L27.544 18.4648L23.1338 17.0107L19.6895 18.9814L19.4951 19.1113V15.9668L19.5498 15.9297L21.17 14.8184V13.1172L19.8691 12.0996L17.3418 13.5723L17.2988 19.8164L17.2979 19.8867L17.2383 19.9229L13.3467 22.2773V25.8359L13.1514 25.7021L10.6934 24.0205L10.6387 23.9834V22.1172L9.25293 21.1055L7.16992 22.5166L7.17285 24.7852L11.877 27.8809L11.9326 27.918V31.2314L11.7393 31.1045L4.52441 26.3906L4.46777 26.3535V26.2861L4.46191 22.4404L0.927772 20.0459L0.873085 20.0088V11.7822L0.927772 11.7451L4.46191 9.34961L4.46777 5.50586V5.43359L4.5293 5.39746L11.7666 4.85547L11.8271 4.85059V8.15625L11.6318 8.02344L9.17383 6.34375L9.11914 6.30664V4.44336L10.5039 3.43164L12.5869 4.84277L12.5898 7.11133L16.126 4.71582L16.1826 4.67969V0.732422L15.9893 0.859375L8.77441 5.57617L8.71777 5.61328V5.6875L8.71387 9.52734L5.17773 11.9219L5.12207 11.959V20.1953L5.17773 20.2324L8.71387 22.627L8.71777 26.4688V26.543L8.7793 26.5791L16.2363 30.9248L16.2998 30.9609L16.3623 30.9238L19.6426 29.001L19.7041 28.9648V25.8105L19.5117 25.9414L16.2881 27.8291L12.7344 25.7568L15.8584 23.6904L17.333 24.666L17.3975 24.709L17.4648 24.6699L19.8232 23.2959L19.9951 23.1943L19.8271 23.083L15.958 20.5254L15.8906 20.4805L15.8213 20.5244L11.4121 23.3662L11.4092 21.2588V21.1924L11.3545 21.1553L7.82129 18.7617V13.4492L10.1143 11.8975L12.3574 13.415V14.6631L9.125 16.8789L8.9707 16.9844L9.12695 17.0869L11.2305 18.4648L11.2988 18.5088L11.3672 18.4648L15.7773 17.0107L19.2217 18.9814L19.416 19.1113V15.9668L19.3613 15.9297L17.7412 14.8184V13.1172L19.042 12.0996L21.5693 13.5723L21.6123 19.8164L21.6133 19.8867L21.6729 19.9229L25.5645 22.2773V25.8359L25.7598 25.7021L28.2178 24.0205L28.2725 23.9834V22.1172L29.6582 21.1055L31.7412 22.5166L31.7383 24.7852L27.0342 27.8809L26.9785 27.918V31.2314L27.1719 31.1045L34.3867 26.3906L34.4434 26.3535V26.2861L34.4492 22.4404L37.9834 20.0459L38.0381 20.0088V11.7822L37.9834 11.7451L34.4492 9.34961L34.4434 5.50586V5.43359L34.3818 5.39746L27.144 4.85547L27.0835 4.85059V8.15625L27.2793 8.02344L29.7363 6.34375L29.791 6.30664V4.44336L28.4062 3.43164L26.3232 4.84277L26.3203 7.11133L22.7842 4.71582L22.7275 4.67969V0.732422L22.9209 0.859375L30.1357 5.57617L30.1924 5.61328V5.6875L30.1963 9.52734L33.7324 11.9219L33.788 11.959V20.1953L33.7324 20.2324L30.1963 22.627L30.1924 26.4688V26.543L30.1309 26.5791L22.6738 30.9248L22.6104 30.9609L22.5479 30.9238L19.2676 29.001L19.206 28.9648V25.8105L19.3984 25.9414L22.622 27.8291L26.1758 25.7568L23.0518 23.6904L21.5771 24.666L21.5127 24.709L21.4453 24.6699L19.087 23.2959L18.915 23.1943L19.083 23.083L22.9521 20.5254L23.0195 20.4805L23.0889 20.5244L27.498 23.3662L27.501 21.2588V21.1924L27.5557 21.1553L31.0889 18.7617V13.4492L28.7959 11.8975L26.5527 13.415V14.6631L29.7852 16.8789L29.9395 16.9844L29.7832 17.0869L27.6797 18.4648L27.6113 18.5088L27.543 18.4648L23.1328 17.0107L19.6885 18.9814L19.4941 19.1113V15.9668L19.5488 15.9297L21.169 14.8184V13.1172L19.8682 12.0996L17.3408 13.5723L17.2979 19.8164L17.2969 19.8867L17.2373 19.9229L13.3457 22.2773V25.8359L13.1504 25.7021L10.6924 24.0205L10.6377 23.9834V22.1172L9.25195 21.1055L7.16895 22.5166L7.17188 24.7852L11.876 27.8809L11.9316 27.918V31.2314L11.7383 31.1045L4.52344 26.3906L4.4668 26.3535V26.2861L4.46094 22.4404L0.926796 20.0459L0.872109 20.0088V11.7822L0.926796 11.7451L4.46094 9.34961L4.4668 5.50586V5.43359L4.52832 5.39746..."
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

                {/* Minimize UI */}
                <div className="flex p-1.5 justify-center items-center gap-2 rounded-md">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.125 16.875V17.625H12.625V16.875H11.125ZM12.625 3.125V2.375H11.125V3.125H12.625ZM16.875 7.125H16.125V12.875H16.875H17.625V7.125H16.875ZM12.875 16.875V16.125H7.125V16.875V17.625H12.875V16.875ZM3.125 12.875H3.875V7.125H3.125H2.375V12.875H3.125ZM7.125 3.125V3.875H12.875V3.125V2.375H7.125V3.125ZM11.875 16.875H12.625V3.125H11.875H11.125V16.875H11.875Z"
                      fill="#7B7B7B"
                    />
                  </svg>
                </div>
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
                  Use Custom Colors
                </div>
                <div
                  className="flex p-1 justify-center items-center gap-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newColor = {
                      id: Date.now(),
                      hex: `#${Math.floor(Math.random() * 16777215)
                        .toString(16)
                        .padStart(6, "0")}`,
                      opacity: 100,
                    };
                    setCustomColors([...customColors, newColor]);
                  }}
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
          className="flex flex-col items-center justify-center flex-1 self-stretch rounded-[20px] border"
          style={{
            borderColor: "var(--Stroke-01, #ECECEC)",
            backgroundColor: "var(--Surface-01, #FCFCFC)",
          }}
        >
          <div className="flex flex-col items-center justify-center gap-4 p-8">
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
                3D Canvas
              </div>
              <div
                className="text-sm"
                style={{
                  color: "var(--Text-Secondary, #7B7B7B)",
                  fontFamily: "Inter",
                }}
              >
                Your 3D objects will appear here
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
