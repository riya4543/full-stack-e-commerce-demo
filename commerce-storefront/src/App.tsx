import { FormEvent, useEffect, useMemo, useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';
type Product = { id:string; name:string; description:string; price:number; inventory:number; category:{name:string} };
type CartItem = { id:string; quantity:number; product:Product };
type Cart = { items:CartItem[] };

function money(amount: number) { return new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR' }).format(amount / 100); }

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [token, setToken] = useState(localStorage.getItem('commerce_token') || '');
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [notice, setNotice] = useState(''); const [busy, setBusy] = useState(false); const [showLogin, setShowLogin] = useState(false);
  const cartCount = useMemo(() => cart?.items.reduce((total, item) => total + item.quantity, 0) || 0, [cart]);

  async function request(path:string, options:RequestInit = {}) {
    const headers: Record<string,string> = { 'Content-Type':'application/json', ...(options.headers as Record<string,string> || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(`${API}${path}`, { ...options, headers });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || 'Something went wrong.');
    return body;
  }
  async function loadProducts() { try { const result = await request('/products'); setProducts(result.data); } catch (e) { setNotice(e instanceof Error ? e.message : 'Could not load products. Is the API running?'); } }
  async function loadCart() { if (!token) return setCart(null); try { setCart(await request('/cart')); } catch { logout(); } }
  useEffect(() => { void loadProducts(); }, []);
  useEffect(() => { void loadCart(); }, [token]);
  function logout() { localStorage.removeItem('commerce_token'); setToken(''); setCart(null); setNotice('You have signed out.'); }
  async function login(event:FormEvent) { event.preventDefault(); setBusy(true); try { const result = await request('/auth/login', {method:'POST', body:JSON.stringify({email,password})}); localStorage.setItem('commerce_token', result.token); setToken(result.token); setShowLogin(false); setNotice(`Welcome back, ${result.user.email}.`); } catch (e) { setNotice(e instanceof Error ? e.message : 'Login failed.'); } finally { setBusy(false); } }
  async function addToCart(productId:string) { if (!token) { setShowLogin(true); setNotice('Please sign in before adding items.'); return; } setBusy(true); try { await request('/cart/items', {method:'POST', body:JSON.stringify({productId,quantity:1})}); await loadCart(); setNotice('Item added to your cart.'); } catch (e) { setNotice(e instanceof Error ? e.message : 'Could not add the item.'); } finally { setBusy(false); } }
  async function checkout() { setBusy(true); try { const order = await request('/orders/checkout', {method:'POST'}); await loadCart(); setNotice(`Order ${order.id.slice(-6)} created successfully.`); } catch (e) { setNotice(e instanceof Error ? e.message : 'Checkout failed.'); } finally { setBusy(false); } }

  return <><header><a className="brand" href="#top">commerce<span>core</span></a><nav><a href="#products">Shop</a><button className="link" onClick={() => token ? logout() : setShowLogin(true)}>{token ? 'Sign out' : 'Sign in'}</button><button className="cart-button" onClick={() => document.getElementById('cart')?.scrollIntoView()} aria-label="Open cart">Cart <b>{cartCount}</b></button></nav></header>
    <main id="top"><section className="hero"><p className="eyebrow">FULL-STACK DEMO STORE</p><h1>Everyday tech,<br/><em>better chosen.</em></h1><p className="hero-copy">A React storefront connected to the CommerceCore Express and PostgreSQL API.</p><a className="primary" href="#products">Explore products <span>→</span></a></section>
      {notice && <p className="notice" role="status">{notice}<button onClick={() => setNotice('')}>×</button></p>}
      <section id="products" className="catalog"><div className="section-heading"><div><p className="eyebrow">CATALOG</p><h2>Featured products</h2></div><p>{products.length} item{products.length === 1 ? '' : 's'} available</p></div><div className="product-grid">{products.map((product, index) => <article className="product" key={product.id}><div className={`product-art art-${index % 3}`}><span>{product.category.name}</span><div className="headphone">◖◗</div></div><div className="product-info"><p>{product.category.name}</p><h3>{product.name}</h3><p className="description">{product.description}</p><div><strong>{money(product.price)}</strong><button disabled={busy || product.inventory === 0} onClick={() => void addToCart(product.id)}>{product.inventory ? 'Add to cart' : 'Sold out'}</button></div></div></article>)}</div></section>
      <section id="cart" className="cart"><div><p className="eyebrow">YOUR CART</p><h2>{cartCount ? `${cartCount} item${cartCount === 1 ? '' : 's'} ready` : 'Your cart is empty'}</h2>{cart?.items.map(item => <p className="cart-item" key={item.id}>{item.product.name} <span>×{item.quantity} · {money(item.product.price * item.quantity)}</span></p>)}</div><button className="primary" disabled={!cartCount || busy} onClick={() => void checkout()}>Checkout <span>→</span></button></section>
    </main><footer>CommerceCore • React, TypeScript, Express, Prisma & PostgreSQL</footer>
    {showLogin && <div className="modal-backdrop" onMouseDown={() => setShowLogin(false)}><form className="login-card" onSubmit={login} onMouseDown={e=>e.stopPropagation()}><button className="close" type="button" onClick={() => setShowLogin(false)}>×</button><p className="eyebrow">ACCOUNT</p><h2>Welcome back</h2><p>Demo admin: <code>admin@commercecore.dev</code><br/>Password: <code>Admin123!</code></p><label>Email<input required type="email" value={email} onChange={e => setEmail(e.target.value)} /></label><label>Password<input required minLength={8} type="password" value={password} onChange={e => setPassword(e.target.value)} /></label><button className="primary full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'} <span>→</span></button></form></div>}
  </>;
}
