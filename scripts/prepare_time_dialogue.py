import json, wave, subprocess, argparse
from pathlib import Path
import numpy as np
import whisperx

root=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser()
parser.add_argument('--assets',default='public/assets/tempo-interacao')
parser.add_argument('--script',default='reports/TEMPO-INTERACAO.md')
args=parser.parse_args()
assets=root/args.assets
report=(root/args.script).read_text(encoding='utf8')
turns=[]
for line in report.splitlines():
    for label,speaker in [('NARRADOR:','narrador'),('BUGI:','bugi')]:
        if line.startswith(label):
            text=line[len(label):].strip().replace('vantagens... e','vantagens e')
            turns.append({'speaker':speaker,'text':text})
# The Puck source has this line and the next in one spoken phrase; keep exact source text.
model,metadata=whisperx.load_align_model(language_code='pt',device='cpu')
sources={}
for speaker,name in [('bugi','bugi-puck.wav'),('narrador','narrador-charon.wav')]:
    path=assets/name
    audio=whisperx.load_audio(str(path))
    text=' '.join(t['text'] for t in turns if t['speaker']==speaker)
    result=whisperx.align([{'start':0,'end':len(audio)/16000,'text':text}],model,metadata,audio,'cpu',return_char_alignments=False)
    words=result['word_segments']
    if any('start' not in w or 'end' not in w for w in words):
        raise RuntimeError('Missing acoustic alignment for '+speaker)
    (assets/(speaker+'-alignment.json')).write_text(json.dumps(words,ensure_ascii=False,indent=2),encoding='utf8')
    with wave.open(str(path),'rb') as wav:
        rate=wav.getframerate(); channels=wav.getnchannels()
        pcm=np.frombuffer(wav.readframes(wav.getnframes()),dtype=np.int16).reshape(-1,channels)
    sources[speaker]={'words':words,'cursor':0,'pcm':pcm,'rate':rate,'channels':channels}

pieces=[]; timeline=[]; captions=[]; cursor=0
for i,turn in enumerate(turns):
    source=sources[turn['speaker']]
    count=len(turn['text'].split())
    words=source['words'][source['cursor']:source['cursor']+count]
    source['cursor']+=count
    a=max(0,words[0]['start']-.06); b=min(len(source['pcm'])/source['rate'],words[-1]['end']+.10)
    segment=source['pcm'][round(a*source['rate']):round(b*source['rate'])]
    if source['rate']!=24000 or source['channels']!=1: raise RuntimeError('Expected original 24k mono WAV')
    start=cursor/24000
    pieces.append(segment);cursor+=len(segment)
    timeline.append({**turn,'index':i,'start':start,'end':cursor/24000})
    for w in words: captions.append({'word':w['word'],'start':start+w['start']-a,'end':start+w['end']-a,'speaker':turn['speaker'],'turn':i})
    pause=np.zeros((round(.20*24000),1),dtype=np.int16);pieces.append(pause);cursor+=len(pause)
with wave.open(str(assets/'dialogue.wav'),'wb') as wav:
    wav.setnchannels(1);wav.setsampwidth(2);wav.setframerate(24000);wav.writeframes(np.concatenate(pieces).tobytes())
pcm=np.concatenate(pieces).astype(np.float64).flatten()/32768
envelope=[round(min(1,float(np.sqrt(np.mean(pcm[i:i+800]**2)))*12),3) for i in range(0,len(pcm),800)]
data={'duration':cursor/24000,'alignmentType':'acoustic-forced-alignment','turns':timeline,'words':captions,'envelope':envelope}
(assets/'timing.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf8')
print('Duration',data['duration'],'turns',len(timeline),'words',len(captions))
