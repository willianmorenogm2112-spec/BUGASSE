from pathlib import Path
import json,subprocess,numpy as np,wave
p=Path('public/assets/terra-1s');t=json.loads((p/'timing.json').read_text(encoding='utf8'))
print([(q['index'],round(q['start'],2),round(q['end'],2)) for q in t['turns']])
with wave.open(str(p/'dialogue.wav'),'rb') as w: rate=w.getframerate();voice=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(float)/32768
rng=np.random.default_rng(20261106);fx=np.zeros_like(voice)
def sound(at,kind):
 start=round(at*rate);n=min(round(.32*rate),len(fx)-start);x=np.arange(n)/rate
 if kind=='brake': y=rng.normal(0,.018,n)*np.sin(np.linspace(0,np.pi,n))**2
 else: y=.018*np.sin(2*np.pi*(600*x-400*x*x))*np.exp(-20*x)
 fx[start:start+n]+=y
for turn in [0,2,4,8,13]:sound(t['turns'][turn]['start']+(.65 if turn==0 else .4),'brake' if turn in [0,2,4] else 'cue')
with wave.open(str(p/'mix-source.wav'),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(rate);w.writeframes((np.clip(voice+fx,-1,1)*32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg','-y','-v','warning','-i',str(p/'mix-source.wav'),'-af','loudnorm=I=-15:TP=-2:LRA=9','-ar','48000',str(p/'mix-final.wav')],check=True)
print('Real dialogue mixed',len(voice)/rate)
