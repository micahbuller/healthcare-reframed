"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BlogPost } from "@/types/types";

gsap.registerPlugin(ScrollTrigger);

const ScrollStoryButton: React.FC<{ link: string }> = ({ link }) => {
  return (
    <div className="flex justify-start items-center">
      <Link href={link} target="_blank" rel="noopener noreferrer" className="text-lg font-sans border-2 rounded-full py-4 px-8 border-[#2F2C2C] text-[#2F2C2C] flex items-center space-x-3 transition-all duration-300 hover:bg-[#2F2C2C] hover:text-white">
        <span>Dive Deeper: Experience the Scroll Story</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 rotate-45">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </Link>
    </div>
  );
};

const PostHero: React.FC<{ episode: BlogPost }> = ({ episode }) => {
  const { title, description, imageUrl, youtubeLink, spotifyLink, appleMusicLink, externalLink, slug } = episode;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    gsap.fromTo(
      element,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: element,
          start: "top 100%", // Animation starts when the bottom of the element is 90% visible
          end: "top 20%", // Animation ends when the top of the element is 20% visible
          toggleActions: "play none none reset", // Replay animation every time the element enters the viewport
        },
      }
    );
  }, []);

  return (
    <div ref={ref} className="flex flex-col space-y-6">
      <div  className="flex flex-col md:flex-row w-full space-y-6 md:space-x-6">
        <Link href={youtubeLink} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
          <div className="relative aspect-video w-full h-auto md:h-64  md:w-auto bg-black rounded-3xl shrink-0 overflow-hidden">
            <div className="absolute flex inset-0 z-10  items-center justify-center">
              {/* Play Button */}
              <div className="flex items-center justify-center w-16 h-16 bg-opacity-50 backdrop-blur-lg bg-[#EC7A5B] rounded-full shadow-lg cursor-pointer transition-transform duration-300 hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
                </svg>
              </div>
            </div>
            <Image objectFit="cover" width={750} height={400} src={imageUrl} alt={"Image of " + title} />
          </div>
        </Link>

        <div className="flex flex-col w-full space-y-6">
          <h3 className="text-2xl md:text-xl lg:text-3xl font-mono uppercase text-[#2F2C2C]">{title}</h3>
          <p className="text-md font-sans uppercase text-[#2F2C2C] line-clamp-2">{description}</p>
          <div className="flex flex-col md:flex-row w-full space-y-6 md:items-center md:justify-between">
            <div className="flex flex-row space-x-4">
              <Link href={"/transcripts/" + slug} className="text-md font-mono uppercase text-[#2F2C2C] hover:text-[#EC7A5B] transition-colors duration-300">
                <p className="text-md font-mono uppercase text-[#2F2C2C]">Read Transcript</p>
              </Link>
            </div>
            <div className="flex flex-row space-x-10">
              <Link href={youtubeLink} rel="noopener noreferrer" target="_blank">
                <svg width="59" height="42" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_43_577)">
                    <path
                      d="M57.7712 6.5588C57.0913 3.97578 55.0952 1.94591 52.5551 1.25447C47.9509 0 29.5 0 29.5 0C29.5 0 11.0491 0 6.44979 1.25447C3.9097 1.94591 1.91357 3.97578 1.23362 6.5588C0 11.2359 0 21 0 21C0 21 0 30.7641 1.23362 35.4412C1.91357 38.0242 3.9097 40.0541 6.44979 40.7455C11.0491 42 29.5 42 29.5 42C29.5 42 47.9509 42 52.5502 40.7455C55.0903 40.0541 57.0864 38.0242 57.7664 35.4412C59 30.7641 59 21 59 21C59 21 59 11.2359 57.7664 6.5588H57.7712ZM23.599 29.9986V12.0014L38.927 21L23.599 29.9986Z"
                      fill="#2F2C2C"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_43_577">
                      <rect width="59" height="42" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </Link>
              <Link href={spotifyLink} rel="noopener noreferrer" target="_blank">
                <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_95_3)">
                    <path
                      d="M19.9639 0.63852C36.4258 -0.106161 47.06 17.9449 38.1758 31.9095C30.1545 44.517 11.622 44.4313 3.69018 31.7755C-4.55289 18.6244 4.52139 1.33666 19.9639 0.63852ZM14.6915 11.9744C12.6918 12.1773 10.3995 12.222 8.46122 12.7582C6.89386 13.192 6.47639 15.2194 7.8052 16.193C8.73891 16.8781 9.80866 16.4053 10.843 16.2526C18.1692 15.1747 25.1151 16.1037 31.843 19.1383C32.4338 19.4045 33.5334 20.0821 34.1148 20.1268C35.8704 20.2646 36.9141 18.2242 35.7437 16.893C35.3859 16.4872 34.1968 15.9659 33.662 15.7146C28.8518 13.4526 23.572 12.2239 18.2549 11.9577L14.6915 11.9726V11.9744ZM15.8526 18.9819C13.8156 19.088 11.6723 19.2146 9.68752 19.6968C7.31878 20.272 8.04748 23.0534 10.0267 22.8468C10.8523 22.7611 11.8047 22.48 12.6731 22.3664C18.2977 21.6367 24.1553 22.5414 29.2823 24.9114C29.847 25.172 30.4397 25.5518 30.9988 25.7845C32.5438 26.4287 33.8893 24.7308 32.9221 23.4183C32.5624 22.9305 31.064 22.2734 30.4583 21.996C26.265 20.0766 21.7102 19.0898 17.0919 18.967L15.8526 18.9819ZM15.0475 25.321C13.7392 25.3824 11.2884 25.6375 10.0864 26.0787C8.81159 26.5478 9.20297 28.4523 10.5635 28.4337C16.0185 27.0598 21.9133 27.6313 27.003 30.0013C27.5174 30.2414 28.712 30.9954 29.1649 31.055C30.2048 31.1909 30.9168 30.005 30.3129 29.1505C29.9775 28.6758 27.9069 27.7542 27.2863 27.488C23.4136 25.8218 19.2762 25.1255 15.0493 25.3228L15.0475 25.321Z"
                      fill="#2F2C2C"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_95_3">
                      <rect width="42" height="42" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </Link>
              <Link href={appleMusicLink} rel="noopener noreferrer" target="_blank">
                <svg width="41" height="42" viewBox="0 0 41 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M40.9262 11.57C40.9262 11.1607 40.9205 10.7458 40.9092 10.3365C40.8864 9.43843 40.8296 8.53465 40.6704 7.64791C40.5113 6.74981 40.2441 5.90855 39.8292 5.09002C39.4199 4.28855 38.8856 3.5496 38.249 2.91297C37.6123 2.27634 36.8734 1.74203 36.0719 1.33277C35.2534 0.917821 34.4178 0.650664 33.5197 0.491507C32.633 0.332349 31.7292 0.281191 30.8311 0.25277C30.4161 0.247086 30.0012 0.241402 29.5919 0.235718C29.1031 0.235718 28.6143 0.235718 28.1254 0.235718H12.8008C12.312 0.235718 11.8231 0.235718 11.3343 0.235718C10.925 0.235718 10.5101 0.241402 10.1008 0.25277C9.20272 0.275507 8.29893 0.332349 7.41219 0.491507C6.51409 0.656348 5.67283 0.917821 4.85999 1.33845C4.05283 1.74771 3.31957 2.28203 2.68294 2.91866C2.04631 3.55529 1.50631 4.28855 1.09705 5.09571C0.682104 5.91423 0.414946 6.74981 0.255789 7.65359C0.0966313 8.54033 0.0454736 9.44412 0.0170526 10.3422C0.0113684 10.7515 0.0056842 11.1607 0 11.57C0 12.0588 0 12.5477 0 13.0365V28.3554C0 28.8443 0 29.3331 0 29.822C0 30.2312 0.0056842 30.6462 0.0170526 31.0554C0.0397894 31.9535 0.0966313 32.8573 0.255789 33.7441C0.414946 34.6422 0.682104 35.4834 1.09705 36.3019C1.50631 37.1034 2.04063 37.8424 2.67726 38.479C3.31389 39.1156 4.05283 39.6499 4.8543 40.0592C5.67283 40.4741 6.50841 40.7413 7.40651 40.9005C8.29324 41.0596 9.19703 41.1108 10.0951 41.1392C10.5044 41.1506 10.9193 41.1562 11.3286 41.1562C11.8174 41.1619 12.3063 41.1562 12.7951 41.1562H28.114C28.6029 41.1562 29.0917 41.1562 29.5806 41.1562C29.9898 41.1562 30.4048 41.1506 30.814 41.1392C31.7121 41.1165 32.6159 41.0596 33.5027 40.9005C34.4008 40.7413 35.242 40.4741 36.0549 40.0592C36.8563 39.6499 37.5953 39.1156 38.2319 38.479C38.8685 37.8424 39.4029 37.1091 39.8121 36.3019C40.2271 35.4834 40.4942 34.6478 40.6534 33.7441C40.8125 32.8573 40.8637 31.9535 40.8921 31.0554C40.9035 30.6462 40.9092 30.2312 40.9092 29.822C40.9149 29.3331 40.9092 28.8443 40.9092 28.3554V13.0365C40.9262 12.5477 40.9262 12.0588 40.9262 11.57ZM29.9614 26.8662C29.9614 27.3834 29.9557 27.8552 29.8477 28.3725C29.7397 28.8784 29.5465 29.3502 29.2509 29.7765C28.9553 30.2028 28.5745 30.5495 28.1311 30.811C27.682 31.0782 27.2103 31.226 26.71 31.3283C25.7665 31.5159 25.1242 31.5613 24.5159 31.442C23.9305 31.3226 23.4359 31.0554 23.0381 30.6916C22.4526 30.1516 22.0831 29.4241 22.0035 28.6681C21.9126 27.7757 22.2082 26.8264 22.8732 26.1216C23.2086 25.7691 23.6349 25.4906 24.2033 25.2689C24.7945 25.0416 25.4482 24.8994 26.4543 24.7005C26.7214 24.6493 26.9829 24.5925 27.25 24.5413C27.5968 24.4731 27.898 24.3822 28.1368 24.0866C28.3812 23.791 28.3812 23.4272 28.3812 23.0748V14.0597C28.3812 13.3719 28.0743 13.1843 27.4149 13.3094C26.9431 13.4003 16.8309 15.4409 16.8309 15.4409C16.2625 15.5774 16.0579 15.7649 16.0579 16.4755V29.6799C16.0579 30.1971 16.0294 30.6689 15.9214 31.1862C15.8134 31.6921 15.6202 32.1639 15.3246 32.5902C15.029 33.0165 14.6482 33.3632 14.2048 33.6247C13.7558 33.8918 13.284 34.0453 12.7838 34.1476C11.8402 34.3352 11.1979 34.3807 10.5897 34.2613C10.0042 34.142 9.50966 33.8691 9.11177 33.5053C8.5263 32.9653 8.18524 32.2377 8.09998 31.4817C8.00903 30.5893 8.27619 29.6401 8.94693 28.9352C9.28229 28.5828 9.70861 28.3043 10.277 28.0826C10.8682 27.8552 11.5219 27.7131 12.528 27.5142C12.7951 27.463 13.0566 27.4062 13.3238 27.355C13.6705 27.2868 13.9718 27.1959 14.2105 26.9003C14.4492 26.6047 14.4777 26.258 14.4777 25.9056C14.4777 23.1089 14.4777 10.6833 14.4777 10.6833C14.4777 10.4786 14.4947 10.3422 14.5061 10.274C14.5572 9.95569 14.6823 9.67717 14.9153 9.48391C15.1086 9.32475 15.3587 9.21106 15.6713 9.14285H15.677L27.8526 6.67591C27.9606 6.65318 28.8359 6.4997 28.9382 6.48833C29.5976 6.43149 29.9671 6.86349 29.9671 7.56265L29.9614 26.8662Z"
                    fill="#2F2C2C"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {externalLink && <ScrollStoryButton link={externalLink} />}
    </div>
  );
};

export default PostHero;
