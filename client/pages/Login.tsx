import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/hooks/use-translation";
import { useLanguage } from "@/hooks/use-language";
import { useOnceUITheme } from "@/hooks/use-once-ui-theme";

export default function Login() {
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const { theme } = useOnceUITheme();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Google OAuth logic would go here
    setTimeout(() => {
      setIsLoading(false);
      console.log("Google login");
    }, 2000);
  };

  return (
    <div
      className="flex w-full min-h-screen bg-surface-01 dark:bg-gray-900"
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
      }}
    >
      {/* Left Panel - Sign In Form */}
      <div className="flex w-full lg:w-[640px] flex-col items-center justify-center px-4 lg:px-40 py-8 bg-surface-01 dark:bg-gray-900">
        {/* Logo */}
        <div className="mb-10">
          <img
            src={
              theme === "dark"
                ? "https://cdn.builder.io/o/assets%2F3f900ffbafd84b58a77a4df01e4d869c%2Fb7a440ba59d348d6a7dc75e25e912748?format=webp&width=800"
                : "https://cdn.builder.io/o/assets%2F3f900ffbafd84b58a77a4df01e4d869c%2F207bcd63914a43c2b81f7d68a2d3eab8?format=webp&width=800"
            }
            alt="Madaar Logo"
            className="w-[230px] h-auto object-contain"
            style={{ aspectRatio: "230/117.19" }}
          />
        </div>

        {/* Title */}
        <h1
          className="text-text-primary dark:text-white text-center text-[32px] font-normal leading-[40px] tracking-[-0.96px] mb-10"
          style={{
            fontFamily: "Inter, -apple-system, Roboto, Helvetica, sans-serif",
          }}
        >
          {t("pages.login.title") || "Sign in to Madaar"}
        </h1>

        {/* Sign In Options */}
        <div className="flex flex-col items-center gap-6 w-full max-w-[320px]">
          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="flex w-[320px] h-[44px] px-5 py-2 justify-center items-center gap-2 rounded-[10px] transition-all duration-200 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(180deg, #E5E5E5 0%, #E2E2E2 100%)",
              boxShadow:
                "0px 3px 4px -1px rgba(0, 0, 0, 0.15), 0px 1px 0px 0px rgba(255, 255, 255, 0.33) inset, 0px 0px 0px 1px #D4D4D4",
            }}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            ) : (
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/1147e8965e9d996efd722b8f68d7a52c3847b3d6?width=48"
                alt="Google"
                className="w-6 h-6"
              />
            )}
            <span
              className="text-text-primary text-[14px] font-semibold leading-[20px] tracking-[-0.28px]"
              style={{
                fontFamily:
                  "Inter, -apple-system, Roboto, Helvetica, sans-serif",
              }}
            >
              {isLoading
                ? t("common.buttons.signingIn") || "Signing in..."
                : t("common.buttons.loginWithGoogle") || "Sign in with Google"}
            </span>
          </button>

          {/* Need Account Text */}
          <div className="flex flex-col items-center gap-4">
            <p
              className="text-text-secondary text-[11px] font-medium leading-[16px] tracking-[-0.11px] text-center"
              style={{
                fontFamily:
                  "Inter, -apple-system, Roboto, Helvetica, sans-serif",
              }}
            >
              {t("common.messages.dontHaveAccount") || "Need an account?"}
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - AI Generated Image */}
      <div className="hidden lg:flex flex-1 relative rounded-[12px] overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div
          className="w-full h-[860px] relative"
          style={{
            background:
              'linear-gradient(180deg, rgba(0, 0, 0, 0.00) 70.04%, rgba(0, 0, 0, 0.20) 100%), url("https://api.builder.io/api/v1/image/assets/TEMP/38de9157fcea0f48430a6d28eec3e25c9be8bb48?width=1560") lightgray 0px -195.999px / 100% 123.496% no-repeat',
          }}
        >
          {/* Volume Icon */}
          <div className="absolute top-4 left-4">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path
                d="M13 4.22585C13 3.20697 11.8465 2.6161 11.0196 3.21143L6.08529 6.76415C5.87255 6.91732 5.61705 6.99973 5.35491 6.99973H3.75C2.23122 6.99973 1 8.23095 1 9.74973V14.2497C1 15.7685 2.23122 16.9997 3.75 16.9997H5.35491C5.61705 16.9997 5.87255 17.0821 6.08529 17.2353L11.0196 20.788C11.8465 21.3834 13 20.7925 13 19.7736V4.22585Z"
                fill="#FCFCFC"
              />
              <path
                d="M18.7175 4.22138C19.0104 3.92849 19.4852 3.92849 19.7781 4.22138C21.7679 6.21117 23 8.96219 23 11.9996C23 15.0369 21.7679 17.7879 19.7781 19.7777C19.4852 20.0706 19.0104 20.0706 18.7175 19.7777C18.4246 19.4848 18.4246 19.01 18.7175 18.7171C20.4375 16.9971 21.5 14.6231 21.5 11.9996C21.5 9.37599 20.4375 7.00202 18.7175 5.28204C18.4246 4.98915 18.4246 4.51427 18.7175 4.22138Z"
                fill="#FCFCFC"
              />
              <path
                d="M16.4194 7.58075C16.1265 7.28786 15.6516 7.28786 15.3587 7.58075C15.0658 7.87365 15.0658 8.34852 15.3587 8.64141C16.2191 9.50182 16.75 10.6883 16.75 12.0002C16.75 13.3121 16.2191 14.4985 15.3587 15.3589C15.0658 15.6518 15.0658 16.1267 15.3587 16.4196C15.6516 16.7125 16.1265 16.7125 16.4194 16.4196C17.5496 15.2894 18.25 13.7259 18.25 12.0002C18.25 10.2745 17.5496 8.71096 16.4194 7.58075Z"
                fill="#FCFCFC"
              />
            </svg>
          </div>

          {/* Prompt Container */}
          <div className="absolute bottom-[76px] left-1/2 transform -translate-x-1/2 w-[479px]">
            {/* Prompt Input Card */}
            <div
              className="flex flex-col p-3 gap-3 rounded-[24px] border border-stroke-01 bg-surface-01 backdrop-blur-[6px] mb-5"
              style={{
                boxShadow:
                  "0px 239px 67px 0px rgba(0, 0, 0, 0.00), 0px 153px 61px 0px rgba(0, 0, 0, 0.01), 0px 86px 52px 0px rgba(0, 0, 0, 0.04), 0px 38px 38px 0px rgba(0, 0, 0, 0.06), 0px 10px 21px 0px rgba(0, 0, 0, 0.07)",
              }}
            >
              {/* Prompt Text */}
              <div className="flex p-2 items-start gap-2">
                <p
                  className="flex-1 text-text-primary text-[15px] font-normal leading-[24px] tracking-[-0.3px] overflow-hidden"
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 8,
                    fontFamily:
                      "Inter, -apple-system, Roboto, Helvetica, sans-serif",
                  }}
                >
                  A surreal image of a veiled figure on a horse atop a Persian
                  rug in a vast white salt flat under a deep teal sky.
                </p>
              </div>

              {/* Input Controls */}
              <div className="flex justify-between items-center">
                {/* Left Side - Input Controls */}
                <div className="flex items-center gap-2">
                  {/* Plus Button */}
                  <button className="flex h-10 px-[10px] py-1 items-center gap-3 rounded-[12px] border border-stroke-02">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 3.125V10M10 10V16.875M10 10H3.125M10 10H16.875"
                        stroke="#121212"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {/* Inspiration Dropdown */}
                  <button className="flex h-10 px-3 py-1 items-center gap-3 rounded-[12px] border border-stroke-02">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.8805 5.83333H9.33268C9.05654 5.83333 8.83268 5.60948 8.83268 5.33333V2.1057C8.83268 1.61505 8.19963 1.41792 7.92108 1.82183L2.70661 9.3828C2.47786 9.71449 2.7153 10.1667 3.11822 10.1667H6.66602C6.94216 10.1667 7.16602 10.3905 7.16602 10.6667V13.8943C7.16602 14.385 7.79907 14.5821 8.07762 14.1782L13.2921 6.6172C13.5208 6.28551 13.2834 5.83333 12.8805 5.83333Z"
                        stroke="#49BA61"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-text-secondary text-[14px] font-medium leading-[20px] tracking-[-0.14px]">
                      Inspiration
                    </span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.66602 8.3335L9.41009 11.0776C9.73553 11.403 10.2632 11.403 10.5886 11.0776L13.3327 8.3335"
                        stroke="#7B7B7B"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                {/* Right Side - Action Buttons */}
                <div className="flex items-center gap-2">
                  {/* Brainwave Dropdown */}
                  <button className="flex px-3 py-[10px] items-center gap-3 rounded-[12px] bg-surface-03">
                    <span className="text-text-primary text-[14px] font-medium leading-[20px] tracking-[-0.14px]">
                      Brainwave 2.0
                    </span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.66602 8.3335L9.41009 11.0776C9.73553 11.403 10.2632 11.403 10.5886 11.0776L13.3327 8.3335"
                        stroke="#7B7B7B"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {/* Microphone Button */}
                  <button className="flex w-10 h-10 p-8 justify-center items-center gap-2 rounded-[12px]">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.99948 15.8332C12.5624 15.8332 14.765 14.2906 15.7294 12.0832M9.99948 15.8332C7.43658 15.8332 5.23398 14.2906 4.26953 12.0832M9.99948 15.8332V17.7082M9.99947 13.1248C8.04347 13.1248 6.45781 11.5392 6.45781 9.58317V5.83317C6.45781 3.87716 8.04347 2.2915 9.99947 2.2915C11.9555 2.2915 13.5411 3.87716 13.5411 5.83317V9.58317C13.5411 11.5392 11.9555 13.1248 9.99947 13.1248Z"
                        stroke="#7B7B7B"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {/* Generate Button */}
                  <button
                    className="flex w-10 h-10 px-5 py-2 justify-center items-center gap-2 rounded-[12px]"
                    style={{
                      background:
                        "linear-gradient(180deg, #323232 0%, #222 100%)",
                      boxShadow:
                        "0px 0.5px 1px 0px rgba(255, 255, 255, 0.15) inset, 0px 2px 4px -1px rgba(13, 13, 13, 0.50), 0px -1px 1.2px 0.35px #121212 inset, 0px 0px 0px 1px #333",
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.79102 7.29145L8.23157 3.85089C9.20788 2.87458 10.7908 2.87457 11.7671 3.85088L15.2077 7.29145M9.99935 3.54145V16.8748"
                        stroke="#FCFCFC"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Text */}
            <p
              className="text-surface-01 text-center text-[13px] font-normal leading-[16px] tracking-[-0.13px]"
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 8,
                overflow: "hidden",
                fontFamily:
                  "Inter, -apple-system, Roboto, Helvetica, sans-serif",
              }}
            >
              Try Brainwave 2.0 for free
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
