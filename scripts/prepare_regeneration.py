"""Audit the supplied real WAV, align words acoustically, and prepare one common pilot mix."""
from pathlib import Path
import json,hashlib,wave,subprocess
import numpy as np
from faster_whisper import WhisperModel
import whisperx
from scipy.signal import resample_poly
import math
import nltk,os
root=Path(__file__).resolve().parents[1];folder=root/'public/assets/regeneracao'
data_root=root/'.venv-whisperx/nltk_data'
if data_root.exists():
 os.environ['NLTK_DATA']=str(data_root)
 nltk.data.path.insert(0,str(data_root))
script=json.loads((folder/'script.json').read_text(encoding='utf8'))
source=folder/'narrador-original.wav'
audit=folder/'asr-audit.json'
if not audit.exists():
 model=WhisperModel('base',device='cpu',compute_type='int8',cpu_threads=3,local_files_only=True)
 with wave.open(str(source),'rb') as wav:
  rate=wav.getframerate();samples=np.frombuffer(wav.readframes(wav.getnframes()),dtype=np.int16).astype(np.float32)/32768
 g=math.gcd(rate,16000);samples=resample_poly(samples,16000//g,rate//g).astype(np.float32)
 segments,info=model.transcribe(samples,language='pt',beam_size=3,vad_filter=True)
 rows=[dict(start=s.start,end=s.end,text=s.text) for s in segments]
 audit.write_text(json.dumps(dict(model='faster-whisper-base',segments=rows,humanListen=False),ensure_ascii=False,indent=2),encoding='utf8')
 print(rows,flush=True)
with wave.open(str(source),'rb') as wav:duration=wav.getnframes()/wav.getframerate()
assert duration<11.5,'Do not speed or cut speech to force 12 seconds.'
cache=folder/'alignment.json'
if cache.exists():aligned=json.loads(cache.read_text(encoding='utf8'))
else:
 model,meta=whisperx.load_align_model(language_code='pt',device='cpu')
 aligned=whisperx.align([dict(start=0,end=duration,text=script['text'])],model,meta,whisperx.load_audio(str(source)),'cpu',return_char_alignments=False)
 cache.write_text(json.dumps(aligned,ensure_ascii=False,indent=2),encoding='utf8')
assert all('start' in w and 'end' in w for w in aligned['word_segments'])
offset=.25
words=[dict(word=w['word'],start=w['start']+offset,end=w['end']+offset,speaker='narrador',turn=0) for w in aligned['word_segments']]
subprocess.run(['ffmpeg','-y','-v','error','-i',str(source),'-af','adelay=250,apad=whole_dur=12,loudnorm=I=-16:TP=-2:LRA=9','-ar','48000','-ac','1','-t','12',str(folder/'mix-final.wav')],check=True)
with wave.open(str(folder/'mix-final.wav'),'rb') as wav:
 samples=np.frombuffer(wav.readframes(wav.getnframes()),dtype=np.int16).astype(float)/32768
envelope=[min(1,float(np.sqrt(np.mean(samples[n:n+1600]**2)))*12) for n in range(0,len(samples),1600)]
def onset(word):return next(w['start'] for w in words if w['word'].lower().strip('.,?!')==word)
def end(word):return next(w['end'] for w in words if w['word'].lower().strip('.,?!')==word)
# Keep the voice intact. Only the choreography is retimed to acoustic anchors.
anchors=[[0,0],[onset('tropeço'),3.0],[onset('arranhão'),3.5],[onset('pele'),6.0],[end('inteira'),8.3],[onset('indestrutível'),9.6],[12,12]]
assert all(anchors[i][0]<anchors[i+1][0] for i in range(len(anchors)-1))
timing=dict(duration=12,audioEnabled=True,alignmentType='acoustic-forced-alignment-whisperx',words=words,envelope=envelope,choreographyAnchors=anchors)
(folder/'timing.json').write_text(json.dumps(timing,ensure_ascii=False,indent=2),encoding='utf8')
provenance=dict(audio=dict(file=source.name,sha256=hashlib.sha256(source.read_bytes()).hexdigest(),duration=duration,generationSource='user_supplied_wav',requestedVoice='Charon',requestedModel='gemini-3.8-flash-tts',modelVerifiedFromFile=False,chargedCost=None),failures=[dict(service='AI Studio earlier tab',error='HTTP 403',fakeFallbackUsed=False)],background=dict(generationSource='original_svg_code',model=None),comparison=dict(sameAudio=True,sameCharacter=True,sameCamera=True,sameNarrativeMilestones=True,differentMotionController=True),published=False)
(folder/'provenance.json').write_text(json.dumps(provenance,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps(dict(duration=duration,words=len(words),anchors=anchors),ensure_ascii=False),flush=True)
