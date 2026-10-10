import numpy as np, wave, sys
SR = 44100; T = 103.0; N = int(SR * T)
rng = np.random.default_rng(7)
mix = np.zeros(N)

OFF = 0.0
def add(sig, t, g=1.0):
    i = int((t + OFF) * SR); j = min(N, i + len(sig))
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
beat = 60 / 100 / 2
pattern = [0, 2, 1, 3, 2, 1, 3, 2]
MEND = 90.0
t = 0.0; bar = 0
while t < MEND:
    darkzone = (51.5 <= t < 57.0) or (65.0 <= t < 81.0) or (34.0 <= t < 37.5)
    prog = sad if darkzone else happy
    chord = prog[bar % 4]
    for k, idx in enumerate(pattern):
        tt = t + k * beat
        if tt >= MEND: break
        g = 0.10 if darkzone else 0.13
        add(pl(chord[idx], .996), tt, g)
        if k == 0: add(pl(chord[0] - 12, .997), tt, 0.12)
    t += 8 * beat; bar += 1
for m in [48, 60, 64, 67, 72, 76]: add(pluck(note(m), 4.0, .998), MEND, 0.16)

# --- sfx ---
OFF = 4.0
for tt_ in (-3.85, -3.5, -2.7, -1.9): pass
def plim(t, f): add(tone(f, .8, .35, harm=(1, .3, .15)) + tone(f * 2.01, .8, .2, harm=(.4,)), t, .32)
def popfx(t):
    n = int(.12 * SR); tt = np.arange(n) / SR
    add(np.sin(2 * np.pi * (300 + 900 * tt / .12) * tt) * env(n, .002, .04), t, .45)
def whoosh(t, dur=.5): add(noise(dur, dur / 2, .08) * np.hanning(int(dur * SR)), t, .5)
def tick(t, f=2200): add(tone(f, .1, .03, harm=(1,)), t, .18)
def thud(t): add(tone(70, .4, .12, harm=(1, .3)), t, .7)

popfx(-3.85); whoosh(-3.5); popfx(-2.7); popfx(-1.9)
whoosh(.2); popfx(.5)
for i in range(6): tick(1.2 + i * .22 + .1, 1400 + i * 120)
whoosh(6.1)
for i in range(16): tick(6.4 + i * .1, 900 + i * 60)
popfx(8.8); popfx(9.6)
whoosh(12.3)
for i, a in enumerate([12.6, 14.3, 16.6, 17.1, 19.6, 20.1, 22.6, 23.1]): popfx(a)
arr = [14.6, 16.9, 17.4, 19.9, 20.4, 22.9, 23.4, 25.6, 25.8, 26.0, 26.2]
scale = [1047, 1175, 1319, 1397, 1568, 1760, 1976, 2093, 2349, 2637, 2794]
for i, a in enumerate(arr): plim(a, scale[i])
whoosh(30.1); popfx(30.4); thud(31.8); popfx(33.6)
whoosh(37.1)
for i in range(15): tick(37.3 + i * .1, 1500 + (i % 5) * 200)
popfx(39.4); plim(39.5, 1568)
popfx(42.5)
for i in range(10): add(noise(.05, .02, .6), 43.8 + i * .05, .25)
for i in range(15): tick(47.6 + i * .17, 500)
n = int(1.4 * SR); r = noise(1.4, 10, .5) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 18 * np.arange(n) / SR)))
add(r * np.linspace(1, .6, n), 48.4, .25); thud(49.8); popfx(50.6)
whoosh(53.0); popfx(53.3); popfx(57.2)
whoosh(61.1); thud(62.3)
whoosh(63.0, 1.2)
popfx(65.6); popfx(66.0); popfx(66.4)
for k, m in enumerate([55, 54, 53, 52]):
    dur = .35 if k < 3 else .9
    f = note(m); n = int(dur * SR); tt = np.arange(n) / SR
    vib = np.sin(2 * np.pi * f * tt + (k == 3) * 3 * np.sin(2 * np.pi * 6 * tt))
    add((vib + .4 * np.sign(vib)) * np.minimum(1, tt / .02) * np.exp(-tt / (dur * .8)), 67.1 + k * .38, .12)
whoosh(71.0); popfx(71.6)
for i in range(3): add(noise(.25, .08, .7), 72.8 + i * .9, .45)
whoosh(77.0); popfx(77.3); popfx(82.0)
whoosh(85.8)
whoosh(91.8); popfx(92.3); popfx(93.2); popfx(94.6)
for m in [53, 60, 65, 69, 72]: add(pluck(note(m), 5.0, .998), 92.0, 0.13)

mix = np.tanh(mix * 1.2) * .85
pcm = (mix * 32767).astype(np.int16)
with wave.open(sys.argv[1], 'w') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('ok')
