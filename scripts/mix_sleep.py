"""Mix real dialogue with sparse original procedural SFX; no synthetic narration."""
from pathlib import Path
import json,wave,subprocess
import numpy as np
folder=Path(__file__).resolve().parents[1]/'public/assets/sono'
timing=json.loads((folder/'timing.json').read_text(encoding='utf8'))
assert timing['alignmentType']!='estimated'
with wave.open(str(folder/'dialogue.wav'),'rb') as wav:
    rate=wav.getframerate();speech=np.frombuffer(wav.readframes(wav.getnframes()),dtype=np.int16).astype(float)/32768
fx=np.zeros(len(speech));rng=np.random.default_rng(20261106)
def cue(at,kind):
    start=round(at*rate);n=min(round((.7 if kind=='slide' else .22)*rate),len(fx)-start)
    if n<=0:return
    t=np.arange(n)/rate
    if kind=='slide':
        sound=rng.normal(0,.013,n)*np.sin(np.pi*np.arange(n)/n)**2
    elif kind=='key':
        sound=.025*np.sin(2*np.pi*1700*t)*np.exp(-25*t)+.015*np.sin(2*np.pi*2230*t)*np.exp(-32*t)
    else:
        sound=.025*np.sin(2*np.pi*(430*t+250*t*t))*np.exp(-30*t)
    fx[start:start+n]+=sound
def wordat(index,token):
    return next(w['start'] for w in timing['words'] if w['turn']==index and w['word'].lower().strip('.,!?;:')==token)
cue(.25,'slide')
cue(timing['turns'][1]['start']+.18,'graphic')
cue(wordat(4,'zero'),'graphic')
cue(wordat(8,'três'),'graphic')
cue(wordat(9,'chave'),'key')
cue(wordat(11,'alarme'),'graphic')
cue(wordat(18,'devolve'),'slide')
with wave.open(str(folder/'mix-source.wav'),'wb') as wav:
    wav.setnchannels(1);wav.setsampwidth(2);wav.setframerate(rate);wav.writeframes((np.clip(speech+fx,-1,1)*32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg','-y','-v','warning','-i',str(folder/'mix-source.wav'),'-af','loudnorm=I=-15:TP=-2:LRA=9','-ar','48000',str(folder/'mix-final.wav')],check=True)
print('MIXED',len(speech)/rate,'seconds; 7 original SFX; no external music',flush=True)
