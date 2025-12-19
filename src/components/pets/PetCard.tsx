import { Link } from "react-router-dom";
import { Heart, MapPin } from "lucide-react";
import { useState } from "react";

interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  location: string;
  image: string;
  fee: number;
}

interface PetCardProps {
  pet: Pet;
}

const PetCard = ({ pet }: PetCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Link to={`/pets/${pet.id}`} className="block group">
      <article className="bg-card rounded-2xl overflow-hidden shadow-soft card-hover">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
          <img
            src={pet.image}
            alt={pet.name}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
          
          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
            className="absolute top-4 right-4 w-10 h-10 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:scale-110 hover:bg-background"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isFavorite ? "fill-primary text-primary" : "text-muted-foreground"
              }`}
            />
          </button>

          {/* Type Badge */}
          <div className="absolute bottom-4 left-4">
            <span className="px-3 py-1 bg-background/90 backdrop-blur-sm rounded-full text-sm font-medium">
              {pet.type}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-display text-xl font-semibold group-hover:text-primary transition-colors">
                {pet.name}
              </h3>
              <p className="text-muted-foreground text-sm">{pet.breed}</p>
            </div>
            <span className="text-primary font-semibold">${pet.fee}</span>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{pet.age}</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {pet.location}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default PetCard;
