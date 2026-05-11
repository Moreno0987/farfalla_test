import Link from "next/link";

interface CategoryCardProps {
  icon: string;
  tag: string;
  title: string;
  desc: string;
  price: string;
  href: string;
  terlaris?: boolean;
}

export default function CategoryCard({ 
  icon, 
  tag, 
  title, 
  desc, 
  price, 
  href, 
  terlaris 
}: CategoryCardProps) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div className="pcard" style={{ 
        padding: "1.25rem 1rem", 
        cursor: "pointer", 
        borderColor: terlaris ? "var(--bali-tan)" : "#EDE4D6", 
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderWidth: "1px",
        borderStyle: "solid",
        borderRadius: "8px",
        transition: "all 0.2s ease"
      }}>
        {terlaris && (
          <div className="tag tag-gold" style={{ 
            marginBottom: "0.75rem", 
            display: "inline-block", 
            alignSelf: "flex-start" 
          }}>
            Terlaris
          </div>
        )}
        
        <div style={{ 
          fontSize: 32, 
          marginBottom: "0.75rem", 
          color: "var(--bali-tan)" 
        }}>
          {icon}
        </div>
        
        <span className="tag tag-gold" style={{ 
          marginBottom: "0.5rem", 
          display: "inline-block",
          alignSelf: "flex-start"
        }}>
          {tag}
        </span>
        
        <h3 className="serif" style={{ 
          fontSize: 20, 
          fontWeight: 400, 
          margin: "0.5rem 0 0.25rem", 
          fontStyle: "italic",
          color: "#1C1208"
        }}>
          {title}
        </h3>
        
        <p style={{ 
          fontSize: 11, 
          color: "var(--bali-tan)", 
          lineHeight: 1.6, 
          margin: "0 0 1rem",
          flexGrow: 1
        }}>
          {desc}
        </p>
        
        <p style={{ 
          fontSize: 11, 
          color: "var(--bali-gold)", 
          fontWeight: 500, 
          letterSpacing: "0.06em",
          margin: 0
        }}>
          {price}
        </p>
      </div>
    </Link>
  );
}