"""Original deterministic contact SFX mixed underneath genuine Gemini speech."""
from pathlib import Path
import json,wave,subprocess
import numpy as np
folder=Path(__file__).resolve().parents[1]/'public/assets/gravidade'
timing=json.loads((folder/'timing.json').read_text(encoding='utf8'))
with wave.open(str(folder/'dialogue.wav'),'rb') as wav:
    rate=wav.getframerate();speech=np.frombuffer(wav.readframes(wav.getnframes()),dtype=np.int16).astype(float)/32768
fx=np.zeros(len(speech));rng=np.random.default_rng(20261106)
def cue(at,kind):
    start=round(at*rate);n=min(round(.25*rate),len(fx)-start)
    if n<=0:return
    t=np.arange(n)/rate
    if kind=='contact':
        sound=.07*np.sin(2*np.pi*(110*t-50*t*t))*np.exp(-23*t)+rng.normal(0,.008,n)*np.exp(-50*t)
    else:sound=.022*np.sin(2*np.pi*(520*t+400*t*t))*np.exp(-30*t)
    fx[start:start+n]+=sound
cue(.65,'contact')
for i in [3,7,9,11]:cue(timing['turns'][i]['start'],'graphic')
cue(timing['turns'][8]['start']+.65,'contact')
cue(timing['turns'][10]['start']+1,'contact')
with wave.open(str(folder/'mix-source.wav'),'wb') as wav:
    wav.setnchannels(1);wav.setsampwidth(2);wav.setframerate(rate);wav.writeframes((np.clip(speech+fx,-1,1)*32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg','-y','-v','warning','-i',str(folder/'mix-source.wav'),'-af','loudnorm=I=-16:TP=-2:LRA=9','-ar','48000',str(folder/'mix-final.wav')],check=True)
print('Mixed',len(speech)/rate,'seconds; original procedural SFX; no external music')
