import numpy as np, wave, sys
SR = 44100; T = 78.0; N = int(SR * T)
rng = np.random.default_rng(7)
mix = np.zeros(N)

def add(sig, t, g=1.0):
    i = int(t * SR); j = min(N, i + len(sig))
    if i < N: mix[i:j] += g * sig[: j - i]

def env(n, a=0.005, d=0.3):
    t = np.arange(n) / SR
    return np.minimum(1, t / a) * np.exp(-t / d)

def tone(f, dur, d=0.3, a=0.005, harm=(1, .5, .25)):
    n = int(dur * SR); t = np.arange(n) / SR
    s = sum(h * np.sin(2 * np.pi * f * (k + 1) * t) for k, h in enumerate(harm))
    return s * env(n, a, d)

def pluck(f, dur=1.2, decay=.996):  # Karplus-Strong
    n = int(dur * SR); p = int(SR / f)
    buf = rng.uniform(-1, 1, p); out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = decay * 0.5 * (buf[i % p] + buf[(i + 1) % p])
    return out

def noise(dur, d=0.1, lp=0.3):
    n = int(dur * SR); x = rng.uniform(-1, 1, n)
    y = np.zeros(n); a = lp
    for i in range(1, n): y[i] = y[i - 1] + a * (x[i] - y[i - 1])
    return y * env(n, 0.002, d)

# --- music: plucked arpeggios, 100 bpm ---
note = lambda m: 440 * 2 ** ((m - 69) / 12)
happy = [[60, 64, 67, 72], [55, 59, 62, 67], [57, 60, 64, 69], [53, 57, 60, 65]]   # C G Am F
sad   = [[57, 60, 64, 69], [50, 53, 57, 62], [57, 60, 64, 69], [52, 56, 59, 64]]   # Am Dm Am E
cache = {}
def pl(m, d):
    k = (m, d)
    if k not in cache: cache[k] = pluck(note(m), 1.4, d)
    return cache[k]
beat = 60 / 100 / 2  # eighth notes
pattern = [0, 2, 1, 3, 2, 1, 3, 2]
t = 0.0; bar = 0
while t < 72.0:
    darkzone = (33.2 <= t < 38.0) or (52.8 <= t < 62.6)
    prog = sad if darkzone else happy
    chord = prog[bar % 4]
    for k, idx in enumerate(pattern):
        tt = t + k * beat
        if tt >= 72: break
        g = 0.10 if darkzone else 0.13
        add(pl(chord[idx], .996), tt, g)
        if k == 0: add(pl(chord[0] - 12, .997), tt, 0.12)
    t += 8 * beat; bar += 1
# final chord
for m in [48, 60, 64, 67, 72, 76]: add(pluck(note(m), 4.0, .998), 72.0, 0.16)

# --- sfx ---
def plim(t, f): add(tone(f, .8, .35, harm=(1, .3, .15)) + tone(f * 2.01, .8, .2, harm=(.4,)), t, .35)
def popfx(t): 
    n = int(.12 * SR); tt = np.arange(n) / SR
    add(np.sin(2 * np.pi * (300 + 900 * tt / .12) * tt) * env(n, .002, .04), t, .45)
def whoosh(t, dur=.5): add(noise(dur, dur / 2, .08) * np.hanning(int(dur * SR)), t, .5)
def tick(t, f=2200): add(tone(f, .1, .03, harm=(1,)), t, .18)
def thud(t): add(tone(70, .4, .12, harm=(1, .3)), t, .7)

whoosh(.8); popfx(1.9)
whoosh(6.4); whoosh(6.6)
for i, f in enumerate([1318, 1568, 1760, 2093]): plim(8.6 + i * 1.25 + .9, f)
whoosh(9.2, .6)
for i in range(14): tick(22.4 + i * .22 + 1.0, 1800 + (i % 4) * 300)
popfx(25.4); plim(25.5, 1568)
popfx(28.0)
for i in range(10): add(noise(.05, .02, .6), 29.4 + i * .05, .25)  # confetti burst
for i in range(5): tick(33.6 + i * .45, 600)
# door rattle
n = int(1.4 * SR); r = noise(1.4, 10, .5) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 18 * np.arange(n) / SR)))
add(r * np.linspace(1, .6, n), 35.0, .25); thud(36.4)
popfx(38.3); popfx(42.8)
whoosh(46.8); thud(47.6)
popfx(51.0); popfx(51.4); popfx(51.8)
# sad trombone
for k, m in enumerate([55, 54, 53, 52]):
    dur = .35 if k < 3 else .9
    f = note(m); n = int(dur * SR); tt = np.arange(n) / SR
    vib = np.sin(2 * np.pi * f * tt + (k == 3) * 3 * np.sin(2 * np.pi * 6 * tt))
    add((vib + .4 * np.sign(vib)) * np.minimum(1, tt / .02) * np.exp(-tt / (dur * .8)), 52.9 + k * .38, .12)
for i in range(3): add(noise(.25, .08, .7), 58.6 + i * .9, .45); 
popfx(63.0); popfx(68.6)

mix = np.tanh(mix * 1.2) * .85
pcm = (mix * 32767).astype(np.int16)
with wave.open(sys.argv[1], 'w') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('ok')
