import "./BrandSlider.css";

const brands = [
  { name: "Nike", img: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" },
  { name: "Adidas", img: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg" },
  { name: "Puma", img: "https://static.vecteezy.com/system/resources/previews/022/076/746/non_2x/puma-logo-and-art-free-vector.jpg" },
  { name: "Zara", img: "https://www.logo.wine/a/logo/Zara_(retailer)/Zara_(retailer)-Logo.wine.svg" },
  { name: "H&M", img: "https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg" },
  { name: "Levi's", img: "https://e7.pngegg.com/pngimages/269/82/png-clipart-logo-levi-strauss-co-brand-jeans-jeans-text-label.png" },
  { name: "Gucci", img: "https://i.pinimg.com/564x/d4/a0/09/d4a009e8bf35eaff5c498a2dab6392b8.jpg" },
  { name: "Reebok", img: "https://logos-world.net/wp-content/uploads/2020/04/Reebok-Logo.png" },
  { name: "Under Armour ", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAiemJT06IuEqAVvW24tQd4vGybRjvT_v22Q&s" },
  { name: "Uniqlo", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStW_pjJEzmmxSmqP1r5le-exJZ_e36cG2WVA&s" },
];

const BrandSlider = () => {
  return (
    <div className="brand-wrapper">
      <h3 className="section-title">OUR BRANDS</h3>

      <div className="brand-marquee">
        <div className="brand-track">
          {[...brands, ...brands].map((b, i) => (
            <div className="brand-card" key={i}>
              <img src={b.img} alt={b.name} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandSlider;
