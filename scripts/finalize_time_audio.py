"""Measured speech envelope and original deterministic sound design; no synthesized speech."""
import json,wave,math
from pathlib import Path
import numpy as np
root=Path(__file__).resolve().parents[1]
folder=root/'public/assets/tempo-interacao'
data=json.loads((folder/'timing.json').read_text(encoding='utf8'))
with wave.open(str(folder/'dialogue.wav'),'rb') as wav:
    rate=wav.getframerate();pcm=np.frombuffer(wav.readframes(wav.getnframes()),dtype=np.int16).astype(np.float64)/32768
data['envelope']=[round(min(1,float(np.sqrt(np.mean(pcm[i:i+800]**2)))*14),3) for i in range(0,len(pcm),800)]
(folder/'timing.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf8')
sfx=np.zeros(len(pcm));rng=np.random.default_rng(20261105)
def effect(start,duration,kind):
    a=round(start*rate); n=min(round(duration*rate),len(sfx)-a);t=np.arange(n)/rate
    if kind=='click': v=rng.uniform(-1,1,n)*np.exp(-t*65)*.1
    elif kind=='air': v=rng.uniform(-1,1,n)*np.sin(np.pi*t/duration)**2*.018
    elif kind=='alarm': v=np.sin(2*np.pi*780*t)*(np.sin(t*35)>0)*.028
    else: v=(np.sin(2*np.pi*340*t)+.35*np.sin(2*np.pi*680*t))*np.exp(-t*12)*.035
    sfx[a:a+n]+=v
for idx in [2,6,10,16]: effect(data['turns'][idx]['start'],.18,'click')
effect(data['turns'][5]['start']+.25,.65,'air')
effect(data['turns'][6]['start']+.15,.55,'ding')
effect(data['turns'][10]['start']+.15,.55,'ding')
effect(data['turns'][16]['end']-.4,.7,'alarm')
with wave.open(str(folder/'sfx.wav'),'wb') as wav:
    wav.setnchannels(1);wav.setsampwidth(2);wav.setframerate(rate);wav.writeframes((np.clip(sfx,-1,1)*32767).astype(np.int16).tobytes())
print('Envelope',len(data['envelope']),'frames; original SFX generated')
def stamp(s):
    ms=round(s*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
pages=[]
for turn in data['turns']:
    words=[w for w in data['words'] if w['turn']==turn['index']]
    for i in range(0,len(words),5):
        group=words[i:i+5]
        pages.append(f"{len(pages)+1}\n{stamp(group[0]['start'])} --> {stamp(group[-1]['end'])}\n{turn['speaker'].upper()}: "+' '.join(w['word'] for w in group)+'\n')
(folder/'legendas.srt').write_text('\n'.join(pages),encoding='utf8')
assert len(data['turns'])==18
assert all(q['start']<q['end'] for q in data['turns'])
assert all(a['end']<=b['start']+.002 for a,b in zip(data['turns'],data['turns'][1:]))
assert all(w['start']>=data['turns'][w['turn']]['start']-1e-6 and w['end']<=data['turns'][w['turn']]['end']+1e-6 for w in data['words'])
print('Timing validated; SRT generated')
