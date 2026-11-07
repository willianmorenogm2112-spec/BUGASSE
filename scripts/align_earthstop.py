"""Align genuine TTS, cut only between turns, and assemble the canonical dialogue."""
import json, wave, hashlib, sys
from pathlib import Path
import numpy as np
import whisperx
root=Path(__file__).resolve().parents[1]
folder=root/'public/assets/terra-1s'
script=json.loads((folder/'script.json').read_text(encoding='utf8'))
tracks=[('bugi-puck.wav',[t['index'] for t in script['turns'] if t['speaker']=='bugi']),('narrador-charon.wav',[t['index'] for t in script['turns'] if t['speaker']=='narrador'])]
model,meta=whisperx.load_align_model(language_code='pt',device='cpu')
if '--track' in sys.argv:
    selected=sys.argv[sys.argv.index('--track')+1]
    tracks=[t for t in tracks if t[0]==selected]
pieces={};provenance=[]
for filename,indices in tracks:
    path=folder/filename
    with wave.open(str(path),'rb') as wav:
        assert wav.getsampwidth()==2 and wav.getnchannels()==1
        rate=wav.getframerate()
        samples=np.frombuffer(wav.readframes(wav.getnframes()),dtype=np.int16).copy()
    duration=len(samples)/rate
    cache=folder/(filename.replace('.wav','-alignment.json'))
    texts=[script['turns'][i]['text'] for i in indices]
    if cache.exists():
        result=json.loads(cache.read_text(encoding='utf8'))
    else:
        result=whisperx.align([dict(start=0,end=duration,text=' '.join(texts))],model,meta,whisperx.load_audio(str(path)),'cpu',return_char_alignments=False)
        cache.write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf8')
    words=result['word_segments']
    assert len(words)==sum(len(t.split()) for t in texts),(filename,len(words),'token mismatch')
    assert all('start' in w and 'end' in w for w in words),(filename,'missing timestamps')
    cursor=0
    for i,text in zip(indices,texts):
        count=len(text.split());ws=words[cursor:cursor+count];cursor+=count
        start=max(0,ws[0]['start']-.10);end=min(duration,ws[-1]['end']+.16)
        chunk=samples[round(start*rate):round(end*rate)]
        # Keep original voice and timing; only resample to common mix rate.
        from scipy.signal import resample_poly
        import math
        common=48000;g=math.gcd(rate,common)
        chunk=resample_poly(chunk.astype(float)/32768,common//g,rate//g)
        pieces[i]=(chunk,[dict(word=w['word'],start=w['start']-start,end=w['end']-start) for w in ws])
    provenance.append(dict(file=filename,sha256=hashlib.sha256(path.read_bytes()).hexdigest(),duration=duration,sampleRate=rate,generationSource='google_ai_studio_ui',model='gemini-3.8-flash-tts',voice='Puck' if filename.startswith('bugi') else 'Charon',chargedCost=None))
    print('Aligned',filename,len(words),'words',duration,flush=True)
if '--align-only' in sys.argv: sys.exit(0)
mix=[np.zeros(round(.10*48000))];cursor=.1;turns=[];words=[]
for turn in script['turns']:
    chunk,ws=pieces[turn['index']]
    turns.append(dict(**turn,start=cursor,end=cursor+len(chunk)/48000))
    words.extend(dict(**w,speaker=turn['speaker'],turn=turn['index']) | dict(start=w['start']+cursor,end=w['end']+cursor) for w in ws)
    mix.append(chunk);pause=.26 if turn['speaker']=='bugi' else .18
    if turn['index'] in [3,5,7,13,17,19]:pause=.40
    mix.append(np.zeros(round(pause*48000)));cursor+=len(chunk)/48000+pause
speech=np.concatenate(mix+[np.zeros(24000)])
with wave.open(str(folder/'dialogue.wav'),'wb') as wav:
    wav.setnchannels(1);wav.setsampwidth(2);wav.setframerate(48000);wav.writeframes((np.clip(speech,-1,1)*32767).astype(np.int16).tobytes())
env=[min(1,float(np.sqrt(np.mean(speech[n:n+1600]**2)))*12) for n in range(0,len(speech),1600)]
timing=dict(duration=len(speech)/48000,alignmentType='acoustic-forced-alignment-whisperx',turns=turns,words=words,envelope=env)
(folder/'timing.json').write_text(json.dumps(timing,ensure_ascii=False,indent=2),encoding='utf8')
(folder/'provenance.json').write_text(json.dumps(dict(audio=provenance,background=dict(generationSource='original_svg_code',model=None,note='Cenário por código solicitado pelo usuário; não é imagem Google.'),failures=[],chargedCost=None),ensure_ascii=False,indent=2),encoding='utf8')
print('ASSEMBLED',len(words),'words',timing['duration'],'seconds',flush=True)
