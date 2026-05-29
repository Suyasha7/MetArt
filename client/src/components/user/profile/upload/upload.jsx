import { toast } from 'react-toastify'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

// import css and components
import './upload.css'
import Bubbles from '../../../utility/bubbles/bubbles'

// import actions
import { clearError, clearMessage, uploadArt, getAllArts } from '../../../../redux/artSlice';

const loadingMessages = [
    "Scanning canvas brushwork & color compositions...",
    "Generating premium, storytelling catalog description...",
    "Analyzing historical art trends for fair-market valuation...",
    "Calculating optimal placement for anti-piracy watermarking...",
    "Synthesizing high-fidelity metadata packages..."
];

const Upload = () => {
    const {error, message, isLoading} = useSelector(state => state.art);

    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [isAuctionItem, setIsAuctionItem] = useState(false);
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [estimatedValueFrom, setEstimatedValueFrom] = useState('');
    const [estimatedValueTo, setEstimatedValueTo] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    // AI Appraiser and Watermark States
    const [watermarkPosition, setWatermarkPosition] = useState('southwest');
    const [isAppraising, setIsAppraising] = useState(false);
    const [appraisalResult, setAppraisalResult] = useState(null);
    const [aiOpacity, setAiOpacity] = useState(null);
    const [loadingStep, setLoadingStep] = useState(0);

    useEffect(() => {
        let interval;
        if (isAppraising) {
            setLoadingStep(0);
            interval = setInterval(() => {
                setLoadingStep(prev => (prev + 1) % loadingMessages.length);
            }, 1800);
        }
        return () => clearInterval(interval);
    }, [isAppraising]);

    const handleImageChange = (e) => {
        e.preventDefault();
        setImages(old => [...old, ...e.target.files]);
        setImagePreviews(prev => [...prev, ...Array.from(e.target.files).map(img => URL.createObjectURL(img))]);
    };

    const handleClear = () => {
        setName('')
        setPrice('')
        setDiscount('')
        setCategory('')
        setDescription('')
        setIsAuctionItem(false)
        setImages([]);
        setImagePreviews([]);
        setEstimatedValueFrom('')
        setEstimatedValueTo('')
        setSelectedDate('')
        setSelectedTime('')
        setWatermarkPosition('southwest')
        setAppraisalResult(null)
        setAiOpacity(null)
    }

    const handleAiAppraisal = async () => {
        if (images.length < 1) {
            return toast.warn("Please upload an artwork image first so the AI Co-Pilot can analyze it.");
        }
        
        setIsAppraising(true);
        setAppraisalResult(null);

        const formData = new FormData();
        formData.append("artImage", images[0]);

        try {
            const { data } = await axios.post("/api/v1/ai/appraise", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true
            });

            if (data.success && data.appraisal) {
                setAppraisalResult(data.appraisal);
                setAiOpacity(data.appraisal.watermarkOpacity);
                toast.success("AI Art Appraisal completed! Review the suggestions below.");
            } else {
                toast.error("Could not retrieve AI suggestions. Please try again.");
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "AI Appraisal failed.";
            toast.error(errorMsg);
        } finally {
            setIsAppraising(false);
        }
    };

    const applyAiSuggestions = () => {
        if (!appraisalResult) return;
        
        // Map category correctly
        let detectedCategory = appraisalResult.category || "";
        if (!detectedCategory && appraisalResult.tags) {
            const categories = ["painting", "photography", "sketching", "sculpture"];
            const found = appraisalResult.tags.find(tag => categories.includes(tag.toLowerCase()));
            if (found) {
                detectedCategory = found.toLowerCase();
            }
        }
        
        if (detectedCategory) {
            setCategory(detectedCategory.toLowerCase());
        } else {
            const tagString = appraisalResult.tags?.join(" ") || "";
            if (/abstract|oil|acrylic|canvas|paint|watercolor/i.test(tagString)) {
                setCategory("painting");
            } else if (/photo|shot|portrait|camera/i.test(tagString)) {
                setCategory("photography");
            } else if (/sketch|pencil|draw/i.test(tagString)) {
                setCategory("sketching");
            } else if (/sculpt|clay|bronze|stone/i.test(tagString)) {
                setCategory("sculpture");
            }
        }

        if (appraisalResult.description) {
            setDescription(appraisalResult.description);
        }
        if (appraisalResult.suggestedPrice) {
            setPrice(appraisalResult.suggestedPrice);
            setEstimatedValueFrom(Math.floor(appraisalResult.suggestedPrice * 0.9));
            setEstimatedValueTo(Math.floor(appraisalResult.suggestedPrice * 1.3));
        }
        if (appraisalResult.watermarkPosition) {
            setWatermarkPosition(appraisalResult.watermarkPosition);
        }
        
        if (appraisalResult.title || appraisalResult.name) {
            setName(appraisalResult.title || appraisalResult.name);
        } else {
            if (appraisalResult.tags && appraisalResult.tags.length > 0) {
                const words = appraisalResult.tags.slice(0, 2).map(tag => tag.charAt(0).toUpperCase() + tag.slice(1)).join(" ");
                setName(`${words} Study`);
            }
        }

        toast.success("AI Suggestions applied to your upload form!");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(images.length < 1) {return toast.warn("You must include image of you artwork as well.")};
        const myForm = new FormData();
        myForm.append('name', name);
        myForm.append('price', price);
        myForm.append('discount', discount);
        myForm.append('category', category);
        myForm.append('description', description);
        myForm.append('isAuctionItem', isAuctionItem);
        myForm.append('watermarkPosition', watermarkPosition);
    
        for (const image of images) {
            myForm.append('artImages', image);
        }
    
        if (isAuctionItem) {
          myForm.append('estimatedValueFrom', estimatedValueFrom);
          myForm.append('estimatedValueTo', estimatedValueTo);
          myForm.append('endDate', selectedDate + ' ' + selectedTime);
        }
    
        dispatch(uploadArt(myForm));
    };

    useEffect(() => {
        if(message){
          toast.success(message);
          dispatch(getAllArts({}));
          dispatch(clearMessage());
          handleClear();
        }
    
        if(error){
          toast.error(error);
          dispatch(clearError());
        }
    }, [dispatch, message, error])

    return (
        <div className="uploadContainer">
            <div className="uploadForm">
                <h2>✨ Upload New Masterpiece</h2>
                <p className="uploadSubtitle">List your artwork for direct sale or high-stakes live auctions.</p>
                
                <form onSubmit={handleSubmit}>
                    <div className='row1'>
                        <div>
                            <span>Name</span>
                            <input type="text" placeholder='required*' value={name} autoComplete='off' onChange={(e) => setName(e.target.value)} required/>
                        </div>

                        <div>
                            <span>Price (Rs)</span>
                            <input type="number" placeholder='required*' value={price} min='0' autoComplete='off' onChange={(e) => setPrice(e.target.value)} required />
                        </div>

                        <div>
                            <span>Discount</span>
                            <input type="number" placeholder='optional' value={discount} min='0' onChange={(e) => setDiscount(e.target.value)} />
                        </div>

                        <div>
                            <span>Choose Category</span>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                                <option value='' disabled>Category</option>
                                <option value='painting'>Painting</option>
                                <option value='photography'>Photography</option>
                                <option value='sketching'>Sketching</option>
                                <option value='sculpture'>Sculpture</option>
                            </select>   
                        </div>
                    </div>

                    <div className="row2">
                        <div>
                            <span>Description</span>
                            <textarea value={description} 
                            placeholder="Please add the detailed description of your art here..." 
                            onChange={(e) => setDescription(e.target.value)} 
                            required
                            ></textarea>
                        </div>
                    </div>

                    <div className="row3">
                        <span>Artwork Images</span>
                        <input id='artImages' type='file' accept='image/*' onChange={handleImageChange} multiple required />
                        
                        <label htmlFor='artImages'>
                            <i className="fa-solid fa-arrow-up-from-bracket"></i>
                            <p>Upload images of your art.</p>
                        </label>
                        
                        {imagePreviews[0] && 
                            <div className="imagePreview">
                                {imagePreviews.map((img, index) => <img key={index} src={img} alt="artImage" />)}
                            </div>
                        }
                    </div>

                    <div className="watermarkSection">
                        <h4>🛡️ Anti-Piracy Watermark Settings</h4>
                        <p>High-resolution images will be protected dynamically with an invisible-signature watermark overlay.</p>
                        <div className="watermarkFields">
                            <div>
                                <span>Watermark Placement</span>
                                <select value={watermarkPosition} onChange={(e) => setWatermarkPosition(e.target.value)}>
                                    <option value="southwest">Bottom-Left (Southwest)</option>
                                    <option value="southeast">Bottom-Right (Southeast)</option>
                                    <option value="northwest">Top-Left (Northwest)</option>
                                    <option value="northeast">Top-Right (Northeast)</option>
                                    <option value="center">Center</option>
                                </select>
                            </div>
                            {aiOpacity && (
                                <div>
                                    <span>AI Suggested Opacity</span>
                                    <input type="text" value={`${(aiOpacity * 100).toFixed(0)}% (Auto-scaled)`} disabled />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={isAuctionItem ? "auctionFields active" : "auctionFields"}>
                        <div>
                            <span>Estimated Value (From)</span>
                            <input type="number" placeholder="required" min="0" value={estimatedValueFrom} onChange={e => setEstimatedValueFrom(e.target.value)} />
                        </div>

                        <div>
                            <span>Estimated Value (To)</span>
                            <input type="number" placeholder="required" min="0" value={estimatedValueTo}  onChange={e => setEstimatedValueTo(e.target.value)} />
                        </div>

                        <div>
                            <span>End Date</span>
                            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} required={isAuctionItem} />
                        </div>

                        <div>
                            <span>End Time</span>
                            <input type="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} required={isAuctionItem} />
                        </div>
                    </div>

                    <div className="buttons">
                        <div className="auctionCheckboxContainer">
                            <input id="auctionCheckbox" type="checkbox" checked={isAuctionItem} onChange={() => setIsAuctionItem(!isAuctionItem)} />
                            <label htmlFor="auctionCheckbox">Upload as auction artwork?</label>
                        </div>
                        <button type='button' className="btn-clear" onClick={handleClear}>Clear</button>
                        <button type='submit' className="btn-submit" disabled={isLoading}>{isLoading ? <Bubbles /> : "Submit"}</button>
                    </div>
                </form>
            </div>

            <div className="aiCopilotPanel">
                <div className="aiCopilotHeader">
                    <span className="sparkleIcon">✨</span>
                    <div>
                        <h3>AI Art Appraiser</h3>
                        <p className="subtitle">OpenAI GPT-4o Co-Pilot</p>
                    </div>
                </div>

                <div className="aiCopilotContent">
                    {images.length < 1 ? (
                        <div className="aiEmptyState">
                            <i className="fa-solid fa-wand-magic-sparkles magic-wand"></i>
                            <p>Upload an image first, then use our visual AI to automatically appraise, describe, and protect your artwork.</p>
                        </div>
                    ) : isAppraising ? (
                        <div className="aiLoadingState">
                            <div className="scanner">
                                <div className="scannerLine"></div>
                                <img src={imagePreviews[0]} alt="Scanning Preview" />
                            </div>
                            <div className="aiLoadingSpinner">
                                <div className="spinner"></div>
                            </div>
                            <p className="loadingMessage">{loadingMessages[loadingStep]}</p>
                        </div>
                    ) : appraisalResult ? (
                        <div className="aiResultsState">
                            <div className="resultsHeader">
                                <span>Analysis Complete!</span>
                                <button type="button" onClick={applyAiSuggestions} className="applyBtn">Apply Suggestions</button>
                            </div>
                            
                            <div className="appraisalItem">
                                <span className="label">💡 Suggested Name:</span>
                                <span className="value">{appraisalResult.title || (appraisalResult.tags && appraisalResult.tags.slice(0, 2).map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(" ") + " Study")}</span>
                            </div>

                            <div className="appraisalItem">
                                <span className="label">💰 Starting Bid Recommendation:</span>
                                <span className="value font-price">Rs {appraisalResult.suggestedPrice}</span>
                            </div>

                            <div className="appraisalItem">
                                <span className="label">🛡️ IP Protection Watermark Placement:</span>
                                <span className="value text-capital">{appraisalResult.watermarkPosition} ({Math.round(appraisalResult.watermarkOpacity * 100)}% opacity)</span>
                            </div>

                            <div className="appraisalItem tagsContainer">
                                <span className="label">🏷️ AI Semantic Tags:</span>
                                <div className="tagsList">
                                    {appraisalResult.tags?.map((tag, i) => <span key={i} className="tagBadge">#{tag}</span>)}
                                </div>
                            </div>

                            <div className="appraisalItem descItem">
                                <span className="label">📜 Narrative Catalog Description:</span>
                                <p className="descText">"{appraisalResult.description}"</p>
                            </div>

                            <button type="button" onClick={handleAiAppraisal} className="reanalyzeBtn">
                                <i className="fa-solid fa-rotate-right"></i> Re-Analyze Image
                            </button>
                        </div>
                    ) : (
                        <div className="aiReadyState">
                            <div className="readyPreview">
                                <img src={imagePreviews[0]} alt="Ready Preview" />
                            </div>
                            <button type="button" onClick={handleAiAppraisal} className="analyzeBtn">
                                <i className="fa-solid fa-microchip-ai"></i> Run Visual AI Appraisal
                            </button>
                            <p className="analyzeHelp">GPT-4o Vision will analyze color palette, canvas composition, and suggest pricing metadata.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Upload;