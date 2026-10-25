/* Expressions de Pi : copiées telles quelles depuis reference/route-epfl.html (objet FACES). */
export const FACES = {
 idle:`<g class="lid"><ellipse cx="140" cy="78" rx="9" ry="11" fill="#fff"/><ellipse cx="180" cy="78" rx="9" ry="11" fill="#fff"/><circle cx="142" cy="80" r="5" fill="#0D1B3E"/><circle cx="182" cy="80" r="5" fill="#0D1B3E"/><circle cx="144" cy="77" r="1.6" fill="#fff"/><circle cx="184" cy="77" r="1.6" fill="#fff"/></g>
   <path d="M150 100 Q160 109 170 100" stroke="#0D1B3E" stroke-width="3.5" fill="none" stroke-linecap="round"/>
   <ellipse cx="127" cy="96" rx="7" ry="4" fill="#FF8FB1" opacity=".55"/><ellipse cx="193" cy="96" rx="7" ry="4" fill="#FF8FB1" opacity=".55"/>`,
 happy:`<path d="M131 82 Q140 70 149 82" stroke="#0D1B3E" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M171 82 Q180 70 189 82" stroke="#0D1B3E" stroke-width="4" fill="none" stroke-linecap="round"/>
   <path d="M146 96 Q160 118 174 96 Z" fill="#0D1B3E"/><path d="M152 104 Q160 112 168 104" fill="#FF7A9C"/>
   <ellipse cx="125" cy="94" rx="8" ry="4.5" fill="#FF8FB1" opacity=".7"/><ellipse cx="195" cy="94" rx="8" ry="4.5" fill="#FF8FB1" opacity=".7"/>`,
 sad:`<path d="M130 66 L148 72" stroke="#0D1B3E" stroke-width="3" stroke-linecap="round"/><path d="M190 66 L172 72" stroke="#0D1B3E" stroke-width="3" stroke-linecap="round"/>
   <ellipse cx="140" cy="82" rx="8" ry="9" fill="#fff"/><ellipse cx="180" cy="82" rx="8" ry="9" fill="#fff"/><circle cx="140" cy="86" r="4.5" fill="#0D1B3E"/><circle cx="180" cy="86" r="4.5" fill="#0D1B3E"/>
   <path d="M150 108 Q160 100 170 108" stroke="#0D1B3E" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
 think:`<ellipse cx="140" cy="78" rx="9" ry="11" fill="#fff"/><ellipse cx="180" cy="78" rx="9" ry="11" fill="#fff"/><circle cx="144" cy="74" r="5" fill="#0D1B3E"/><circle cx="184" cy="74" r="5" fill="#0D1B3E"/>
   <path d="M152 103 L170 101" stroke="#0D1B3E" stroke-width="3.5" stroke-linecap="round"/>`
} as const;

export type Mood = keyof typeof FACES;
