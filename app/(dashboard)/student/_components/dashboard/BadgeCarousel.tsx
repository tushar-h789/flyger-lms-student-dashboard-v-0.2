// "use client";

// import React, { useCallback, useEffect, useState } from "react";
// import useEmblaCarousel from "embla-carousel-react";
// import type { EmblaOptionsType } from "embla-carousel";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import BadgeCard from "./BadgeCard";

// type Badge = { title: string; subtitle: string };

// const BADGES: Badge[] = [
//   { title: "Newbie - Activity Badge", subtitle: "Required 4 logins" },
//   { title: "Newbie - Learning Badge", subtitle: "Required 1" },
//   {
//     title: "Newbie - Perfectionism Badge",
//     subtitle: "Required 1 tests or assignments with score 90%+",
//   },
//   { title: "Consistency Badge", subtitle: "Attend 3 live classes" },
//   { title: "Helper Badge", subtitle: "Answer 2 forum questions" },
// ];

// const emblaOptions: EmblaOptionsType = {
//   align: "center",
//   containScroll: "trimSnaps",
//   dragFree: false,
//   loop: false,
// };

// export default function BadgeCarousel() {
//   const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions);
//   const [centerIndex, setCenterIndex] = useState(0);

//   const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
//   const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

//   useEffect(() => {
//     if (!emblaApi) return;
//     const updateCenter = () => {
//       const selected = emblaApi.selectedScrollSnap();
//       const total = emblaApi.scrollSnapList().length;
//       const inViewCount = emblaApi.slidesInView().length || 1;
//       let center = selected + Math.floor(inViewCount / 2);
//       if (center >= total) center = total - 1;
//       setCenterIndex(center);
//     };
//     emblaApi.on("select", updateCenter);
//     emblaApi.on("scroll", updateCenter);
//     emblaApi.on("reInit", updateCenter);
//     updateCenter();
//     return () => {
//       emblaApi.off("select", updateCenter);
//       emblaApi.off("scroll", updateCenter);
//       emblaApi.off("reInit", updateCenter);
//     };
//   }, [emblaApi]);

//   return (
//     <div className="relative">
//       {/* Controls */}
//       <button
//         type="button"
//         onClick={scrollPrev}
//         className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 grid place-items-center rounded-md border border-gray-200 text-gray-600 bg-white shadow-sm"
//         aria-label="Previous badges"
//       >
//         <ChevronLeft className="h-4 w-4" />
//       </button>
//       <button
//         type="button"
//         onClick={scrollNext}
//         className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 grid place-items-center rounded-md border border-gray-200 text-gray-600 bg-white shadow-sm"
//         aria-label="Next badges"
//       >
//         <ChevronRight className="h-4 w-4" />
//       </button>

//       {/* Viewport */}
//       <div ref={emblaRef} className="overflow-hidden">
//         <div className="flex">
//           {BADGES.map((badge, idx) => (
//             <div
//               key={`${badge.title}-${idx}`}
//               className="min-w-0 shrink-0 grow-0 basis-full sm:basis-1/2 lg:basis-1/3 px-2"
//             >
//               <div
//                 className={
//                   "rounded-md border border-gray-200 bg-white p-4 h-full transition-transform duration-300 will-change-transform " +
//                   (idx === centerIndex ? "scale-125 shadow-md" : "scale-95")
//                 }
//               >
//                 <BadgeCard title={badge.title} subtitle={badge.subtitle} />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
