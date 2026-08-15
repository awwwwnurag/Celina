import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ProductCard } from '../components/ProductCard';
import { SlidersHorizontal, ArrowUpDown, ChevronDown, ChevronUp, Search, X } from 'lucide-react';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Products and loading states
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Dynamic filter lists from database
  const [dbCategories, setDbCategories] = useState([]);
  const [dbBrands, setDbBrands] = useState([]);
  const [brandSearch, setBrandSearch] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Selected filter states
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedFabrics, setSelectedFabrics] = useState([]);
  const [selectedNecks, setSelectedNecks] = useState([]);
  const [selectedSleeves, setSelectedSleeves] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [selectedPatterns, setSelectedPatterns] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Sorting
  const [sort, setSort] = useState('newest');

  // Accordion open/close states
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    size: true,
    color: true,
    fabric: false,
    neck: false,
    sleeve: false,
    collection: false,
    occasion: false,
    pattern: false,
    brand: false,
    availability: false
  });

  // Filter option sets
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  
  const colorOptionsList = [
    { name: 'Blue', bg: '#38BDF8' },
    { name: 'White', bg: '#FFFFFF' },
    { name: 'Ivory', bg: '#FFFFF0' },
    { name: 'Gold', bg: '#FFD700' },
    { name: 'Green', bg: '#008000' },
    { name: 'Beige', bg: '#F5F5DC' },
    { name: 'Pink', bg: '#FFC0CB' },
    { name: 'Red', bg: '#FF0000' }
  ];

  const fabrics = ['100% Pure Cotton', 'Premium Cotton', 'Linen Cotton Blend', 'Organza Silk', 'Rayon Cotton'];
  const sleeves = ['Sleeveless', 'Short Sleeves', '3/4 Sleeves', 'Full Sleeves'];
  const necks = ['Round Neck', 'Mandarin Collar', 'V-Neck Collar', 'No Collar'];
  const collections = ['Cotton Collection', 'Office Wear Collection', 'Festive Collection', 'Summer Collection'];
  const occasions = ['Casual Wear', 'Office Wear', 'Festive Wear'];
  const patterns = ['Solid Stripes', 'Geometric Printed', 'Floral Zari Border', 'Embroidered Floral', 'Solid Pastels', 'Solid Cream'];

  // Search keyword from URL
  const searchVal = searchParams.get('search') || '';

  // 1. Fetch dynamic options on mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const catRes = await axios.get('/api/categories');
        setDbCategories(catRes.data.map(c => c.name) || []);
        const brandRes = await axios.get('/api/brands');
        setDbBrands(brandRes.data.map(b => b.name) || []);
      } catch (err) {
        console.error('Error fetching dynamic filter lists:', err);
      }
    };
    fetchFilterOptions();
  }, []);

  // 2. Sync URL params with local React states
  useEffect(() => {
    const getParam = (key) => searchParams.get(key) ? searchParams.get(key).split(',') : [];

    setSelectedCategories(getParam('category'));
    setSelectedSizes(getParam('sizes'));
    setSelectedBrands(getParam('brand'));
    
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');

    setSelectedColors(getParam('colors'));
    setSelectedFabrics(getParam('fabric'));
    setSelectedNecks(getParam('neck'));
    setSelectedSleeves(getParam('sleeveLength'));
    setSelectedCollections(getParam('collectionName'));
    setSelectedOccasions(getParam('occasion'));
    setSelectedPatterns(getParam('pattern'));
    setInStockOnly(searchParams.get('inStock') === 'true');

    setSort(searchParams.get('sort') || 'newest');
    
    const pageParam = searchParams.get('page');
    setPage(pageParam ? Number(pageParam) : 1);
  }, [searchParams]);

  // 3. Fetch products whenever URL parameters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = searchParams.toString();
        const { data } = await axios.get(`/api/products?limit=12&${query}`);
        setProducts(data.products || []);
        setTotalPages(data.pages || 1);
        setTotalProducts(data.total || 0);
      } catch (e) {
        console.error("Fetch products failed in Shop:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  // Toggle accordion sections
  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Helper: Update parameters and push to URL
  const handleCheckboxChange = (value, currentList, paramKey) => {
    let nextList;
    if (currentList.includes(value)) {
      nextList = currentList.filter(item => item !== value);
    } else {
      nextList = [...currentList, value];
    }

    let params = Object.fromEntries(searchParams.entries());
    if (nextList.length > 0) {
      params[paramKey] = nextList.join(',');
    } else {
      delete params[paramKey];
    }

    // Special handling for minDiscount: calculate the minimum value of selected discounts
    if (paramKey === 'discounts') {
      if (nextList.length > 0) {
        const minVal = Math.min(...nextList.map(Number));
        params.minDiscount = minVal.toString();
      } else {
        delete params.minDiscount;
      }
    }
    
    params.page = 1;
    setSearchParams(params);
  };

  // Price presets trigger
  const handlePriceRadioChange = (min, max) => {
    let params = Object.fromEntries(searchParams.entries());
    if (min) params.minPrice = min;
    else delete params.minPrice;
    
    if (max) params.maxPrice = max;
    else delete params.maxPrice;

    params.page = 1;
    setSearchParams(params);
  };

  // Custom price bounds inputs trigger
  const handlePriceCustomChange = (min, max) => {
    setMinPrice(min);
    setMaxPrice(max);

    let params = Object.fromEntries(searchParams.entries());
    if (min) params.minPrice = min;
    else delete params.minPrice;

    if (max) params.maxPrice = max;
    else delete params.maxPrice;

    params.page = 1;
    setSearchParams(params);
  };

  // Sort dropdown
  const handleSortChange = (e) => {
    const nextSort = e.target.value;
    setSort(nextSort);
    let params = Object.fromEntries(searchParams.entries());
    params.sort = nextSort;
    setSearchParams(params);
  };

  // Reset all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedBrands([]);
    setMinPrice('');
    setMaxPrice('');
    setSelectedColors([]);
    setSelectedFabrics([]);
    setSelectedNecks([]);
    setSelectedSleeves([]);
    setSelectedCollections([]);
    setSelectedOccasions([]);
    setSelectedPatterns([]);
    setInStockOnly(false);
    setSort('newest');
    setSearchParams(searchVal ? { search: searchVal } : {});
  };

  // Pagination click
  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    let params = Object.fromEntries(searchParams.entries());
    params.page = nextPage;
    setSearchParams(params);
  };

  const categoriesOptions = dbCategories.length > 0 ? dbCategories : ['Kurtis', 'Coord Sets', 'Bottom Wear', 'Dupattas'];
  const brandsOptions = dbBrands.length > 0 ? dbBrands : ['Label Celina', 'Zara Ethnic', 'Sanskriti', 'Rivaaz', 'Aura Handlooms'];

  // Helper to render accordion headers with selected badges
  const renderAccordionHeader = (key, label, selectedCount) => {
    const isOpen = openSections[key];
    return (
      <button 
        onClick={() => toggleSection(key)}
        className="flex justify-between items-center w-full font-Poppins font-bold uppercase text-xs tracking-wider text-black py-2"
      >
        <div className="flex items-center gap-2">
          <span>{label}</span>
          {selectedCount > 0 && (
            <span className="bg-[#ff007f]/10 text-[#ff007f] text-[10px] font-black px-1.5 py-0.5 rounded-full ml-1">
              {selectedCount}
            </span>
          )}
        </div>
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="lg:hidden sticky top-[112px] z-40 mb-4">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="w-full bg-main text-white rounded-full py-3 px-4 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
        >
          <SlidersHorizontal size={15} /> Filters & Sort
        </button>
      </div>
      {showMobileFilters && (
        <button
          aria-label="Close filters overlay"
          onClick={() => setShowMobileFilters(false)}
          className="fixed inset-0 z-[75] bg-black/45 lg:hidden"
        />
      )}
      
      {/* 2-COLUMN LAYOUT */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT COLUMN: 15 NYKAA ACCORDION FILTERS SIDEBAR */}
        <aside className={`${showMobileFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} fixed lg:sticky lg:top-8 left-0 top-0 bottom-0 z-[80] w-[86vw] max-w-sm lg:w-64 flex-shrink-0 space-y-5 bg-white border-r lg:border border-brand-border p-5 lg:rounded-2xl shadow-xl lg:shadow-sm self-start overflow-y-auto transition-transform duration-300`}>
          <div className="flex justify-between items-center border-b border-brand-border pb-3">
            <h3 className="font-Poppins font-black uppercase tracking-wider text-xs flex items-center gap-2 text-black">
              <SlidersHorizontal size={14} className="text-main" /> Filters
            </h3>
            <div className="flex items-center gap-3">
              {(selectedCategories.length > 0 || selectedSizes.length > 0 || selectedBrands.length > 0 || minPrice || maxPrice || selectedColors.length > 0 || selectedFabrics.length > 0 || selectedNecks.length > 0 || selectedSleeves.length > 0 || selectedCollections.length > 0 || selectedOccasions.length > 0 || selectedPatterns.length > 0 || inStockOnly) && (
                <button
                  onClick={clearFilters}
                  className="text-[10px] text-red-500 font-bold hover:underline uppercase tracking-wider"
                >
                  Reset
                </button>
              )}
              <button onClick={() => setShowMobileFilters(false)} className="lg:hidden p-1 rounded-full bg-gray-100 text-black" aria-label="Close filters">
                <X size={15} />
              </button>
            </div>
          </div>

          {/* 1. CATEGORY ACCORDION */}
          <div className="border-b border-brand-border pb-3.5">
            {renderAccordionHeader('category', 'Category', selectedCategories.length)}
            {openSections.category && (
              <div className="mt-2 space-y-2">
                {categoriesOptions.map((c) => (
                  <label key={c} className="flex items-center gap-2.5 text-xs font-semibold text-neutral-750 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={selectedCategories.includes(c)}
                      onChange={() => handleCheckboxChange(c, selectedCategories, 'category')}
                      className="rounded border-brand-border text-main focus:ring-main h-4 w-4"
                    />
                    <span>{c}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* 2. PRICE ACCORDION */}
          <div className="border-b border-brand-border pb-3.5">
            {renderAccordionHeader('price', 'Price', (minPrice || maxPrice) ? 1 : 0)}
            {openSections.price && (
              <div className="mt-2 space-y-3">
                <div className="space-y-2">
                  {[
                    { label: 'Under ₹1,000', min: '0', max: '1000' },
                    { label: '₹1,000 - ₹2,000', min: '1000', max: '2000' },
                    { label: '₹2,000 - ₹5,000', min: '2000', max: '5000' },
                    { label: 'Above ₹5,000', min: '5000', max: '99999' }
                  ].map((p, idx) => {
                    const isSelected = minPrice === p.min && maxPrice === p.max;
                    return (
                      <label key={idx} className="flex items-center gap-2.5 text-xs font-semibold text-neutral-750 cursor-pointer select-none">
                        <input 
                          type="radio"
                          name="priceGroup"
                          checked={isSelected}
                          onChange={() => handlePriceRadioChange(p.min, p.max)}
                          className="border-brand-border text-main focus:ring-main h-4 w-4"
                        />
                        <span>{p.label}</span>
                      </label>
                    );
                  })}
                </div>
                <div className="flex gap-2 items-center pt-2 border-t border-dashed border-brand-border">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => handlePriceCustomChange(e.target.value, maxPrice)}
                    className="w-full px-3 py-1.5 text-[10px] border border-brand-border rounded focus:outline-none focus:border-main text-black"
                  />
                  <span className="text-gray-400 text-xs">to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => handlePriceCustomChange(minPrice, e.target.value)}
                    className="w-full px-3 py-1.5 text-[10px] border border-brand-border rounded focus:outline-none focus:border-main text-black"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 3. SIZE ACCORDION */}
          <div className="border-b border-brand-border pb-3.5">
            {renderAccordionHeader('size', 'Size', selectedSizes.length)}
            {openSections.size && (
              <div className="mt-2 grid grid-cols-4 gap-1.5">
                {sizes.map((s) => {
                  const isChecked = selectedSizes.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => handleCheckboxChange(s, selectedSizes, 'sizes')}
                      className={`py-1 text-[10px] border rounded font-black tracking-wider transition ${
                        isChecked
                          ? 'bg-main border-main text-white'
                          : 'border-brand-border text-black hover:border-main'
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4. COLOR ACCORDION */}
          <div className="border-b border-brand-border pb-3.5">
            {renderAccordionHeader('color', 'Color', selectedColors.length)}
            {openSections.color && (
              <div className="mt-2 space-y-2.5 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
                {colorOptionsList.map((col) => {
                  const isChecked = selectedColors.includes(col.name);
                  return (
                    <label key={col.name} className="flex items-center text-xs font-semibold text-neutral-755 cursor-pointer select-none gap-2.5">
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCheckboxChange(col.name, selectedColors, 'colors')}
                        className="rounded border-brand-border text-main focus:ring-main h-4 w-4"
                      />
                      <span 
                        className="w-5 h-5 rounded border border-black/10 inline-block shadow-sm"
                        style={{ background: col.bg }}
                      />
                      <span>{col.name}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* 5. FABRIC ACCORDION */}
          <div className="border-b border-brand-border pb-3.5">
            {renderAccordionHeader('fabric', 'Fabric', selectedFabrics.length)}
            {openSections.fabric && (
              <div className="mt-2 space-y-2">
                {fabrics.map((f) => (
                  <label key={f} className="flex items-center gap-2.5 text-xs font-semibold text-neutral-750 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={selectedFabrics.includes(f)}
                      onChange={() => handleCheckboxChange(f, selectedFabrics, 'fabric')}
                      className="rounded border-brand-border text-main focus:ring-main h-4 w-4"
                    />
                    <span>{f}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* 6. SLEEVE ACCORDION */}
          <div className="border-b border-brand-border pb-3.5">
            {renderAccordionHeader('sleeve', 'Sleeve Type', selectedSleeves.length)}
            {openSections.sleeve && (
              <div className="mt-2 space-y-2">
                {sleeves.map((sl) => (
                  <label key={sl} className="flex items-center gap-2.5 text-xs font-semibold text-neutral-750 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={selectedSleeves.includes(sl)}
                      onChange={() => handleCheckboxChange(sl, selectedSleeves, 'sleeveLength')}
                      className="rounded border-brand-border text-main focus:ring-main h-4 w-4"
                    />
                    <span>{sl}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* 7. NECK STYLE ACCORDION */}
          <div className="border-b border-brand-border pb-3.5">
            {renderAccordionHeader('neck', 'Neck Style', selectedNecks.length)}
            {openSections.neck && (
              <div className="mt-2 space-y-2">
                {necks.map((n) => (
                  <label key={n} className="flex items-center gap-2.5 text-xs font-semibold text-neutral-750 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={selectedNecks.includes(n)}
                      onChange={() => handleCheckboxChange(n, selectedNecks, 'neck')}
                      className="rounded border-brand-border text-main focus:ring-main h-4 w-4"
                    />
                    <span>{n}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* 8. PATTERN ACCORDION */}
          <div className="border-b border-brand-border pb-3.5">
            {renderAccordionHeader('pattern', 'Pattern', selectedPatterns.length)}
            {openSections.pattern && (
              <div className="mt-2 space-y-2">
                {patterns.map((p) => (
                  <label key={p} className="flex items-center gap-2.5 text-xs font-semibold text-neutral-750 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={selectedPatterns.includes(p)}
                      onChange={() => handleCheckboxChange(p, selectedPatterns, 'pattern')}
                      className="rounded border-brand-border text-main focus:ring-main h-4 w-4"
                    />
                    <span>{p}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* 9. COLLECTION ACCORDION */}
          <div className="border-b border-brand-border pb-3.5">
            {renderAccordionHeader('collection', 'Collection', selectedCollections.length)}
            {openSections.collection && (
              <div className="mt-2 space-y-2">
                {collections.map((col) => (
                  <label key={col} className="flex items-center gap-2.5 text-xs font-semibold text-neutral-750 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={selectedCollections.includes(col)}
                      onChange={() => handleCheckboxChange(col, selectedCollections, 'collectionName')}
                      className="rounded border-brand-border text-main focus:ring-main h-4 w-4"
                    />
                    <span>{col}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* 10. OCCASION ACCORDION */}
          <div className="border-b border-brand-border pb-3.5">
            {renderAccordionHeader('occasion', 'Occasion', selectedOccasions.length)}
            {openSections.occasion && (
              <div className="mt-2 space-y-2">
                {occasions.map((o) => (
                  <label key={o} className="flex items-center gap-2.5 text-xs font-semibold text-neutral-750 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={selectedOccasions.includes(o)}
                      onChange={() => handleCheckboxChange(o, selectedOccasions, 'occasion')}
                      className="rounded border-brand-border text-main focus:ring-main h-4 w-4"
                    />
                    <span>{o}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* 11. BRAND ACCORDION */}
          <div className="border-b border-brand-border pb-3.5">
            {renderAccordionHeader('brand', 'Brand', selectedBrands.length)}
            {openSections.brand && (
              <div className="mt-2 space-y-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
                {brandsOptions.map((b) => (
                  <label key={b} className="flex items-center gap-2.5 text-xs font-semibold text-neutral-750 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={selectedBrands.includes(b)}
                      onChange={() => handleCheckboxChange(b, selectedBrands, 'brand')}
                      className="rounded border-brand-border text-main focus:ring-main h-4 w-4"
                    />
                    <span>{b}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* 12. AVAILABILITY ACCORDION */}
          <div className="pb-1">
            {renderAccordionHeader('availability', 'Availability', inStockOnly ? 1 : 0)}
            {openSections.availability && (
              <div className="mt-2 space-y-2">
                <label className="flex items-center gap-2.5 text-xs font-semibold text-neutral-750 cursor-pointer select-none">
                  <input 
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={() => {
                      const nextVal = !inStockOnly;
                      setInStockOnly(nextVal);
                      let params = Object.fromEntries(searchParams.entries());
                      if (nextVal) params.inStock = 'true';
                      else delete params.inStock;
                      params.page = 1;
                      setSearchParams(params);
                    }}
                    className="rounded border-brand-border text-main focus:ring-main h-4 w-4"
                  />
                  <span>Exclude Out of Stock</span>
                </label>
              </div>
            )}
          </div>
          <button onClick={() => setShowMobileFilters(false)} className="lg:hidden w-full bg-black text-white rounded-full py-3 text-xs font-black uppercase tracking-wider">
            Apply Filters
          </button>
        </aside>

        {/* RIGHT COLUMN: PRODUCTS LIST & SORT */}
        <main className="flex-grow space-y-6">
          
          {/* Header Toolbar */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-brand-light p-4 rounded-2xl border border-brand-border text-xs font-bold uppercase tracking-wider text-black shadow-sm">
            <span className="text-gray-500">
              Showing {products.length} of {totalProducts} products
              {searchVal && ` matching "${searchVal}"`}
            </span>
            
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <ArrowUpDown size={14} className="text-black" />
              <span className="text-gray-400">Sort By</span>
              <select
                value={sort}
                onChange={handleSortChange}
                className="bg-transparent border-none text-black outline-none cursor-pointer pr-4 font-black tracking-wider uppercase"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="popular">Popularity</option>
              </select>
            </div>
          </div>

          {/* Grid Products */}
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="bg-neutral-100 aspect-[3/4] w-full rounded-md"></div>
                  <div className="h-4 bg-neutral-100 rounded w-3/4 mx-auto"></div>
                  <div className="h-3 bg-neutral-100 rounded w-1/2 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-brand-light border border-dashed border-[#c2c8da] rounded-md text-gray-500 text-sm font-semibold">
              No products match the selected filters.
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-6">
              <button
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
                className="px-4 py-2 border border-[#c2c8da] text-black hover:bg-black hover:text-white rounded-full text-xs font-black uppercase tracking-wider transition disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-black"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-8 h-8 rounded-full text-xs font-black flex items-center justify-center transition ${
                    page === i + 1
                      ? 'bg-black text-white'
                      : 'border border-[#c2c8da] text-black hover:bg-brand-light'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={page === totalPages}
                onClick={() => handlePageChange(page + 1)}
                className="px-4 py-2 border border-[#c2c8da] text-black hover:bg-black hover:text-white rounded-full text-xs font-black uppercase tracking-wider transition disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-black"
              >
                Next
              </button>
            </div>
          )}

        </main>

      </div>
    </div>
  );
};

export default Shop;
