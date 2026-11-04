"""Original deterministic SFX, mixed with the genuine downloaded Gemini WAV. No synthetic voice."""
import math, random, struct, wave
from pathlib import Path

root = Path(__file__).resolve().parents[1]
folder = root / 'public/assets/pilot-atrito-v1'
rate = 48000
data = [0.0] * (rate * 25 // 2)
rng = random.Random(230)
for start, duration, kind in [(0.5,.1,'step'),(1.1,.1,'step'),(1.7,.1,'step'),(2.15,.35,'slip'),(8.95,.12,'snap'),(10.2,.32,'thud')]:
    for i in range(int(duration * rate)):
        t = i / rate
        noise = rng.uniform(-1, 1)
        if kind == 'slip':
            value = noise * math.sin(math.pi*t/duration)**2 * .06
        elif kind == 'snap':
            value = noise * math.exp(-t*60) * .13
        else:
            hz = 100 if kind == 'step' else 62
            value = (math.sin(2*math.pi*hz*t)*.75+noise*.25)*math.exp(-t*30)*(.09 if kind == 'step' else .2)
        index = int(start * rate) + i
        data[index] += value
with wave.open(str(folder/'sfx-original.wav'), 'wb') as wav:
    wav.setparams((1, 2, rate, len(data), 'NONE', 'not compressed'))
    wav.writeframes(b''.join(struct.pack('<h', round(max(-1,min(1,v))*32767)) for v in data))
print('SFX originais: passos, deslize, soltura e impacto; seed=230; 12.5s, mono 48kHz.')
