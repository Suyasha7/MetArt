import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./spaceMatcher.css";
import Seo from "../seo/seo";

export default function SpaceMatcher() {
  const [theme, setTheme] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [preferredCategory, setPreferredCategory] = useState("");

  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleMatch = async (e) => {
    e.preventDefault();
    if (!theme || !maxPrice || !preferredCategory) {
      toast.warn("Please answer all questions to calculate matches!");
      return;
    }

    try {
      setLoading(true);
      setHasSearched(false);
      setMatches([]);

      // Simulate a sophisticated AI scanner/matcher delay for high-fidelity engagement
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const { data } = await axios.post("/api/v1/space/match", {
        theme,
        maxPrice: Number(maxPrice),
        preferredCategory,
      });

      if (data.success) {
        setMatches(data.matches);
        setHasSearched(true);
      }
    } catch (error) {
      toast.error("Failed to fetch space matches. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="matcherPage">
      <Seo title="AI Space Matcher - MetArt" description="Match your aesthetic preferences and budget to find the perfect luxury curated exhibition spaces on MetArt." />

      <div className="matcherHero">
        <span className="badge">AI MATCHMAKER</span>
        <h1>Aesthetic Matcher</h1>
        <p>
          Answer a few questions about your stylistic taste and acquisition budget. Our AI curator will calculate compatibility scores across all live exhibition spaces!
        </p>
      </div>

      <div className="matcherContainer container">
        {/* Preference Form */}
        <div className="matcherFormCard">
          <h2>Select Your Art Preferences</h2>
          <form onSubmit={handleMatch} className="quizForm">
            {/* Vibe Selection */}
            <div className="quizQuestion">
              <label>1. What visual vibe fits your space?</label>
              <div className="optionsGrid">
                {[
                  { value: "minimalist", label: "Luxury Minimalist", desc: "Clean spaces, silent depth" },
                  { value: "futuristic", label: "Futuristic & Sci-Fi", desc: "Cyberpunk neon, high tech" },
                  { value: "vibrant", label: "Vibrant & Expressive", desc: "Bold colors, raw emotions" },
                  { value: "classical", label: "Classical Oil & Canvas", desc: "Fine textures, rich heritage" }
                ].map((opt) => (
                  <div
                    key={opt.value}
                    className={`quizOptionCard ${theme === opt.value ? "selected" : ""}`}
                    onClick={() => setTheme(opt.value)}
                  >
                    <span className="bullet"></span>
                    <div>
                      <p className="optLabel">{opt.label}</p>
                      <p className="optDesc">{opt.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget Selection */}
            <div className="quizQuestion">
              <label>2. What is your acquisition budget ceiling?</label>
              <div className="optionsGrid flexRow">
                {[
                  { value: "500", label: "Under $500" },
                  { value: "1500", label: "Under $1,500" },
                  { value: "5000", label: "Under $5,000" },
                  { value: "99999", label: "No Budget Limit" }
                ].map((opt) => (
                  <div
                    key={opt.value}
                    className={`quizOptionCard pill ${maxPrice === opt.value ? "selected" : ""}`}
                    onClick={() => setMaxPrice(opt.value)}
                  >
                    <span className="pillText">{opt.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Selection */}
            <div className="quizQuestion">
              <label>3. Select your standout art medium category:</label>
              <div className="optionsGrid flexRow">
                {[
                  { value: "painting", label: "Canvas Painting" },
                  { value: "digital", label: "Digital Artwork" },
                  { value: "sculpture", label: "Sculpture / 3D Art" },
                  { value: "photography", label: "Fine Photography" }
                ].map((opt) => (
                  <div
                    key={opt.value}
                    className={`quizOptionCard pill ${preferredCategory === opt.value ? "selected" : ""}`}
                    onClick={() => setPreferredCategory(opt.value)}
                  >
                    <span className="pillText">{opt.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="calculateBtn glowAccent" disabled={loading}>
              {loading ? "Scanning Aesthetic Compatibility..." : "⚡ Calculate Compatibility Matches"}
            </button>
          </form>
        </div>

        {/* Results Showcase */}
        <div className="matcherResultsSection">
          {loading ? (
            <div className="scannerLoader">
              <div className="scannerPulse"></div>
              <div className="radarLine"></div>
              <p>Analyzing matching coefficients...</p>
            </div>
          ) : hasSearched ? (
            <div className="resultsShowcase">
              <h2>Your Curated Matches ({matches.length})</h2>
              {matches.length === 0 ? (
                <div className="noResultsCard">
                  <p>No active exhibition matches found. Try widening your preferences!</p>
                </div>
              ) : (
                <div className="matchesList">
                  {matches.map(({ space, score, matchReasons }) => (
                    <div key={space._id} className="matchResultCard">
                      {/* Match compatibility score badge */}
                      <div className="scoreWheel">
                        <svg viewBox="0 0 36 36" className="circular-chart purple">
                          <path
                            className="circle-bg"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="circle"
                            strokeDasharray={`${score}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <text x="18" y="20.35" className="percentage">
                            {score}%
                          </text>
                        </svg>
                      </div>

                      <div className="matchInfo">
                        <div className="matchHeader">
                          <span className="spTheme">{space.theme}</span>
                          <h3>{space.name}</h3>
                        </div>
                        <p className="spDesc">{space.description}</p>
                        
                        <div className="reasons">
                          <h4>Match Logic:</h4>
                          <ul>
                            {matchReasons.map((reason, idx) => (
                              <li key={idx}>✓ {reason}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="matchFooter">
                          <span>🖼️ {space.artworks?.length || 0} Artworks</span>
                          <Link to="/spaces" className="enterSpaceBtn">
                            Step Inside Exhibition →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="preSearchCard">
              <div className="badgeIcon">⚙️</div>
              <h3>Waiting for Alignment</h3>
              <p>
                Select your vibe, budget, and favorite medium on the left side to calculate compatibility rankings.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
