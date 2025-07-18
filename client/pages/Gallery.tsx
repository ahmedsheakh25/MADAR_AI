import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  Zap,
  Filter,
  ChevronUp,
  Check,
} from "lucide-react";
import { Button } from "@/components/design-system";
import { useTranslation } from "@/hooks/use-translation";

// Mock scene data matching the Figma design
const MOCK_SCENES = [
  {
    id: 1,
    title: "Futuristic Humanoid Robot",
    folder: "Untitled Folder",
    image: "/placeholder.svg",
    isHovered: false,
  },
  {
    id: 2,
    title: "Gas Station Icon 1.0",
    folder: "3D Icons",
    image: "/placeholder.svg",
    isHovered: true,
  },
  {
    id: 3,
    title: "Classic Car in Studio",
    folder: "Untitled Folder",
    image: "/placeholder.svg",
    isHovered: false,
  },
  {
    id: 4,
    title: "Artisanal Food Arrangement",
    folder: "Untitled Folder",
    image: "/placeholder.svg",
    isHovered: false,
  },
  {
    id: 5,
    title: "Delivery Robot on Wheels",
    folder: "3D Icons",
    image: "/placeholder.svg",
    isHovered: false,
  },
  {
    id: 6,
    title: "Minimalist Architecture Scene",
    folder: "Untitled Folder",
    image: "/placeholder.svg",
    isHovered: false,
  },
  {
    id: 7,
    title: "Animated Girl with Headphones",
    folder: "Untitled Folder",
    image: "/placeholder.svg",
    isHovered: false,
  },
  {
    id: 8,
    title: "Cute Shop Storefront Icon",
    folder: "3D Icons",
    image: "/placeholder.svg",
    isHovered: false,
  },
];

const FILTER_OPTIONS = [
  { id: "all", label: "All scenes", active: true, shortcut: "⌘ 0" },
  { id: "designs", label: "Designs", active: false, shortcut: "⌘ -" },
  { id: "animation", label: "Animation", active: false, shortcut: "⌘ +" },
];

export default function Gallery() {
  const { t } = useTranslation();

  const SORT_OPTIONS = [
    {
      id: "newest",
      label: t("pages.gallery.filters.newest"),
      active: true,
      shortcut: "⌘ 0",
    },
    {
      id: "oldest",
      label: t("pages.gallery.filters.oldest"),
      active: false,
      shortcut: "⌘ 0",
    },
  ];
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [undoDisabled] = useState(true);

  return (
    <div className="min-h-screen bg-background dark:bg-background font-inter">
      {/* Topbar */}
      <div className="flex items-center justify-between w-full px-5 py-5 border-b border-border dark:border-border bg-background dark:bg-background">
        {/* Left section */}
        <div className="flex items-center gap-4">
          {/* Undo/Redo */}
          <div className="flex items-center gap-2">
            <button
              className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all ${
                undoDisabled
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-accent dark:hover:bg-accent"
              }`}
              disabled={undoDisabled}
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground dark:text-muted-foreground" />
            </button>
            <button className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent dark:bg-accent hover:bg-accent/80 dark:hover:bg-accent/80 transition-all">
              <ArrowRight className="w-5 h-5 text-foreground dark:text-foreground" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex items-center justify-between w-65 h-10 px-2.5 py-1 rounded-xl border border-border dark:border-border bg-muted dark:bg-muted">
            <div className="flex items-center gap-3 flex-1">
              <div className="flex items-center justify-center w-8 h-8 p-2 rounded-lg">
                <Search className="w-4 h-4 text-muted-foreground dark:text-muted-foreground" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files..."
                className="bg-transparent text-xs font-medium text-muted-foreground dark:text-muted-foreground placeholder:text-muted-foreground dark:placeholder:text-muted-foreground border-none outline-none flex-1"
              />
            </div>
            <div className="flex items-center justify-center px-1.5 py-0.5 rounded-md bg-accent dark:bg-accent text-xs font-medium text-muted-foreground dark:text-muted-foreground">
              ⌘ K
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Notification */}
          <div className="relative w-10 h-10">
            <button className="flex items-center justify-center w-10 h-10 p-2.5 rounded-lg hover:bg-accent dark:hover:bg-accent transition-all">
              <Zap className="w-5 h-5 text-foreground dark:text-foreground" />
            </button>
            <div className="absolute top-1 right-2 w-1 h-1 rounded-full bg-destructive"></div>
          </div>

          {/* Create Button */}
          <Button className="px-6 py-2.5 rounded-xl bg-gradient-to-b from-border to-border/80 dark:from-border dark:to-border/80 text-foreground dark:text-foreground text-sm font-semibold shadow-lg hover:shadow-xl transition-all">
            Create
          </Button>

          {/* User Avatar */}
          <div className="flex items-center justify-center w-10 h-10 p-1">
            <div className="w-8 h-8 rounded-full bg-primary overflow-hidden">
              <img
                src="/placeholder.svg"
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex flex-col items-center w-full max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between w-full px-12 py-4">
          <h1 className="text-xl font-medium text-foreground dark:text-foreground">
            My Scenes
          </h1>

          {/* Filter */}
          <div className="relative w-34 h-10">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center justify-between w-34 px-2 py-2 rounded-xl border border-border dark:border-border bg-muted dark:bg-muted h-10 hover:bg-accent dark:hover:bg-accent transition-all"
            >
              <div className="flex items-center gap-1">
                <div className="flex items-center justify-center p-1">
                  <Filter className="w-4 h-4 text-muted-foreground dark:text-muted-foreground" />
                </div>
                <span className="text-xs font-medium text-foreground dark:text-foreground">
                  All scenes
                </span>
              </div>
              <div className="flex items-center justify-center p-1">
                <ChevronUp className="w-4 h-4 text-foreground dark:text-foreground" />
              </div>
            </button>

            {/* Filter Dropdown */}
            {isFilterOpen && (
              <div className="absolute top-12 -left-1.5 w-43 rounded-2xl border border-border dark:border-border bg-background dark:bg-background shadow-2xl backdrop-blur-md z-10">
                <div className="flex flex-col p-2">
                  {FILTER_OPTIONS.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center justify-between h-9 px-2 py-1.5 rounded-xl hover:bg-accent dark:hover:bg-accent cursor-pointer"
                    >
                      <div className="flex items-center gap-1 flex-1">
                        <div className="flex items-center justify-center p-1 rounded-md">
                          {option.active && (
                            <Check className="w-4 h-4 text-muted-foreground dark:text-muted-foreground" />
                          )}
                        </div>
                        <span className="text-xs font-medium text-foreground dark:text-foreground">
                          {option.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-center w-8 px-1.5 py-0.5 rounded-md bg-accent dark:bg-accent text-xs font-medium text-muted-foreground dark:text-muted-foreground">
                        {option.shortcut}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border dark:border-border p-2">
                  {SORT_OPTIONS.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center justify-between h-9 px-2 py-1.5 rounded-xl hover:bg-accent dark:hover:bg-accent cursor-pointer"
                    >
                      <div className="flex items-center gap-1 flex-1">
                        <div className="flex items-center justify-center p-1 rounded-md">
                          {option.active && (
                            <Check className="w-4 h-4 text-muted-foreground dark:text-muted-foreground" />
                          )}
                        </div>
                        <span className="text-xs font-medium text-foreground dark:text-foreground">
                          {option.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-center w-8 px-1.5 py-0.5 rounded-md bg-accent dark:bg-accent text-xs font-medium text-muted-foreground dark:text-muted-foreground">
                        {option.shortcut}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="relative flex flex-wrap justify-center items-start gap-3 w-full px-12 pb-12">
          {/* Scene Cards */}
          {MOCK_SCENES.map((scene) => (
            <div
              key={scene.id}
              className="flex flex-col items-start gap-0 min-w-[260px] flex-1 p-2 rounded-3xl border border-border dark:border-border bg-background dark:bg-background relative group hover:shadow-lg transition-all duration-300"
            >
              <div className="w-full h-[238px] relative rounded-2xl overflow-hidden">
                <img
                  src={scene.image}
                  alt={scene.title}
                  className="w-full h-full object-cover"
                />
                <div className="text-[rgb(2,8,23)] bg-black font-normal text-base leading-6 font-inter">
                  <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-full overflow-hidden overscroll-none touch-pan-x touch-pan-y font-normal" />
                </div>
                {/* Hover Hand Pointer - only show on hover */}
                {scene.isHovered && (
                  <div className="absolute right-22 bottom-21 w-[34px] h-[34px] opacity-100 group-hover:opacity-100 transition-opacity">
                    <svg
                      width="34"
                      height="35"
                      viewBox="0 0 34 35"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="drop-shadow-lg"
                    >
                      <g filter="url(#filter0_d_6001_16742)">
                        <path
                          d="M21.7135 15.8628C21.7135 16.0115 21.7879 15.4484 22.0216 15.0765C22.1118 14.8088 22.3046 14.5879 22.5577 14.4624C22.683 14.4002 22.8193 14.3634 22.9589 14.3539C23.0984 14.3444 23.2385 14.3625 23.371 14.4072C23.5036 14.4518 23.626 14.5221 23.7314 14.6141C23.8368 14.7061 23.923 14.8179 23.9852 14.9432C24.0473 15.0685 24.0842 15.2048 24.0937 15.3444C24.1031 15.4839 24.085 15.624 24.0404 15.7565C24.0404 16.4578 24.0404 16.4259 24.0404 16.8934C24.0404 17.3609 24.0404 17.7647 24.0404 18.1684C23.9996 18.79 23.9143 19.4078 23.7854 20.0172C23.6145 20.5336 23.3789 21.0262 23.0841 21.4834C22.5676 22.0606 22.1413 22.7125 21.8198 23.4172C21.7362 23.7648 21.7004 24.1223 21.7135 24.4797C21.7139 24.8096 21.7568 25.1381 21.841 25.4572C21.4067 25.505 20.9685 25.505 20.5341 25.4572C20.1198 25.3934 19.5991 24.5647 19.4716 24.3097C19.4393 24.2396 19.3876 24.1804 19.3227 24.1388C19.2577 24.0972 19.1822 24.0752 19.1051 24.0752C19.028 24.0752 18.9525 24.0972 18.8875 24.1388C18.8225 24.1804 18.7708 24.2396 18.7385 24.3097C18.5048 24.7134 17.9948 25.4465 17.6229 25.489C16.9216 25.574 15.4448 25.489 14.2973 25.489C14.2973 25.489 14.4885 24.4265 14.0529 24.044C13.6173 23.6615 13.171 23.2153 12.831 22.9178L11.9491 21.9403C11.3285 21.362 10.8736 20.6284 10.6316 19.8153C10.4085 18.8165 10.4298 18.3278 10.6316 17.9347C10.8548 17.6081 11.1922 17.3769 11.5773 17.2865C11.886 17.2321 12.2033 17.254 12.5016 17.3503C12.7102 17.4376 12.8904 17.581 13.0223 17.7647C13.2666 18.094 13.341 18.2534 13.256 17.8922C13.171 17.5309 13.0435 16.9997 12.8204 16.2453C12.6398 15.6609 12.4591 15.3315 12.321 14.9384C12.1829 14.5453 12.0023 14.1734 11.7898 13.6847C11.5973 13.1856 11.4376 12.6745 11.3116 12.1547C11.2635 11.9406 11.2623 11.7186 11.3082 11.504C11.3541 11.2894 11.4458 11.0873 11.5773 10.9115C11.764 10.7278 11.996 10.5966 12.2498 10.5313C12.5035 10.466 12.77 10.4689 13.0223 10.5397C13.4232 10.7134 13.7608 11.0065 13.9891 11.379C14.3068 11.8929 14.5636 12.442 14.7541 13.0153C15.1044 13.9274 15.3538 14.8752 15.4979 15.8415C15.4719 15.2713 15.5184 14.7001 15.636 14.1415C15.695 13.9719 15.7916 13.8179 15.9185 13.6909C16.0455 13.564 16.1996 13.4674 16.3691 13.4084C16.6848 13.3072 17.0205 13.2853 17.3466 13.3447C17.6718 13.4169 17.9591 13.6059 18.1541 13.8759C18.3981 14.4969 18.5381 15.1538 18.5685 15.8203C18.5995 15.2507 18.6994 14.687 18.866 14.1415C19.0442 13.892 19.3032 13.7118 19.5991 13.6315C19.9505 13.568 20.3103 13.568 20.6616 13.6315C20.9491 13.729 21.2007 13.9104 21.3841 14.1522C21.6088 14.7158 21.745 15.3107 21.7879 15.9159"
                          fill="white"
                        />
                        <path
                          d="M21.7135 15.8628C21.7135 16.0115 21.7879 15.4484 22.0216 15.0765C22.1118 14.8088 22.3046 14.5879 22.5577 14.4624C22.683 14.4002 22.8193 14.3634 22.9589 14.3539C23.0984 14.3444 23.2385 14.3625 23.371 14.4072C23.5036 14.4518 23.626 14.5221 23.7314 14.6141C23.8368 14.7061 23.923 14.8179 23.9852 14.9432C24.0473 15.0685 24.0842 15.2048 24.0937 15.3444C24.1031 15.4839 24.085 15.624 24.0404 15.7565C24.0404 16.4578 24.0404 16.4259 24.0404 16.8934C24.0404 17.3609 24.0404 17.7647 24.0404 18.1684C23.9996 18.79 23.9143 19.4078 23.7854 20.0172C23.6145 20.5336 23.3789 21.0262 23.0841 21.4834C22.5676 22.0606 22.1413 22.7125 21.8198 23.4172C21.7362 23.7648 21.7004 24.1223 21.7135 24.4797C21.7139 24.8096 21.7568 25.1381 21.841 25.4572C21.4067 25.505 20.9685 25.505 20.5341 25.4572C20.1198 25.3934 19.5991 24.5647 19.4716 24.3097C19.4393 24.2396 19.3876 24.1804 19.3227 24.1388C19.2577 24.0972 19.1822 24.0752 19.1051 24.0752C19.028 24.0752 18.9525 24.0972 18.8875 24.1388C18.8225 24.1804 18.7708 24.2396 18.7385 24.3097C18.5048 24.7134 17.9948 25.4465 17.6229 25.489C16.9216 25.574 15.4448 25.489 14.2973 25.489C14.2973 25.489 14.4885 24.4265 14.0529 24.044C13.6173 23.6615 13.171 23.2153 12.831 22.9178L11.9491 21.9403C11.3285 21.362 10.8736 20.6284 10.6316 19.8153C10.4085 18.8165 10.4298 18.3278 10.6316 17.9347C10.8548 17.6081 11.1922 17.3769 11.5773 17.2865C11.886 17.2321 12.2033 17.254 12.5016 17.3503C12.7102 17.4376 12.8904 17.581 13.0223 17.7647C13.2666 18.094 13.341 18.2534 13.256 17.8922C13.171 17.5309 13.0435 16.9997 12.8204 16.2453C12.6398 15.6609 12.4591 15.3315 12.321 14.9384C12.1829 14.5453 12.0023 14.1734 11.7898 13.6847C11.5973 13.1856 11.4376 12.6745 11.3116 12.1547C11.2635 11.9406 11.2623 11.7186 11.3082 11.504C11.3541 11.2894 11.4458 11.0873 11.5773 10.9115C11.764 10.7278 11.996 10.5966 12.2498 10.5313C12.5035 10.466 12.77 10.4689 13.0223 10.5397C13.4232 10.7134 13.7608 11.0065 13.9891 11.379C14.3068 11.8929 14.5636 12.442 14.7541 13.0153C15.1044 13.9274 15.3538 14.8752 15.4979 15.8415C15.4719 15.2713 15.5184 14.7001 15.636 14.1415C15.695 13.9719 15.7916 13.8179 15.9185 13.6909C16.0455 13.564 16.1996 13.4674 16.3691 13.4084C16.6848 13.3072 17.0205 13.2853 17.3466 13.3447C17.6718 13.4169 17.9591 13.6059 18.1541 13.8759C18.3981 14.4969 18.5381 15.1538 18.5685 15.8203C18.5995 15.2507 18.6994 14.687 18.866 14.1415C19.0442 13.892 19.3032 13.7118 19.5991 13.6315C19.9505 13.568 20.3103 13.568 20.6616 13.6315C20.9491 13.729 21.2007 13.9104 21.3841 14.1522C21.5782 14.7029 21.6892 15.2794 21.7135 15.8628V15.8628Z"
                          stroke="black"
                          strokeWidth="0.75"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M20.6829 22.3227V18.6465"
                          stroke="black"
                          strokeWidth="0.75"
                          strokeLinecap="round"
                        />
                        <path
                          d="M18.5366 22.3334L18.526 18.6465"
                          stroke="black"
                          strokeWidth="0.75"
                          strokeLinecap="round"
                        />
                        <path
                          d="M16.4222 18.6782L16.4435 22.312"
                          stroke="black"
                          strokeWidth="0.75"
                          strokeLinecap="round"
                        />
                      </g>
                      <defs>
                        <filter
                          id="filter0_d_6001_16742"
                          x="8.09717"
                          y="10.1094"
                          width="18.374"
                          height="19.7925"
                          filterUnits="userSpaceOnUse"
                          colorInterpolationFilters="sRGB"
                        >
                          <feFlood
                            floodOpacity="0"
                            result="BackgroundImageFix"
                          />
                          <feColorMatrix
                            in="SourceAlpha"
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            result="hardAlpha"
                          />
                          <feOffset dy="2" />
                          <feGaussianBlur stdDeviation="1" />
                          <feColorMatrix
                            type="matrix"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                          />
                          <feBlend
                            mode="normal"
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow_6001_16742"
                          />
                          <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="effect1_dropShadow_6001_16742"
                            result="shape"
                          />
                        </filter>
                      </defs>
                    </svg>
                  </div>
                )}
              </div>

              {/* Card Info */}
              <div className="flex flex-col items-start gap-1 w-full p-3">
                <h3 className="text-xs font-semibold text-foreground dark:text-foreground truncate w-full">
                  {scene.title}
                </h3>
                <p className="text-xs font-medium text-muted-foreground dark:text-muted-foreground opacity-80 w-full">
                  {scene.folder}
                </p>
              </div>
            </div>
          ))}

          {/* Bottom Overlay */}
          <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-background dark:from-background to-transparent backdrop-blur-xl pointer-events-none opacity-30"></div>
        </div>
      </div>
    </div>
  );
}
