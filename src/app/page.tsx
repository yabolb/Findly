"use client";

import { Search, MapPin, TrendingUp } from "lucide-react";

export default function Home() {
    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 lg:px-8">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-8 animate-fade-in">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">
                            Over 10,000 items listed this month
                        </span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="font-heading text-5xl md:text-7xl font-bold text-text-main mb-6 leading-tight">
                        Find everything.
                        <br />
                        <span className="text-primary">Second-hand.</span>
                    </h1>

                    {/* Subheading */}
                    <p className="text-xl md:text-2xl text-text-main/60 mb-12 max-w-2xl mx-auto font-light">
                        Discover unique treasures and sustainable finds from people in your
                        community. Buy, sell, and save the planet.
                    </p>

                    {/* Search Bar Placeholder */}
                    <div className="max-w-3xl mx-auto">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
                            <div className="relative bg-white rounded-3xl shadow-2xl shadow-primary/10 p-2 flex items-center gap-3 border border-gray-100">
                                {/* Search Icon */}
                                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-2xl flex items-center justify-center ml-2">
                                    <Search className="w-5 h-5 text-white" />
                                </div>

                                {/* Input Placeholder */}
                                <div className="flex-1 py-2">
                                    <input
                                        type="text"
                                        placeholder="Search for anything..."
                                        className="w-full text-lg outline-none bg-transparent text-text-main placeholder:text-text-main/40"
                                    />
                                </div>

                                {/* Location */}
                                <div className="hidden md:flex items-center gap-2 px-4 py-2 border-l border-gray-200">
                                    <MapPin className="w-5 h-5 text-text-main/40" />
                                    <span className="text-text-main/60 whitespace-nowrap">
                                        Near me
                                    </span>
                                </div>

                                {/* Search Button */}
                                <button className="flex-shrink-0 bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-2xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 mr-1">
                                    Search
                                </button>
                            </div>
                        </div>

                        {/* Popular Searches */}
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                            <span className="text-sm text-text-main/50">Popular:</span>
                            {["Furniture", "Electronics", "Clothing", "Books"].map((tag) => (
                                <button
                                    key={tag}
                                    className="px-4 py-2 rounded-full bg-white border border-gray-200 text-sm text-text-main/70 hover:border-primary hover:text-primary transition-all duration-200 hover:shadow-md"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="pb-20 px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { number: "50K+", label: "Active Users" },
                            { number: "100K+", label: "Items Sold" },
                            { number: "4.9★", label: "Average Rating" },
                        ].map((stat, idx) => (
                            <div
                                key={idx}
                                className="text-center p-8 rounded-3xl bg-white border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300"
                            >
                                <div className="text-4xl font-bold text-primary mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-text-main/60">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
