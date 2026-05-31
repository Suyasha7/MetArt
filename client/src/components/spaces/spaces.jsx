import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "./spaces.css";
import Seo from "../seo/seo";

export default function Spaces() {
  const { user, isAuthenticated } = useSelector((state) => state.user);

  // States
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSpace, setActiveSpace] = useState(null);
  const [myArtworks, setMyArtworks] = useState([]);
  const [commentary, setCommentary] = useState("");
  const [generatingCommentary, setGeneratingCommentary] = useState(false);

  // Form States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState("");
  const [newSpaceDesc, setNewSpaceDesc] = useState("");
  const [newSpaceTheme, setNewSpaceTheme] = useState("minimalist");
  const [selectedArtworks, setSelectedArtworks] = useState([]);

  // Fetch all spaces
  const fetchSpaces = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/v1/spaces");
      if (data.success) {
        setSpaces(data.spaces);
      }
    } catch (error) {
      toast.error("Failed to load exhibition spaces.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch logged-in user's artworks for curation
  const fetchMyArtworks = async () => {
    if (!user || user.role !== "creator") return;
    try {
      const { data } = await axios.get(`/api/v1/artworks/${user._id}`);
      if (data.success) {
        setMyArtworks(data.artworks);
      }
    } catch (error) {
      console.error("Error loading user artworks:", error);
    }
  };

  useEffect(() => {
    fetchSpaces();
    fetchMyArtworks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Handle curation selection
  const handleArtSelection = (artId) => {
    if (selectedArtworks.includes(artId)) {
      setSelectedArtworks(selectedArtworks.filter((id) => id !== artId));
    } else {
      setSelectedArtworks([...selectedArtworks, artId]);
    }
  };

  // Create Space Submit
  const handleCreateSpace = async (e) => {
    e.preventDefault();
    if (!newSpaceName || !newSpaceDesc) {
      toast.warn("Please enter both a name and description.");
      return;
    }

    try {
      const { data } = await axios.post(
        "/api/v1/space/create",
        {
          name: newSpaceName,
          description: newSpaceDesc,
          theme: newSpaceTheme,
          artworks: selectedArtworks,
        },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("Exhibition Space Curated Successfully!");
        setNewSpaceName("");
        setNewSpaceDesc("");
        setSelectedArtworks([]);
        setShowCreateModal(false);
        fetchSpaces();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create space.");
    }
  };

  // Generate Live AI Commentary
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakText = (text) => {
    if (!window.speechSynthesis) {
      toast.warn("Text-to-speech is not supported in this browser.");
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Select a female English voice with higher pitch
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice =
      voices.find((v) => v.name.includes("Microsoft Zira")) ||
      voices.find((v) => v.name.includes("Google UK English Female")) ||
      voices.find((v) => v.name.includes("Samantha")) ||
      voices.find((v) => v.name.includes("Female") && v.lang.startsWith("en")) ||
      voices.find((v) => v.name.includes("Zira")) ||
      voices.find((v) => v.name.includes("Hazel")) ||
      voices.find((v) => v.name.includes("Susan")) ||
      voices.find((v) => v.name.includes("Kate")) ||
      voices.find((v) => v.lang.startsWith("en"));
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.pitch = 1.35; // Higher-pitched feminine voice
    utterance.rate = 0.92; // Elegant, slow curator speaking pace

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Generate Live AI Commentary
  const handleGenerateCommentary = async (spaceId) => {
    try {
      handleStopSpeaking();
      setGeneratingCommentary(true);
      setCommentary("");
      const { data } = await axios.get(`/api/v1/space/${spaceId}/commentary`);
      if (data.success) {
        setCommentary(data.commentary);
        // Automatically start speaking the review!
        speakText(data.commentary);
      }
    } catch (error) {
      toast.error("Curator AI failed to analyze this space.");
    } finally {
      setGeneratingCommentary(false);
    }
  };

  // Stop speaking when user changes active space or leaves the page
  useEffect(() => {
    handleStopSpeaking();
  }, [activeSpace]);

  useEffect(() => {
    return () => {
      handleStopSpeaking();
    };
  }, []);


  return (
    <div className="spacesPage">
      <Seo title="Virtual Spaces - MetArt" description="Step inside luxury themed exhibition spaces and explore direct creator artwork galleries with live AI commentators." />

      {/* Hero Header */}
      <div className="spacesHero">
        <div className="heroOverlay"></div>
        <div className="heroContent">
          <span className="badge">EXHIBITIONS</span>
          <h1>Virtual Spaces</h1>
          <p>
            Explore meticulously curated exhibitions or launch your own. Match
            your aesthetic taste and experience live commentary from our AI art historian.
          </p>
          <div className="heroActions">
            <Link to="/space-matcher" className="matcherBtn glowAccent">
              ⚡ Open Space Matcher
            </Link>
            {isAuthenticated && user?.role === "creator" && (
              <button
                className="curateBtn"
                onClick={() => setShowCreateModal(true)}
              >
                ✦ Curate a Space
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="spacesLayout container">
        {/* Sidebar: Available Spaces */}
        <div className="spacesSidebar">
          <h2>Curated Exhibitions</h2>
          {loading ? (
            <div className="loaderMini"></div>
          ) : spaces.length === 0 ? (
            <p className="emptyTxt">No spaces active yet. Be the first to curate one!</p>
          ) : (
            <div className="spacesList">
              {spaces.map((sp) => (
                <div
                  key={sp._id}
                  className={`spaceSidebarCard ${
                    activeSpace?._id === sp._id ? "active" : ""
                  }`}
                  onClick={() => {
                    setActiveSpace(sp);
                    setCommentary("");
                  }}
                >
                  <div className="spSidebarTheme" data-theme={sp.theme}>
                    {sp.theme}
                  </div>
                  <h3>{sp.name}</h3>
                  <p className="descLine">{sp.description}</p>
                  <div className="spMeta">
                    <span>🖼️ {sp.artworks?.length || 0} Artworks</span>
                    <span>✍️ By {sp.creator?.name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Exhibition Viewer */}
        <div className="spacesMain">
          {activeSpace ? (
            <div className="activeSpaceExhibition">
              <div className="spaceHeader" data-theme={activeSpace.theme}>
                <div className="headerGlass">
                  <div className="themeTag">{activeSpace.theme}</div>
                  <h2>{activeSpace.name}</h2>
                  <p>{activeSpace.description}</p>
                  <p className="curatorCredit">
                    Curated by <span>{activeSpace.creator?.name}</span>
                  </p>
                </div>
              </div>

              {/* Artworks List Grid */}
              <div className="spaceArtworkSection">
                <h3>Exhibition Pieces ({activeSpace.artworks?.length || 0})</h3>
                {activeSpace.artworks?.length === 0 ? (
                  <div className="emptyExhibition">
                    <p>No artworks placed in this space yet.</p>
                  </div>
                ) : (
                  <div className="spaceArtworksGrid">
                    {activeSpace.artworks.map((art) => (
                      <div key={art._id} className="spaceArtCard">
                        <div className="artImageContainer">
                          <img
                            src={art.images?.[0]?.watermarked_image_url || art.images?.[0]?.original_image_url}
                            alt={art.name}
                          />
                          <div className="artHoverOverlay">
                            <Link to={`/art/${art._id}`} className="viewArtBtn">
                              View Masterpiece
                            </Link>
                          </div>
                        </div>
                        <div className="artCardBody">
                          <h4>{art.name}</h4>
                          <p className="category">{art.category}</p>
                          <div className="priceLine">
                            <span>Starting Bid</span>
                            <span className="price">${art.price}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Live AI Commentator Interface */}
              <div className="liveCommentatorSection">
                <div className="commentatorCard">
                  <div className="commentatorHeader">
                    <div className={`avatarAI ${isSpeaking ? 'speaking' : ''} ${generatingCommentary ? 'thinking' : ''}`}>
                      <div className="avatarPulse"></div>
                      <img src="/curator_avatar.png" alt="AI Curator" className="curatorAvatarImg" />
                      {/* Animated mouth overlay for speaking */}
                      {(isSpeaking || generatingCommentary) && (
                        <div className="avatarMouthAnim"></div>
                      )}
                    </div>
                    <div>
                      <h4>Live AI Commentator</h4>
                      <p>Virtual Art Historian & Curator Guide</p>
                      {isSpeaking && <span className="liveIndicator">● LIVE</span>}
                    </div>
                  </div>

                  <div className="commentatorContent">
                    {generatingCommentary || isSpeaking ? (
                      <div className="aiCuratorSpeaking">
                        {/* Avatar character visible while speaking */}
                        <div className={`avatarCharacterDisplay ${isSpeaking ? 'speaking' : 'thinking'}`}>
                          <img src="/curator_avatar.png" alt="AI Curator Speaking" className="curatorCharacterImg" />
                          <div className="speechBubble">
                            <p>
                              {generatingCommentary
                                ? "Hmm, let me analyze the artworks in this exhibition..."
                                : "Listen closely as I walk you through this exhibition!"}
                            </p>
                          </div>
                        </div>
                        <div className="soundwave">
                          <span className="stroke"></span>
                          <span className="stroke"></span>
                          <span className="stroke"></span>
                          <span className="stroke"></span>
                          <span className="stroke"></span>
                          <span className="stroke"></span>
                          <span className="stroke"></span>
                        </div>
                        <p className="speakingText">
                          {generatingCommentary
                            ? "AI curator is analyzing the composition and visual dialogue of this Space..."
                            : "🎙️ AI Curator Guide is speaking live... Listen to the review!"}
                        </p>
                        {isSpeaking && (
                          <button onClick={handleStopSpeaking} className="stopVoiceBtn">
                            ⏸️ Mute Audio Guide
                          </button>
                        )}
                      </div>
                    ) : commentary ? (
                      <div className="commentaryOutput">
                        <div className="commentaryWithAvatar">
                          <img src="/curator_avatar.png" alt="AI Curator" className="curatorMiniAvatar" />
                          <div className="commentaryBubble">
                            <p className="quote">"</p>
                            <p className="commentaryText">{commentary}</p>
                          </div>
                        </div>
                        <button onClick={() => speakText(commentary)} className="playVoiceBtn">
                          🔊 Play Spoken Guide
                        </button>
                      </div>
                    ) : (
                      <div className="callToActionContainer">
                        <img src="/curator_avatar.png" alt="AI Curator" className="curatorIdleAvatar" />
                        <p className="callToAction">
                          Hi there! I'm your AI Curator Guide. Click the button below and I'll give you a live, spoken commentary walkthrough of this exhibition space!
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="commentatorFooter">
                    <button
                      className="commentaryTriggerBtn"
                      disabled={generatingCommentary}
                      onClick={() => handleGenerateCommentary(activeSpace._id)}
                    >
                      {generatingCommentary
                        ? "Curator Thinking..."
                        : commentary
                        ? "🔄 Refresh Commentary"
                        : "🎙️ Stream Live Curator Review"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="noActiveSpace">
              <div className="noActiveCard">
                <div className="circleArt">🖼️</div>
                <h2>Explore MetArt Spaces</h2>
                <p>
                  Please select an exhibition from the left sidebar to enter a virtual space, view the protected creations, and listen to the Live AI Commentator tour guide.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Curate Space Modal */}
      {showCreateModal && (
        <div className="spaceModalOverlay">
          <div className="spaceModalCard">
            <div className="modalHeader">
              <h3>Curate Virtual Space</h3>
              <button
                className="closeModalBtn"
                onClick={() => setShowCreateModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateSpace} className="modalForm">
              <label>Space Exhibition Title</label>
              <input
                type="text"
                placeholder="e.g. Cyberpunk Renaissance"
                value={newSpaceName}
                onChange={(e) => setNewSpaceName(e.target.value)}
                required
              />

              <label>Curatorial Theme & Vibe</label>
              <textarea
                placeholder="Describe the aesthetic values, visual atmosphere, and meaning of this space..."
                rows="3"
                value={newSpaceDesc}
                onChange={(e) => setNewSpaceDesc(e.target.value)}
                required
              ></textarea>

              <label>Visual Mode (Theme Style)</label>
              <select
                value={newSpaceTheme}
                onChange={(e) => setNewSpaceTheme(e.target.value)}
              >
                <option value="minimalist">Luxury Minimalist</option>
                <option value="vibrant">Vibrant & Expressive</option>
                <option value="classical">Classical Oil & Canvas</option>
                <option value="futuristic">Futuristic & Sci-Fi</option>
                <option value="dark-mode">Deep Obsidian Dark Mode</option>
              </select>

              <label>Add Your Artworks to the Exhibition</label>
              {myArtworks.length === 0 ? (
                <p className="noArtWarn">
                  You haven't uploaded any artworks yet. Go to your profile and upload some to curate this space!
                </p>
              ) : (
                <div className="artworkChecklist">
                  {myArtworks.map((art) => (
                    <div
                      key={art._id}
                      className={`artCheckItem ${
                        selectedArtworks.includes(art._id) ? "checked" : ""
                      }`}
                      onClick={() => handleArtSelection(art._id)}
                    >
                      <img src={art.images?.[0]?.watermarked_image_url} alt="" />
                      <div>
                        <p className="artCheckName">{art.name}</p>
                        <p className="artCheckPrice">${art.price}</p>
                      </div>
                      <div className="checkboxMarker">
                        {selectedArtworks.includes(art._id) ? "✓" : "+"}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="submit"
                className="submitSpaceBtn glowAccent"
                disabled={myArtworks.length === 0}
              >
                ✦ Publish Exhibition Space
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
