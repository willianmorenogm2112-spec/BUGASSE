"""Original procedural cartoon SFX; speech remains the genuine Gemini WAV."""
import json, wave
from pathlib import Path
import numpy as np
root=Path(__file__).resolve().parents[1]
folder=root/'bugi-3d/kit/projects/bugi-formiga'
timing=json.loads((folder/'timing.json').read_text(encoding='utf8'))
with wave.open(str(folder/'dialogue.wav'),'rb') as source:
    rate=source.getframerate()
    voice=np.frombuffer(source.readframes(source.getnframes()),dtype=np.int16).astype(float)/32768
fx=np.zeros(len(voice))
rng=np.random.default_rng(20261105)
for index in [0,4,6,12,15]:
    start=round(timing['turns'][index]['start']*rate)
    count=min(round(.22*rate),len(fx)-start)
    t=np.arange(count)/rate
    if index==6:
        cue=np.sin(2*np.pi*(1100*t-1500*t*t))*np.exp(-t*24)
    elif index==4:
        cue=rng.normal(0,1,count)*np.sin(np.pi*np.arange(count)/count)**2
    else:
        cue=np.sin(2*np.pi*(450*t+800*t*t))*np.exp(-t*20)
    fx[start:start+count]+=cue*.035
with wave.open(str(folder/'mix-with-sfx.wav'),'wb') as out:
    out.setnchannels(1);out.setsampwidth(2);out.setframerate(rate)
    out.writeframes((np.clip(voice+fx,-1,1)*32767).astype(np.int16).tobytes())
