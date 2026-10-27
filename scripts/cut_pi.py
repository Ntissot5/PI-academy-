# Détourage de Pi depuis un rendu sur fond blanc.
# - fond = zone blanche reliée au bord de l'image (les reflets clairs à l'intérieur restent opaques) ;
# - sur la bande du bord, l'opacité et la couleur sont « démélangées » du blanc (pas de liseré clair) ;
# - recadrage aux mêmes proportions que l'ancien fichier (320 × 219) pour garder le visage aligné.
import sys
from collections import deque
import numpy as np
from PIL import Image, ImageFilter

src, out = sys.argv[1], sys.argv[2]
rgb = np.asarray(Image.open(src).convert("RGB")).astype(np.float32) / 255.0
H, W, _ = rgb.shape

# Opacité « vue depuis le blanc » : 1 − composante la plus claire ramenée à l'échelle.
dist = 1.0 - rgb.min(-1)                      # 0 sur blanc pur, grand sur bleu saturé
bg_like = dist < 0.06                          # quasi blanc

# Fond = quasi-blanc connecté aux bords.
bg = np.zeros((H, W), bool); q = deque()
for x in range(W):
    for y in (0, H - 1):
        if bg_like[y, x] and not bg[y, x]: bg[y, x] = True; q.append((y, x))
for y in range(H):
    for x in (0, W - 1):
        if bg_like[y, x] and not bg[y, x]: bg[y, x] = True; q.append((y, x))
while q:
    y, x = q.popleft()
    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        ny, nx = y + dy, x + dx
        if 0 <= ny < H and 0 <= nx < W and bg_like[ny, nx] and not bg[ny, nx]:
            bg[ny, nx] = True; q.append((ny, nx))
body = ~bg

# Bande de bord : pixels du corps proches du fond (8 px). Ailleurs, opaque.
body_img = Image.fromarray((body * 255).astype(np.uint8))
core = np.asarray(body_img.filter(ImageFilter.MinFilter(17))) > 127
edge = body & ~core

# Couleur de référence du bord = couleur du corps juste à l'intérieur (étalée vers l'extérieur).
ref = np.where(core[..., None], rgb, 0); w = core.astype(np.float32)
ref_img = Image.fromarray((ref * 255).astype(np.uint8)); w_img = Image.fromarray((w * 255).astype(np.uint8))
est = np.zeros_like(rgb); got = np.zeros((H, W), bool)
for r in (3, 6, 10, 16, 24):
    bf = np.asarray(ref_img.filter(ImageFilter.BoxBlur(r))).astype(np.float32) / 255
    bw = np.asarray(w_img.filter(ImageFilter.BoxBlur(r))).astype(np.float32) / 255
    m = (~got) & (bw > 0.03)
    est[m] = bf[m] / bw[m][..., None]; got |= m

# Démélange : pixel = a·couleur + (1−a)·blanc  →  a = (1 − pixel) / (1 − couleur), par canal, on prend le max.
den = np.maximum(1.0 - est, 0.04)
a_ch = (1.0 - rgb) / den
a_edge = np.clip(a_ch.max(-1), 0, 1)
alpha = np.where(core, 1.0, np.where(edge, a_edge, 0.0))
alpha = np.where(bg, 0.0, alpha)
# Lissage très léger de l'opacité (anticrénelage), sans élargir le contour.
alpha = np.asarray(Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7))).astype(np.float32) / 255
alpha = np.where(core, 1.0, alpha)
color = np.where(edge[..., None], est, rgb)
color = np.where(core[..., None], rgb, color)

# Recadrage : boîte du corps + marge, aux proportions 320 × 219.
ys, xs = np.nonzero(alpha > 0.02)
x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
bw_, bh_ = x1 - x0, y1 - y0
ratio = 320 / 219
pad = int(0.01 * bw_)
cw = bw_ + 2 * pad; ch = bh_ + 2 * pad
if cw / ch > ratio: ch = cw / ratio
else: cw = ch * ratio
cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
box = (int(cx - cw / 2), int(cy - ch / 2), int(cx + cw / 2), int(cy + ch / 2))
rgba = np.dstack([np.clip(color, 0, 1), alpha])
img = Image.fromarray((rgba * 255).astype(np.uint8), "RGBA")
canvas = Image.new("RGBA", (box[2] - box[0], box[3] - box[1]), (0, 0, 0, 0))
canvas.paste(img.crop((max(box[0], 0), max(box[1], 0), min(box[2], W), min(box[3], H))), (max(-box[0], 0), max(-box[1], 0)))
final = canvas.resize((960, 657), Image.LANCZOS)
final.save(out, "WEBP", quality=90, method=6, exact=True)
print("ok", final.size, "corps", (x0, y0, x1, y1))
