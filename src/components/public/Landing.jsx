import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
    BarChart3, Search, Network, Zap, Database, 
    Star, ShoppingCart
} from "lucide-react";
import styles from "../../css/Home.module.css";

/* Products Data (Flattened Algorithms) */
const allProducts = [
    { id: "dijkstra", name: "Dijkstra's Path", category: "Greedy", icon: Zap, link: "/greedy/dijkstra", isTrending: true, rating: 4.9, reviews: 128 },
    { id: "quick", name: "Quick Sort", category: "Sorting", icon: BarChart3, link: "/sorting/quick", isTrending: true, rating: 4.8, reviews: 312 },
    { id: "bfs", name: "Breadth First Search", category: "Graph", icon: Network, link: "/graph/bfs", isTrending: true, rating: 4.7, reviews: 205 },
    { id: "binary", name: "Binary Search", category: "Searching", icon: Search, link: "/searching/binary", isTrending: true, rating: 4.9, reviews: 450 },
    { id: "bubble", name: "Bubble Sort", category: "Sorting", icon: BarChart3, link: "/sorting/bubble", isTrending: false, rating: 4.2, reviews: 890 },
    { id: "merge", name: "Merge Sort", category: "Sorting", icon: BarChart3, link: "/sorting/merge", isTrending: false, rating: 4.8, reviews: 275 },
    { id: "selection", name: "Selection Sort", category: "Sorting", icon: BarChart3, link: "/sorting/selection", isTrending: false, rating: 4.3, reviews: 156 },
    { id: "insertion", name: "Insertion Sort", category: "Sorting", icon: BarChart3, link: "/sorting/insertion", isTrending: false, rating: 4.4, reviews: 189 },
    { id: "linear", name: "Linear Search", category: "Searching", icon: Search, link: "/searching/linear", isTrending: false, rating: 4.1, reviews: 320 },
    { id: "bellman", name: "Bellman-Ford", category: "Greedy", icon: Zap, link: "/greedy/bellman-Ford", isTrending: false, rating: 4.6, reviews: 98 },
    { id: "dfs", name: "Depth First Search", category: "Graph", icon: Network, link: "/graph/dfs", isTrending: false, rating: 4.7, reviews: 198 },
    { id: "btree", name: "Binary Tree", category: "Graph", icon: Network, link: "/graph/binaryTree", isTrending: false, rating: 4.8, reviews: 210 },
    { id: "array", name: "Array", category: "LinearDS", icon: Database, link: "/array", isTrending: false, rating: 4.5, reviews: 430 },
    { id: "stack", name: "Stack", category: "LinearDS", icon: Database, link: "/stack", isTrending: true, rating: 4.8, reviews: 380 },
    { id: "queue", name: "Queue", category: "LinearDS", icon: Database, link: "/queue", isTrending: false, rating: 4.6, reviews: 310 },
    { id: "ll", name: "Linked List", category: "LinearDS", icon: Database, link: "/linklist", isTrending: false, rating: 4.7, reviews: 260 }
];

/* Hero Slides */
const heroSlides = [
    {
        title: "Algorithm of the Week",
        desc: "Master graph traversal with our stunning Dijkstra visualization. Learn how shortest paths are calculated in real-time.",
        badge: "Trending",
        link: "/greedy/dijkstra",
        bgImage: "linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80')"
    },
    {
        title: "The Sorting Collection",
        desc: "From Bubble to Merge. Watch elements race into order and deeply understand time complexity.",
        badge: "Essential",
        link: "/sorting/quick",
        bgImage: "linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80')"
    },
    {
        title: "Data Structure Fundamentals",
        desc: "Visualize Stacks, Queues, and Linked Lists. The building blocks of software engineering at your fingertips.",
        badge: "New Arrival",
        link: "/stack",
        bgImage: "linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80')"
    }
];

const ProductCard = ({ product }) => {
    const Icon = product.icon;
    return (
        <Link to={product.link} className={styles.productCard}>
            <div className={`${styles.productImage} ${styles[`img-${product.category}`]}`}>
                {product.isTrending && <span className={styles.productBadge}>Best Seller</span>}
                <Icon />
            </div>
            <div className={styles.productInfo}>
                <span className={styles.productCategory}>{product.category}</span>
                <h3 className={styles.productTitle}>{product.name}</h3>
                
                <div className={styles.productRating}>
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                    ))}
                    <span className={styles.ratingCount}>({product.reviews})</span>
                </div>

                <div className={styles.productFooter}>
                    <div>
                        <span className={styles.productPrice}>Free</span>
                        <span className={styles.originalPrice}>$9.99</span>
                    </div>
                    <div className={styles.addToCartBtn}>
                        <ShoppingCart size={18} />
                    </div>
                </div>
            </div>
        </Link>
    );
};

const Landing = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-advance carousel
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const trendingProducts = allProducts.filter(p => p.isTrending);

    return (
        <div className={styles.storeWrapper}>
            
            {/* Hero Carousel */}
            <section className={styles.heroCarousel}>
                {heroSlides.map((slide, idx) => (
                    <div 
                        key={idx} 
                        className={`${styles.carouselSlide} ${idx === currentSlide ? styles.active : ""}`}
                        style={{ backgroundImage: slide.bgImage }}
                    >
                        <div className={styles.slideContent}>
                            <span className={styles.slideBadge} style={{ background: "var(--accent-cyan)", color: "#000" }}>{slide.badge}</span>
                            <h1 className={styles.slideTitle}>{slide.title}</h1>
                            <p className={styles.slideDesc}>{slide.desc}</p>
                            <Link to={slide.link} className={styles.ctaButton} style={{ background: "#fff" }}>
                                Visualize Now
                            </Link>
                        </div>
                    </div>
                ))}
                
                {/* Carousel Controls */}
                <div className={styles.carouselControls}>
                    {heroSlides.map((_, idx) => (
                        <div 
                            key={idx} 
                            className={`${styles.carouselDot} ${idx === currentSlide ? styles.active : ""}`}
                            onClick={() => setCurrentSlide(idx)}
                        />
                    ))}
                </div>
            </section>

            <div className={styles.storeSection}>
                {/* Category Pills */}
                <div className={styles.categoryRow}>
                    {["All Categories", "Sorting", "Searching", "Graph", "Greedy", "LinearDS"].map(cat => (
                        <div key={cat} className={styles.categoryPill}>
                            {cat}
                        </div>
                    ))}
                </div>

                {/* Trending Section */}
                <div style={{ marginTop: "60px" }}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Trending Visualizations</h2>
                        <Link to="/" className={styles.viewAllLink}>View All Best Sellers →</Link>
                    </div>
                    
                    <div className={styles.productScroll}>
                        {trendingProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>

                {/* Promotional Offer Banner */}
                <div className={styles.offerBanner}>
                    <div className={styles.offerText}>
                        <h2>Unlock The Full Developer Bundle</h2>
                        <p>Create a free account today to save your progress, unlock achievements, and master data structures.</p>
                    </div>
                    <Link to="/Auth" className={styles.offerBtn}>
                        Claim Offer
                    </Link>
                </div>

                {/* All Products Grid */}
                <div style={{ marginTop: "60px" }}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>All Algorithms</h2>
                    </div>
                    
                    <div className={styles.productGrid}>
                        {allProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Fat E-commerce Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerGrid}>
                    <div className={styles.footerCol}>
                        <h3>AlgoVisualizer</h3>
                        <p>The premium destination for interactive data structure and algorithm learning. We make the complex simple and beautiful.</p>
                        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--glass-surface)", display: "flex", alignItems: "center", justifyContent: "center" }}>X</div>
                            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--glass-surface)", display: "flex", alignItems: "center", justifyContent: "center" }}>in</div>
                            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--glass-surface)", display: "flex", alignItems: "center", justifyContent: "center" }}>gh</div>
                        </div>
                    </div>
                    
                    <div className={styles.footerCol}>
                        <h3>Shop Categories</h3>
                        <ul className={styles.footerList}>
                            <li><Link to="/">Sorting Algorithms</Link></li>
                            <li><Link to="/">Graph Traversal</Link></li>
                            <li><Link to="/">Greedy Strategies</Link></li>
                            <li><Link to="/">Data Structures</Link></li>
                        </ul>
                    </div>

                    <div className={styles.footerCol}>
                        <h3>Customer Service</h3>
                        <ul className={styles.footerList}>
                            <li><Link to="/contact">Contact Us</Link></li>
                            <li><Link to="/about">About the Platform</Link></li>
                            <li><Link to="/benefits">Account Benefits</Link></li>
                            <li><Link to="/">FAQ</Link></li>
                        </ul>
                    </div>

                    <div className={styles.footerCol}>
                        <h3>Stay in the Loop</h3>
                        <p>Sign up for our newsletter to get new algorithms straight to your inbox.</p>
                        <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
                            <input type="email" placeholder="Email Address" className={styles.newsletterInput} />
                            <button className={styles.newsletterBtn}>Subscribe</button>
                        </form>
                    </div>
                </div>
                
                <div className={styles.footerBottom}>
                    <span>&copy; 2026 AlgoVisualizer. All rights reserved.</span>
                    <div style={{ display: "flex", gap: "16px" }}>
                        <span>Privacy Policy</span>
                        <span>Terms of Service</span>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default Landing;
