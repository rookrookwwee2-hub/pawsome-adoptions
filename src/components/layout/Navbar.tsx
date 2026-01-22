import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Heart, User, LogOut, Settings, ChevronDown, Cat, Dog, Package, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/contexts/CartContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import CurrencySelector from "@/components/cart/CurrencySelector";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SocialIcons } from "@/components/shared/SocialIcons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();
  const { items, removeFromCart, getTotal, formatPrice } = useCart();
  
  const cartItemCount = items.length;
  const cartTotal = getTotal();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Adopt", path: "/pets" },
    { name: "Reviews", path: "/reviews" },
    { name: "Foster", path: "/foster" },
    { name: "Donate", path: "/donate" },
    { name: "About", path: "/about" },
  ];

  const breedLinks = [
    { name: "Cat Breeds", path: "/cat-breeds", icon: Cat },
    { name: "Dog Breeds", path: "/dog-breeds", icon: Dog },
  ];

  const moreLinks = [
    { name: "Delivery Options", path: "/delivery-options" },
    { name: "Health Guarantee", path: "/health-guarantee" },
    { name: "Emotional Support", path: "/emotional-support" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
              <Heart className="w-5 h-5 text-primary-foreground fill-current" />
            </div>
            <span className="font-display text-2xl font-bold text-foreground">
              Pawsfam
            </span>
          </Link>

          {/* Always visible Theme Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              link.name === "Reviews" ? (
                <Link
                  key={link.name}
                  to={link.path}
                  className="font-body font-medium px-3 py-1.5 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
                >
                  {link.name}
                </Link>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`font-body font-medium transition-colors link-underline ${
                    isActive(link.path)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              )
            ))}
            
            {/* Breeds Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 font-body font-medium text-muted-foreground hover:text-foreground transition-colors">
                Breeds <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                {breedLinks.map((link) => (
                  <DropdownMenuItem key={link.path} asChild>
                    <Link to={link.path} className="flex items-center gap-2">
                      <link.icon className="w-4 h-4" />
                      {link.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* More Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 font-body font-medium text-muted-foreground hover:text-foreground transition-colors">
                More <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                {moreLinks.map((link) => (
                  <DropdownMenuItem key={link.path} asChild>
                    <Link to={link.path}>{link.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Dynamic Social Icons */}
            <SocialIcons iconSize="sm" className="mr-2" />
            <CurrencySelector />
            <ThemeToggle />
            
            {/* Cart Icon with Hover Preview */}
            <HoverCard openDelay={100} closeDelay={200}>
              <HoverCardTrigger asChild>
                <Button variant="ghost" size="icon" asChild className="rounded-full relative">
                  <Link to="/checkout">
                    <ShoppingCart className="w-5 h-5" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                        {cartItemCount > 9 ? "9+" : cartItemCount}
                      </span>
                    )}
                  </Link>
                </Button>
              </HoverCardTrigger>
              <HoverCardContent align="end" className="w-80 p-0 bg-background border shadow-lg z-50">
                <div className="p-4">
                  <h4 className="font-semibold text-sm mb-3">
                    Shopping Cart ({cartItemCount} {cartItemCount === 1 ? "item" : "items"})
                  </h4>
                  
                  {cartItemCount === 0 ? (
                    <div className="text-center py-6">
                      <ShoppingCart className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Your cart is empty</p>
                      <Button asChild size="sm" className="mt-3 rounded-full">
                        <Link to="/pets">Browse Pets</Link>
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {items.slice(0, 3).map((item) => (
                          <div key={item.petId} className="flex gap-3 items-start">
                            {item.petImage && (
                              <img
                                src={item.petImage}
                                alt={item.petName}
                                className="w-12 h-12 rounded-lg object-cover shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{item.petName}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.isReservation ? "30% Deposit" : "Full Adoption"}
                              </p>
                              <p className="text-sm font-semibold text-primary">
                                {formatPrice(
                                  item.isReservation && item.reservationDeposit
                                    ? item.reservationDeposit
                                    : item.basePrice
                                )}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                              onClick={(e) => {
                                e.preventDefault();
                                removeFromCart(item.petId);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        {items.length > 3 && (
                          <p className="text-xs text-muted-foreground text-center py-1">
                            +{items.length - 3} more item{items.length - 3 > 1 ? "s" : ""}
                          </p>
                        )}
                      </div>
                      
                      <Separator className="my-3" />
                      
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-muted-foreground">Subtotal</span>
                        <span className="font-bold text-primary">{formatPrice(cartTotal)}</span>
                      </div>
                      
                      <Button asChild className="w-full rounded-full" size="sm">
                        <Link to="/checkout">Proceed to Checkout</Link>
                      </Button>
                    </>
                  )}
                </div>
              </HoverCardContent>
            </HoverCard>
            
            {user ? (
              <>
                {isAdmin && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/admin"><Settings className="w-4 h-4 mr-2" />Admin</Link>
                  </Button>
                )}
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/orders"><Package className="w-4 h-4 mr-2" />Orders</Link>
                </Button>
                <Button variant="ghost" size="icon" asChild className="rounded-full">
                  <Link to="/account"><User className="w-5 h-5" /></Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={handleSignOut} className="rounded-full">
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="icon" asChild className="rounded-full">
                <Link to="/auth"><User className="w-5 h-5" /></Link>
              </Button>
            )}
            <Button asChild className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/pets">Start Adopting</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`font-body font-medium py-2 transition-colors ${
                    isActive(link.path)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="border-t border-border pt-4 mt-2">
                <p className="text-xs text-muted-foreground uppercase mb-2">Breeds</p>
                {breedLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 font-body font-medium py-2 text-muted-foreground hover:text-foreground"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="border-t border-border pt-4 mt-2">
                <p className="text-xs text-muted-foreground uppercase mb-2">More</p>
                {moreLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="font-body font-medium py-2 block text-muted-foreground hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Cart Link */}
              <Link 
                to="/checkout" 
                onClick={() => setIsOpen(false)} 
                className="flex items-center justify-between py-2 border-t border-border mt-2 pt-4"
              >
                <span className="font-body font-medium text-muted-foreground flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Cart
                </span>
                {cartItemCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              <div className="flex items-center justify-between py-2 border-t border-border mt-2 pt-4">
                <span className="font-body font-medium text-muted-foreground">Currency</span>
                <CurrencySelector />
              </div>
              {user ? (
                <>
                  <Link to="/account" onClick={() => setIsOpen(false)} className="font-body font-medium py-2 text-muted-foreground">
                    Account Settings
                  </Link>
                  <Link to="/orders" onClick={() => setIsOpen(false)} className="font-body font-medium py-2 text-muted-foreground flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Order History
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setIsOpen(false)} className="font-body font-medium py-2 text-muted-foreground">
                      Admin Dashboard
                    </Link>
                  )}
                  <Button variant="outline" onClick={handleSignOut} className="w-full mt-2">
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button asChild variant="outline" className="w-full mt-2">
                  <Link to="/auth" onClick={() => setIsOpen(false)}>Sign In</Link>
                </Button>
              )}
              <Button asChild className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/pets" onClick={() => setIsOpen(false)}>Start Adopting</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
