// ÉLAN — Product Catalog
const PRODUCTS = [
  {
    id: 'aria-slip',
    name: 'Aria Slip Dress',
    price: 189,
    category: 'Dresses',
    season: 'AW26',
    color: 'Champagne',
    composition: '100% Mulberry Silk',
    description: 'A bias-cut slip dress that moves like liquid. Crafted from heavyweight mulberry silk with delicate French seams and an adjustable spaghetti strap.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&h=1200&fit=crop&q=85',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&h=1200&fit=crop&q=85',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&h=1200&fit=crop&q=85'
    ],
    badge: 'New'
  },
  {
    id: 'monolith-trench',
    name: 'Monolith Trench Coat',
    price: 429,
    category: 'Outerwear',
    season: 'AW26',
    color: 'Bone',
    composition: 'Cotton Gabardine, Silk Lining',
    description: 'A modernist take on the trench. Architectural shoulders, raw-edged storm flap, and a belted waist that cinches with intent.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=900&h=1200&fit=crop&q=85',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&h=1200&fit=crop&q=85',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&h=1200&fit=crop&q=85'
    ],
    badge: 'Editor’s Pick'
  },
  {
    id: 'pleated-midi',
    name: 'Pleated Midi Skirt',
    price: 159,
    category: 'Skirts',
    season: 'AW26',
    color: 'Ink',
    composition: 'Recycled Polyester Crepe',
    description: 'Knife-pleated skirt with a high waistband and concealed side zip. Falls below the knee with a kinetic, almost percussive movement.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1581338834647-b0fb40704e21?w=900&h=1200&fit=crop&q=85',
      'https://images.unsplash.com/photo-1551803091-e20673f15770?w=900&h=1200&fit=crop&q=85',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&h=1200&fit=crop&q=85'
    ]
  },
  {
    id: 'crossover-knit',
    name: 'Crossover Knit Top',
    price: 129,
    category: 'Knitwear',
    season: 'AW26',
    color: 'Cream',
    composition: 'Merino Wool',
    description: 'A featherweight merino top with a draped crossover front. Long sleeves taper to a fitted cuff.',
    sizes: ['XS', 'S', 'M', 'L'],
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900&h=1200&fit=crop&q=85',
      'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=900&h=1200&fit=crop&q=85',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&h=1200&fit=crop&q=85'
    ]
  },
  {
    id: 'wideleg-trouser',
    name: 'Wide-Leg Trouser',
    price: 199,
    category: 'Trousers',
    season: 'AW26',
    color: 'Charcoal',
    composition: 'Italian Wool Twill',
    description: 'A sweeping wide-leg trouser cut from heavyweight wool twill. Pleated front, slanted pockets, and a clean break over the shoe.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&h=1200&fit=crop&q=85',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&h=1200&fit=crop&q=85',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900&h=1200&fit=crop&q=85'
    ],
    badge: 'New'
  },
  {
    id: 'cashmere-wrap',
    name: 'Cashmere Wrap Coat',
    price: 349,
    category: 'Outerwear',
    season: 'AW26',
    color: 'Camel',
    composition: '90% Cashmere, 10% Wool',
    description: 'An unstructured wrap coat that feels like an embrace. Self-tie belt, dropped shoulder, and side pockets deep enough to disappear into.',
    sizes: ['One Size'],
    images: [
      'https://images.unsplash.com/photo-1551803091-e20673f15770?w=900&h=1200&fit=crop&q=85',
      'https://images.unsplash.com/photo-1581338834647-b0fb40704e21?w=900&h=1200&fit=crop&q=85',
      'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=900&h=1200&fit=crop&q=85'
    ]
  },
  {
    id: 'shirt-dress',
    name: 'Linen Shirt Dress',
    price: 169,
    category: 'Dresses',
    season: 'AW26',
    color: 'Stone',
    composition: 'Belgian Linen',
    description: 'An oversized shirt dress in washed Belgian linen. Wear it open over swimwear or buttoned with a leather belt.',
    sizes: ['XS', 'S', 'M', 'L'],
    images: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&h=1200&fit=crop&q=85',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&h=1200&fit=crop&q=85',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&h=1200&fit=crop&q=85'
    ]
  },
  {
    id: 'tailored-blazer',
    name: 'Tailored Blazer',
    price: 279,
    category: 'Tailoring',
    season: 'AW26',
    color: 'Black',
    composition: 'Wool Crepe',
    description: 'A single-breasted blazer with sharp shoulders, a nipped waist, and a clean finish. The piece your wardrobe orbits around.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&h=1200&fit=crop&q=85',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&h=1200&fit=crop&q=85',
      'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=900&h=1200&fit=crop&q=85'
    ],
    badge: 'Bestseller'
  },
  {
    id: 'mohair-sweater',
    name: 'Oversized Mohair Sweater',
    price: 239,
    category: 'Knitwear',
    season: 'AW26',
    color: 'Dusk',
    composition: 'Mohair, Silk Blend',
    description: 'A halo of soft mohair with a relaxed silhouette. Drop shoulders, ribbed cuffs, and a wide neckline that slips to expose a collarbone.',
    sizes: ['XS', 'S', 'M', 'L'],
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&h=1200&fit=crop&q=85',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900&h=1200&fit=crop&q=85',
      'https://images.unsplash.com/photo-1551803091-e20673f15770?w=900&h=1200&fit=crop&q=85'
    ]
  },
  {
    id: 'bias-maxi',
    name: 'Bias-Cut Maxi Dress',
    price: 259,
    category: 'Dresses',
    season: 'AW26',
    color: 'Wine',
    composition: 'Silk Satin',
    description: 'A floor-skimming bias-cut maxi in low-luster silk satin. Cowl neckline, open back, hand-rolled hem.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&h=1200&fit=crop&q=85',
      'https://images.unsplash.com/photo-1581338834647-b0fb40704e21?w=900&h=1200&fit=crop&q=85',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&h=1200&fit=crop&q=85'
    ],
    badge: 'New'
  },
  {
    id: 'silk-shirt',
    name: 'Fluid Silk Shirt',
    price: 149,
    category: 'Tops',
    season: 'AW26',
    color: 'Ivory',
    composition: '100% Silk Charmeuse',
    description: 'A liquid silk shirt that drapes in the air. Mother-of-pearl buttons, hidden placket, and a softly rounded collar.',
    sizes: ['XS', 'S', 'M', 'L'],
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900&h=1200&fit=crop&q=85',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&h=1200&fit=crop&q=85',
      'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=900&h=1200&fit=crop&q=85'
    ]
  },
  {
    id: 'leather-skirt',
    name: 'Vegan Leather Skirt',
    price: 179,
    category: 'Skirts',
    season: 'AW26',
    color: 'Espresso',
    composition: 'Recycled Vegan Leather',
    description: 'A high-waisted A-line skirt in supple recycled vegan leather. Hits just above the knee with a rear vent.',
    sizes: ['XS', 'S', 'M', 'L'],
    images: [
      'https://images.unsplash.com/photo-1551803091-e20673f15770?w=900&h=1200&fit=crop&q=85',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&h=1200&fit=crop&q=85',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&h=1200&fit=crop&q=85'
    ]
  }
];

const CATEGORIES = ['All', 'Dresses', 'Outerwear', 'Tailoring', 'Knitwear', 'Tops', 'Trousers', 'Skirts'];

if (typeof window !== 'undefined') {
  window.PRODUCTS = PRODUCTS;
  window.CATEGORIES = CATEGORIES;
  window.getProduct = (id) => PRODUCTS.find(p => p.id === id);
  window.formatPrice = (n) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0 });
}
