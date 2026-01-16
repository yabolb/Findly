(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/SearchBar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SearchBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const CATEGORIES = [
    {
        value: "all",
        label: "All Categories"
    },
    {
        value: "cars-motorcycles",
        label: "Cars & Motorcycles"
    },
    {
        value: "fashion",
        label: "Fashion"
    },
    {
        value: "real-estate",
        label: "Real Estate"
    },
    {
        value: "tech-electronics",
        label: "Tech & Electronics"
    },
    {
        value: "sports-leisure",
        label: "Sports & Leisure"
    },
    {
        value: "home-garden",
        label: "Home & Garden"
    },
    {
        value: "movies-books-music",
        label: "Movies, Books & Music"
    },
    {
        value: "baby-kids",
        label: "Baby & Kids"
    },
    {
        value: "collectibles-art",
        label: "Collectibles & Art"
    },
    {
        value: "diy",
        label: "DIY"
    },
    {
        value: "agriculture-industrial",
        label: "Agriculture & Industrial"
    },
    {
        value: "services",
        label: "Services"
    },
    {
        value: "others",
        label: "Others"
    }
];
function SearchBar({ onSearch, compact = false }) {
    _s();
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [category, setCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const [location, setLocation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isCategoryOpen, setIsCategoryOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleSearch = ()=>{
        console.log("Search triggered:", {
            query,
            category,
            location
        });
        onSearch?.(query, category, location);
    };
    const handleKeyPress = (e)=>{
        if (e.key === "Enter") {
            handleSearch();
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        className: `relative w-full ${compact ? "max-w-2xl mx-0" : "max-w-4xl mx-auto"}`,
        initial: compact ? {
            opacity: 0
        } : {
            opacity: 0,
            y: 20
        },
        animate: compact ? {
            opacity: 1
        } : {
            opacity: 1,
            y: 0
        },
        transition: {
            duration: 0.5
        },
        children: [
            !compact && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-2xl opacity-20"
            }, void 0, false, {
                fileName: "[project]/src/components/SearchBar.tsx",
                lineNumber: 55,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `relative bg-white rounded-full flex items-center gap-2 transition-all duration-300 ${compact ? "shadow-md border border-gray-200 p-1 bg-gray-50/50" : "shadow-2xl shadow-primary/10 p-2"}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `flex-1 flex items-center gap-2 ${compact ? "px-4 py-1" : "px-6 py-2"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                className: `${compact ? "w-4 h-4" : "w-5 h-5"} text-text-main/40 flex-shrink-0`
                            }, void 0, false, {
                                fileName: "[project]/src/components/SearchBar.tsx",
                                lineNumber: 65,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                value: query,
                                onChange: (e)=>setQuery(e.target.value),
                                onKeyPress: handleKeyPress,
                                placeholder: compact ? "Search..." : "Search for anything...",
                                className: "w-full text-base outline-none bg-transparent text-text-main placeholder:text-text-main/40 font-medium"
                            }, void 0, false, {
                                fileName: "[project]/src/components/SearchBar.tsx",
                                lineNumber: 66,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/SearchBar.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this),
                    !compact && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-8 w-px bg-gray-200"
                    }, void 0, false, {
                        fileName: "[project]/src/components/SearchBar.tsx",
                        lineNumber: 77,
                        columnNumber: 22
                    }, this),
                    !compact && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setIsCategoryOpen(!isCategoryOpen),
                                className: "flex items-center gap-2 px-6 py-2 hover:bg-gray-50 rounded-full transition-colors duration-200 group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm font-medium text-text-main/70 group-hover:text-text-main whitespace-nowrap",
                                        children: CATEGORIES.find((cat)=>cat.value === category)?.label || "All Categories"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SearchBar.tsx",
                                        lineNumber: 87,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                        className: `w-4 h-4 text-text-main/40 transition-transform duration-200 ${isCategoryOpen ? "rotate-180" : ""}`
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/SearchBar.tsx",
                                        lineNumber: 90,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/SearchBar.tsx",
                                lineNumber: 83,
                                columnNumber: 13
                            }, this),
                            isCategoryOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    opacity: 0,
                                    y: -10
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                className: "absolute top-full right-0 mt-2 bg-white rounded-3xl shadow-xl border border-gray-100 py-2 z-50 min-w-[240px] max-h-96 overflow-y-auto",
                                children: CATEGORIES.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setCategory(cat.value);
                                            setIsCategoryOpen(false);
                                        },
                                        className: `w-full text-left px-6 py-3 hover:bg-primary/5 transition-colors duration-150 ${category === cat.value ? "text-primary font-semibold bg-primary/5" : "text-text-main/70"}`,
                                        children: cat.label
                                    }, cat.value, false, {
                                        fileName: "[project]/src/components/SearchBar.tsx",
                                        lineNumber: 102,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/components/SearchBar.tsx",
                                lineNumber: 96,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/SearchBar.tsx",
                        lineNumber: 81,
                        columnNumber: 11
                    }, this),
                    !compact && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-8 w-px bg-gray-200"
                    }, void 0, false, {
                        fileName: "[project]/src/components/SearchBar.tsx",
                        lineNumber: 122,
                        columnNumber: 22
                    }, this),
                    !compact && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hidden md:flex items-center gap-2 px-6 py-2 min-w-[160px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                className: "w-4 h-4 text-text-main/40 flex-shrink-0"
                            }, void 0, false, {
                                fileName: "[project]/src/components/SearchBar.tsx",
                                lineNumber: 127,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                value: location,
                                onChange: (e)=>setLocation(e.target.value),
                                onKeyPress: handleKeyPress,
                                placeholder: "Location...",
                                className: "w-full text-sm outline-none bg-transparent text-text-main placeholder:text-text-main/40"
                            }, void 0, false, {
                                fileName: "[project]/src/components/SearchBar.tsx",
                                lineNumber: 128,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/SearchBar.tsx",
                        lineNumber: 126,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].button, {
                        onClick: handleSearch,
                        whileHover: {
                            scale: 1.05
                        },
                        whileTap: {
                            scale: 0.95
                        },
                        className: `flex-shrink-0 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow duration-200 ${compact ? "w-8 h-8 bg-primary" : "w-14 h-14 bg-gradient-to-r from-primary to-accent"}`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                            className: compact ? "w-4 h-4" : "w-6 h-6"
                        }, void 0, false, {
                            fileName: "[project]/src/components/SearchBar.tsx",
                            lineNumber: 149,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/SearchBar.tsx",
                        lineNumber: 140,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/SearchBar.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            !compact && isCategoryOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-40",
                onClick: ()=>setIsCategoryOpen(false)
            }, void 0, false, {
                fileName: "[project]/src/components/SearchBar.tsx",
                lineNumber: 155,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/SearchBar.tsx",
        lineNumber: 47,
        columnNumber: 5
    }, this);
}
_s(SearchBar, "TtnbBXZlwIPO0CBL+0905RL6B6M=");
_c = SearchBar;
var _c;
__turbopack_context__.k.register(_c, "SearchBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/mock-data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MOCK_PRODUCTS",
    ()=>MOCK_PRODUCTS,
    "PLATFORM_LOGOS",
    ()=>PLATFORM_LOGOS
]);
const PLATFORM_LOGOS = {
    wallapop: "🛍️",
    vinted: "👚",
    ebay: "🏪",
    milanuncios: "📢"
};
const MOCK_PRODUCTS = [
    {
        id: "1",
        title: "iPhone 13 Pro 128GB - Like New",
        description: "Excellent condition, battery health 95%, with original box and charger",
        price: 599.99,
        currency: "EUR",
        image_url: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=500",
        source_url: "https://wallapop.com/item/1",
        platform: "wallapop",
        category: "tech-electronics",
        location: "Madrid, Spain",
        condition: "like-new",
        phash: null,
        price_score: "bargain",
        created_at: new Date("2026-01-15")
    },
    {
        id: "2",
        title: "Nike Air Max 90 - Size 42",
        description: "Brand new, never worn. Original packaging included.",
        price: 89.99,
        currency: "EUR",
        image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
        source_url: "https://vinted.com/item/2",
        platform: "vinted",
        category: "fashion",
        location: "Barcelona, Spain",
        condition: "new",
        phash: null,
        price_score: "fair",
        created_at: new Date("2026-01-14")
    },
    {
        id: "3",
        title: "Mountain Bike Trek X-Caliber 8",
        description: "29-inch wheels, hydraulic disc brakes, used for one season",
        price: 750.00,
        currency: "EUR",
        image_url: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=500",
        source_url: "https://ebay.com/item/3",
        platform: "ebay",
        category: "sports-leisure",
        location: "Valencia, Spain",
        condition: "good",
        phash: null,
        price_score: "bargain",
        created_at: new Date("2026-01-13")
    },
    {
        id: "4",
        title: "Vintage Leather Sofa - 3 Seater",
        description: "Classic Chesterfield design, genuine Italian leather",
        price: 1200.00,
        currency: "EUR",
        image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500",
        source_url: "https://milanuncios.com/item/4",
        platform: "milanuncios",
        category: "home-garden",
        location: "Seville, Spain",
        condition: "good",
        phash: null,
        price_score: "expensive",
        created_at: new Date("2026-01-12")
    },
    {
        id: "5",
        title: "Canon EOS R6 Camera Body",
        description: "Full-frame mirrorless, 20MP, 4K video, shutter count: 5000",
        price: 1899.00,
        currency: "EUR",
        image_url: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500",
        source_url: "https://wallapop.com/item/5",
        platform: "wallapop",
        category: "tech-electronics",
        location: "Madrid, Spain",
        condition: "like-new",
        phash: null,
        price_score: "fair",
        created_at: new Date("2026-01-11")
    },
    {
        id: "6",
        title: "Zara Wool Coat - Size M",
        description: "Navy blue, barely worn, perfect for winter",
        price: 45.00,
        currency: "EUR",
        image_url: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500",
        source_url: "https://vinted.com/item/6",
        platform: "vinted",
        category: "fashion",
        location: "Bilbao, Spain",
        condition: "like-new",
        phash: null,
        price_score: "bargain",
        created_at: new Date("2026-01-10")
    },
    {
        id: "7",
        title: "Harry Potter Complete Collection",
        description: "All 7 books in hardcover, excellent condition",
        price: 65.00,
        currency: "EUR",
        image_url: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=500",
        source_url: "https://ebay.com/item/7",
        platform: "ebay",
        category: "movies-books-music",
        location: "Granada, Spain",
        condition: "good",
        phash: null,
        price_score: "fair",
        created_at: new Date("2026-01-09")
    },
    {
        id: "8",
        title: "Baby Stroller Bugaboo Fox 2",
        description: "All-terrain stroller, lightweight, adjustable handlebar",
        price: 550.00,
        currency: "EUR",
        image_url: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500",
        source_url: "https://wallapop.com/item/8",
        platform: "wallapop",
        category: "baby-kids",
        location: "Málaga, Spain",
        condition: "good",
        phash: null,
        price_score: "bargain",
        created_at: new Date("2026-01-08")
    },
    {
        id: "9",
        title: "Electric Guitar Fender Stratocaster",
        description: "Sunburst finish, maple neck, with hard case",
        price: 899.00,
        currency: "EUR",
        image_url: "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=500",
        source_url: "https://milanuncios.com/item/9",
        platform: "milanuncios",
        category: "movies-books-music",
        location: "Zaragoza, Spain",
        condition: "good",
        phash: null,
        price_score: "fair",
        created_at: new Date("2026-01-07")
    },
    {
        id: "10",
        title: "Gaming PC - RTX 3080, Ryzen 7",
        description: "Custom build, 32GB RAM, 1TB NVMe SSD, water-cooled",
        price: 1450.00,
        currency: "EUR",
        image_url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500",
        source_url: "https://wallapop.com/item/10",
        platform: "wallapop",
        category: "tech-electronics",
        location: "Madrid, Spain",
        condition: "like-new",
        phash: null,
        price_score: "bargain",
        created_at: new Date("2026-01-06")
    },
    {
        id: "11",
        title: "Adidas Ultraboost Running Shoes",
        description: "Size 41, black colorway, minimal wear",
        price: 75.00,
        currency: "EUR",
        image_url: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500",
        source_url: "https://vinted.com/item/11",
        platform: "vinted",
        category: "sports-leisure",
        location: "Barcelona, Spain",
        condition: "good",
        phash: null,
        price_score: "fair",
        created_at: new Date("2026-01-05")
    },
    {
        id: "12",
        title: "Wooden Dining Table + 6 Chairs",
        description: "Solid oak, extends to seat 8, slight wear on table top",
        price: 480.00,
        currency: "EUR",
        image_url: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=500",
        source_url: "https://ebay.com/item/12",
        platform: "ebay",
        category: "home-garden",
        location: "Valencia, Spain",
        condition: "good",
        phash: null,
        price_score: "bargain",
        created_at: new Date("2026-01-04")
    },
    {
        id: "13",
        title: "MacBook Pro 14 M1 Pro 16GB",
        description: "Space Gray, AppleCare+ until 2027, pristine condition",
        price: 1999.00,
        currency: "EUR",
        image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
        source_url: "https://wallapop.com/item/13",
        platform: "wallapop",
        category: "tech-electronics",
        location: "Madrid, Spain",
        condition: "like-new",
        phash: null,
        price_score: "fair",
        created_at: new Date("2026-01-03")
    },
    {
        id: "14",
        title: "Vintage Vinyl Record Collection",
        description: "50+ records from the 70s-90s, classic rock and jazz",
        price: 250.00,
        currency: "EUR",
        image_url: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=500",
        source_url: "https://milanuncios.com/item/14",
        platform: "milanuncios",
        category: "collectibles-art",
        location: "Seville, Spain",
        condition: "good",
        phash: null,
        price_score: "expensive",
        created_at: new Date("2026-01-02")
    },
    {
        id: "15",
        title: "DJI Mavic Air 2 Drone",
        description: "4K camera, fly more combo with 3 batteries and carrying case",
        price: 650.00,
        currency: "EUR",
        image_url: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500",
        source_url: "https://ebay.com/item/15",
        platform: "ebay",
        category: "tech-electronics",
        location: "Barcelona, Spain",
        condition: "like-new",
        phash: null,
        price_score: "bargain",
        created_at: new Date("2026-01-01")
    },
    {
        id: "16",
        title: "Burberry Trench Coat - Classic",
        description: "Authentic, size 38, beige, timeless design",
        price: 380.00,
        currency: "EUR",
        image_url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500",
        source_url: "https://vinted.com/item/16",
        platform: "vinted",
        category: "fashion",
        location: "Madrid, Spain",
        condition: "good",
        phash: null,
        price_score: "fair",
        created_at: new Date("2025-12-31")
    },
    {
        id: "17",
        title: "Road Bike Specialized Allez",
        description: "Carbon fork, Shimano 105 groupset, 54cm frame",
        price: 590.00,
        currency: "EUR",
        image_url: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500",
        source_url: "https://wallapop.com/item/17",
        platform: "wallapop",
        category: "sports-leisure",
        location: "Valencia, Spain",
        condition: "good",
        phash: null,
        price_score: "bargain",
        created_at: new Date("2025-12-30")
    },
    {
        id: "18",
        title: "IKEA KALLAX Shelving Unit (White)",
        description: "4x4 grid, perfect condition, easy to disassemble for pickup",
        price: 45.00,
        currency: "EUR",
        image_url: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=500",
        source_url: "https://milanuncios.com/item/18",
        platform: "milanuncios",
        category: "home-garden",
        location: "Bilbao, Spain",
        condition: "like-new",
        phash: null,
        price_score: "fair",
        created_at: new Date("2025-12-29")
    },
    {
        id: "19",
        title: "PlayStation 5 Digital Edition",
        description: "1 year old, includes 2 controllers and 5 games",
        price: 380.00,
        currency: "EUR",
        image_url: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500",
        source_url: "https://ebay.com/item/19",
        platform: "ebay",
        category: "tech-electronics",
        location: "Málaga, Spain",
        condition: "good",
        phash: null,
        price_score: "fair",
        created_at: new Date("2025-12-28")
    },
    {
        id: "20",
        title: "Antique Wooden Cabinet",
        description: "Early 1900s, restored, beautiful carvings, display piece",
        price: 890.00,
        currency: "EUR",
        image_url: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500",
        source_url: "https://wallapop.com/item/20",
        platform: "wallapop",
        category: "collectibles-art",
        location: "Granada, Spain",
        condition: "good",
        phash: null,
        price_score: "expensive",
        created_at: new Date("2025-12-27")
    },
    // NEW: Cars & Motorcycles Category
    {
        id: "21",
        title: "BMW 320d 2018 - Diesel",
        description: "150,000 km, full service history, sports package",
        price: 18500.00,
        currency: "EUR",
        image_url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500",
        source_url: "https://milanuncios.com/item/21",
        platform: "milanuncios",
        category: "cars-motorcycles",
        location: "Madrid, Spain",
        condition: "good",
        phash: null,
        price_score: "bargain",
        created_at: new Date("2025-12-26")
    },
    {
        id: "22",
        title: "Yamaha MT-07 Motorcycle 2020",
        description: "Low mileage, one owner, ABS, excellent condition",
        price: 5999.00,
        currency: "EUR",
        image_url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500",
        source_url: "https://wallapop.com/item/22",
        platform: "wallapop",
        category: "cars-motorcycles",
        location: "Barcelona, Spain",
        condition: "like-new",
        phash: null,
        price_score: "bargain",
        created_at: new Date("2025-12-25")
    },
    // NEW: Real Estate Category
    {
        id: "23",
        title: "Studio Apartment - City Center",
        description: "35m², renovated, 5th floor with elevator, near metro",
        price: 145000.00,
        currency: "EUR",
        image_url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500",
        source_url: "https://milanuncios.com/item/23",
        platform: "milanuncios",
        category: "real-estate",
        location: "Madrid, Spain",
        condition: "like-new",
        phash: null,
        price_score: "fair",
        created_at: new Date("2025-12-24")
    },
    {
        id: "24",
        title: "Country House with Land",
        description: "250m² house + 2000m² land, rustic style, mountain views",
        price: 280000.00,
        currency: "EUR",
        image_url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500",
        source_url: "https://milanuncios.com/item/24",
        platform: "milanuncios",
        category: "real-estate",
        location: "Ávila, Spain",
        condition: "good",
        phash: null,
        price_score: "bargain",
        created_at: new Date("2025-12-23")
    },
    // NEW: DIY Category
    {
        id: "25",
        title: "Bosch Professional Drill Set",
        description: "18V cordless drill + impact driver, 2 batteries, charger, case",
        price: 189.00,
        currency: "EUR",
        image_url: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500",
        source_url: "https://ebay.com/item/25",
        platform: "ebay",
        category: "diy",
        location: "Valencia, Spain",
        condition: "like-new",
        phash: null,
        price_score: "bargain",
        created_at: new Date("2025-12-22")
    },
    {
        id: "26",
        title: "Workbench with Tool Storage",
        description: "Heavy-duty steel frame, wooden top, drawer + cabinet storage",
        price: 220.00,
        currency: "EUR",
        image_url: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=500",
        source_url: "https://wallapop.com/item/26",
        platform: "wallapop",
        category: "diy",
        location: "Seville, Spain",
        condition: "good",
        phash: null,
        price_score: "fair",
        created_at: new Date("2025-12-21")
    },
    // NEW: Agriculture & Industrial Category
    {
        id: "27",
        title: "John Deere Compact Tractor",
        description: "25HP, 4WD, 500 hours, front loader included",
        price: 12500.00,
        currency: "EUR",
        image_url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500",
        source_url: "https://milanuncios.com/item/27",
        platform: "milanuncios",
        category: "agriculture-industrial",
        location: "Salamanca, Spain",
        condition: "good",
        phash: null,
        price_score: "bargain",
        created_at: new Date("2025-12-20")
    },
    {
        id: "28",
        title: "Industrial Pallet Jack",
        description: "2500kg capacity, hydraulic, excellent working condition",
        price: 350.00,
        currency: "EUR",
        image_url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500",
        source_url: "https://wallapop.com/item/28",
        platform: "wallapop",
        category: "agriculture-industrial",
        location: "Zaragoza, Spain",
        condition: "good",
        phash: null,
        price_score: "fair",
        created_at: new Date("2025-12-19")
    },
    // NEW: Services Category
    {
        id: "29",
        title: "Home Cleaning Service",
        description: "Professional cleaning, flexible hours, eco-friendly products",
        price: 25.00,
        currency: "EUR",
        image_url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500",
        source_url: "https://milanuncios.com/item/29",
        platform: "milanuncios",
        category: "services",
        location: "Madrid, Spain",
        condition: "new",
        phash: null,
        price_score: "fair",
        created_at: new Date("2025-12-18")
    },
    {
        id: "30",
        title: "Private Guitar Lessons",
        description: "Experienced teacher, all levels, at your home or online",
        price: 30.00,
        currency: "EUR",
        image_url: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=500",
        source_url: "https://wallapop.com/item/30",
        platform: "wallapop",
        category: "services",
        location: "Barcelona, Spain",
        condition: "new",
        phash: null,
        price_score: "bargain",
        created_at: new Date("2025-12-17")
    },
    // NEW: Others Category
    {
        id: "31",
        title: "Parking Space - Monthly Rent",
        description: "Covered parking, secure building, 24/7 access",
        price: 80.00,
        currency: "EUR",
        image_url: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=500",
        source_url: "https://milanuncios.com/item/31",
        platform: "milanuncios",
        category: "others",
        location: "Madrid, Spain",
        condition: "new",
        phash: null,
        price_score: "fair",
        created_at: new Date("2025-12-16")
    },
    {
        id: "32",
        title: "Event Tickets - Music Festival",
        description: "2-day pass, premium camping, June 2026",
        price: 180.00,
        currency: "EUR",
        image_url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500",
        source_url: "https://wallapop.com/item/32",
        platform: "wallapop",
        category: "others",
        location: "Valencia, Spain",
        condition: "new",
        phash: null,
        price_score: "bargain",
        created_at: new Date("2025-12-15")
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ProductCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProductCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mock-data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-client] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const PRICE_SCORE_CONFIG = {
    bargain: {
        label: "Bargain",
        color: "bg-emerald-100 text-emerald-700 border-emerald-200",
        dotColor: "bg-emerald-500",
        pulse: true
    },
    fair: {
        label: "Fair Price",
        color: "bg-slate-100 text-slate-600 border-slate-200",
        dotColor: "bg-slate-400"
    },
    expensive: {
        label: "Market Price",
        color: "bg-slate-100 text-slate-600 border-slate-200",
        dotColor: "bg-slate-400"
    }
};
function ProductCard({ product }) {
    _s();
    const [imageLoaded, setImageLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const priceScoreConfig = product.price_score ? PRICE_SCORE_CONFIG[product.price_score] : null;
    const handleClick = ()=>{
        window.open(product.source_url, "_blank", "noopener,noreferrer");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        whileHover: {
            scale: 1.02
        },
        transition: {
            duration: 0.2,
            ease: "easeOut"
        },
        className: "group cursor-pointer",
        onClick: handleClick,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative aspect-square bg-slate-100 overflow-hidden",
                    children: [
                        !imageLoaded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ProductCard.tsx",
                            lineNumber: 52,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: product.image_url,
                            alt: product.title,
                            className: `w-full h-full object-cover rounded-2xl p-3 transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`,
                            onLoad: ()=>setImageLoaded(true),
                            loading: "lazy"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ProductCard.tsx",
                            lineNumber: 56,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute top-5 right-5 px-3 py-1.5 rounded-full backdrop-blur-md bg-white/70 border border-white/40 shadow-lg flex items-center gap-1.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-lg",
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PLATFORM_LOGOS"][product.platform]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ProductCard.tsx",
                                    lineNumber: 67,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs font-medium text-slate-700 capitalize",
                                    children: product.platform
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ProductCard.tsx",
                                    lineNumber: 68,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ProductCard.tsx",
                            lineNumber: 66,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute top-5 left-5 px-2 py-1 rounded-lg backdrop-blur-md bg-black/40 text-white text-xs font-medium capitalize",
                            children: product.condition.replace("-", " ")
                        }, void 0, false, {
                            fileName: "[project]/src/components/ProductCard.tsx",
                            lineNumber: 74,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 text-white text-sm font-medium",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "View on ",
                                            product.platform
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ProductCard.tsx",
                                        lineNumber: 81,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ProductCard.tsx",
                                        lineNumber: 82,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ProductCard.tsx",
                                lineNumber: 80,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/ProductCard.tsx",
                            lineNumber: 79,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ProductCard.tsx",
                    lineNumber: 49,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-4",
                    children: [
                        priceScoreConfig && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-3",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${priceScoreConfig.color}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `w-2 h-2 rounded-full ${priceScoreConfig.dotColor}`
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ProductCard.tsx",
                                                lineNumber: 96,
                                                columnNumber: 37
                                            }, this),
                                            priceScoreConfig.pulse && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `absolute top-0 left-0 w-2 h-2 rounded-full ${priceScoreConfig.dotColor} animate-ping opacity-75`
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ProductCard.tsx",
                                                lineNumber: 98,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ProductCard.tsx",
                                        lineNumber: 95,
                                        columnNumber: 33
                                    }, this),
                                    priceScoreConfig.label
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ProductCard.tsx",
                                lineNumber: 92,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/ProductCard.tsx",
                            lineNumber: 91,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "font-heading text-text-main text-base font-semibold mb-2 line-clamp-2 leading-snug",
                            children: product.title
                        }, void 0, false, {
                            fileName: "[project]/src/components/ProductCard.tsx",
                            lineNumber: 107,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-slate-500 mb-3 flex items-center gap-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "📍"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ProductCard.tsx",
                                    lineNumber: 113,
                                    columnNumber: 25
                                }, this),
                                product.location
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ProductCard.tsx",
                            lineNumber: 112,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-baseline justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-2xl font-bold text-primary",
                                    children: product.currency === "EUR" ? `${product.price.toLocaleString('es-ES', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })} €` : `${product.price.toFixed(2)} ${product.currency}`
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ProductCard.tsx",
                                    lineNumber: 119,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs text-slate-400",
                                    children: new Date(product.created_at).toLocaleDateString("en-GB", {
                                        day: "numeric",
                                        month: "short"
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ProductCard.tsx",
                                    lineNumber: 125,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ProductCard.tsx",
                            lineNumber: 118,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ProductCard.tsx",
                    lineNumber: 88,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ProductCard.tsx",
            lineNumber: 47,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ProductCard.tsx",
        lineNumber: 41,
        columnNumber: 9
    }, this);
}
_s(ProductCard, "herZJqy/1Gg51nCYa0Z7tHl3+ng=");
_c = ProductCard;
var _c;
__turbopack_context__.k.register(_c, "ProductCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ProductGrid.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProductGrid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ProductCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
"use client";
;
;
;
// Sponsored Card Component - Mimics ProductCard Design
function SponsoredCard({ position }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        whileHover: {
            scale: 1.02
        },
        transition: {
            duration: 0.2,
            ease: "easeOut"
        },
        className: "group cursor-pointer",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative aspect-square bg-gradient-to-br from-violet-50 to-orange-50 overflow-hidden flex items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center p-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-4xl",
                                    children: "💎"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ProductGrid.tsx",
                                    lineNumber: 26,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/ProductGrid.tsx",
                                lineNumber: 25,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-heading font-semibold text-slate-700 text-lg mb-1",
                                children: "Premium Offer"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ProductGrid.tsx",
                                lineNumber: 28,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-slate-500",
                                children: "Featured Brand"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ProductGrid.tsx",
                                lineNumber: 31,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ProductGrid.tsx",
                        lineNumber: 24,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/ProductGrid.tsx",
                    lineNumber: 22,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "font-heading text-text-main text-base font-semibold mb-2 line-clamp-2 leading-snug mt-3",
                            children: "Discover Amazing Deals"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ProductGrid.tsx",
                            lineNumber: 40,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-slate-500 mb-3 flex items-center gap-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "📍"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ProductGrid.tsx",
                                    lineNumber: 46,
                                    columnNumber: 25
                                }, this),
                                "Your Location"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ProductGrid.tsx",
                            lineNumber: 45,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-baseline justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-2xl font-bold text-primary",
                                    children: "--"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ProductGrid.tsx",
                                    lineNumber: 52,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs text-slate-400",
                                    children: [
                                        "Position #",
                                        position
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ProductGrid.tsx",
                                    lineNumber: 55,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ProductGrid.tsx",
                            lineNumber: 51,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ProductGrid.tsx",
                    lineNumber: 38,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ProductGrid.tsx",
            lineNumber: 20,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ProductGrid.tsx",
        lineNumber: 15,
        columnNumber: 9
    }, this);
}
_c = SponsoredCard;
function ProductGrid({ products }) {
    // Calculate positions for AdSense placements
    // Position #5, then every 10 products (15, 25, 35...)
    const shouldShowAd = (index)=>{
        const position = index + 1;
        return position === 5 || position > 5 && (position - 5) % 10 === 0;
    };
    // Build grid items including ads
    const gridItems = [];
    let adCounter = 1;
    products.forEach((product, index)=>{
        // Check if we should insert an ad BEFORE this product
        if (shouldShowAd(index)) {
            gridItems.push(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SponsoredCard, {
                position: index + 1
            }, `ad-${adCounter}`, false, {
                fileName: "[project]/src/components/ProductGrid.tsx",
                lineNumber: 83,
                columnNumber: 17
            }, this));
            adCounter++;
        }
        // Add the product
        gridItems.push(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            product: product
        }, product.id, false, {
            fileName: "[project]/src/components/ProductGrid.tsx",
            lineNumber: 89,
            columnNumber: 24
        }, this));
    });
    // Animation variants for staggered fade-in
    const containerVariants = {
        hidden: {
            opacity: 0
        },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };
    const itemVariants = {
        hidden: {
            opacity: 0,
            y: 20
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: [
                    0.4,
                    0,
                    0.2,
                    1
                ]
            }
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-slate-600",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-semibold text-text-main",
                            children: products.length
                        }, void 0, false, {
                            fileName: "[project]/src/components/ProductGrid.tsx",
                            lineNumber: 120,
                            columnNumber: 21
                        }, this),
                        " results found"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ProductGrid.tsx",
                    lineNumber: 119,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ProductGrid.tsx",
                lineNumber: 118,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
                variants: containerVariants,
                initial: "hidden",
                animate: "visible",
                children: gridItems.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        variants: itemVariants,
                        children: item
                    }, index, false, {
                        fileName: "[project]/src/components/ProductGrid.tsx",
                        lineNumber: 133,
                        columnNumber: 21
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/ProductGrid.tsx",
                lineNumber: 126,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ProductGrid.tsx",
        lineNumber: 116,
        columnNumber: 9
    }, this);
}
_c1 = ProductGrid;
var _c, _c1;
__turbopack_context__.k.register(_c, "SponsoredCard");
__turbopack_context__.k.register(_c1, "ProductGrid");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/types/index.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ========================================
// FINDLY - TYPE DEFINITIONS (PRD-Aligned)
// ========================================
// 13 Core Categories from PRD
__turbopack_context__.s([
    "CATEGORY_LABELS",
    ()=>CATEGORY_LABELS
]);
const CATEGORY_LABELS = {
    "cars-motorcycles": "Cars & Motorcycles",
    fashion: "Fashion",
    "real-estate": "Real Estate",
    "tech-electronics": "Tech & Electronics",
    "sports-leisure": "Sports & Leisure",
    "home-garden": "Home & Garden",
    "movies-books-music": "Movies, Books & Music",
    "baby-kids": "Baby & Kids",
    "collectibles-art": "Collectibles & Art",
    diy: "DIY",
    "agriculture-industrial": "Agriculture & Industrial",
    services: "Services",
    others: "Others"
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ZeroResults.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ZeroResults
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
"use client";
;
;
;
const SUGGESTED_CATEGORIES = [
    "tech-electronics",
    "fashion",
    "sports-leisure",
    "home-garden",
    "cars-motorcycles"
];
function ZeroResults({ query }) {
    const handleCategoryClick = (category)=>{
        // This will be connected to the search state later
        console.log("Suggested category clicked:", category);
    // TODO: Trigger search with this category
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full max-w-2xl mx-auto text-center py-20",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                    className: "w-12 h-12 text-slate-400"
                }, void 0, false, {
                    fileName: "[project]/src/components/ZeroResults.tsx",
                    lineNumber: 29,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ZeroResults.tsx",
                lineNumber: 28,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "font-heading text-3xl font-bold text-text-main mb-3",
                children: "No results found"
            }, void 0, false, {
                fileName: "[project]/src/components/ZeroResults.tsx",
                lineNumber: 33,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-lg text-slate-600 mb-8",
                children: query ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        "We couldn't find any products matching",
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-semibold text-text-main",
                            children: [
                                '"',
                                query,
                                '"'
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ZeroResults.tsx",
                            lineNumber: 42,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true) : "Try adjusting your search or browse our suggested categories below"
            }, void 0, false, {
                fileName: "[project]/src/components/ZeroResults.tsx",
                lineNumber: 38,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm font-medium text-slate-500 uppercase tracking-wide",
                        children: "Suggested Categories"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ZeroResults.tsx",
                        lineNumber: 51,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap items-center justify-center gap-3",
                        children: SUGGESTED_CATEGORIES.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>handleCategoryClick(category),
                                className: "px-6 py-3 rounded-full bg-white border-2 border-gray-200 text-text-main font-medium hover:border-primary hover:text-primary hover:shadow-lg transition-all duration-200 hover:scale-105",
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CATEGORY_LABELS"][category]
                            }, category, false, {
                                fileName: "[project]/src/components/ZeroResults.tsx",
                                lineNumber: 56,
                                columnNumber: 25
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/ZeroResults.tsx",
                        lineNumber: 54,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ZeroResults.tsx",
                lineNumber: 50,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-200",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                            className: "w-5 h-5 text-primary mt-1 flex-shrink-0"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ZeroResults.tsx",
                            lineNumber: 70,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-left",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-semibold text-text-main mb-2",
                                    children: "Search Tips"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ZeroResults.tsx",
                                    lineNumber: 72,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "text-sm text-slate-600 space-y-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "• Try using more general keywords"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ZeroResults.tsx",
                                            lineNumber: 74,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "• Check your spelling"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ZeroResults.tsx",
                                            lineNumber: 75,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "• Remove filters to see more results"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ZeroResults.tsx",
                                            lineNumber: 76,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "• Browse different categories"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ZeroResults.tsx",
                                            lineNumber: 77,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ZeroResults.tsx",
                                    lineNumber: 73,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ZeroResults.tsx",
                            lineNumber: 71,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ZeroResults.tsx",
                    lineNumber: 69,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ZeroResults.tsx",
                lineNumber: 68,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ZeroResults.tsx",
        lineNumber: 26,
        columnNumber: 9
    }, this);
}
_c = ZeroResults;
var _c;
__turbopack_context__.k.register(_c, "ZeroResults");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/CategoryBar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CategoryBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/index.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Car$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/car.js [app-client] (ecmascript) <export default as Car>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shirt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shirt$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shirt.js [app-client] (ecmascript) <export default as Shirt>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$laptop$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Laptop$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/laptop.js [app-client] (ecmascript) <export default as Laptop>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dumbbell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Dumbbell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/dumbbell.js [app-client] (ecmascript) <export default as Dumbbell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sofa$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sofa$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sofa.js [app-client] (ecmascript) <export default as Sofa>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$film$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Film$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/film.js [app-client] (ecmascript) <export default as Film>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$baby$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Baby$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/baby.js [app-client] (ecmascript) <export default as Baby>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Gem$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/gem.js [app-client] (ecmascript) <export default as Gem>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wrench$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wrench$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wrench.js [app-client] (ecmascript) <export default as Wrench>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tractor$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tractor$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/tractor.js [app-client] (ecmascript) <export default as Tractor>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/briefcase.js [app-client] (ecmascript) <export default as Briefcase>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-client] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
"use client";
;
;
;
;
;
// Icon mapping for each category
const CATEGORY_ICONS = {
    "cars-motorcycles": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$car$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Car$3e$__["Car"],
    "fashion": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shirt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shirt$3e$__["Shirt"],
    "real-estate": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"],
    "tech-electronics": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$laptop$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Laptop$3e$__["Laptop"],
    "sports-leisure": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dumbbell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Dumbbell$3e$__["Dumbbell"],
    "home-garden": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sofa$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sofa$3e$__["Sofa"],
    "movies-books-music": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$film$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Film$3e$__["Film"],
    "baby-kids": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$baby$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Baby$3e$__["Baby"],
    "collectibles-art": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$gem$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Gem$3e$__["Gem"],
    "diy": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wrench$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wrench$3e$__["Wrench"],
    "agriculture-industrial": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tractor$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tractor$3e$__["Tractor"],
    "services": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__["Briefcase"],
    "others": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"]
};
const ALL_CATEGORIES = [
    {
        id: "all",
        label: "All",
        Icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"]
    },
    ...Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CATEGORY_LABELS"]).map(([id, label])=>({
            id: id,
            label,
            Icon: CATEGORY_ICONS[id]
        }))
];
function CategoryBar({ selectedCategory = "all", onCategorySelect }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-dd6cf4ff5712d4cd" + " " + "w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-20 z-40 shadow-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-dd6cf4ff5712d4cd" + " " + "max-w-7xl mx-auto px-6 lg:px-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-dd6cf4ff5712d4cd" + " " + "overflow-x-auto scrollbar-hide",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-dd6cf4ff5712d4cd" + " " + "flex items-center gap-2 py-4 min-w-max",
                        children: ALL_CATEGORIES.map(({ id, label, Icon })=>{
                            const isSelected = selectedCategory === id;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].button, {
                                onClick: ()=>onCategorySelect(id),
                                whileHover: {
                                    scale: 1.05
                                },
                                whileTap: {
                                    scale: 0.95
                                },
                                className: `
                                        flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium
                                        transition-all duration-200
                                        ${isSelected ? "bg-primary text-white shadow-md" : "bg-white text-slate-700 border border-gray-200 hover:border-primary hover:text-primary hover:shadow-md"}
                                    `,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                        className: "jsx-dd6cf4ff5712d4cd" + " " + "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/CategoryBar.tsx",
                                        lineNumber: 77,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "jsx-dd6cf4ff5712d4cd" + " " + "whitespace-nowrap",
                                        children: label
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/CategoryBar.tsx",
                                        lineNumber: 78,
                                        columnNumber: 37
                                    }, this)
                                ]
                            }, id, true, {
                                fileName: "[project]/src/components/CategoryBar.tsx",
                                lineNumber: 63,
                                columnNumber: 33
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/components/CategoryBar.tsx",
                        lineNumber: 58,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/CategoryBar.tsx",
                    lineNumber: 57,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/CategoryBar.tsx",
                lineNumber: 55,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "dd6cf4ff5712d4cd",
                children: ".scrollbar-hide.jsx-dd6cf4ff5712d4cd::-webkit-scrollbar{display:none}.scrollbar-hide.jsx-dd6cf4ff5712d4cd{-ms-overflow-style:none;scrollbar-width:none}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/CategoryBar.tsx",
        lineNumber: 54,
        columnNumber: 9
    }, this);
}
_c = CategoryBar;
var _c;
__turbopack_context__.k.register(_c, "CategoryBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useScrollPosition.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useScrollPosition",
    ()=>useScrollPosition
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useScrollPosition() {
    _s();
    const [scrollY, setScrollY] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [isScrolled, setIsScrolled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useScrollPosition.useEffect": ()=>{
            const handleScroll = {
                "useScrollPosition.useEffect.handleScroll": ()=>{
                    const currentScrollY = window.scrollY;
                    setScrollY(currentScrollY);
                    // Threshold: show sticky search after scrolling ~200px
                    setIsScrolled(currentScrollY > 200);
                }
            }["useScrollPosition.useEffect.handleScroll"];
            // Check initial scroll position
            handleScroll();
            window.addEventListener('scroll', handleScroll, {
                passive: true
            });
            return ({
                "useScrollPosition.useEffect": ()=>window.removeEventListener('scroll', handleScroll)
            })["useScrollPosition.useEffect"];
        }
    }["useScrollPosition.useEffect"], []);
    return {
        scrollY,
        isScrolled
    };
}
_s(useScrollPosition, "iSL2e9efsj/X9fyqqB7xj1b4rFc=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Navbar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Navbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SearchBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/SearchBar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useScrollPosition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useScrollPosition.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function Navbar({ onSearch }) {
    _s();
    const { scrollY, isScrolled: isSearchVisible } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useScrollPosition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScrollPosition"])();
    const isNavBackgroundVisible = scrollY > 10;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isNavBackgroundVisible ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100/50" : "bg-transparent"}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto px-6 lg:px-8",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between h-20",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: "flex items-center gap-2 group flex-shrink-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-10 h-10 bg-primary rounded-xl flex items-center justify-center transform transition-transform group-hover:scale-105 shadow-sm",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                    className: "w-5 h-5 text-white"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Navbar.tsx",
                                    lineNumber: 28,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/Navbar.tsx",
                                lineNumber: 27,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-heading text-2xl font-bold text-text-main hidden sm:block",
                                children: "Findly"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Navbar.tsx",
                                lineNumber: 30,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Navbar.tsx",
                        lineNumber: 26,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `hidden md:block flex-1 max-w-xl mx-8 transition-all duration-300 ${isSearchVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SearchBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            onSearch: onSearch,
                            compact: true
                        }, void 0, false, {
                            fileName: "[project]/src/components/Navbar.tsx",
                            lineNumber: 40,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/Navbar.tsx",
                        lineNumber: 36,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hidden md:flex items-center gap-8 flex-shrink-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/categories",
                                className: "text-text-main/70 hover:text-primary font-medium transition-colors duration-200 relative group",
                                children: [
                                    "Categories",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Navbar.tsx",
                                        lineNumber: 50,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Navbar.tsx",
                                lineNumber: 45,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/about",
                                className: "text-text-main/70 hover:text-primary font-medium transition-colors duration-200 relative group",
                                children: [
                                    "About",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Navbar.tsx",
                                        lineNumber: 57,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Navbar.tsx",
                                lineNumber: 52,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Navbar.tsx",
                        lineNumber: 44,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "md:hidden p-2 rounded-xl hover:bg-primary/10 transition-colors ml-auto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-6 h-6 text-text-main",
                            fill: "none",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: "2",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M4 6h16M4 12h16M4 18h16"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Navbar.tsx",
                                lineNumber: 72,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/Navbar.tsx",
                            lineNumber: 63,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/Navbar.tsx",
                        lineNumber: 62,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Navbar.tsx",
                lineNumber: 24,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/Navbar.tsx",
            lineNumber: 23,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/Navbar.tsx",
        lineNumber: 17,
        columnNumber: 9
    }, this);
}
_s(Navbar, "t40CKhwn2Kaima95jJSKLdNfpY0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useScrollPosition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScrollPosition"]
    ];
});
_c = Navbar;
var _c;
__turbopack_context__.k.register(_c, "Navbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/supabase.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-client] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://pbkpuzodxnkgrminzjwb.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBia3B1em9keG5rZ3JtaW56andiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MTA2MzksImV4cCI6MjA4NDA4NjYzOX0.64jlpkMZciANKGod4BwMl-r_GXxBNKauwQW2c7wdXI4");
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/product-service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchProducts",
    ()=>fetchProducts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mock-data.ts [app-client] (ecmascript)");
;
;
async function fetchProducts(filters) {
    try {
        let query = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("products").select("*");
        // Apply filters if provided
        if (filters) {
            if (filters.query) {
                // Full-text search on title and description
                query = query.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
            }
            if (filters.category) {
                query = query.eq("category", filters.category);
            }
            if (filters.minPrice !== undefined) {
                query = query.gte("price", filters.minPrice);
            }
            if (filters.maxPrice !== undefined) {
                query = query.lte("price", filters.maxPrice);
            }
            if (filters.location) {
                query = query.ilike("location", `%${filters.location}%`);
            }
            if (filters.condition && filters.condition.length > 0) {
                query = query.in("condition", filters.condition);
            }
            if (filters.platform && filters.platform.length > 0) {
                query = query.in("platform", filters.platform);
            }
            if (filters.priceScore && filters.priceScore.length > 0) {
                query = query.in("price_score", filters.priceScore);
            }
        }
        // Order by most recent first
        query = query.order("created_at", {
            ascending: false
        });
        const { data, error } = await query;
        if (error) {
            console.error("Supabase query error:", error);
            // Fall back to mock data on error
            return applyMockFilters(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOCK_PRODUCTS"], filters);
        }
        // If database is empty, use mock data
        if (!data || data.length === 0) {
            console.log("📦 Database empty - using mock data");
            return applyMockFilters(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOCK_PRODUCTS"], filters);
        }
        // Convert created_at strings to Date objects
        return data.map((product)=>({
                ...product,
                created_at: new Date(product.created_at)
            }));
    } catch (error) {
        console.error("Failed to fetch products:", error);
        // Fall back to mock data on error
        return applyMockFilters(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOCK_PRODUCTS"], filters);
    }
}
/**
 * Apply filters to mock data (used when database is empty or unavailable)
 */ function applyMockFilters(products, filters) {
    if (!filters) return products;
    let filtered = [
        ...products
    ];
    if (filters.query) {
        const query = filters.query.toLowerCase();
        filtered = filtered.filter((p)=>p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query));
    }
    if (filters.category) {
        filtered = filtered.filter((p)=>p.category === filters.category);
    }
    if (filters.minPrice !== undefined) {
        filtered = filtered.filter((p)=>p.price >= filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
        filtered = filtered.filter((p)=>p.price <= filters.maxPrice);
    }
    if (filters.location) {
        const location = filters.location.toLowerCase();
        filtered = filtered.filter((p)=>p.location.toLowerCase().includes(location));
    }
    if (filters.condition && filters.condition.length > 0) {
        filtered = filtered.filter((p)=>filters.condition.includes(p.condition));
    }
    if (filters.platform && filters.platform.length > 0) {
        filtered = filtered.filter((p)=>filters.platform.includes(p.platform));
    }
    if (filters.priceScore && filters.priceScore.length > 0) {
        filtered = filtered.filter((p)=>p.price_score && filters.priceScore.includes(p.price_score));
    }
    return filtered;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SearchBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/SearchBar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductGrid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ProductGrid.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ZeroResults$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ZeroResults.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CategoryBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/CategoryBar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Navbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Navbar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/product-service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useScrollPosition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useScrollPosition.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
function Home() {
    _s();
    const [products, setProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [hasSearched, setHasSearched] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedCategory, setSelectedCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("all");
    const { isScrolled } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useScrollPosition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScrollPosition"])();
    // Load initial "Trending Bargains" on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            loadTrendingBargains();
        }
    }["Home.useEffect"], []);
    const loadTrendingBargains = async ()=>{
        setLoading(true);
        try {
            // Fetch all products and filter for bargains
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchProducts"])();
            const bargains = data.filter((product)=>product.price_score === "bargain");
            setProducts(bargains);
        } catch (error) {
            console.error("Failed to load trending bargains:", error);
        } finally{
            setLoading(false);
        }
    };
    const loadProducts = async (query, category, location)=>{
        setLoading(true);
        try {
            const filters = {};
            if (query) filters.query = query;
            if (category && category !== "all") filters.category = category;
            if (location) filters.location = location;
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchProducts"])(Object.keys(filters).length > 0 ? filters : undefined);
            setProducts(data);
        } catch (error) {
            console.error("Failed to load products:", error);
        } finally{
            setLoading(false);
        }
    };
    const handleSearch = (query, category, location)=>{
        console.log("🔍 Search initiated:");
        console.log("  Query:", query);
        console.log("  Category:", category);
        console.log("  Location:", location);
        setSearchQuery(query);
        setHasSearched(true);
        setSelectedCategory(category || "all");
        loadProducts(query, category, location);
    };
    const handleCategorySelect = async (category)=>{
        setSelectedCategory(category);
        if (!hasSearched) {
            // In discovery mode, filter bargains by category
            setLoading(true);
            try {
                const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$product$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchProducts"])(category !== "all" ? {
                    category: category
                } : undefined);
                const bargains = data.filter((product)=>product.price_score === "bargain");
                setProducts(bargains);
            } catch (error) {
                console.error("Failed to filter bargains:", error);
            } finally{
                setLoading(false);
            }
        } else {
            // In search mode, filter search results by category
            loadProducts(searchQuery, category !== "all" ? category : undefined);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Navbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                onSearch: handleSearch
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 96,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "pt-24 pb-8 px-6 lg:px-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-5xl mx-auto text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                    className: "w-4 h-4 text-primary"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 103,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm font-medium text-primary",
                                    children: "Over 10,000 items listed this month"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 104,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 102,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "font-heading text-4xl md:text-6xl font-bold text-text-main mb-4 leading-tight",
                            children: [
                                "Find everything.",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 112,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-primary",
                                    children: "Second-hand."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 113,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 110,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-base md:text-lg text-text-main/60 mb-8 max-w-2xl mx-auto font-light",
                            children: "Discover unique treasures and sustainable finds from people in your community. Buy, sell, and save the planet."
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 117,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `transition-all duration-300 ${isScrolled ? "opacity-0 translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"}`,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$SearchBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                onSearch: handleSearch
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 125,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 123,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 100,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 99,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$CategoryBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                selectedCategory: selectedCategory,
                onCategorySelect: handleCategorySelect
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 131,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "pb-20 px-6 lg:px-8 mt-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-7xl mx-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "font-heading text-2xl md:text-3xl font-bold text-text-main mb-2",
                                    children: hasSearched ? `Results for "${searchQuery}"` : "🔥 Trending Bargains"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 141,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-slate-600",
                                    children: hasSearched ? "Based on your search criteria" : "The best deals on the market right now"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 147,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 140,
                            columnNumber: 21
                        }, this),
                        loading ? // Loading State
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center py-20",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 158,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-slate-600",
                                    children: hasSearched ? "Searching for products..." : "Loading trending bargains..."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 159,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 157,
                            columnNumber: 25
                        }, this) : products.length > 0 ? // Products Grid
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProductGrid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            products: products
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 165,
                            columnNumber: 25
                        }, this) : // Zero Results
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ZeroResults$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            query: searchQuery || "bargains"
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 168,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 138,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 137,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 95,
        columnNumber: 9
    }, this);
}
_s(Home, "WlzBfc0Z+F0/DLu7ES41nQS5iUk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useScrollPosition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useScrollPosition"]
    ];
});
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_b44287b2._.js.map