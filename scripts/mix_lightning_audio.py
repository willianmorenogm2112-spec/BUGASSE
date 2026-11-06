"""Original rain/thunder SFX under genuine Gemini speech; deterministic seed."""
from pathlib import Path
import json,wave
import numpy as np
root=Path(__file__).resolve().parents[1]
folder=root/'public/assets/raio-carro'
timing=json.loads((folder/'timing.json').read_text(encoding='utf8'))
with wave.open(str(folder/'dialogue.wav'),'rb') as w:
    rate=w.getframerate()
    speech=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(float)/32768
rng=np.random.default_rng(20261106)
fx=rng.normal(0,.0015,len(speech))
# Muted thunder onset reinforces the visual bolt without startling peak levels.
for onset in [.15]:
    start=round(onset*rate);n=min(round(1.2*rate),len(fx)-start)
    noise=rng.normal(0,1,n)
    low=np.convolve(noise,np.ones(140)/140,mode='same')
    low/=max(.001,float(np.max(np.abs(low))))
    t=np.arange(n)/rate
    fx[start:start+n]+=low*.09*np.exp(-3*t)
for index in [2,6,10,12]:
    start=round(timing['turns'][index]['start']*rate)
    n=min(round(.12*rate),len(fx)-start);t=np.arange(n)/rate
    fx[start:start+n]+=.025*np.sin(2*np.pi*(650*t+300*t*t))*np.exp(-35*t)
with wave.open(str(folder/'mix-source.wav'),'wb') as w:
    w.setnchannels(1);w.setsampwidth(2);w.setframerate(rate)
    w.writeframes((np.clip(speech+fx,-1,1)*32767).astype(np.int16).tobytes())
