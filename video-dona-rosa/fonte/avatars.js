// Faceless editorial-style bust portraits. avatar(opts) -> SVG string (viewBox 0 0 200 200, circular crop)
const shade = (hex, p) => { const n = parseInt(hex.slice(1), 16); const f = v => Math.round(p < 0 ? v * (1 + p) : v + (255 - v) * p);
  return '#' + [n >> 16, n >> 8 & 255, n & 255].map(f).map(v => v.toString(16).padStart(2, '0')).join(''); };
let AVN = 0;
function avatar(o) {
  const id = 'av' + (AVN++);
  const skin = o.skin || '#C68642', skD = shade(skin, -.2), skL = shade(skin, .12);
  const top = o.top || '#4A90D9', topD = shade(top, -.22), topL = shade(top, .15);
  const hc = o.hairC || '#24170F', hcL = shade(hc, .35);
  const bg = o.bg || '#2A2F5C';
  const torso = `<path d="M18 206 C20 162 50 143 86 138 Q100 147 114 138 C150 143 180 162 182 206Z" fill="${top}"/>
                 <path d="M140 146 C162 156 180 172 182 206 L150 206 C152 182 150 162 140 146Z" fill="#000" opacity=".12"/>`;
  const neck = `<path d="M87 108 L87 141 Q100 151 113 141 L113 108Z" fill="${skD}"/>`;
  const head = `<ellipse cx="72" cy="90" rx="6.5" ry="10" fill="${skin}"/><ellipse cx="128" cy="90" rx="6.5" ry="10" fill="${skD}"/>
    <path d="M72 86 C72 57 84 43 100 43 C116 43 128 57 128 86 C128 109 116 123 100 123 C84 123 72 109 72 86Z" fill="${skin}"/>
    <path d="M112 47 C124 56 128 71 128 86 C128 107 118 121 103 123 C116 106 120 72 112 47Z" fill="#000" opacity=".09"/>
    <path d="M78 66 C80 54 88 47 97 46" stroke="${skL}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".5"/>`;
  const C = { // clothing details
    dress: `<path d="M74 140 Q100 168 126 140" stroke="${topD}" stroke-width="5" fill="none"/>`,
    apron: `<path d="M70 206 L74 160 Q100 172 126 160 L130 206Z" fill="${o.apronC || '#FFF4E0'}"/><path d="M80 141 L76 162 M120 141 L124 162" stroke="${o.apronC || '#FFF4E0'}" stroke-width="7"/>`,
    tee: `<path d="M84 139 Q100 156 116 139" stroke="${topD}" stroke-width="6" fill="none"/>`,
    polo: `<path d="M86 139 L100 160 L114 139" fill="${topL}"/><path d="M100 160 V190" stroke="${topD}" stroke-width="3"/><circle cx="100" cy="172" r="2.5" fill="${topD}"/>`,
    suit: `<path d="M88 139 L100 172 L112 139Z" fill="#fff"/><path d="M96 146 L104 146 L107 190 L100 200 L93 190Z" fill="${o.tie || '#D7263D'}"/>
           <path d="M86 138 L100 172 L66 206 L48 206 C54 170 66 150 86 138Z" fill="${topD}"/><path d="M114 138 L100 172 L134 206 L152 206 C146 170 134 150 114 138Z" fill="${topD}"/>`,
    vest: `<path d="M50 206 C52 170 66 150 88 140 L96 206Z M150 206 C148 170 134 150 112 140 L104 206Z" fill="#FF8A1F"/><path d="M58 180 L94 184 M142 180 L106 184" stroke="#E8F0F2" stroke-width="7"/>`,
    plaid: `<path d="M60 160 V206 M80 146 V206 M120 146 V206 M140 160 V206 M30 180 H170 M24 196 H176" stroke="${topD}" stroke-width="5" opacity=".55"/><path d="M86 139 L100 156 L114 139" fill="${topD}"/>`,
    jacket: `<path d="M86 138 L100 206 L114 138" fill="${o.under || '#F4F4F4'}"/><path d="M86 138 L98 206 M114 138 L102 206" stroke="${topD}" stroke-width="5"/>`,
  };
  const tag = o.tag ? `<rect x="118" y="168" width="40" height="16" rx="4" fill="#fff"/><rect x="122" y="173" width="24" height="5" rx="2" fill="${topD}"/>` : '';
  const H = {
    turban: { back: `<path d="M70 98 C60 92 62 76 70 70 L74 96Z M130 98 C140 92 138 76 130 70 L126 96Z" fill="${hc}"/>`,
      front: `<path d="M64 84 C56 40 84 18 106 20 C136 22 150 48 138 86 C134 66 122 56 100 56 C80 56 68 66 64 84Z" fill="${o.wrapC || '#E4572E'}"/>
        <path d="M64 84 C62 60 74 44 92 38 C80 52 74 66 72 82Z" fill="#000" opacity=".12"/>
        <path d="M84 24 C96 4 128 6 128 26 C138 18 150 30 140 42 C132 30 112 26 96 34Z" fill="${shade(o.wrapC || '#E4572E', -.12)}"/>
        <path d="M70 60 C90 44 116 42 136 58" stroke="${o.wrapC2 || '#FFD23F'}" stroke-width="7" fill="none" stroke-linecap="round"/>
        ${[[86, 36], [110, 32], [124, 46], [76, 52], [100, 46], [118, 70], [130, 62]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.6" fill="${o.wrapC2 || '#FFD23F'}"/>`).join('')}
        <circle cx="70" cy="106" r="7" fill="none" stroke="#F2C14E" stroke-width="3.5"/><circle cx="130" cy="106" r="7" fill="none" stroke="#F2C14E" stroke-width="3.5"/>` },
    longwave: { back: `<path d="M64 90 C56 48 80 34 102 34 C126 34 146 52 138 92 C144 122 138 150 130 162 L70 162 C58 140 58 116 64 90Z" fill="${hc}"/>`,
      front: `<path d="M71 82 C70 54 86 42 104 42 C122 42 134 58 130 84 C124 66 112 56 96 60 C86 62 76 70 71 82Z" fill="${hc}"/>
        <path d="M118 46 C130 54 136 70 132 92" stroke="${hcL}" stroke-width="4" fill="none" opacity=".5" stroke-linecap="round"/>` },
    pony: { back: `<path d="M126 70 C150 74 154 108 140 130 C136 112 132 96 124 86Z" fill="${hc}"/>`,
      front: `<path d="M71 84 C68 52 86 40 102 40 C122 40 134 56 130 82 C122 64 110 58 98 58 C86 58 76 68 71 84Z" fill="${hc}"/><path d="M84 50 C96 44 112 44 122 52" stroke="${hcL}" stroke-width="4" fill="none" opacity=".45" stroke-linecap="round"/>` },
    short: { back: '', front: `<path d="M70 82 C66 50 86 36 104 38 C126 40 136 56 130 82 C126 66 118 58 104 58 C92 58 80 66 72 82Z" fill="${hc}"/><path d="M90 44 C102 40 116 44 124 52" stroke="${hcL}" stroke-width="4" fill="none" opacity=".4" stroke-linecap="round"/>` },
    afro: { back: `<g fill="${hc}">${[[70, 60, 20], [86, 44, 22], [106, 40, 22], [124, 50, 20], [134, 68, 18], [66, 80, 16], [134, 86, 14], [100, 50, 24]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>`,
      front: `<path d="M74 78 C78 62 90 56 100 56 C112 56 122 62 126 78 C118 70 108 68 100 68 C92 68 82 70 74 78Z" fill="${hc}"/>` },
    bald: { back: '', front: `<path d="M72 92 C70 76 72 66 76 60 L80 92Z M128 92 C130 76 128 66 124 60 L120 92Z" fill="${hc}"/><ellipse cx="92" cy="54" rx="12" ry="6" fill="#fff" opacity=".22"/>` },
    slick: { back: '', front: `<path d="M69 80 C64 46 88 34 108 36 C128 38 136 56 131 78 C124 60 110 54 94 56 C82 58 74 66 69 80Z" fill="${hc}"/><path d="M84 46 C100 40 118 44 128 58" stroke="#fff" stroke-width="3" fill="none" opacity=".35"/>` },
    cap: { back: '', front: `<path d="M72 84 C70 70 72 64 76 60 L80 84Z" fill="${hc}"/><path d="M69 72 C68 44 86 34 100 34 C116 34 132 44 131 72Z" fill="${o.capC || '#2B6CB0'}"/>
        <path d="M58 74 Q98 60 142 72 Q100 82 58 74Z" fill="${shade(o.capC || '#2B6CB0', -.28)}"/><circle cx="100" cy="35" r="4" fill="${shade(o.capC || '#2B6CB0', -.2)}"/>
        <path d="M76 54 C86 42 98 38 108 38" stroke="#fff" stroke-width="3.5" opacity=".3" fill="none"/>` },
    helmet: { back: '', front: `<path d="M64 76 C64 42 82 30 100 30 C118 30 136 42 136 76Z" fill="#FFC531"/><path d="M92 30 h16 v46 h-16z" fill="#E6A800"/>
        <rect x="56" y="72" width="88" height="11" rx="5.5" fill="#E6A800"/><path d="M72 58 C76 44 86 36 96 34" stroke="#fff" stroke-width="4" opacity=".45" fill="none" stroke-linecap="round"/>` },
    straw: { back: '', front: `<ellipse cx="100" cy="72" rx="64" ry="13" fill="#E3C27A"/><path d="M70 72 C70 40 84 30 100 30 C116 30 130 40 130 72Z" fill="#EBD192"/>
        <rect x="70" y="58" width="60" height="9" fill="#B5462E"/><path d="M40 72 Q100 88 160 72" stroke="#C9A55E" stroke-width="3" fill="none"/>
        <path d="M78 46 l8 18 M92 38 l6 20 M108 38 l-2 20 M122 46 l-6 18" stroke="#D8B66C" stroke-width="2.5"/>` },
  }[o.hair || 'short'];
  const beard = o.beard ? `<path d="M73 94 C74 116 86 129 100 129 C114 129 126 116 127 94 C121 106 111 111 100 111 C89 111 79 106 73 94Z" fill="${o.beardC || hc}"/>` : '';
  const stache = o.stache ? `<path d="M86 104 Q93 98 100 102 Q107 98 114 104 Q107 108 100 106 Q93 108 86 104Z" fill="${o.beardC || hc}"/>` : '';
  const glasses = o.glasses ? `<rect x="78" y="80" width="18" height="13" rx="4" fill="none" stroke="#2A2A33" stroke-width="3"/><rect x="104" y="80" width="18" height="13" rx="4" fill="none" stroke="#2A2A33" stroke-width="3"/><path d="M96 85 h8" stroke="#2A2A33" stroke-width="3"/>` : '';
  const shades = o.shades ? `<rect x="76" y="79" width="21" height="14" rx="5" fill="#111"/><rect x="103" y="79" width="21" height="14" rx="5" fill="#111"/><path d="M97 84 h6" stroke="#111" stroke-width="3"/><path d="M80 83 l7 0" stroke="#fff" stroke-width="2" opacity=".5"/>` : '';
  const watchBadge = '';
  return `<svg viewBox="0 0 200 200" width="100%" height="100%"><defs><clipPath id="${id}c"><circle cx="100" cy="100" r="100"/></clipPath>
      <radialGradient id="${id}g" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="${shade(bg, .18)}"/><stop offset="1" stop-color="${bg}"/></radialGradient></defs>
    <g clip-path="url(#${id}c)"><rect width="200" height="200" fill="url(#${id}g)"/>
      ${H.back}${torso}${(o.clothes || ['tee']).map(c => C[c]).join('')}${tag}${neck}${head}${beard}${stache}${glasses}${shades}${H.front}</g></svg>`;
}
const PEOPLE = {
  rosa:  { hair: 'turban', wrapC: '#E4572E', wrapC2: '#FFD23F', skin: '#8D5524', top: '#E4572E', clothes: ['dress', 'apron'], bg: '#FF8A65' },
  jorge: { hair: 'bald', hairC: '#9A9A9A', skin: '#C68642', top: '#2E9E5B', clothes: ['polo'], beard: true, beardC: '#6B6B6B', bg: '#3DDC97', tag: true },
  ana:   { hair: 'longwave', hairC: '#4A2A18', skin: '#E0AC69', top: '#2E9E5B', clothes: ['polo'], bg: '#7FD8FF', tag: true },
  atac:  { hair: 'short', hairC: '#2E2A26', skin: '#F1C27D', top: '#3D5A80', clothes: ['jacket'], glasses: true, bg: '#FFD23F' },
  mot:   { hair: 'cap', capC: '#E4572E', skin: '#A0663A', top: '#5C6B8A', clothes: ['tee'], beard: true, hairC: '#24170F', bg: '#B794F6' },
  fab:   { hair: 'pony', hairC: '#24170F', skin: '#8D5524', top: '#FFFFFF', clothes: ['jacket'], under: '#2B6CB0', glasses: true, bg: '#FF8FB1' },
  op:    { hair: 'helmet', skin: '#6B3E1F', top: '#2B6CB0', clothes: ['tee', 'vest'], bg: '#FFB86B' },
  agri:  { hair: 'straw', skin: '#A0663A', top: '#C0392B', clothes: ['plaid'], stache: true, hairC: '#3A2A1E', bg: '#9BE564' },
  rico:  { hair: 'slick', hairC: '#B8BAC6', skin: '#F1C27D', top: '#1F2A4D', clothes: ['suit'], shades: true, bg: '#3A3F75' },
  filho: { hair: 'cap', capC: '#2B6CB0', skin: '#7A4A20', top: '#FFC93C', clothes: ['tee'], bg: '#7FD8FF', tag: true },
};
if (typeof module !== 'undefined') module.exports = { avatar, PEOPLE };
