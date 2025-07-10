
import React from 'react';
import { Github, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-white/10 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold gradient-text">StudioLink</h3>
            <p className="text-muted-foreground text-sm">
              The premier community for designers and architects to showcase, connect, and collaborate.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Community</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Explore Projects</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Featured Designers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Design Challenges</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Community Guidelines</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Freelance Hub</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Portfolio Reviews</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Mentorship</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Career Board</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © 2024 StudioLink. All rights reserved.
          </p>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-4 md:mt-0">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-400 fill-current" />
            <span>for the design community</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
